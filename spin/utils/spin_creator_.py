import json
import random

from django.shortcuts import get_object_or_404
from spin.models import Spin, SpinTicket
from django.core.exceptions import ValidationError
# import logging

from django.contrib.auth.models import User
from zuser.models import Cashier

from game_utils.time_file import get_local_time_date
from .raw_result import special_cases, bet_types

# logger = logging.getLogger(__name__)

class Spinner:
    def create_game_instances(self, game_num):
        try:
            while True:
                existing_game = Spin.objects.filter(game_num=game_num).first()
                if existing_game:
                    game_num += 1
                else:
                    game_instance = Spin.objects.create(game_num=game_num)
                    return game_instance
        except ValidationError as e:
            print(f"Error creating Spin instance: {e}")
            return None

    def get_all_cashier_username(self):
        cashier_users = Cashier.objects.values_list('cashier__username', flat=True).filter(agent__locked=False)
        return cashier_users

    def create_and_save_combinations(self):
        all_numbers = range(1, 37)
        for game_num in range(1600, 1610):
            try:
                game_instance = self.create_game_instances(game_num)
                num_iterations = random.choice(range(3, 7))

                cashier_usernames = self.get_all_cashier_username()
                for u in cashier_usernames:
                    cashier_user = User.objects.get(username=u)
                    cashier = get_object_or_404(Cashier, cashier=cashier_user)
                    bet_types_list = list(bet_types.keys())
                    for _ in range(num_iterations):
                        
                        bet_type = random.choice(bet_types_list)
                        stake = random.randint(10, 1000)
                        selected_value = random.choice(all_numbers)
                        if bet_type in ['single', 'pair', 'trio', 'quad', 'six']:
                            num_count = {'single': 1, 'pair': 2, 'trio': 3, 'quad': 4, 'six': 6}[bet_type]
                            chosen_numbers = random.sample(range(0, 37), num_count)
                        else:
                            chosen_numbers = bet_types[bet_type]['numbers']

                        ticket = SpinTicket.objects.create(
                            _game=game_instance,
                            kind=chosen_numbers,
                            choice_val=bet_type,
                            stake=stake,
                            cashier_by=cashier,
                            ticket_type='Single',
                        )
                        current_date = get_local_time_date()
                        year = str(current_date.year)[-2:]
                        month = str(current_date.month).zfill(2)
                        day = str(current_date.day).zfill(2)

                        ticket.unique_identifier = f"{ticket.id}{game_instance.game_num}{day}{month}{year}"
                        ticket.save()
            except Exception as e:
                print(f"Error creating combinations for game_num {game_num}: {e}")

    def create_combinations_per_game(self):
        all_numbers = range(1, 37)
        try:
            game_instance = Spin.objects.latest_keno_open()
            num_iterations = random.choice(range(1, 5))

            cashier_usernames = self.get_all_cashier_username()
            for u in cashier_usernames:
                cashier_user = User.objects.get(username=u)
                cashier = get_object_or_404(Cashier, cashier=cashier_user)
                for _ in range(num_iterations):
                    _stake = random.choice(range(10, 30, 10))
                    _size = random.choice(range(1, 4))
                    selected_value = random.sample(all_numbers)
                    ticket = SpinTicket.objects.create(
                        _game=game_instance,
                        choice_value=f'{selected_value}',
                        stake=_stake,
                        cashier_by=cashier,
                        ticket_type='Single',
                    )
                    current_date = get_local_time_date()

                    year = str(current_date.year)[-2:]
                    month = str(current_date.month).zfill(2)
                    day = str(current_date.day).zfill(2)

                    ticket.unique_identifier = f"{ticket.id}{game_instance.game_num}{day}{month}{year}"
                    ticket.save()
        except Exception as e:
            print(f"Error creating combinations: {e}")
