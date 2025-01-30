import json
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

from zuser.models import Agent, Cashier
from game_utils.time_file import get_local_time_date, get_local_time_now, single_date
from spin.utils.raw_result import special_cases

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

class SpinManager(models.Manager):

    def get_result(self, game_num, date_str, agent):
        latest_results = None
        if date_str:
            date = single_date(date_str)
            print(date)
        else:
            date = get_local_time_date()
        try:
            game = self.filter(created_at__date=date).get(game_num=game_num)
            print(f'game {game}')
            latest_results = self.filter(gameId=game).order_by('-id')[:20] # agent=agent,
            print(f'latest results {latest_results}')

        except ObjectDoesNotExist as e:
            print(f'an error occured: {e}')
        if latest_results:
            data = {
                'status': 'keno',
                'message': 'Result is found',
                'balls': [result.value for result in latest_results],
                'game_num': game_num,
            }
            # print(f'data {data['balls']}')
            return data
        else:
            data = {
                'status': 'keno',
                'message': 'Result is not found',
                'balls': [],
                'game_num': game_num,
            }
            return data

    def latest_spin_open(self):
        try:
            return self.filter(status='OPEN').latest('created_at')
        except Spin.DoesNotExist:
            return None

    def non_result_game(self):
        try:
            latest_game = Spin.objects.latest('created_at')
            if latest_game.status == 'CLOSED' and not latest_game._done:
                return latest_game
            else:
                return None
        except Spin.DoesNotExist:
            return None

    def get_result(self, game_num, date_str, agent):
        latest_results = None
        if date_str:
            date = single_date(date_str)
            print(date)
        else:
            date = get_local_time_date()
        try:
            # Ensure you filter and then order, followed by retrieving the first result
            game = self.filter(created_at__date=date, agent=agent, game_num=game_num).order_by('-id').first()
            if game:
                print(f'r {game.result}')
                latest_results = game.result if game.result else None
        except self.model.DoesNotExist as e:
            latest_results = None
            print(f'an error occured: {e}')
        print(f'latest result {latest_results}')
        if latest_results:
            data = {
                'game': 'spin',
                'message': 'Result is found',
                'balls': [latest_results],
                'game_num': game_num,
            }
            return data
        else:
            data = {
                'game': 'spin',
                'message': 'Result is not found',
                'balls': [],
                'game_num': game_num,
            }
            return data

class Spin(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name="spin")
    game_num = models.IntegerField(null=True, db_index=True)
    status = models.CharField(max_length=10, default='OPEN')
    created_at = models.DateTimeField(db_index=True)
    updated_at = models.DateTimeField(db_index=True)
    game_type = models.CharField(default='spin', max_length=15, db_index=True)
    result = models.IntegerField(null=True)
    _done = models.BooleanField(default=False)
    # keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')

    objects = SpinManager()

    # def __str__(self):
    #     return f"Game Num: {self.game_num}"

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

class SpinTicketManager(models.Manager):

    def get_value(self):
        pass

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

    def total_stake(self, game_instance, agent):
        return self.filter(_game=game_instance, cashier_by__agent=agent, cancelled=False).aggregate(total=Sum('stake'))['total'] or 0

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
            last_4_games = Spin.objects.filter(status='CLOSED').order_by('-id')[:4]
            last_4_game_ids = last_4_games.values_list('id', flat=True)
            last_4_games_total_won = tickets.filter(
                cancelled=False,
                _game_id__in=last_4_game_ids
            ).aggregate(last_4_games_total_won=Sum('won_amount'))['last_4_games_total_won'] or 0
            return daily_gain, daily_total_stake, last_4_games_total_won
        except Exception as e:
            print(f'daily statistics, {e}')
            return 0, 0, 0

    def last_100_selections(self, cashier):
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
            bet_val = selection.choice_val
            val = special_cases[bet_val] if bet_val in special_cases else bet_val
            win_type = selection.win_type

            if selection.ticket_type == 'Multiple':
                if selection.unique_identifier not in total_stakes:
                    total_stakes[selection.unique_identifier] = selection.multiple_stake
                else:
                    total_stakes[selection.unique_identifier] = max(total_stakes[selection.unique_identifier], selection.multiple_stake)

                if selection.unique_identifier not in added_identifiers:
                    added_identifiers.add(selection.unique_identifier)
                    user_data[selection.unique_identifier] = []
                user_data[selection.unique_identifier].append({
                    'win_type': win_type,
                    'val': val,
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
                    'game': 'spin',
                    'user': [{
                        'win_type': win_type,
                        'val': val,
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

class SpinTicket(models.Model):
    _game = models.ForeignKey(Spin, on_delete=models.CASCADE, db_index=True, related_name='spinticket')
    cashier_by = models.ForeignKey(Cashier, on_delete=models.SET_NULL, null=True, related_name="spinticket")
    choice_val = models.CharField(max_length=10, null=False, blank=False)
    kind = models.CharField(max_length=20, null=False, blank=False)
    win_type = models.CharField(max_length=20, null=False, blank=False)
    _odd = models.IntegerField(default=0)
    stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    won_amount = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)

    redeemed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    unique_identifier = models.CharField(max_length=30, default=None, blank=True, null=True)
    ticket_type = models.CharField(max_length=30, default=None, blank=True, null=True)
    multiple_stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    result = models.IntegerField(default=0)

    objects = SpinTicketManager()

    def get_choice_list(self):
        # return json.loads(self.choice_list)
        if isinstance(self.choice_val, str):
            try:
                choice_list = json.loads(self.choice_val)
            except json.JSONDecodeError:
                choice_list = []
        else:
            choice_list = self.choice_list
        return choice_list

    def check_for_result(self, game):
        try:
            result = game.result
            if result:
                return result
            else:
                None
        except Exception as e:
            print(f'exception {e}')
            return None

    def get_status(self):
        r = self.check_for_result(self._game)
        if self.redeemed is True:
            return 'redeemed'
        elif r is not None:
            return 'redeem'
        else:
            return 'active'

    def to_data_structure(self, cashier):
        status = self.get_status()
        total_won_amount = 0

        if self.cancelled:
            status = 'unknown'
            data = {
                'status': status
            }
            return data

        if self.ticket_type == 'Multiple':
            similar_tickets = SpinTicket.objects.filter(unique_identifier=self.unique_identifier, ticket_type='Multiple')
            total_won_amount = similar_tickets.aggregate(total_won=Sum('won_amount'))['total_won'] or 0

        if status == 'redeemed':
            if self.ticket_type == 'Single':
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.stake},
                    'by': cashier,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': self.won_amount
                }
            else:
                data = {
                    'code': self.unique_identifier,
                    'status': status,
                    'message': 'Ticket is found',
                    'user': {'stake': self.multiple_stake},
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
                    'user': {'stake': self.multiple_stake},
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
                    'user': {'stake': self.multiple_stake},
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
                    'user': {'stake': self.multiple_stake},
                    'won': total_won_amount,
                    'by': cashier,
                    'on': get_local_time_now().strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': total_won_amount
                }

        return data

    def save(self, *args, **kwargs):
        if self.pk is None:  # Check if the object is being created for the first time
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

    def get_possible_won(self):
        return self.stake * self._odd
        # return turn_odd_type_to_price(self.cashier_by.agent.keno_odd_type, self.choice_length(), self.stake)

class SpinAnalyticManager(models.Manager):
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
            print(f'spin analytica prize: {e}')
            return False, 0, 0, 0

    def get_game_statistics(self, game, agent):
        today = get_local_time_date()
        game_analytics = self.objects.filter(gameId=game, agent=agent, created_at__date=today)
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

class SpinAnalytica(models.Model):
    spin_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='default')
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name="spinanalytic")
    gameId = models.ForeignKey(Spin, on_delete=models.CASCADE, related_name='spinanalytic_set')
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

    objects = SpinAnalyticManager()

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    @classmethod
    def create(cls, spin_odd_type, agent, game_id, choosen_strategy=None, total_won=0, total_gain=0,
               loss_percent=0, total_tickets=0, total_stake=0, special_prize=False, expected_gain=0,
               gain_percentage=0, total_special_prize=0, prize_made=False):
        game_analytic = cls(
            spin_odd_type=spin_odd_type,
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
