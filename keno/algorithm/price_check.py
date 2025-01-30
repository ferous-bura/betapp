import os
import django
import json
import random
from keno.utils.raw_result import lucky_odd_price, turn_odd_type_to_price
from zuser.models import GameHistory
from ..models import GameResult

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "game.settings")
django.setup()
class KenoPrice:
    def __init__(self, smodel, game, tickets, total_stake, total_won, total_players):
        self.game = game
        self.smodel = smodel
        self.tickets = tickets
        self.total_players = total_players
        self.total_stake = total_stake
        self.total_won = total_won

    def main(self, result, agent):
        winners = []
        total_won = 0

        for ticket in self.tickets:
            matched_balls = [b for b in result if b in ticket.get_choice_list()]
            if matched_balls:
                won_amount = lucky_odd_price(self.game.keno_odd_type, matched_balls, ticket.choice_length(), ticket.stake)
                ticket.won_amount = won_amount
                total_won += won_amount
                try:
                    ticket.redeemed = True
                except Exception as e:
                    print(e)
                print(ticket.won_amount)
                print(ticket.redeemed)
                winners.append((ticket, matched_balls, won_amount))

        won_perc = (total_won / self.total_stake) * 100

        admin_benefit_percent = GameHistory.objects.get_benefit_percent
        systems_benefit_percent = agent.agent_margin if agent.agent_margin > 0 else admin_benefit_percent

        if systems_benefit_percent < 6:
            threshold = 280
        elif systems_benefit_percent < 11:
            threshold = 260
        elif systems_benefit_percent < 21:
            threshold = 250
        elif systems_benefit_percent < 51:
            threshold = 240

        won_diff_perc = (total_won / (self.total_stake - (self.total_stake * systems_benefit_percent))) * 100
        if won_diff_perc >= threshold:
            for i, r in enumerate(result):
                GameResult.objects.create(value=r, order=i + 1, gameId=self.game, resultId=0, agent=agent)

            keno_odd_type = self.game.keno_odd_type if self.game.keno_odd_type else 'A'
            for winner in winners:
                ticket, match_balls, won_amount = winner
                ticket.redeemed = True
                ticket.save()
            return result, False

    def calculate_total_missing_percentage(self):
        total_numbers = sum(len(set(json.loads(self.game.result))) if self.game.result else 0 for game in self.tickets)
        total_missing_numbers = sum(len(set(json.loads(self.game.result)).difference(set(ticket.get_choice_list()))) for ticket in self.tickets)

        total_missing_percentage = (total_missing_numbers / total_numbers) * 100 if total_numbers > 0 else 0
        return round(total_missing_percentage, 2)
    
    def calculate_total_missing_percentage_second(self):
        total_numbers = 0
        total_missing_numbers = 0

        for selection_game in self.tickets:
            result_set = set(json.loads(self.game.result)) if self.game.result else set()
            choice_list = set(selection_game.get_choice_list())

            total_numbers += len(result_set)
            total_missing_numbers += len(result_set.difference(choice_list))

        total_missing_percentage = (total_missing_numbers / total_numbers) * 100 if total_numbers > 0 else 0
        return round(total_missing_percentage, 2)
