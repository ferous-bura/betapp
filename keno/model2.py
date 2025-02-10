from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField, Max
from django.db.models.functions import ExtractDate
import json
from datetime import datetime, timedelta
from .utils.time_utils import get_local_time_now, get_local_time_date
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

class GameManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related()

    def latest_keno(self):
        return self.filter(status='keno').select_related().last()

    def latest_closed(self):
        return self.filter(status='CLOSED').select_related().last()

    def non_result_game(self):
        return self.filter(status='CLOSED', _done=False).select_related().last()

    def latest_keno_open(self):
        return self.filter(status='OPEN').select_related().last()

    def get_related_to_game(self, game_instance):
        return self.filter(_game=game_instance).select_related()

    def get_selection_games(self, game_instance):
        return (Ticket.objects
                .filter(_game=game_instance)
                .select_related('_game')
                .only('choice_list', 'stake', 'won_amount'))

    def get_result(self, game_num, date_str, agent):
        try:
            date = single_date(date_str) if date_str else get_local_time_date()
            game = (self.filter(created_at__date=date)
                   .select_related()
                   .get(game_num=game_num))
            
            latest_results = (GameResult.objects
                            .filter(agent=agent, gameId=game)
                            .order_by('-id')[:20]
                            .values_list('value', flat=True))

            return {
                'game': 'keno',
                'message': 'Result is found' if latest_results else 'Result is not found',
                'balls': list(latest_results),
                'game_num': game_num,
            }
        except Exception as e:
            logger.error(f"Error getting result: {e}")
            return {
                'game': 'keno',
                'message': 'Result is not found',
                'balls': [],
                'game_num': game_num,
            }

class Game(models.Model):
    game_num = models.IntegerField(null=True, db_index=True)
    status = models.CharField(max_length=10, default='OPEN', db_index=True)
    created_at = models.DateTimeField(db_index=True)
    updated_at = models.DateTimeField(db_index=True)
    game_type = models.CharField(default='keno', max_length=15, db_index=True)
    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    result_gen_try = models.IntegerField(default=0)
    _done = models.BooleanField(default=False, db_index=True)

    objects = GameManager()

    class Meta:
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['game_num', 'created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

class GameResultManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related('gameId', 'agent')

    def filter_by_game_and_agent(self, game, agent):
        results = (self.filter(gameId=game, agent=agent)
                  .order_by('order')[:20]
                  .values_list('value', flat=True))
        
        return ''.join(f'<span class="badge badge-danger">{value}</span>&nbsp;'
                      for value in results)

class GameResult(models.Model):
    agent = models.ForeignKey('zuser.Agent', on_delete=models.SET_NULL, null=True, related_name="gameresult")
    value = models.IntegerField(null=True)
    order = models.IntegerField(null=True)
    gameId = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='gameresult_set')
    resultId = models.IntegerField(null=True, db_index=True)

    objects = GameResultManager()

    class Meta:
        indexes = [
            models.Index(fields=['gameId', 'agent']),
            models.Index(fields=['resultId']),
        ]

class GameAnalyticManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related('agent', 'gameId')

    def get_previous_special_prize(self, agent):
        try:
            today = timezone.now().date()
            game_prize = (self.filter(agent=agent, created_at__date=today)
                         .order_by('-created_at')
                         .select_related())
            
            if not game_prize.exists():
                return False, 0, 0, 0

            last_game = game_prize.first()
            last_8_games = game_prize[:8]
            last_4_games = game_prize[:4]

            prize_last_8_games = 1 if any(game.prize_made for game in last_8_games) else 0
            prize_last_4_games = 1 if any(game.prize_made for game in last_4_games) else 0

            return (last_game.prize_made,
                    last_game.total_special_prize,
                    prize_last_8_games,
                    prize_last_4_games)
        except Exception as e:
            logger.error(f"Error getting previous special prize: {e}")
            return False, 0, 0, 0

    def get_game_statistics(self, game, agent):
        try:
            today = get_local_time_date()
            analytic = (self.filter(gameId=game, agent=agent, created_at__date=today)
                       .latest('created_at'))
            
            return {
                'total_won': analytic.total_won,
                'total_gain': analytic.total_gain,
                'expected_gain': analytic.expected_gain,
                'total_tickets': analytic.total_tickets,
                'total_stake': analytic.total_stake,
            }
        except Exception as e:
            logger.error(f"Error getting game statistics: {e}")
            return {
                'total_won': 0,
                'total_gain': 0,
                'expected_gain': 0,
                'total_tickets': 0,
                'total_stake': 0,
            }

class GameAnalytica(models.Model):
    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    agent = models.ForeignKey('zuser.Agent', on_delete=models.SET_NULL, null=True, related_name="gameanalytic")
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

    class Meta:
        indexes = [
            models.Index(fields=['agent', 'created_at']),
            models.Index(fields=['gameId', 'agent']),
        ]

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)

    @classmethod
    def create(cls, **kwargs):
        instance = cls(**kwargs)
        instance.save()
        return instance

class TicketManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related('_game', 'cashier_by')

    def check_and_get_related_to_game(self, game_instance, agent):
        return (self.filter(_game=game_instance, cashier_by__agent=agent)
                .select_related('_game', 'cashier_by')
                .only('choice_list', 'stake', 'won_amount'))

    def total_stake(self, game_instance, agent):
        return (self.filter(_game=game_instance, cashier_by__agent=agent, cancelled=False)
                .aggregate(total=Sum('stake'))['total'] or 0)

    def get_daily_tickets_stastistics_for_prize(self, agent):
        try:
            today = get_local_time_date()
            tickets = (self.filter(cashier_by__agent=agent, created_at__date=today)
                      .select_related('_game'))

            daily_total_stake = tickets.aggregate(sum=Sum('stake'))['sum'] or 0
            total_won = tickets.filter(cancelled=False).aggregate(sum=Sum('won_amount'))['sum'] or 0
            cancelled_stake = tickets.filter(cancelled=True).aggregate(sum=Sum('stake'))['sum'] or 0

            daily_gain = daily_total_stake - total_won - cancelled_stake

            last_4_games = (Game.objects.filter(status='CLOSED')
                           .order_by('-id')[:4]
                           .values_list('id', flat=True))

            last_4_games_total_won = (tickets.filter(cancelled=False, _game_id__in=last_4_games)
                                    .aggregate(sum=Sum('won_amount'))['sum'] or 0)

            return daily_gain, daily_total_stake, last_4_games_total_won
        except Exception as e:
            logger.error(f"Error getting daily statistics: {e}")
            return 0, 0, 0

    def get_ticket_with_max_stake(self, agent, game):
        return (self.filter(_game=game, cashier_by__agent=agent)
                .aggregate(max_stake=Max('stake'))['max_stake'])

class Ticket(models.Model):
    _game = models.ForeignKey(Game, on_delete=models.CASCADE, db_index=True, related_name='ticket')
    cashier_by = models.ForeignKey('zuser.Cashier', on_delete=models.SET_NULL, null=True, related_name="ticket")
    choice_list = models.TextField(default='[]', db_index=True)
    stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    won_amount = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)
    redeemed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    unique_identifier = models.CharField(max_length=30, default=None, blank=True, null=True, db_index=True)
    ticket_type = models.CharField(max_length=30, default=None, blank=True, null=True)
    multiple_stake = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    _odd = models.IntegerField(default=0)
    result = models.IntegerField(default=0)

    objects = TicketManager()

    class Meta:
        indexes = [
            models.Index(fields=['_game', 'cashier_by']),
            models.Index(fields=['created_at', 'cashier_by']),
            models.Index(fields=['unique_identifier']),
        ]

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)

    def get_choice_list(self):
        return json.loads(self.choice_list)

    def choice_length(self):
        return len(self.get_choice_list())

    def get_possible_won(self):
        return turn_odd_type_to_price(
            self._game.keno_odd_type,
            self.choice_length(),
            self.stake
        )