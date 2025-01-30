import uuid
import json
import logging
from datetime import datetime, timedelta
from django.db import models
from django.core.validators import MinValueValidator
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
# from django.contrib.auth.models import User
from django.db.models import Sum, F, ExpressionWrapper, DecimalField, Max, Count

from zuser.models import Agent, Cashier, Player
from game_utils.time_file import get_local_time_date, get_local_time_now, get_local_time_yesterday, single_date
from .utils.raw_result import lucky_odd_price, turn_odd_type_to_price

logger = logging.getLogger(__name__)

ODD_CHOICES = [
    ('promo4', 'Promo 4'),
    ('mohio', 'Mohio'),
    ('promo', 'Promo'),
    ('promo2', 'Promo 2'),
    ('promo3', 'Promo 3'),
    ('promo5', 'Promo 5'),
    ('promo6', 'Promo 6'),
    ('type1', 'Type 1'),
    ('type2', 'Type 2'),
    ('mohio2', 'Mohio 2'),
]


class MobileGameManager(models.Manager):

    def latest_keno(self):
        try:
            return self.filter(status='keno').latest('created_at')
        except MobileGame.DoesNotExist:
            return None

    def latest_closed(self):
        try:
            return self.filter(status='CLOSED').latest('created_at')
        except MobileGame.DoesNotExist:
            return None

    def latest_keno_open(self):
        try:
            return self.filter(status='OPEN').latest('created_at')
        except MobileGame.DoesNotExist:
            return None

    def get_related_to_game(self, game_instance):
        return self.filter(_game=game_instance)

    def get_selection_games(self, game_instance):
        return MobileTicket.objects.filter(_game=game_instance).select_related('_game')


    def get_result(self, game_num, date_str, agent):
        # if not current_datetime is None:
            # current_datetime = parse_date(date_str)
        current_datetime = get_local_time_now()
        current_datetime = datetime.combine(current_datetime.date(), datetime.min.time()).replace(tzinfo=current_datetime.tzinfo)
        game = self.filter(created_at__gte=current_datetime).get(game_num=game_num)
        latest_results = MobileGameResult.objects.filter(agent=agent, gameId=game).order_by('-id')[:20]
        if latest_results.exists():
            data = {
                'status': 'keno',
                'message': 'Result is found',
                'balls': [result.value for result in latest_results],
                'game_num': game_num,
            }
            return data
        else:
            data = {
                'status': 'keno',
                'message': 'Result is not found',
                'balls': [],
                'game_num': game_num,
            }
            return data

class MobileGame(models.Model):
    game_num = models.IntegerField(null=True, db_index=True)
    status = models.CharField(max_length=10, default='OPEN')
    created_at = models.DateTimeField(db_index=True)
    updated_at = models.DateTimeField(db_index=True)
    game_type = models.CharField(default='keno', max_length=15, db_index=True)

    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    result_gen_try = models.IntegerField(default=0)

    objects = MobileGameManager()

    # def __str__(self):
    #     return f"Game Num: {self.game_num}"

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

    def get_result_as_list(self):
        if self.result:
            return json.loads(self.result)
        else:
            return []
class MobileGameResultManager(models.Manager):
    def filter_by_game(self, game_id):
        results = self.filter(gameId__id=game_id)
        serialized_results = []
        for result in results:
            serialized_result = {
                'value': result.value,
                'order': result.order,
                'gameId': result.gameId.game_num,  # Assuming gameId has a game_num field
                'resultId': result.resultId
            }
            serialized_results.append(serialized_result)
        return serialized_results

class MobileGameResult(models.Model):
    # _user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="gameresult")
    value = models.IntegerField(null=True)
    order = models.IntegerField(null=True)
    gameId = models.ForeignKey(MobileGame, on_delete=models.CASCADE, related_name='gameresult_set')
    resultId = models.IntegerField(null=True, db_index=True)
    objects = MobileGameResultManager()

class MobileGameAnalyticManager(models.Manager):
    def get_previous_special_prize(self):
        today = timezone.now().date()
        try:
            game_prize = self.filter(created_at__date=today).order_by('-created_at')
            last_game = game_prize.first()
            # print(f'len game_prize {len(game_prize)} last_game {last_game}')
            last_8_games = game_prize[:8]
            last_4_games = game_prize[:4]
            prize_last_8_games = 1 if any(game.prize_made for game in last_8_games) else 0
            prize_last_4_games = 1 if any(game.prize_made for game in last_4_games) else 0
            if last_game is not None:
                previous_total_special_prize = last_game.total_special_prize
                previous_prize_made = last_game.prize_made
            else:
                previous_prize_made = False
                previous_total_special_prize = 0
            # print(f'previous_prize_made {previous_prize_made}, previous_total_special_prize {previous_total_special_prize}, prize_last_8_games {prize_last_8_games}, prize_last_4_games {prize_last_4_games}')
            return previous_prize_made, previous_total_special_prize, prize_last_8_games, prize_last_4_games
        except Exception as e:
            return False, 0, 0, 0

    def get_game_statistics(self, game):
        today = get_local_time_date()
        game_analytics = MobileGameAnalytica.objects.filter(gameId=game, created_at__date=today)
        analytic = game_analytics.latest('created_at')
        return {
            'total_won': analytic.total_won,
            'total_gain': analytic.total_gain,
            'expected_gain': analytic.expected_gain,
            'total_tickets': analytic.total_tickets,
            'total_stake': analytic.total_stake,
        }

class MobileGameAnalytica(models.Model):
    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    gameId = models.ForeignKey(MobileGame, on_delete=models.CASCADE, related_name='gameanalytic_set')
    choosen_strategy = models.CharField(max_length=20, null=True, blank=True)
    total_won = models.IntegerField(default=0)
    loss_percent = models.IntegerField(default=0)
    total_tickets = models.IntegerField(default=0)
    total_stake = models.IntegerField(default=0)
    special_prize = models.BooleanField(default=False)
    total_gain = models.IntegerField(default=0)
    expected_gain = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)
    cancelled_tickets = models.IntegerField(default=0)

    gain_percentage = models.IntegerField(default=0)
    total_special_prize = models.IntegerField(default=0)
    prize_made = models.BooleanField(default=False)

    objects = MobileGameAnalyticManager()

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    @classmethod
    def create(cls, keno_odd_type, game_id, choosen_strategy=None, total_won=0, total_gain=0,
               loss_percent=0, total_tickets=0, total_stake=0, special_prize=False, expected_gain=0,
               gain_percentage=0, total_special_prize=0, prize_made=False):
        game_analytic = cls(
            keno_odd_type=keno_odd_type,
            gameId=game_id,
            choosen_strategy=choosen_strategy,
            total_won=total_won,
            total_gain=total_gain,
            loss_percent=loss_percent,
            total_tickets=total_tickets,
            total_stake=total_stake,
            special_prize=special_prize,
            created_at=get_local_time_now(),
            updated_at=get_local_time_now(),
            expected_gain=expected_gain,
            gain_percentage=gain_percentage,
            total_special_prize=total_special_prize,
            prize_made=prize_made,
        )
        game_analytic.save()
        return game_analytic

class MobileTicketManager(models.Manager):

    def get_selection_games_info_by_cashier(self, player):
        selection_games = self.filter(played_by=player)
        total_choices_list_length = sum(len(json.loads(game.choice_list)) for game in selection_games)
        count = selection_games.count()
        return count, total_choices_list_length

    def max_min_length(self, game_instance, player):
        t = self.filter(_game=game_instance, played_by=player)
        all_t = []
        for i in t:
            all_t['length'].append=i.choice_length
            all_t['ticket'].append=i
        
        return max(all_t['length']), min(all_t['length'])

    def check_and_get_related_to_game(self, game_instance, player):
        try:
            related_objects = self.filter(_game=game_instance, played_by=player)
            if related_objects.exists():
                return related_objects
            else:
                return None
        except Exception as e:
            print(f'tickets are not found in the ticket model, exception is: {e}')
            return None

    def daily_total_gain_loss(self):
        today = get_local_time_date()
        games_filtered = MobileGame.objects.filter(created_at__date=today).exclude(status='OPEN')
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.id) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def weekly_total_gain_loss(self):
        today = get_local_time_date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        games_filtered = MobileGame.objects.filter(created_at__date__range=[start_of_week, end_of_week]).exclude(status='OPEN')
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.pk) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def daily_total_gain_loss_com(self, request):
        company_id = request.user.company_user.id
        today = get_local_time_date()
        games_filtered = MobileGame.objects.filter(created_at__date=today).exclude(status="OPEN")
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.pk) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def weekly_total_gain_loss_com(self, player):
        today = get_local_time_date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        games_filtered = MobileGame.objects.filter(created_at__date__range=[start_of_week, end_of_week]).exclude(status="OPEN")
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.pk, played_by=player) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def last_100_selections(self, player):
        selections = self.order_by('-created_at').filter(played_by=player, cancelled=False)[:100]
        formatted_selections = []
        mark = 1

        for selection in selections:
            won = selection.get_possible_won()
            status = selection._game.status
            if status == 'CLOSED':
                won = selection.won_amount
                if won > 0:
                    mark = 3
                else:
                    mark = 2

            formatted_selection = {
                'on': selection.created_at.strftime('%Y-%m-%d'),
                'selection': selection.get_choice_list(),
                'draw': selection._game.game_num,
                'stake': selection.stake,
                'won': won,
                'mark': mark,
            }
            formatted_selections.append(formatted_selection)

        return formatted_selections

    def get_ticket_by_ussid(self, code):

        try:
            ticket = self.filter(unique_identifier=code).first()
            return ticket
        except self.model.DoesNotExist:
            return None

    def get_multiple_ticket_by_ussid(self, code):
        ticket_id, game_num = self.extract_ticket_id_and_game_num(code)

        try:
            ticket = self.filter(pk=ticket_id, _game__game_num=game_num)
            return ticket
        except self.model.DoesNotExist:
            return None

    def get_status(self, game_result, redeemed):
        if redeemed:
            return 'redeemed'
        elif game_result is not None:
            return 'redeem'
        else:
            return 'active'

    def sorted_won_amount(self, game_instance, player):
        return self.filter(_game=game_instance, played_by=player).order_by('won_amount')

    def sorted_stakes(self, game_instance, player):
        return self.filter(_game=game_instance, played_by=player).order_by('stake')

    def total_won(self, game_instance, player):
        result = self.filter(_game=game_instance, played_by=player).aggregate(total=Sum('won_amount'))
        return result['total'] if result['total'] is not None else 0

    def choice_list_length(self):
        return self.annotate(choice_list_length=models.Func(models.Value(len), function='LENGTH', output_field=models.IntegerField()))

    def total_stake(self, game_instance, player):
        return self.filter(_game=game_instance, played_by=player, cancelled=False).aggregate(total=Sum('stake'))['total'] or 0

    def total_tickets(self, game_instance, player):
        return self.filter(_game=game_instance, played_by=player).aggregate(total_tickets=Count('id'))['total_tickets'] or 0

    def get_daily_tickets_stastistics_for_prize(self, player):
        try:
            today_start = timezone.now().date()
            today_end = today_start + timedelta(days=1)
            # print(f's {today_start}, e {today_end}')

            tickets = self.filter(played_by=player) #removed, just for test , created_at__range=(today_start, today_end)

            daily_total_stake = tickets.aggregate(daily_total_stake=Sum('stake'))['daily_total_stake'] or 0
            total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0

            claimed_tickets = tickets.filter(redeemed=True)
            claimed_count = claimed_tickets.count()
            claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

            unclaimed_tickets = tickets.filter(redeemed=False)
            unclaimed_count = unclaimed_tickets.count()
            unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

            cancelled_tickets = tickets.filter(cancelled=True)
            cancelled_count = cancelled_tickets.count()
            cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

            daily_gain = daily_total_stake - total_won - cancelled_stake_amount
            last_4_games = MobileGame.objects.filter(status='CLOSED').order_by('-id')[:4]
            last_4_game_ids = last_4_games.values_list('id', flat=True)
            last_4_games_total_won = tickets.filter(
                cancelled=False,
                _game_id__in=last_4_game_ids
            ).aggregate(last_4_games_total_won=Sum('won_amount'))['last_4_games_total_won'] or 0
            return daily_gain, daily_total_stake, last_4_games_total_won
        except Exception as e:
            print(f'daily statistics, {e}')
            return 0, 0, 0

    def get_ticket_with_max_stake(self, player, game):
        return self.get_queryset().filter(_game=game, played_by=player).aggregate(max_stake=Max('stake'))['max_stake']

class MobileTicket(models.Model):

    _game = models.ForeignKey(MobileGame, on_delete=models.CASCADE, db_index=True, related_name='ticket')
    played_by = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name="ticket")
    choice_list = models.TextField(default='[]', db_index=True)  # Default value is an empty JSON array

    stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    won_amount = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)

    redeemed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    unique_identifier = models.CharField(max_length=30, default=None, blank=True, null=True)
    ticket_type = models.CharField(max_length=30, default=None, blank=True, null=True)
    multiple_stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)

    objects = MobileTicketManager()

    def __str__(self):
        return f"Game Num: {self._game.game_num}, " \
               f"Choice List: {self.choice_list}, " \
               f"Stake: {self.stake}, " \
               f"Game: {self._game}"

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

    def to_data_structure(self):
        status = self.get_status()
        total_won_amount = 0

        if self.ticket_type == 'Multiple':
            similar_tickets = MobileTicket.objects.filter(unique_identifier=self.unique_identifier, ticket_type='Multiple')
            total_won_amount = similar_tickets.aggregate(total_won=Sum('won_amount'))['total_won'] or 0
            max_multiple_stake = similar_tickets.aggregate(max_multiple_stake=Max('multiple_stake'))['max_multiple_stake']

        if status == 'redeemed':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'by': self.cashier_by,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': self.won_amount
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'by': self.cashier_by,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': total_won_amount,
                }

        elif status == 'redeem':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': self.won_amount,
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': total_won_amount,
                }
                
        elif status == 'active':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': max_multiple_stake},
                }
                
        else:
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': self.won_amount,
                    'by': self.cashier_by,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': self.won_amount
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': total_won_amount,
                    'by': self.cashier_by,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': total_won_amount
                }
                
        return data

    def choice_length(self):
        choices = self.choice_list.split(', ')
        choices = [choice.strip('[]') for choice in choices]  # Remove '[' and ']' from the choices
        choice_list_length = len(choices)
        return choice_list_length

    def check_for_result(self, game_num):
        try:
            result = MobileGameResult.objects.filter(gameId__game_num=game_num)
            if result.exists():
                return result
            else:
                None
        except MobileGameResult.DoesNotExist:
            return None

    def get_status(self):
        r = self.check_for_result(self._game.game_num)
        if self.redeemed is True:
            return 'redeemed'
        elif r is not None:
            return 'redeem'
        else:
            return 'active'

    def set_choice_list(self, value):
        self.choice_list = value

    def get_choice_list(self):
        return json.loads(self.choice_list)
    
    def get_nums(self):        
        choices = self.choice_list.split(', ')
        nums = [choice.strip('[]') for choice in choices]
        return nums

    def count_occurrences(self):
        return self.choice_list.count()

    def get_total_won(self, keno_odd_type, match_balls):
        return lucky_odd_price(keno_odd_type, match_balls, self.choice_length(), self.stake)

    def get_possible_won(self):
        return turn_odd_type_to_price(self._game.keno_odd_type, self.choice_length(), self.stake)

# Signal receiver function to generate and save ussid
# @receiver(post_save, sender=Ticket)
def generate_ussid(sender, instance, created, **kwargs):
    if created and not instance.ussid:
        # Generate the unique identifier
        identifier = str(uuid.uuid4())[:12]  # Take the first 12 characters of the UUID
        # Add prefix 'xxxx-' and date part 'ddmm' to the identifier
        today = get_local_time_date()
        date_part = today.strftime("%d%m")
        ussid = f'xxxx-{date_part}-{identifier}'
        instance.ussid = ussid
        instance.save(update_fields=['ussid'])

def parse_date(date_str):
    try:
        # Attempt to parse the date string
        return datetime.strptime(date_str, '%B %d, %Y, %I:%M %p').date()
    except (TypeError, ValueError):
        # If parsing fails or the date_str is None, return None
        return None

class GameManager(models.Manager):

    def latest_keno(self):
        try:
            return self.filter(status='keno').latest('created_at')
        except Game.DoesNotExist:
            return None

    def latest_closed(self):
        try:
            return self.filter(status='CLOSED').latest('created_at')
        except Game.DoesNotExist:
            return None

    def non_result_game(self):
        try:
            latest_game = Game.objects.latest('created_at')
            if latest_game.status == 'CLOSED' and not latest_game._done:
                return latest_game
            else:
                return None
        except Game.DoesNotExist:
            return None

    def latest_keno_open(self):
        try:
            return self.filter(status='OPEN').latest('created_at')
        except Game.DoesNotExist:
            return None

    def get_related_to_game(self, game_instance):
        return self.filter(_game=game_instance)

    def get_selection_games(self, game_instance):
        return Ticket.objects.filter(_game=game_instance).select_related('_game')

    def get_result(self, game_num, date_str, agent):
        latest_results = None
        if date_str:
            date = single_date(date_str)
            print(date)
        else:
            date = get_local_time_date()
        # current_datetime = datetime.combine(current_datetime.date(), datetime.min.time()).replace(tzinfo=current_datetime.tzinfo)
        try:
            game = self.filter(created_at__date=date).get(game_num=game_num)
            # game = self.filter(created_at__gte=current_datetime).get(game_num=game_num)
            latest_results = GameResult.objects.filter(agent=agent, gameId=game).order_by('-id')[:20]

        except ObjectDoesNotExist as e:
            print(f'an error occured: {e}')
        if latest_results:
            data = {
                'game': 'keno',
                'message': 'Result is found',
                'balls': [result.value for result in latest_results],
                'game_num': game_num,
            }
            return data
        else:
            data = {
                'game': 'keno',
                'message': 'Result is not found',
                'balls': [],
                'game_num': game_num,
            }
            return data

class Game(models.Model):
    game_num = models.IntegerField(null=True, db_index=True)
    status = models.CharField(max_length=10, default='OPEN')
    created_at = models.DateTimeField(db_index=True)
    updated_at = models.DateTimeField(db_index=True)
    game_type = models.CharField(default='keno', max_length=15, db_index=True)

    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    result_gen_try = models.IntegerField(default=0)
    _done = models.BooleanField(default=False)

    objects = GameManager()

    # def __str__(self):
    #     return f"Game Num: {self.game_num}"

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

    def get_result_as_list(self):
        if self.result:
            return json.loads(self.result)
        else:
            return []

    def result_try(self):
        self.result_gen_try + 1
        self.save()

    def get_absolute_url(self):
        return reverse('keno:game_detail', kwargs={'pk': self.pk})

class GameResultManager(models.Manager):
    def filter_by_game_and_agent(self, game, agent):
        results = self.filter(gameId=game, agent=agent)[:20]

        serialized_results = ""
        for i, result in enumerate(results):
            serialized_result = f'<span class="badge badge-danger">{result.value}</span>&nbsp;'
            serialized_results += serialized_result
        return serialized_results

class GameResult(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name="gameresult")
    value = models.IntegerField(null=True)
    order = models.IntegerField(null=True)
    gameId = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='gameresult_set')
    resultId = models.IntegerField(null=True, db_index=True)
    objects = GameResultManager()

class GameAnalyticManager(models.Manager):
    def get_previous_special_prize(self, agent):
        today = timezone.now().date()
        try:
            game_prize = self.filter(agent=agent, created_at__date=today).order_by('-created_at')
            last_game = game_prize.first()
            # print(f'len game_prize {len(game_prize)} last_game {last_game}')
            last_8_games = game_prize[:8]
            last_4_games = game_prize[:4]
            prize_last_8_games = 1 if any(game.prize_made for game in last_8_games) else 0
            prize_last_4_games = 1 if any(game.prize_made for game in last_4_games) else 0
            if last_game is not None:
                previous_total_special_prize = last_game.total_special_prize
                previous_prize_made = last_game.prize_made
            else:
                previous_prize_made = False
                previous_total_special_prize = 0
            # print(f'previous_prize_made {previous_prize_made}, previous_total_special_prize {previous_total_special_prize}, prize_last_8_games {prize_last_8_games}, prize_last_4_games {prize_last_4_games}')
            return previous_prize_made, previous_total_special_prize, prize_last_8_games, prize_last_4_games
        except Exception as e:
            print(f'game analytica prize: {e}')
            return False, 0, 0, 0

    def get_game_statistics(self, game, agent):
        today = get_local_time_date()
        game_analytics = GameAnalytica.objects.filter(gameId=game, agent=agent, created_at__date=today)
        analytic = game_analytics.latest('created_at')
        return {
            'total_won': analytic.total_won,
            'total_gain': analytic.total_gain,
            'expected_gain': analytic.expected_gain,
            'total_tickets': analytic.total_tickets,
            'total_stake': analytic.total_stake,
        }

    def get_previous_data(self, agent):
        data = self.model.objects.filter(agent=agent)
        return data

class GameAnalytica(models.Model):
    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name="gameanalytic")
    gameId = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='gameanalytic_set')
    choosen_strategy = models.CharField(max_length=20, null=True, blank=True)
    total_won = models.IntegerField(default=0)
    loss_percent = models.IntegerField(default=0)
    total_tickets = models.IntegerField(default=0)
    total_stake = models.IntegerField(default=0)
    special_prize = models.BooleanField(default=False)
    total_gain = models.IntegerField(default=0)
    expected_gain = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)
    cancelled_tickets = models.IntegerField(default=0)

    gain_percentage = models.IntegerField(default=0)
    total_special_prize = models.IntegerField(default=0)
    prize_made = models.BooleanField(default=False)

    objects = GameAnalyticManager()

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    @classmethod
    def create(cls, keno_odd_type, agent, game_id, choosen_strategy=None, total_won=0, total_gain=0,
               loss_percent=0, total_tickets=0, total_stake=0, special_prize=False, expected_gain=0,
               gain_percentage=0, total_special_prize=0, prize_made=False):
        game_analytic = cls(
            keno_odd_type=keno_odd_type,
            agent=agent,
            gameId=game_id,
            choosen_strategy=choosen_strategy,
            total_won=total_won,
            total_gain=total_gain,
            loss_percent=loss_percent,
            total_tickets=total_tickets,
            total_stake=total_stake,
            special_prize=special_prize,
            created_at=get_local_time_now(),
            updated_at=get_local_time_now(),
            expected_gain=expected_gain,
            gain_percentage=gain_percentage,
            total_special_prize=total_special_prize,
            prize_made=prize_made,
        )
        game_analytic.save()
        return game_analytic

class TicketManager(models.Manager):

    def get_selection_games_info_by_cashier(self, cashier):
        selection_games = self.filter(cashier_by=cashier)
        total_choices_list_length = sum(len(json.loads(game.choice_list)) for game in selection_games)
        count = selection_games.count()
        return count, total_choices_list_length

    def max_min_length(self, game_instance, agent):
        t = self.filter(_game=game_instance, cashier_by__agent=agent)
        all_t = []
        for i in t:
            all_t['length'].append=i.choice_length
            all_t['ticket'].append=i
        
        return max(all_t['length']), min(all_t['length'])

    def check_and_get_related_to_game(self, game_instance, agent):
        try:
            related_objects = self.filter(_game=game_instance, cashier_by__agent=agent)
            if related_objects.exists():
                return related_objects
            else:
                return None
        except Exception as e:
            print(f'tickets are not found in the ticket model, exception is: {e}')
            return None

    def daily_total_gain_loss(self):
        today = get_local_time_date()
        games_filtered = Game.objects.filter(created_at__date=today).exclude(status='OPEN')
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.id) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def weekly_total_gain_loss(self):
        today = get_local_time_date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        games_filtered = Game.objects.filter(created_at__date__range=[start_of_week, end_of_week]).exclude(status='OPEN')
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.pk) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def daily_total_gain_loss_com(self, request):
        company_id = request.user.company_user.id
        today = get_local_time_date()
        games_filtered = Game.objects.filter(created_at__date=today).exclude(status="OPEN")
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.pk) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss

    def weekly_total_gain_loss_com(self, request):
        company_id = request.user.company_user.id
        today = get_local_time_date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        games_filtered = Game.objects.filter(created_at__date__range=[start_of_week, end_of_week]).exclude(status="OPEN")
        for game in games_filtered:
            total_gain_loss = self.filter(_game=game.pk) \
                .aggregate(
                    total_gain_loss=ExpressionWrapper(
                        Sum(F('stake') - F('won_amount')),
                        output_field=DecimalField()
                    )
                )['total_gain_loss'] or 0
            
            return total_gain_loss


    def last_1001_selections(self, cashier):
        formatted_selections = []
        last_40_tickets = self.order_by('-created_at').filter(cashier_by=cashier, cancelled=False, 
                                                              created_at__date=get_local_time_date())
        total_stakes = {}
        added_identifiers = set()
        print(last_40_tickets)
        user = {}
        for selection in last_40_tickets:
            local_created_at = timezone.localtime(selection.created_at)
            if selection.ticket_type == 'Multiple':
                if selection.unique_identifier not in total_stakes:
                    total_stakes[selection.unique_identifier] = selection.multiple_stake
                else:
                    total_stakes[selection.unique_identifier] = max(total_stakes[selection.unique_identifier], selection.multiple_stake)

                if selection.unique_identifier not in added_identifiers:

                    added_identifiers.add(selection.unique_identifier)
                    formatted_selection = {
                        'on': local_created_at.strftime('%Y-%m-%d'),
                        'code': selection.unique_identifier,
                        'id': selection._game.game_num,
                        'stake': total_stakes[selection.unique_identifier],
                        'by': cashier.cashier.username,
                        'company': cashier.agent.company.company_user.username,
                        'gameStartsOn': local_created_at.strftime('%Y-%m-%d'),
                        'agent': cashier.agent.full_name,
                        'toWinMin': 0,
                        'toWinMax': selection.get_possible_won(),
                        'user': user
                    }
                    formatted_selections.append(formatted_selection)
            else:
                user = [{'selection': selection.get_choice_list(),
                        'can_won': selection.get_possible_won(),
                        'stake': selection.stake,
                        'odd': selection._odd}]

                formatted_selection = {
                    'on': local_created_at.strftime('%Y-%m-%d'),
                    'code': selection.unique_identifier,
                    'id': selection._game.game_num,
                    'stake': selection.stake,
                    'by': cashier.cashier.username,
                    'company': cashier.agent.company.company_user.username,
                    'gameStartsOn': local_created_at.strftime('%Y-%m-%d'),
                    'agent': cashier.agent.full_name,
                    'user': user,
                    'toWinMin': 0,
                    'toWinMax': selection.get_possible_won(),
                }
                formatted_selections.append(formatted_selection)
        print(f'form sele {formatted_selection}')

        return formatted_selections

    def last_1002_selections(self, cashier):
        formatted_selections = []
        last_40_tickets = self.order_by('-created_at').filter(
            cashier_by=cashier, 
            cancelled=False, 
            created_at__date=get_local_time_date()
        )
        total_stakes = {}
        added_identifiers = set()
        user_data = {}

        for selection in last_40_tickets:
            local_created_at = timezone.localtime(selection.created_at)
            
            if selection.ticket_type == 'Multiple':
                if selection.unique_identifier not in total_stakes:
                    total_stakes[selection.unique_identifier] = selection.multiple_stake
                else:
                    total_stakes[selection.unique_identifier] = max(total_stakes[selection.unique_identifier], selection.multiple_stake)
                
                if selection.unique_identifier not in added_identifiers:
                    added_identifiers.add(selection.unique_identifier)
                    user_data[selection.unique_identifier] = []

                user_data[selection.unique_identifier].append({
                    'selection': selection.get_choice_list(),
                    'can_won': selection.get_possible_won(),
                    'stake': selection.stake,
                    'odd': selection._odd
                })

            else:
                formatted_selection = {
                    'on': local_created_at.strftime('%Y-%m-%d'),
                    'code': selection.unique_identifier,
                    'id': selection._game.game_num,
                    'stake': selection.stake,
                    'by': cashier.cashier.username,
                    'company': cashier.agent.company.company_user.username,
                    'gameStartsOn': local_created_at.strftime('%Y-%m-%d'),
                    'agent': cashier.agent.full_name,
                    'user': [{
                        'selection': selection.get_choice_list(),
                        'can_won': selection.get_possible_won(),
                        'stake': selection.stake,
                        'odd': selection._odd
                    }],
                    'toWinMin': 0,
                    'toWinMax': selection.get_possible_won()
                }
                formatted_selections.append(formatted_selection)

        for identifier, user_selections in user_data.items():
            for selection in last_40_tickets:
                if selection.unique_identifier == identifier:
                    local_created_at = timezone.localtime(selection.created_at)
                    formatted_selection = {
                        'on': local_created_at.strftime('%Y-%m-%d'),
                        'code': identifier,
                        'id': selection._game.game_num,
                        'stake': total_stakes[identifier],
                        'by': cashier.cashier.username,
                        'company': cashier.agent.company.company_user.username,
                        'gameStartsOn': local_created_at.strftime('%Y-%m-%d'),
                        'agent': cashier.agent.full_name,
                        'user': user_selections,
                        'toWinMin': 0,
                        'toWinMax': max(user['can_won'] for user in user_selections)
                    }
                    formatted_selections.append(formatted_selection)
                    break

        return formatted_selections

    def last_100_selections(self, cashier):
        formatted_selections = []
        last_40_tickets = self.order_by('-created_at').filter(
            cashier_by=cashier, 
            cancelled=False,
            redeemed=False,
            created_at__date=get_local_time_date()
        )
        total_stakes = {}
        added_identifiers = set()
        user_data = {}

        for selection in last_40_tickets:
            local_created_at = timezone.localtime(selection.created_at)

            if selection.ticket_type == 'Multiple':
                if selection.unique_identifier not in total_stakes:
                    total_stakes[selection.unique_identifier] = selection.multiple_stake
                else:
                    total_stakes[selection.unique_identifier] = max(total_stakes[selection.unique_identifier], selection.multiple_stake)
                
                if selection.unique_identifier not in added_identifiers:
                    added_identifiers.add(selection.unique_identifier)
                    user_data[selection.unique_identifier] = []

                user_data[selection.unique_identifier].append({
                    'selection': selection.get_choice_list(),
                    'can_won': selection.get_possible_won(),
                    'stake': selection.stake,
                    'odd': selection._odd
                })

            else:
                formatted_selection = {
                    'created_at': local_created_at,  # Add created_at to use for sorting later
                    'on': local_created_at.strftime('%Y-%m-%d'),
                    'code': selection.unique_identifier,
                    'id': selection._game.game_num,
                    'stake': selection.stake,
                    'by': cashier.cashier.username,
                    'company': cashier.agent.company.company_user.username,
                    'gameStartsOn': local_created_at.strftime('%Y-%m-%d'),
                    'agent': cashier.agent.full_name,
                    'game': 'keno',
                    'user': [{
                        'selection': selection.get_choice_list(),
                        'can_won': selection.get_possible_won(),
                        'stake': selection.stake,
                        'odd': selection._odd
                    }],
                    'toWinMin': 0,
                    'toWinMax': selection.get_possible_won()
                }
                formatted_selections.append(formatted_selection)

        for identifier, user_selections in user_data.items():
            for selection in last_40_tickets:
                if selection.unique_identifier == identifier:
                    local_created_at = timezone.localtime(selection.created_at)
                    formatted_selection = {
                        'created_at': local_created_at,  # Add created_at to use for sorting later
                        'on': local_created_at.strftime('%Y-%m-%d'),
                        'code': identifier,
                        'id': selection._game.game_num,
                        'stake': total_stakes[identifier],
                        'by': cashier.cashier.username,
                        'company': cashier.agent.company.company_user.username,
                        'gameStartsOn': local_created_at.strftime('%Y-%m-%d'),
                        'agent': cashier.agent.full_name,
                        'user': user_selections,
                        'game': 'keno',
                        'toWinMin': 0,
                        'toWinMax': max(user['can_won'] for user in user_selections)
                    }
                    formatted_selections.append(formatted_selection)
                    break

        # Sort the selections by created_at datetime
        formatted_selections.sort(key=lambda x: x['created_at'], reverse=True)

        # Remove the 'created_at' key if it's not needed in the final output
        for selection in formatted_selections:
            del selection['created_at']

        return formatted_selections

    def get_ticket_by_ussid(self, code):

        try:
            ticket = self.filter(unique_identifier=code).first()
            return ticket
        except self.model.DoesNotExist:
            return None

    def get_multiple_ticket_by_ussid(self, code):
        ticket_id, game_num = self.extract_ticket_id_and_game_num(code)

        try:
            ticket = self.filter(pk=ticket_id, _game__game_num=game_num)
            return ticket
        except self.model.DoesNotExist:
            return None

    def get_status(self, game_result, redeemed):
        if redeemed:
            return 'redeemed'
        elif game_result is not None:
            return 'redeem'
        else:
            return 'active'

    def sorted_won_amount(self, game_instance, agent):
        return self.filter(_game=game_instance, cashier_by__agent=agent).order_by('won_amount')

    def sorted_stakes(self, game_instance, agent):
        return self.filter(_game=game_instance, cashier_by__agent=agent).order_by('stake')

    def total_won(self, game_instance, agent):
        result = self.filter(_game=game_instance, cashier_by__agent=agent).aggregate(total=Sum('won_amount'))
        return result['total'] if result['total'] is not None else 0

    def choice_list_length(self):
        return self.annotate(choice_list_length=models.Func(models.Value(len), function='LENGTH', output_field=models.IntegerField()))

    def total_stake(self, game_instance, agent):
        return self.filter(_game=game_instance, cashier_by__agent=agent, cancelled=False).aggregate(total=Sum('stake'))['total'] or 0

    def total_tickets(self, game_instance, agent):
        return self.filter(_game=game_instance, cashier_by__agent=agent).aggregate(total_tickets=Count('id'))['total_tickets'] or 0

    def get_daily_tickets_stastistics_for_prize(self, agent):
        try:
            today_start = timezone.now().date()
            today_end = today_start + timedelta(days=1)
            # print(f's {today_start}, e {today_end}')

            tickets = self.filter(cashier_by__agent=agent, created_at__range=(today_start, today_end)) #removed, just for test 

            daily_total_stake = tickets.aggregate(daily_total_stake=Sum('stake'))['daily_total_stake'] or 0
            total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0

            claimed_tickets = tickets.filter(redeemed=True)
            claimed_count = claimed_tickets.count()
            claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

            unclaimed_tickets = tickets.filter(redeemed=False)
            unclaimed_count = unclaimed_tickets.count()
            unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

            cancelled_tickets = tickets.filter(cancelled=True)
            cancelled_count = cancelled_tickets.count()
            cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

            daily_gain = daily_total_stake - total_won - cancelled_stake_amount
            last_4_games = Game.objects.filter(status='CLOSED').order_by('-id')[:4]
            last_4_game_ids = last_4_games.values_list('id', flat=True)
            last_4_games_total_won = tickets.filter(
                cancelled=False,
                _game_id__in=last_4_game_ids
            ).aggregate(last_4_games_total_won=Sum('won_amount'))['last_4_games_total_won'] or 0
            return daily_gain, daily_total_stake, last_4_games_total_won
        except Exception as e:
            print(f'daily statistics, {e}')
            return 0, 0, 0

    def get_ticket_with_max_stake(self, agent, game):
        return self.get_queryset().filter(_game=game, cashier_by__agent=agent).aggregate(max_stake=Max('stake'))['max_stake']

class Ticket(models.Model):

    _game = models.ForeignKey(Game, on_delete=models.CASCADE, db_index=True, related_name='ticket')
    cashier_by = models.ForeignKey(Cashier, on_delete=models.SET_NULL, null=True, related_name="ticket")
    choice_list = models.TextField(default='[]', db_index=True)  # Default value is an empty JSON array

    stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    won_amount = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)

    redeemed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    unique_identifier = models.CharField(max_length=30, default=None, blank=True, null=True)
    ticket_type = models.CharField(max_length=30, default=None, blank=True, null=True)
    multiple_stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    _odd = models.IntegerField(default=0)
    result = models.IntegerField(default=0)

    objects = TicketManager()

    def __str__(self):
        return f"Game Num: {self._game.game_num}, " \
               f"Choice List: {self.choice_list}, " \
               f"Stake: {self.stake}, " \
               f"Game: {self._game}"

    def save(self, *args, **kwargs):
        if self.pk is None:  # Check if the object is being created for the first time
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

    def to_data_structure(self, cashier):
        status = self.get_status()
        total_won_amount = 0
        max_multiple_stake = 0

        if self.cancelled:
            status = 'unknown'
            data = {
                'status': status
            }
            return data

        if self.ticket_type == 'Multiple':
            similar_tickets = Ticket.objects.filter(unique_identifier=self.unique_identifier, ticket_type='Multiple')
            total_won_amount = similar_tickets.aggregate(total_won=Sum('won_amount'))['total_won'] or 0
            max_multiple_stake = similar_tickets.aggregate(max_multiple_stake=Max('multiple_stake'))['max_multiple_stake']

        if status == 'redeemed':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'by': cashier,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': self.won_amount
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'by': cashier,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': total_won_amount,
                }

        elif status == 'redeem':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': self.won_amount,
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': total_won_amount,
                }
                
        elif status == 'active':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': max_multiple_stake},
                }
                
        else:
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': self.won_amount,
                    'by': cashier,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': self.won_amount
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'won': total_won_amount,
                    'by': cashier,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': total_won_amount
                }
                
        return data

    def choice_length(self):
        choices = self.choice_list.split(', ')
        choices = [choice.strip('[]') for choice in choices]  # Remove '[' and ']' from the choices
        choice_list_length = len(choices)
        return choice_list_length

    def check_for_result(self, game_num):
        try:
            result = GameResult.objects.filter(gameId__game_num=game_num)
            if result.exists():
                return result
            else:
                None
        except GameResult.DoesNotExist:
            return None

    def get_status_dashboard(self):
        r = self.check_for_result(self._game.game_num)
        if r != None:
            if self.redeemed is True:
                return 'redeemed'
            elif self.redeemed is False and self.won_amount > 0:
                return 'un-redeemed'
            else:
                return 'not won'
        else:
            return 'active'

    def get_status(self):
        r = self.check_for_result(self._game.game_num)
        if self.redeemed is True:
            return 'redeemed'
        elif r is not None:
            return 'redeem'
        else:
            return 'active'

    def set_choice_list(self, value):
        self.choice_list = value

    def get_choice_list(self):
        # return json.loads(self.choice_list)
        if isinstance(self.choice_list, str):
            try:
                choice_list = json.loads(self.choice_list)
            except json.JSONDecodeError:
                choice_list = []
        else:
            choice_list = self.choice_list
        return choice_list

    def get_nums(self):        
        choices = self.choice_list.split(', ')
        nums = [choice.strip('[]') for choice in choices]
        return nums

    def count_occurrences(self):
        return self.choice_list.count()

    def get_total_won(self, keno_odd_type, match_balls):
        return lucky_odd_price(keno_odd_type, match_balls, self.choice_length(), self.stake)

    def get_possible_won(self):
        return turn_odd_type_to_price(self.cashier_by.agent.keno_odd_type, self.choice_length(), self.stake)
