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
        # Pre-calculate ranges for ball classification
        self.ball_ranges = range(1, 81)
        self.first_half = range(1, 41)

    def main(self):
        # Bulk fetch all unlocked agents
        all_agents = Agent.objects.filter(locked=False).select_related()
        
        try:
            with transaction.atomic():
                self.game.status = 'CLOSED'
                self.game.save()
                
                # Process agents in bulk
                for agent in all_agents:
                    self.process_agent(agent)
                    
                self.game._done = True
                self.game.save()
        except Exception as e:
            print(f"Error occurred: {e}")

    def process_agent(self, agent):
        """Process a single agent - extracted from main() for clarity"""
        self.agent = agent
        self.tickets = Ticket.objects.check_and_get_related_to_game(self.game, self.agent)
        
        if self.tickets is None:
            self.non_bet_game()
            return
            
        self.margin = agent.keno_margin / 100
        self.micro_prize = False
        self.total_stake = Ticket.objects.total_stake(self.game, self.agent)
        
        # Bulk fetch all required data
        self.set_previous_prize()
        self.calculate_daily_statistics()
        self.betted_game()

    def _check_for_winners(self, result):
        """Optimized winner checking using set operations"""
        result_set = set(map(int, result))
        total_won = 0
        ticket_count = 0

        try:
            for ticket in self.tickets:
                choice_set = set(ticket.get_choice_list())
                matched_count = len(choice_set & result_set)
                if matched_count:
                    won_amount = lucky_odd_price(
                        self.agent.keno_odd_type, 
                        matched_count,
                        ticket.choice_length(),
                        ticket.stake
                    )
                    total_won += won_amount
                    ticket_count += 1
        except Exception as e:
            print(f"Error checking winners: {e}")

        return total_won

    def ball_weight(self):
        """Optimized ball weighting algorithm"""
        # Pre-fetch all required data
        all80_balls, safe_balls, picked_balls_list = self.get_ball_items()
        
        # Use set operations for better performance
        safe_balls_set = set(safe_balls)
        
        # Pre-calculate classifications
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

    def _classify_balls(self, picked_balls_list):
        """Separate ball classification logic for better organization"""
        full_quarantined = []
        half_quarantined = []
        unquarantined = []
        
        # Use list comprehension for better performance
        items = list(picked_balls_list.items())
        
        for ball, info in items:
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
        """Helper function to determine weight threshold"""
        thresholds = {
            2: 59,
            3: 69,
            4: 79,
            5: 89,
            6: 99,
            7: 109,
            8: 119,
            9: 129,
            10: 139
        }
        return thresholds.get(picked_count, 49)

    def _finish_and_save(self, result):
        """Optimized saving with bulk operations"""
        try:
            # Calculate winners in bulk
            total_won = self._calculate_winners_bulk(result)
            
            # Bulk create game results
            self._bulk_create_game_results(result)
            
            # Calculate statistics
            total_gain = self.total_stake - total_won
            statistics = self._calculate_statistics(total_won, total_gain)
            
            # Create analytics in one operation
            self._create_game_analytics(statistics)
            
        except Exception as e:
            print(f"Error in finish_and_save: {e}")

    def _calculate_winners_bulk(self, result):
        """Calculate winners using bulk operations"""
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
        
        # Bulk update tickets
        if tickets_to_update:
            Ticket.objects.bulk_update(tickets_to_update, ['won_amount'])
            
        return total_won