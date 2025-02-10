from django.utils import timezone
import random
from django.db import transaction
from collections import Counter
from django.core.exceptions import ObjectDoesNotExist
from zuser.models import Agent
from ..models import Game, GameAnalytica, GameResult, Ticket
from ..utils.raw_result import lucky_odd_price

class KenoManager:
    def __init__(self, game_instance):
        self.game = game_instance
        self.make_prize = False
        self.margin = 0
        self.agent = None
        self.tickets = None
        self.total_stake = 0
        self.previous_prize_made = True
        self.previous_prize_amount = 0
        self.prize_last_8_games = 0
        self.prize_last_4_games = 0
        self.daily_gain = 0
        self.daily_total_stake = 0
        self.last_4_games_total_won = 0
        self.micro_prize = False
        self.special_prize = False
        self.max_won_amount = 0
        self.last_game_gain = 0
        # Pre-calculate ranges
        self.ball_ranges = range(1, 81)
        self.first_half = range(1, 41)

    def main(self):
        # Bulk fetch all unlocked agents with related data
        agents = Agent.objects.filter(locked=False).select_related()
        
        try:
            with transaction.atomic():
                self.game.status = 'CLOSED'
                self.game.save()
                
                for agent in agents:
                    self.process_agent(agent)
                    
                self.game._done = True
                self.game.save()
        except Exception as e:
            print(f"Error in main: {e}")

    def process_agent(self, agent):
        self.agent = agent
        self.tickets = Ticket.objects.check_and_get_related_to_game(self.game, self.agent)
        
        if not self.tickets:
            self.non_bet_game()
            return
            
        self.margin = agent.keno_margin / 100
        self.micro_prize = False
        self.total_stake = Ticket.objects.total_stake(self.game, self.agent)
        
        # Bulk fetch required data
        self.set_previous_prize()
        self.calculate_daily_statistics()
        self.betted_game()

    def set_previous_prize(self):
        try:
            analytics = GameAnalytica.objects.get_previous_special_prize(self.agent)
            self.previous_prize_made, self.previous_prize_amount, self.prize_last_8_games, self.prize_last_4_games = analytics
        except Exception as e:
            print(f"Error setting previous prize: {e}")
            self.previous_prize_made, self.previous_prize_amount = False, 0
            self.prize_last_8_games, self.prize_last_4_games = 0, 0

    def calculate_daily_statistics(self):
        try:
            stats = Ticket.objects.get_daily_tickets_stastistics_for_prize(self.agent)
            self.daily_gain, self.daily_total_stake, self.last_4_games_total_won = stats
        except Exception as e:
            print(f"Error calculating daily statistics: {e}")
            self.daily_gain = self.daily_total_stake = self.last_4_games_total_won = 0

    def betted_game(self):
        try:
            self.max_won_amount = self.get_max_won_amount()
            result = self.ball_weight()
            self.finish_and_save(result)
        except Exception as e:
            print(f"Error in betted game: {e}")

    def non_bet_game(self):
        try:
            result = random.sample(range(1, 81), 20)
            self._save_game_results(result)
            self._create_empty_analytics()
        except Exception as e:
            print(f"Error in non bet game: {e}")

    def get_max_won_amount(self):
        try:
            max_stake = Ticket.objects.get_ticket_with_max_stake(self.agent, self.game)
            return max_stake * 10000 if max_stake else 0
        except Exception:
            return 0

    def get_ball_items(self):
        all80_balls = list(range(1, 81))
        safe_balls = []
        picked_balls = {}

        for ticket in self.tickets:
            choices = ticket.get_choice_list()
            for ball in choices:
                if ball not in picked_balls:
                    picked_balls[ball] = {'weight': 0, 'picked': 1}
                else:
                    picked_balls[ball]['picked'] += 1

        return all80_balls, safe_balls, picked_balls

    def ball_weight(self):
        all80_balls, safe_balls, picked_balls_list = self.get_ball_items()
        safe_balls_set = set(safe_balls)
        
        classifications = self._classify_balls(picked_balls_list)
        full_quarantined, half_quarantined, unquarantined = classifications
        
        if self.max_won_amount > 0:
            return self._process_with_max_won(
                safe_balls_set,
                full_quarantined,
                half_quarantined,
                unquarantined
            )
        else:
            return self._process_without_max_won(
                all80_balls,
                safe_balls_set,
                full_quarantined,
                half_quarantined,
                unquarantined
            )

    def _process_with_max_won(self, safe_balls, full_quarantined, half_quarantined, unquarantined):
        result = []
        remaining_count = 20

        # Process quarantined balls
        for ball_list in [full_quarantined, half_quarantined]:
            if not ball_list or not remaining_count:
                continue
            count = min(len(ball_list), remaining_count)
            selected = random.sample(ball_list, count)
            result.extend(selected)
            remaining_count -= count

        # Fill remaining with unquarantined or random balls
        if remaining_count:
            available_balls = set(range(1, 81)) - set(result)
            if unquarantined:
                available_balls &= set(unquarantined)
            result.extend(random.sample(list(available_balls), remaining_count))

        return sorted(result)

    def _process_without_max_won(self, all_balls, safe_balls, full_quarantined, half_quarantined, unquarantined):
        result = []
        remaining_count = 20

        # Add safe balls first
        if safe_balls:
            count = min(len(safe_balls), remaining_count)
            result.extend(random.sample(list(safe_balls), count))
            remaining_count -= count

        # Process other ball categories
        for ball_list in [full_quarantined, half_quarantined, unquarantined]:
            if not ball_list or not remaining_count:
                continue
            count = min(len(ball_list), remaining_count)
            selected = random.sample(ball_list, count)
            result.extend(selected)
            remaining_count -= count

        # Fill any remaining slots with random balls
        if remaining_count:
            available_balls = set(all_balls) - set(result)
            result.extend(random.sample(list(available_balls), remaining_count))

        return sorted(result)

    def _classify_balls(self, picked_balls_list):
        full_quarantined = []
        half_quarantined = []
        unquarantined = []
        
        for ball, info in picked_balls_list.items():
            weight = info['weight']
            picked = info['picked']
            
            if weight == 0 and picked <= 1:
                unquarantined.append(ball)
            elif weight == 100 and picked == 1:
                full_quarantined.append(ball)
            elif weight == 50 and picked == 1:
                half_quarantined.append(ball)
            elif picked > 1 and weight <= self._get_weight_threshold(picked):
                unquarantined.append(ball)
            else:
                half_quarantined.append(ball)
                
        return full_quarantined, half_quarantined, unquarantined

    def _get_weight_threshold(self, picked_count):
        thresholds = {
            2: 59, 3: 69, 4: 79, 5: 89,
            6: 99, 7: 109, 8: 119, 9: 129, 10: 139
        }
        return thresholds.get(picked_count, 49)

    def finish_and_save(self, result):
        try:
            total_won = self._calculate_winners_bulk(result)
            self._save_game_results(result)
            
            total_gain = self.total_stake - total_won
            self._create_game_analytics({
                'total_won': total_won,
                'total_gain': total_gain,
                'total_stake': self.total_stake
            })
        except Exception as e:
            print(f"Error in finish_and_save: {e}")

    def _calculate_winners_bulk(self, result):
        result_set = set(result)
        tickets_to_update = []
        total_won = 0
        
        for ticket in self.tickets:
            matched_count = len(set(ticket.get_choice_list()) & result_set)
            if matched_count:
                won_amount = lucky_odd_price(
                    self.agent.keno_odd_type,
                    matched_count,
                    ticket.choice_length(),
                    ticket.stake
                )
                ticket.won_amount = won_amount
                total_won += won_amount
                tickets_to_update.append(ticket)
        
        if tickets_to_update:
            Ticket.objects.bulk_update(tickets_to_update, ['won_amount'])
            
        return total_won

    def _save_game_results(self, result):
        results_to_create = []
        for order, value in enumerate(result, 1):
            results_to_create.append(
                GameResult(
                    agent=self.agent,
                    value=value,
                    order=order,
                    gameId=self.game,
                    resultId=self.game.game_num
                )
            )
        GameResult.objects.bulk_create(results_to_create)

    def _create_game_analytics(self, stats):
        GameAnalytica.create(
            keno_odd_type=self.agent.keno_odd_type,
            agent=self.agent,
            game_id=self.game,
            total_won=stats['total_won'],
            total_gain=stats['total_gain'],
            total_tickets=len(self.tickets),
            total_stake=stats['total_stake'],
            special_prize=self.special_prize,
            prize_made=self.make_prize
        )

    def _create_empty_analytics(self):
        GameAnalytica.create(
            keno_odd_type=self.agent.keno_odd_type,
            agent=self.agent,
            game_id=self.game,
            total_won=0,
            total_gain=0,
            total_tickets=0,
            total_stake=0,
            special_prize=False,
            prize_made=False
        )