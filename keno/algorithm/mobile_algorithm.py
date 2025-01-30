from django.utils import timezone
import random
import re
from collections import Counter
from itertools import chain
from zuser.models import Player
from game_utils.time_file import get_local_time_date, get_local_time_now
from django.core.exceptions import ObjectDoesNotExist
from ..models import MobileGame, MobileGameAnalytica, MobileGameResult, MobileTicket
from ..utils.raw_result import lucky_odd_price


class MobileKenoManager:
    def __init__(self, game_instance):
        self.game = game_instance
        self.make_prize = False
        self.margin = 0
        self.player = None
        self.tickets = None
        self.total_stake = 0
        self.previous_prize_made = True
        self.previous_prize_amount = 0
        self.prize_last_10_games = 0
        self.prize_last_5_games = 0
        self.daily_gain = 0
        self.daily_total_stake = 0
        self.last_5_games_total_won = 0
        self.micro_prize = False
        self.special_prize = False
        self.max_won_amount = 0
        self.last_game_gain = 0
        self.players_margin = 10

    def main(self):
        all_players = Player.objects.filter(lock=False)
        self.game.status = 'CLOSED'
        self.game.save()
        for player in all_players:
            self.player = player
            self.tickets = MobileTicket.objects.check_and_get_related_to_game(self.game, self.player)
            if self.tickets is None:
                self.non_bet_game()
            else:
                self.margin = self.players_margin / 100
                self.micro_prize = False
                self.total_stake = MobileTicket.objects.total_stake(self.game, self.player)
                self.set_previous_prize()
                self.calculate_daily_statistics()
                self.betted_game()

    def set_previous_prize(self):
        try:
            (
                self.previous_prize_made,
                self.previous_prize_amount,
                self.prize_last_10_games,
                self.prize_last_5_games
            ) = MobileGameAnalytica.objects.get_previous_special_prize(self.player)
        except:
            self.previous_prize_made = False
            self.previous_prize_amount = 0
            self.prize_last_10_games = 0
            self.prize_last_5_games = 0

    def calculate_daily_statistics(self):
        try:
            (
                self.daily_gain,
                self.daily_total_stake,
                self.last_5_games_total_won
            ) = MobileTicket.objects.get_daily_tickets_stastistics_for_prize(self.player)
        except:
            self.daily_gain = 0
            self.daily_total_stake = 0
            self.last_5_games_total_won = 0

    def non_bet_game(self):

        def _generate_random_numbers(balls):
            return random.sample(range(1, 81), balls)

        random_results = _generate_random_numbers(20)

        MobileGameAnalytica.create(
            keno_odd_type='B',
            game_id=self.game,
            choosen_strategy="no strategy",
            total_won=0,
            total_gain=0,
            loss_percent=0,
            total_tickets=0,
            total_stake=0,
            special_prize=False,
            expected_gain=0,
            gain_percentage=0,
            total_special_prize=0,
            prize_made=False,
        )
        for i, number in enumerate(random_results, start=1):
            MobileGameResult.objects.create(value=number, order=i, gameId=self.game, resultId=0)

    def betted_game(self):
        special_gain = self.player.give_away_amount
        if not special_gain > 0:
            self.make_prize, self.max_won_amount = self.calculate_max_won()
        else:
            self.max_won_amount = special_gain
            self.special_prize = True
        result = self.ball_weight()
        self._finish_and_save(result)

    def _check_for_winners(self, result):
        total_won = 0
        ticket_count = 0

        try:
            for ticket in self.tickets:
                matched_balls = [int(b) for b in result if int(b) in ticket.get_choice_list()]
                if matched_balls:
                    won_amount = lucky_odd_price(self.game.keno_odd_type, len(matched_balls), ticket.choice_length(),
                                                 ticket.stake)
                    total_won += won_amount
                    ticket_count += 1
                # print(f"Ticket {ticket_count}: Matched balls: {matched_balls}, Won amount: {won_amount}")
        except Exception as e:
            print(f"An error occurred while checking for winners: {e}")

        return total_won

    def should_prize_be_made(self):
        try:
            # print(f'self.previous_prize_made {self.previous_prize_made}')
            if self.previous_prize_made == False:
                if self.prize_last_10_games == 0 and self.daily_total_stake > 6 * self.last_5_games_total_won:
                    # self.daily_gain > self.margin * self.daily_total_stake and not                    
                    # and self.daily_gain > 4 * self.margin * self.previous_prize_amount
                    # print(f'should_prize_be_made {self.previous_prize_amount}')
                    return True
            return False
        except Exception as e:
            # print(f"An error occurred while determining if prize should be made: {e}")
            return False

    def calculate_max_won(self):
        try:
            should_make_prize = self.should_prize_be_made()
            prize_amount = self.previous_prize_amount

            # Initial print log
            # print(f"Initial prize_amount: {prize_amount} should_make_prize {should_make_prize}")

            # First condition
            if should_make_prize and self.daily_total_stake > prize_amount and self.daily_gain > self.daily_total_stake * self.margin:
                prize_amount = self.daily_total_stake * (1 - self.margin) + prize_amount
                self.micro_prize = False
                self.make_prize = True
            # print(f"Prize amount after first condition: {prize_amount}")

            # Second condition
            elif should_make_prize and self.daily_gain > self.daily_total_stake * self.margin:
                prize_amount = self.daily_gain * (1 - self.margin) + prize_amount
                self.micro_prize = False
                self.make_prize = True
            # print(f"Prize amount after second condition: {prize_amount}")

            # Third condition
            elif (self.prize_last_5_games == 0
                  and self.daily_gain > self.margin * self.daily_total_stake
                  and self.daily_total_stake > 4 * self.margin * self.last_5_games_total_won):
                prize_amount = (0.85 - self.margin) * self.daily_total_stake + prize_amount
                self.micro_prize = True
                self.make_prize = False
            # print(f"Prize amount after third condition: {prize_amount}")

            # Fourth condition
            elif self.daily_gain > self.margin * self.daily_total_stake and self.daily_total_stake > 5 * self.margin * self.last_5_games_total_won:
                self.micro_prize = True
                self.make_prize = False
                prize_amount = (0.65 - self.margin) * self.daily_total_stake * 0.2 + prize_amount
            # print(f"Prize amount after fourth condition: {prize_amount}")

            # Fifth condition
            elif self.daily_gain > self.margin * self.daily_total_stake:
                prize_amount = (0.5 - self.margin) * self.daily_total_stake * 0.1 + prize_amount
                self.micro_prize = True
                self.make_prize = False
            # print(f"Prize amount after fifth condition: {prize_amount}")

            else:
                prize_amount = 0
                self.micro_prize = False
                self.make_prize = False
            if self.daily_gain < 0:
                prize_amount = 0
                self.micro_prize = False
            # print(f'self.micro_prize {self.micro_prize} self.make_prize {self.make_prize}, prize_amount {prize_amount}, self.daily_gain {self.daily_gain}, should_make_prize {should_make_prize}, self.daily_total_stake {self.daily_total_stake} self.margin {self.margin} self.last_5_games_total_won {self.last_5_games_total_won} self.prize_last_10_games {self.prize_last_10_games} self.previous_prize_amount {self.previous_prize_amount}')
            return should_make_prize, prize_amount
        except Exception as e:
            # print(f"An error occurred while calculating prize: {e}")
            return False, 0

    def calculate_total_won(self, r):
        total_won = 0
        try:
            for ticket in self.tickets:
                matched_balls = [int(b) for b in r if b in ticket.get_choice_list()]
                if matched_balls:
                    won_amount = lucky_odd_price(self.game.keno_odd_type, len(matched_balls), ticket.choice_length(),
                                                 ticket.stake)
                    total_won += won_amount
                # print(f"Ticket {ticket.id}: Matched balls: {matched_balls}, Won amount: {won_amount}")
        except Exception as e:
            print(f"An error occurred while calculating total won: {e}")
        return total_won

    def ball_weight(self):
        all80_balls, safe_balls, picked_balls_list = self.get_ball_items()  # Balls not in quarantine
        items = list(picked_balls_list.items())

        full_quarantined = []  # Balls picked once and have a weight of 100
        half_quarantined = []  # Balls picked once and have a weight of 50
        multi_quarantined = []  # Balls picked multiple times
        unquarantined = []
        self.get_classiffied_balls(full_quarantined, half_quarantined, multi_quarantined, unquarantined, items)

        total_safe_ball = len(safe_balls)
        tot_unquarantined = len(unquarantined)

        random.shuffle(unquarantined)
        random.shuffle(safe_balls)
        if self.max_won_amount > 0:
            extreme_wons = []
            possible_wons = []
            max_wons = []
            min_wons = []
            special_won = []
            balls_picked = {ball: 0 for ball in range(1, 81)}
            self.get_won_and_picked_balls(extreme_wons, possible_wons, max_wons, min_wons, special_won, balls_picked)
            special_ball = []
            possible_ball = []
            min_ball = []
            max_ball = []
            extreme_ball = []

            if len(special_won) > 0:
                sorted_wons = sorted(special_won, key=lambda x: x[1], reverse=True)
                sorted_unique_balls = self.picked_more_than_one(balls_picked)
                self.get_balls_from_sorted(special_ball, sorted_wons, sorted_unique_balls)

            if len(possible_wons) > 0:
                sorted_wons = sorted(possible_wons, key=lambda x: x[1], reverse=True)
                sorted_unique_balls = self.picked_more_than_one(balls_picked)
                self.get_balls_from_sorted(possible_ball, sorted_wons, sorted_unique_balls)

            if len(min_wons) > 0:
                sorted_wons = sorted(min_wons, key=lambda x: x[1], reverse=True)
                sorted_unique_balls = self.picked_more_than_one(balls_picked)
                self.get_balls_from_sorted(min_ball, sorted_wons, sorted_unique_balls)

            if len(max_wons) > 0:
                sorted_wons = sorted(max_wons, key=lambda x: x[1], reverse=True)
                sorted_unique_balls = self.picked_more_than_one(balls_picked)
                self.get_balls_from_sorted(max_ball, sorted_wons, sorted_unique_balls)

            if len(extreme_wons) > 0:
                sorted_wons = sorted(extreme_wons, key=lambda x: x[1], reverse=True)
                sorted_unique_balls = self.picked_more_than_one(balls_picked)
                self.get_balls_from_sorted(extreme_ball, sorted_wons, sorted_unique_balls)

            special_ballresult20 = self.get_result_for_max_won(safe_balls, full_quarantined, half_quarantined,
                                                               unquarantined, total_safe_ball, tot_unquarantined,
                                                               special_ball)
            special_balltotal_won = self.calculate_total_won(special_ballresult20)
            possible_ballresult20 = self.get_result_for_max_won(safe_balls, full_quarantined, half_quarantined,
                                                                unquarantined, total_safe_ball, tot_unquarantined,
                                                                possible_ball)
            possible_balltotal_won = self.calculate_total_won(possible_ballresult20)
            min_ballresult20 = self.get_result_for_max_won(safe_balls, full_quarantined, half_quarantined,
                                                           unquarantined, total_safe_ball, tot_unquarantined, min_ball)
            min_balltotal_won = self.calculate_total_won(min_ballresult20)
            max_ballresult20 = self.get_result_for_max_won(safe_balls, full_quarantined, half_quarantined,
                                                           unquarantined, total_safe_ball, tot_unquarantined, max_ball)
            max_balltotal_won = self.calculate_total_won(max_ballresult20)
            extreme_ballresult20 = self.get_result_for_max_won(safe_balls, full_quarantined, half_quarantined,
                                                               unquarantined, total_safe_ball, tot_unquarantined,
                                                               extreme_ball)
            extreme_balltotal_won = self.calculate_total_won(extreme_ballresult20)

            diff_special = abs(self.max_won_amount - special_balltotal_won)
            diff_possible = abs(self.max_won_amount - possible_balltotal_won)
            diff_min = abs(self.max_won_amount - min_balltotal_won)
            diff_max = abs(self.max_won_amount - max_balltotal_won)
            diff_extreme = abs(self.max_won_amount - extreme_balltotal_won)

            # Find the minimum difference
            min_diff = min(diff_special, diff_possible, diff_min, diff_max, diff_extreme)

            # Determine which value is closest to max_won
            if min_diff == diff_extreme:
                closest_result = extreme_ballresult20
            elif min_diff == diff_max:
                closest_result = max_ballresult20
            elif min_diff == diff_possible:
                closest_result = possible_ballresult20
            elif min_diff == diff_min:
                closest_result = min_ballresult20
            else:
                closest_result = special_ballresult20
            return closest_result

        else:  # the mission is no ticket can win
            return self.get_result_for_0_maxwon(all80_balls, safe_balls, full_quarantined, half_quarantined,
                                                unquarantined, total_safe_ball, tot_unquarantined)

    def shuffle_balls(self, full_quarantined, half_quarantined, balls, unquarantined):
        random.shuffle(full_quarantined)
        random.shuffle(unquarantined)
        random.shuffle(balls)
        random.shuffle(half_quarantined)

    def picked_more_than_one(self, balls_picked):
        more_than_one_time_picked_balls_flat = [key for key, value in balls_picked.items() if value > 1]
        counted_balls = Counter(more_than_one_time_picked_balls_flat)
        sorted_balls = sorted(counted_balls.items(), key=lambda x: (-x[1], x[0]))
        sorted_unique_balls = [key for key, _ in sorted_balls]
        return sorted_unique_balls

    def get_classiffied_balls(self, full_quarantined, half_quarantined, multi_quarantined, unquarantined, items):
        for ball, info in items:
            if info['weight'] == 0 and ball not in unquarantined and info['picked'] <= 1:
                unquarantined.append(ball)
                continue
            elif info['weight'] == 100 and ball not in full_quarantined and info['picked'] == 1:
                full_quarantined.append(ball)
                continue
            elif info['weight'] == 50 and ball not in half_quarantined and info['picked'] == 1:
                half_quarantined.append(ball)
                continue
            elif (info['weight'] < 50 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] == 1):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 59 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 1):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 69 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 2):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 79 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 3):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 89 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 4):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 99 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 5):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 109 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 6):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 119 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 7):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 129 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 8):
                unquarantined.append(ball)
                continue
            elif (info['weight'] <= 139 and ball not in unquarantined and
                  ball not in full_quarantined and ball not in half_quarantined and
                  ball not in multi_quarantined and info['picked'] > 9):
                unquarantined.append(ball)
                continue
            elif (info['weight'] >= 100 and ball not in multi_quarantined):
                multi_quarantined.append(ball)
                continue
            else:
                half_quarantined.append(ball)
                continue

    def get_won_and_picked_balls(self, extreme_wons, possible_wons, max_wons, min_wons, special_won, balls_picked):
        for ticket in self.tickets:
            choosen_balls = ticket.get_choice_list()
            ball_len = ticket.choice_length()
            win = ticket.get_possible_won()
            if self.special_prize:
                special_won.append((choosen_balls, win, ball_len))
            # print(f'special won {special_won}')
            elif 0 < win <= self.max_won_amount * 0.4:
                min_wons.append((choosen_balls, win, ball_len))
            # print(f'min {min_wons}')
            elif 0.4 * self.max_won_amount < win <= self.max_won_amount * 1.6:
                possible_wons.append((choosen_balls, win, ball_len))
            # print(f'possible {possible_wons}')
            elif 1.6 * self.max_won_amount < win <= self.max_won_amount * 2.4:
                max_wons.append((choosen_balls, win, ball_len))
            # print(f'max won {max_wons}')
            elif win > self.max_won_amount * 2.4:
                extreme_wons.append((choosen_balls, win, ball_len))
            # print(f'extreme won {extreme_wons}')
            for ball in choosen_balls:
                if ball in balls_picked:
                    balls_picked[ball] += 1
                else:
                    balls_picked[ball] = 1

    def get_balls_from_sorted(self, balls, sorted_wons, more_than_one_time_picked_balls_flat):

        for _sorted in sorted_wons:
            _s = [e for e in _sorted[0]]  # Flatten the inner list
            ball = [b for b in _s if b not in more_than_one_time_picked_balls_flat]

            if len(ball) == 10:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 9:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 8:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 7:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 6:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 5:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 4:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 3:
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 2:  # this means # ex. choice (2,54) or (56, 6)
                for single_ball in ball:
                    balls.append(single_ball)
                break

            if len(ball) == 1:  # ex. choice (5) , or (46)
                balls.append(ball[0])
                continue

    def get_result_for_max_won(self, safe_balls, full_quarantined, half_quarantined, unquarantined, total_safe_ball,
                               tot_unquarantined, balls):
        # self.shuffle_balls(full_quarantined, half_quarantined, balls, unquarantined)
        # print(f'full_quarantined, half_quarantined, balls, unquarantined {full_quarantined}, {half_quarantined}, {balls}, {unquarantined}')
        if total_safe_ball > 0:
            # print(f'total safe {total_safe_ball}')
            if tot_unquarantined > 0:
                # print('tot safe1')
                result_balls = [q for q in full_quarantined] + [q for q in
                                                                half_quarantined] + unquarantined + safe_balls
            else:
                # print('tot safe2')
                result_balls = safe_balls
        else:
            if tot_unquarantined > 0:
                # print('tot unq1')
                result_balls = [q for q in full_quarantined] + [q for q in half_quarantined] + unquarantined
            else:
                # print('tot unq2')
                result_balls = [q for q in full_quarantined] + [q for q in half_quarantined]

        # Count the numbers in each range
        count_1_to_40 = sum(1 for ball in result_balls if ball <= 40)
        count_41_to_80 = sum(1 for ball in result_balls if ball > 40)

        random_numbers_1_to_40 = random.sample([ball for ball in result_balls if ball <= 40], min(10, count_1_to_40))

        remaining_count = 21 - len(random_numbers_1_to_40)
        random_numbers_41_to_80 = random.sample([ball for ball in result_balls if ball > 40],
                                                min(remaining_count, count_41_to_80))
        final_selection = random_numbers_1_to_40 + random_numbers_41_to_80 + balls
        final_selection = final_selection[-20:]
        # print(final_selection)
        random.shuffle(final_selection)
        # print(final_selection)
        return final_selection

    def get_result_for_0_maxwon(self, all80_balls, safe_balls, full_quarantined, half_quarantined, unquarantined,
                                total_safe_ball, tot_unquarantined):
        # random.shuffle(full_quarantined)
        # random.shuffle(half_quarantined)
        if total_safe_ball > 0:
            if tot_unquarantined > 0:
                result_balls = [q for q in full_quarantined] + [q for q in
                                                                half_quarantined] + unquarantined + safe_balls
            else:
                result_balls = safe_balls
        else:
            if tot_unquarantined > 0:
                result_balls = [q for q in full_quarantined] + [q for q in half_quarantined] + unquarantined
            else:
                result_balls = safe_balls
        result_balls = result_balls[-20:]
        # print(f'00 max won {result_balls}')
        random.shuffle(result_balls)
        # print(f'0 max won {result_balls}')
        return result_balls

    def get_ball_items(self):
        all80_balls = range(1, 81)

        # Lists to store different types of balls
        picked_balls = []  # Balls picked by players
        safe_balls = []  # Balls considered safe
        danger_balls = []  # Balls considered dangerous

        # Dictionary to keep track of each ball's details
        picked_balls_list = {
            ball: {
                # 'choice1': 0, 'choice2': 0, 'choice3': 0, 'choice4': 0, 'choice5': 0, 
                # 'choice6': 0, 'choice7': 0, 'choice8': 0, 'choice9': 0, 'choice10': 0, 
                'weight': 0,  # Total weight based on how often it's picked and the stakes
                'picked': 0,  # How many times it's been picked
                'stake': set(),  # Set of stakes associated with the ball
                'ticket': set()  # Set of tickets associated with the ball
            } for ball in range(1, 81)
        }

        # Iterate through each ticket to analyze picked balls
        for ticket in self.tickets:
            ticket_balls = ticket.get_choice_list()
            ball_len = ticket.choice_length()
            for ball in ticket_balls:
                # picked_balls_list[ball][f'choice{ball_len}'] += 1
                picked_balls_list[ball][f'picked'] += 1
                picked_balls_list[ball]['weight'] += round((1 / ball_len) * 100)
                picked_balls_list[ball]['stake'].add(ticket.stake)
                picked_balls_list[ball]['ticket'].add(ticket.id)
                picked_balls.append((ball, picked_balls_list[ball]['ticket'], picked_balls_list[ball]['weight']))

        # Count the frequency of dangerous balls
        danger_balls = [d[0] for d in picked_balls]
        _counter = Counter(danger_balls)
        danger_balls = [num for num, _ in _counter.most_common()]
        safe_balls = [item for item in all80_balls if item not in danger_balls]

        return all80_balls, safe_balls, picked_balls_list

    def _update_game_results(self, result):
        for i, r in enumerate(result):
            MobileGameResult.objects.create(value=r, order=i + 1, gameId=self.game, resultId=0)

    def _finish_and_save(self, result):
        # print(f'result {result}')
        def _calculate_winners(result):
            total_won = 0

            def save_ticket(ticket, won_amount):
                if won_amount > 0:
                    ticket.redeemed = True
                ticket.save()

            for ticket in self.tickets:
                try:
                    matched_balls = [b for b in result if b in ticket.get_choice_list()]
                    if matched_balls:
                        won_amount = lucky_odd_price(self.game.keno_odd_type, len(matched_balls), ticket.choice_length(),
                                                     ticket.stake)
                        ticket.won_amount = won_amount
                        total_won += won_amount
                        save_ticket(ticket, won_amount)
                except Exception as e:
                    # Handle the exception gracefully, log it, and proceed
                    print(f"An error occurred while processing ticket: {e}")

            return total_won

        def statistics_save(total_won, total_gain):
            try:
                if self.special_prize:
                    restore_give_away = total_won - self.max_won_amount
                    self.player.give_away_amount = 0 if restore_give_away > 0 else (restore_give_away) * -1
                    total_special_prize = self.previous_prize_amount + total_gain * 0.4 - total_won
                    self.player.save()
                elif self.make_prize:
                    total_special_prize = self.previous_prize_amount - total_won
                else:
                    total_special_prize = (self.previous_prize_amount - total_won) + total_gain * 0.4

                total_special_prize = max(total_special_prize, 0)

                if total_won > self.total_stake:
                    loss_percent = (total_won / self.total_stake) * 100
                    gain_percentage = 0
                else:
                    loss_percent = 0
                    gain_percentage = round((total_gain / self.total_stake) * 100)

                return total_special_prize, gain_percentage, loss_percent
            except Exception as e:
                # Handle the exception gracefully, log it, and proceed
                print(f"An error occurred while calculating statistics: {e}")
                return 0, 0, 0

        try:
            total_won = _calculate_winners(result)
            # print(f'total won {total_won}, max won {self.max_won_amount} \n\n')
            self._update_game_results(result)
            total_gain = self.total_stake - total_won
            total_special_prize, gain_percentage, loss_percent = statistics_save(total_won, total_gain)

            exp_gain = self.total_stake + (self.margin * 100)
            total_tickets = len(self.tickets)
            total_stake = self.total_stake
        except Exception as e:
            # Handle the exception gracefully, log it, and proceed
            print(f"An error occurred during game analysis: {e}")
        print(f'total gain {total_gain}')
        MobileGameAnalytica.create(
            keno_odd_type='B',
            game_id=self.game,
            choosen_strategy="no strategy",
            total_won=total_won,
            total_gain=total_gain,
            loss_percent=loss_percent,
            total_tickets=total_tickets,
            total_stake=total_stake,
            special_prize=self.special_prize,
            expected_gain=round(exp_gain),
            gain_percentage=gain_percentage,
            total_special_prize=total_special_prize,
            prize_made=self.make_prize,
        )
