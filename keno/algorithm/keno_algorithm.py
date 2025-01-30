import time
import json
import re
import random
import logging
from typing import Set
from collections import Counter
from itertools import chain

from keno.algorithm.state_analyzer import AgentStateAnalyzer
from zuser.models import Agent

from ..utils.raw_result import keno_odd_beta
from .price_check import KenoPrice
from ..models import Game, GameAnalytica, GameResult, Ticket


class KenoResult:
    def __init__(self, game_instance):
        self.pat = r'\b(\d+(\.\d+)?)\b'
        self.game = game_instance
        self.flat = []
        self.sorted = []
        self.model = Ticket.objects.all()
        self.result: Set[int] = set()

    def _make_opposite_choices(self, tickets):
        choices = []
        for obj in tickets:
            balls = re.findall(self.pat, obj.choice_list)
            converted = [int(m[0]) if '.' not in m[0] else float(m[0]) for m in balls]
            choices.append(converted)

        flat = list(chain(*choices))
        counter = Counter(flat)
        _sorted = sorted([(n, c) for n, c in counter.items()], key=lambda x: (x[1], x[0]), reverse=False)
        
        if len(_sorted) < 60:
            unselected_balls = []
            for i in range(1, 81):
                if i not in (_sorted or unselected_balls):
                    unselected_balls.append(i)
            low_winnable_result = unselected_balls[:20]

            unselected_balls = []
            for i in range(1, 81):
                if i not in unselected_balls:
                    unselected_balls.append(i)
                high_winnable_result = unselected_balls[:20]

            unselected_balls = []
            for i in range(1, 81):
                avg = 0
                for i in unselected_balls:
                    if i in _sorted:
                        avg += 1
                if i not in unselected_balls and avg < 8:
                    unselected_balls.append(i)
                elif i not in (unselected_balls or _sorted):
                    unselected_balls.append(i)
                avg_winnable_result = unselected_balls[:20]
            return low_winnable_result, avg_winnable_result, high_winnable_result

        else:
            b = 80 - len(_sorted)
            balls = _sorted[:b]

            unselected_balls = []
            for i in range(1, 81):
                if i not in (unselected_balls or balls):
                    unselected_balls.append(i)
            low_winnable_result = unselected_balls[:20]

            one_balls = []
            two_balls = []
            for t in tickets:
                if t.choice_length == 1:
                    one_balls.append(t.get_nums)
                elif t.choice_length ==2:
                    two_balls.append(t.get_nums)

            unselected_balls = []
            for i in range(1, 81):
                if i not in (unselected_balls or balls) and i not in one_balls:
                    unselected_balls.append(i)
            avg_winnable_result = unselected_balls[:20]
            
            unselected_balls = []
            for i in range(1, 81):
                if i not in (unselected_balls or balls) and i not in (one_balls or two_balls):
                    unselected_balls.append(i)
            high_winnable_result = unselected_balls[:20]

            # if the results length becomes less than 20 prepare a fail safety future
            return low_winnable_result, avg_winnable_result, high_winnable_result

    def _generate_random_numbers(self, balls):
        random_numbers = []
        while len(random_numbers) < balls:
            new_number = random.randint(1, 80)
            if new_number not in random_numbers:
                random_numbers.append(new_number)
        return random_numbers
    
    def non_ticket_game(self, agent):
        get_number = self._generate_random_numbers(20)
        o=0
        self.game.status = 'CLOSED'
        self.game.save()
        for r in get_number:
            o +=1
            _r = GameResult.objects.create(
                value=r,
                order= o,
                gameId=self.game,
                resultId=0,
                agent=agent
            )
        return _r

    def main(self):
        all_agents = Agent.objects.all()
        for agent in all_agents:
            tickets = Ticket.objects.check_and_get_related_to_game(self.game, agent)
            if tickets == None:
                return self.non_ticket_game(agent)
            return self.ticket_game(tickets, agent)

    def prepare_result(self, tickets, agent, max_won_amount, gain_percent):
        # black_lists = [ticket for ticket in tickets]
        # max_min_ticket_length = Ticket.objects.max_min_length(self.game, agent)
        black_lists, nums, white_list = tickets.object.black_list(self.game, agent, max_won_amount)
        low_winnable_result, avg_winnable_result, high_winnable_result = self._make_opposite_choices(tickets, black_lists)
        if gain_percent >= 50:
            return low_winnable_result
        elif gain_percent in range(5, 51):
            return avg_winnable_result
        elif gain_percent < 5:
            return high_winnable_result
        else:
            None

    def calculate_gain_perc(self, agent, tickets, percent):
        total_won = Ticket.objects.total_won(self.game)
        expected_gain = total_won * 0.3
        current_max_won_amount = total_won - expected_gain
        _add_gain = 0

        prev_game_analytic = GameAnalytica.objects.filter(agent=agent, gameId=self.game, total_stakes__gte=10).latest()
        if prev_game_analytic:
            prev_game_gain_perc = prev_game_analytic.gain_percent
            prev_game_loss_perc = prev_game_analytic.loss_percent
            prev_game_total_won = prev_game_analytic.total_won
            prev_expected_gain = prev_game_total_won * (percent / 100)
            prev_gain = prev_game_analytic.total_gain
            prev_loss = prev_game_analytic.total_loss
            if prev_game_gain_perc > percent and prev_game_analytic.special_gain != True:
                _add_gain = prev_gain - prev_expected_gain
            elif prev_game_gain_perc < percent and prev_game_analytic.special_gain != True:
                _add_gain = prev_expected_gain - prev_gain
            elif prev_game_loss_perc >= 100 and prev_game_analytic.special_gain != True:
                _add_gain = (prev_loss - prev_expected_gain) * (percent / 100)
            else:
                pass
        else:
            prev_game_gain_perc = 0
        gain_perc = round((current_max_won_amount + _add_gain) / total_won) * 100
        g_analytica = GameAnalytica.objects.create(
            agent=agent,
            gameId=self.game,
            gain_percent=gain_perc
        )
        max_won_amount = current_max_won_amount + _add_gain
        return max_won_amount, gain_perc, g_analytica

    def calculate_gain_special(self, agent, tickets, special_gain_today):
        total_won = Ticket.objects.total_won(self.game)
        expected_gain = total_won * (special_gain_today /100)
        current_max_won_amount = total_won - expected_gain
        gain_perc = round(current_max_won_amount / total_won) * 100
        g_analytica = GameAnalytica.objects.create(
            agent=agent,
            gameId=self.game,
            gain_percent=gain_perc
        )
        max_won_amount = current_max_won_amount
        return max_won_amount, gain_perc, g_analytica

    def ticket_game(self, tickets, agent):
        agent_state = AgentStateAnalyzer(agent, self.game)
        analytic_summary = agent_state.main()
        gain_per = analytic_summary['gain_per']
        special_gain_today = GameAnalytica.objects.check_for_special_gain_today(agent=agent, gameId=self.game)
        if special_gain_today is not None:
            print("Special gain percent today:", special_gain_today)
            max_won_amount, gain_percent, g_analytica = self.calculate_gain_special(agent, tickets, special_gain_today)
        else:
            print("No special gains today.")
            max_won_amount, gain_percent, g_analytica = self.calculate_gain_perc(agent, tickets, gain_per)

        result = self.prepare_result(tickets, agent, max_won_amount, gain_percent)

        total_players = Ticket.objects.sorted_stakes(self.game, agent).count()
        total_won = Ticket.objects.total_won(self.game)
        total_stake = Ticket.objects.total_stake(self.game)
        total_stake = total_stake['total']
        kp = KenoPrice(self.model, self.game, tickets, total_stake, total_won, total_players)
        return kp.main(result, agent)


    def second_method(self):

        kp = None
        tickets = tickets
        # str1
        sortedballs = self._make_flat(tickets)
        num_numbers = 20  # only if the len of sorted balls is more than 20,
        # if its26 ex 26-20=6  6/2=3  then start at 3rd and end at 23rd
        result_str1 = []

        if gain_per == 20: #ave
            if len(sortedballs) <= 60: # this means 20 ran numbers can be generated that are not in the selection
                pass
            else: # this means its risky because the choice for result is under 20
                pass
            # I am condidering the numbers are more than 60
            start_index = (len(sortedballs) - num_numbers) // 2
            end_index = start_index + num_numbers
            middle_numbers = sortedballs[start_index:end_index]
            result_str1 = self._again_make_flat(middle_numbers)
        elif gain_per == 50: #max
            if len(sortedballs) <= 60: # this means 20 ran numbers can be generated that are not in the selection
                pass
            else: # this means its risky because the choice for result is under 20
                pass
            first_numbers = sortedballs[:num_numbers]
            result_str1 = self._again_make_flat(first_numbers)
        elif gain_per == 5: #min
            if len(sortedballs) <= 60: # this means 20 ran numbers can be generated that are not in the selection
                pass
            else: # this means its risky because the choice for result is under 20
                pass
            last_numbers = sortedballs[num_numbers:]
            result_str1 = self._again_make_flat(last_numbers)
        else:
            pass

        # str2
        result_str2 = []

        if gain_per == 20: #ave
            if len(sortedballs) <= 60: # this means 20 ran numbers can be generated that are not in the selection
                pass
            else: # this means its risky because the choice for result is under 20
                pass
            # I am condidering the numbers are more than 60
            maj_won = total_won / 1.2
            half_won = total_won / 2
            ave_won = total_won / 3
            total_players = len(sorted_assumed_winners_str2)
            if total_players > 3:
                quarter = total_players / 4  # (round_int)
                thirds = total_players / 3
                half = total_players / 2
                if sorted_assumed_winners_str2[-quarter:].won > maj_won:
                    tickets = sorted_assumed_winners_str2[-quarter:]
                elif sorted_assumed_winners_str2[-thirds:].won > half_won:
                    tickets = sorted_assumed_winners_str2[-thirds:]
                elif sorted_assumed_winners_str2[-half:].won > ave_won:
                    tickets = sorted_assumed_winners_str2[-half:]
                result_str2 = self._make_opposite_choices(tickets)
            else:
                # for this players they wont be lucky re-assess this part because small players with lil choices len
                result_str2 = self._make_opposite_choices(sorted_assumed_winners_str2)
        elif gain_per == 50: #max
            if len(sortedballs) <= 60: # this means 20 ran numbers can be generated that are not in the selection
                pass
            else: # this means its risky because the choice for result is under 20
                pass
            # I am condidering the numbers are more than 60
            maj_won = total_won / 1.2
            half_won = total_won / 2
            ave_won = total_won / 3
            total_players = len(sorted_assumed_winners_str2) + len(sorted_stakes_str2)
            # unique together or change the way to calculate for max gain # find a way to combine stake and high won , sort and return them
            if total_players > 3:
                quarter = total_players / 4  # (round_int)
                thirds = total_players / 3
                half = total_players / 2
                if sorted_assumed_winners_str2[-quarter:].won_amount > maj_won:
                    tickets = sorted_assumed_winners_str2[-quarter:]
                elif sorted_assumed_winners_str2[-thirds:].won_amount > half_won:
                    tickets = sorted_assumed_winners_str2[-thirds:]
                elif sorted_assumed_winners_str2[-half:].won_amount > ave_won:
                    tickets = sorted_assumed_winners_str2[-half:]
                result_str2 = self._make_opposite_choices(tickets)
            else:
                # for this players they wont be lucky re-assess this part because small players with lil choices len
                result_str2 = self._make_opposite_choices(sorted_assumed_winners_str2)
        elif gain_per == 5: #min
            if len(sortedballs) <= 60: # this means 20 ran numbers can be generated that are not in the selection
                pass
            else: # this means its risky because the choice for result is under 20
                pass
            # I am condidering the numbers are more than 60
            maj_won = total_stake / 1.2
            half_won = total_stake / 2
            ave_won = total_stake / 3
            total_players = len(sorted_stakes_str2)
            if total_players > 3:
                quarter = round(total_players / 4)
                thirds = round(total_players / 3)
                half = round(total_players / 2)
                quarter_won = 0
                thirds_won = 0
                half_won = 0
                for q in sorted_assumed_winners_str2[quarter:]:
                    quarter_won += q.won_amount
                for q in sorted_assumed_winners_str2[thirds:]:
                    thirds_won += q.won_amount
                for q in sorted_assumed_winners_str2[half:]:
                    half_won += q.won_amount
                if quarter_won > maj_won:
                    tickets = sorted_assumed_winners_str2[quarter:]
                elif thirds_won > half_won:
                    tickets = sorted_assumed_winners_str2[thirds:]
                elif half_won > ave_won:
                    tickets = sorted_assumed_winners_str2[half:]
                result_str2 = self._make_opposite_choices(tickets)
            else:
                # for this players they wont be lucky re-assess this part because small players with lil choices len
                result_str2 = self._make_opposite_choices(sorted_assumed_winners_str2)
        else:
            pass

        if len(result_str1) < 20:
            # make it full
            pass

        if len(result_str2) < 20:
            # make it full but becareful do this inside gain%
            pass

        kp = KenoPrice(self.model, self.game, tickets, total_stake, total_won, total_players)
        result_tuple = kp.main(result_str1, result_str2, agent)
        if result_tuple is not None:
            # Unpack the result_tuple if it's not None
            result, try_again = result_tuple
        else:
            # Handle the case where kp.main() returns None
            print("kp.main() returned None.")

        if try_again:
            return self.main()
        # else:
        #     return result

    def _again_make_flat(self, nums):
        choices = [num[0] for num in nums]
        return choices[:20]

    def _make_flat(self, tickets):
        choices = []
        for obj in tickets:
            balls = re.findall(self.pat, obj.choice_list)
            converted = [int(m[0]) if '.' not in m[0] else float(m[0]) for m in balls]
            choices.append(converted)

        self.flat = list(chain(*choices))
        counter = Counter(self.flat)
        self.sorted = sorted([(n, c) for n, c in counter.items()], key=lambda x: (x[1], x[0]), reverse=False)
        return self.sorted

    def _check_result(self, choice_list, ticket):
        result_set = set(json.loads(self.game.result)) if self.game.result else set()
        choice_list = set(choice_list)
        common = list(result_set.intersection(choice_list))
        missing = list(choice_list.difference(common))
        total_length = ticket.choice_length()
        common_pct = (len(common) / total_length) * 100 if total_length > 0 else 0
        missing_pct = (len(missing) / total_length) * 100 if total_length > 0 else 0

        odd = 0
        max_win = 0
        for key, value in keno_odd_beta:
            if total_length == key:
                odd = value
                if common_pct > 50:
                    max_win = odd * ticket.stake * common_pct / 100
                else:
                    max_win = 0
        return {
            'stake': ticket.stake,
            'choice_list': list(choice_list),
            'common_numbers': list(common),
            'missing_numbers': list(missing),
            'common_percentage': round(common_pct, 2),
            'missing_percentage': round(missing_pct, 2),
            'max_win': max_win,
        }

    def _gen_common(self):
        threshold = list(range(1, 81))
        self.result.clear()
        flat_counter = Counter(self.flat)
        avail = [n for n in threshold if flat_counter[n] == 0]

        while self._calc_missing_percentage() < 60 and len(self.result) < 20:
            if len(self.flat) <= 60:
                self.result.add(random.choice(avail))
            elif len(self.flat) >= 61:
                threshold = 60
                self.result = [n for n, _ in self.sorted[:min(20, threshold)]]
                unique = set(self.result)
                for item in sorted(set(self.result + threshold), key=lambda x: (self.result + threshold).count(x),
                                   reverse=False):
                    if item not in unique:
                        self.result.append(item)
                        unique.add(item)
                    if len(self.result) >= 20:
                        break
                self.result = self.result[:20]
        return list(self.result)

    def _calc_missing_percentage(self):
        threshold = list(range(1, 81))
        flat_counter = Counter(self.flat)
        avail = [n for n in threshold if flat_counter[n] == 0]

        if len(self.flat) <= 60:
            while len(self.result) < 20:
                self.result.add(random.choice(avail))
        elif len(self.flat) >= 61:
            threshold = 60
            self.result = [n for n, _ in self.sorted[:min(20, threshold)]]
            unique = set(self.result)
            for item in sorted(set(self.result + threshold), key=lambda x: (self.result + threshold).count(x),
                               reverse=False):
                if item not in unique:
                    self.result.append(item)
                    unique.add(item)
                if len(self.result) >= 20:
                    break
            self.result = self.result[:20]
        return list(self.result)

    def _print_result_info(self):
        results = []
        for ticket in self.tickets:
            choice_list = ticket.get_choice_list()
            result_info = self._check_result(choice_list, ticket)
            results.append(result_info)
        return results

    def _get_price_prediction_info(self):
        return self.kp.price_predict()

    def _total_missing_percentage(self):
        return self.kp.calculate_total_missing_percentage()

    def _occurrence(self):
        max_found = 7
        for s in self.tickets:
            found = [str(key) for key in s.choice_list if str(key) in self.result]
            count_found = len(found)
            s.can_won = False
            s.keys_found = 0
            if 1 <= count_found <= max_found:
                s.can_won = True
                s.keys_found = count_found
                s.exact_match = f'{count_found}_left'
            else:
                s.can_won = False
