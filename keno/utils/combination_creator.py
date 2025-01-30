import json
import random

from django.shortcuts import get_object_or_404
from keno.models import Game, Ticket, MobileGame, MobileTicket
from django.core.exceptions import ValidationError
import logging

from django.contrib.auth.models import User
from zuser.models import Cashier, Player

from game_utils.time_file import get_local_time_date

logger = logging.getLogger(__name__)

class KenoCombination:
    def create_game_instances(self, game_num):
        try:
            while True:
                existing_game = Game.objects.filter(game_num=game_num).first()
                if existing_game:
                    game_num += 1
                else:
                    game_instance = Game.objects.create(game_num=game_num)
                    return game_instance
        except ValidationError as e:
            print(f"Error creating Game instance: {e}")
            return None

    def get_all_cashier_username(self):
        cashier_users = Cashier.objects.values_list('cashier__username', flat=True).filter(agent__locked=False)
        return cashier_users

    def create_and_save_combinations(self):
        all_numbers = list(range(1, 81))
        for game_num in range(1200, 1400):
            try:
                game_instance = self.create_game_instances(game_num)
                num_iterations = random.choice(range(3, 7))

                cashier_usernames = self.get_all_cashier_username()
                for u in cashier_usernames:
                    cashier_user = User.objects.get(username=u)
                    cashier = get_object_or_404(Cashier, cashier=cashier_user)
                    for _ in range(num_iterations):
                        _stake = random.choice(range(10, 1010, 10))
                        selected_combination = random.sample(all_numbers, game_num - 1195)
                        ticket = Ticket.objects.create(
                            _game=game_instance,
                            choice_list=json.dumps(selected_combination),
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
                print(f"Error creating combinations for game_num {game_num}: {e}")

    def create_combinations_per_game(self):
        all_numbers = list(range(1, 81))
        try:
            game_instance = Game.objects.latest_keno_open()
            num_iterations = random.choice(range(1, 5))

            cashier_usernames = self.get_all_cashier_username()
            for u in cashier_usernames:
                cashier_user = User.objects.get(username=u)
                cashier = get_object_or_404(Cashier, cashier=cashier_user)
                for _ in range(num_iterations):
                    _stake = random.choice(range(10, 30, 10))
                    _size = random.choice(range(1, 4))
                    selected_combination = random.sample(all_numbers, _size)
                    ticket = Ticket.objects.create(
                        _game=game_instance,
                        choice_list=json.dumps(selected_combination),
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

class MobileKenoCombination:
    def create_game_instances(self, game_num):
        try:
            while True:
                existing_game = MobileGame.objects.filter(game_num=game_num).first()
                if existing_game:
                    game_num += 1
                else:
                    game_instance = MobileGame.objects.create(game_num=game_num)
                    return game_instance
        except ValidationError as e:
            print(f"Error creating Mobile Game instance: {e}")
            return None

    def get_all_players_username(self):
        return Player.objects.all()

    def create_and_save_combinations(self):
        all_numbers = list(range(1, 81))
        for game_num in range(1200, 1400):
            try:
                game_instance = self.create_game_instances(game_num)
                num_iterations = random.choice(range(3, 7))

                players = self.get_all_players_username()
                for p in players:
                    for _ in range(num_iterations):
                        _stake = random.choice(range(10, 1010, 10))
                        selected_combination = random.sample(all_numbers, game_num - 1195)
                        ticket = MobileTicket.objects.create(
                            _game=game_instance,
                            choice_list=json.dumps(selected_combination),
                            stake=_stake,
                            played_by=p,
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
        all_numbers = list(range(1, 81))
        try:
            game_instance = MobileGame.objects.latest_keno_open()
            num_iterations = random.choice(range(1, 5))

            players = self.get_all_players_username()
            for p in players:
                for _ in range(num_iterations):
                    _stake = random.choice(range(10, 30, 10))
                    _size = random.choice(range(1, 4))
                    selected_combination = random.sample(all_numbers, _size)
                    ticket = MobileTicket.objects.create(
                        _game=game_instance,
                        choice_list=json.dumps(selected_combination),
                        stake=_stake,
                        played_by=p,
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

class NumpyArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, list):
            return obj
        return json.JSONEncoder.default(self, obj)
