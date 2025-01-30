import random
from django.db import transaction

from collections import defaultdict
from zuser.models import Agent
from spin.models import SpinAnalytica, SpinTicket
from spin.utils.raw_result import special_cases


class SpinAlgorithm:
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
        self.spin_give_away_amount = 0

    def main(self):
        all_agents = Agent.objects.filter(locked=False)

        try:
            with transaction.atomic():
                self.game.status = 'CLOSED'
                self.game.save()
                for agent in all_agents:
                    self.agent = agent
                    self.tickets = SpinTicket.objects.check_and_get_related_to_game(self.game, self.agent)
                    if self.tickets is None: # simply if the cashiers under the agent created no tickets it will create random result
                        self.non_bet_game()
                    else:
                        self.margin = agent.spin_margin / 100
                        self.spin_give_away_amount = agent.spin_give_away_amount
                        self.micro_prize = False
                        self.total_stake = SpinTicket.objects.total_stake(self.game, self.agent)
                        self.set_previous_prize()
                        self.calculate_daily_statistics()
                        self.betted_game()
                self.game._done = True
                self.game.save()
        except Exception as e:
            print(f"Error occurred: {e}")

    def set_previous_prize(self):
        try:
            (
                self.previous_prize_made,
                self.previous_prize_amount,
                self.prize_last_8_games,
                self.prize_last_4_games
            ) = SpinAnalytica.objects.get_previous_special_prize(self.agent)
        except:
            self.previous_prize_made = False
            self.previous_prize_amount = 0
            self.prize_last_8_games = 0
            self.prize_last_4_games = 0

    def calculate_daily_statistics(self):
        try:
            (
                self.daily_gain,
                self.daily_total_stake,
                self.last_4_games_total_won
            ) = SpinTicket.objects.get_daily_tickets_stastistics_for_prize(self.agent)
        except:
            self.daily_gain = 0
            self.daily_total_stake = 0
            self.last_4_games_total_won = 0

    def non_bet_game(self):

        random_value = random.sample(range(1, 37), 1)
        random_value = int(random_value[0])
        print(f'random value result for spin game is {random_value}')

        SpinAnalytica.create(
            spin_odd_type=self.agent.spin_odd_type,
            agent=self.agent,
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
        self.game.result = random_value
        self.game.save()

    def betted_game(self):
        special_gain = self.agent.spin_give_away_amount
        if special_gain <= 0:
            self.make_prize, self.max_won_amount = self.calculate_max_won()
        else:
            self.max_won_amount = special_gain
            self.special_prize = True
        result = self.pick_spin_wheel()
        self._finish_and_save(result)

    def calculate_prize(self, stake, odds):
        return stake * odds

    def should_prize_be_made(self):
        try:
            if self.previous_prize_made == False:
                if self.prize_last_8_games == 0 and self.daily_total_stake > 6 * self.last_4_games_total_won:
                    return True
            return False
        except Exception as e:
            print(f"An error occurred while determining if prize should be made: {e}")
            return False

    def calculate_max_won(self):
        try:
            should_make_prize = self.should_prize_be_made()
            prize_amount = self.previous_prize_amount
            if should_make_prize and self.daily_total_stake > prize_amount and self.daily_gain > self.daily_total_stake * self.margin:
                prize_amount = self.daily_total_stake * (1 - self.margin) + prize_amount
                self.micro_prize = False
                self.make_prize = True
            elif should_make_prize and self.daily_gain > self.daily_total_stake * self.margin:
                prize_amount = self.daily_gain * (1 - self.margin) + prize_amount
                self.micro_prize = False
                self.make_prize = True
            elif (self.prize_last_4_games == 0
                  and self.daily_gain > self.margin * self.daily_total_stake
                  and self.daily_total_stake > 4 * self.margin * self.last_4_games_total_won):
                prize_amount = (0.85 - self.margin) * self.daily_total_stake + prize_amount
                self.micro_prize = True
                self.make_prize = False
            elif self.daily_gain > self.margin * self.daily_total_stake and self.daily_total_stake > 5 * self.margin * self.last_4_games_total_won:
                self.micro_prize = True
                self.make_prize = False
                prize_amount = (0.65 - self.margin) * self.daily_total_stake * 0.2 + prize_amount
            elif self.daily_gain > self.margin * self.daily_total_stake:
                prize_amount = (0.5 - self.margin) * self.daily_total_stake * 0.1 + prize_amount
                self.micro_prize = True
                self.make_prize = False
            else:
                prize_amount = 0
                self.micro_prize = False
                self.make_prize = False
            if self.daily_gain < 0:
                prize_amount = 0
                self.micro_prize = False
            return should_make_prize, prize_amount
        except Exception as e:
            return False, 0

    def get_spin_result(self, spin_nominee_result, ticket):
        val = ticket.choice_val
        print(val)
        if ticket.kind == 'int':
            return spin_nominee_result == int(val)
        elif '/' in val and ticket.kind == 'selector_colour':
            numbers = list(map(int, val.split('/')))
            return spin_nominee_result in numbers
        elif '-' in val and ticket.kind == 'high_low':
            start, end = map(int, val.split('-'))
            numbers = list(range(start, end + 1))
            return spin_nominee_result in numbers
        elif val in special_cases:
            return spin_nominee_result in special_cases[val]
        else:
            return False

    def pick_spin_wheel(self):
        # simulate the tickets and there won amount with all nums
        categories = defaultdict(list)

        simulate_tickets = []
        total_winners = 0
        for spin_nominee_result in range(37):  # 0 to 36
            win_count = 0
            total_win_amount = 0
            for ticket in self.tickets:
                stake = ticket.stake

                if self.get_spin_result(spin_nominee_result, ticket):
                    win_count += 1
                    total_winners += 1
                    total_win_amount += self.calculate_prize(stake, ticket._odd)
                    simulate_tickets.append({'spin_result': spin_nominee_result, 'result': 'win', 'win_count': win_count, 'total_win_amount': total_win_amount, 'total_winners': total_winners})
                else:
                    simulate_tickets.append({'spin_result': spin_nominee_result, 'result': 'lose', 'win_count': win_count, 'total_win_amount': total_win_amount, 'total_winners': total_winners})

        categories = self.categorize_numbers(simulate_tickets)
        # max_won_amount = 90000
        selected_number = self.select_best_number(categories, self.max_won_amount)
        return selected_number

    def select_best_number(self, categories, max_won_amount):
        total_uncalled_won = sum(item['total_win_amount'] for item in categories['uncalled'])
        total_low_won = sum(item['total_win_amount'] for item in categories['low'])
        total_middle_won = sum(item['total_win_amount'] for item in categories['middle'])
        total_high_won = sum(item['total_win_amount'] for item in categories['high'])
        total_special_won = sum(item['total_win_amount'] for item in categories['special'])

        diff_special = abs(max_won_amount - total_special_won)
        diff_low = abs(max_won_amount - total_low_won)
        diff_middle = abs(max_won_amount - total_middle_won)
        diff_high = abs(max_won_amount - total_high_won)
        diff_uncalled = abs(max_won_amount - total_uncalled_won)

        closest_result = None

        if max_won_amount > 0:
            min_diff = min(diff_special, diff_low, diff_middle, diff_high, diff_uncalled)
            if min_diff == diff_high and categories['high']:
                closest_result = min(categories['high'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
            elif min_diff == diff_middle and categories['middle']:
                closest_result = min(categories['middle'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
            elif min_diff == diff_low and categories['low']:
                closest_result = min(categories['low'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
            elif min_diff == diff_uncalled and categories['uncalled']:
                closest_result = min(categories['uncalled'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
            elif min_diff == diff_special and categories['special']:
                closest_result = min(categories['special'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
        else:
            if categories['uncalled']:
                closest_result = min(categories['uncalled'], key=lambda x: x['total_win_amount'])
            else:
                all_candidates = categories['low'] + categories['middle'] + categories['high'] + categories['special']
                closest_result = min(all_candidates, key=lambda x: x['total_win_amount'])

        # TODO Ensure closest_result is not None
        if not closest_result:
            all_candidates = categories['uncalled'] + categories['low'] + categories['middle'] + categories['high'] + categories['special']
            closest_result = min(all_candidates, key=lambda x: abs(x['total_win_amount'] - max_won_amount))

        return closest_result['spin_result']

    def win_thresholds(self, results):
        win_amounts = [results[i]['total_win_amount'] for i in range(37)]
        win_amounts_sorted = sorted(win_amounts)

        low_threshold = win_amounts_sorted[12]  # Roughly bottom third
        mid_threshold = win_amounts_sorted[24]  # Roughly middle third
        high_threshold = win_amounts_sorted[35] # Top third

        give_away = min(win_amounts_sorted, key=lambda x: abs(x - self.spin_give_away_amount))
        print(f'give_away {give_away}') # TODO: use the giveaway
        return low_threshold, mid_threshold, high_threshold

    def categorize_numbers(self, results):
        closest_special = None
        low_threshold, mid_threshold, high_threshold = self.win_thresholds(results)
        categories = {
            'uncalled': [],
            'low': [],
            'middle': [],
            'high': [],
            'special': []
        }
        special_min = 2500 # TODO: replace with something dynamic like model both
        special_max = 3500

        for i in range(37):
            total_win_amount = results[i]['total_win_amount']
            if total_win_amount == 0:
                categories['uncalled'].append({
                    'spin_result': i,
                    'total_win_amount': total_win_amount
                })
            elif total_win_amount <= low_threshold:
                categories['low'].append({
                    'spin_result': i,
                    'total_win_amount': total_win_amount})
            elif total_win_amount <= mid_threshold:
                categories['middle'].append({
                    'spin_result': i,
                    'total_win_amount': total_win_amount})
            elif total_win_amount <= high_threshold:
                categories['high'].append({
                    'spin_result': i,
                    'total_win_amount': total_win_amount})

            if abs(total_win_amount - special_min) < special_max:
                if closest_special is None or abs(total_win_amount - special_min) < abs(closest_special[1] - special_min):
                    closest_special = (i, total_win_amount)
                    # TODO: its setting up for special but I forgot what the calculation does fix it

        if closest_special:
            categories['special'].append({'spin_result': closest_special[0], 'total_win_amount': closest_special[1]})
 
        return categories

    def _update_game_results(self, result):
        self.game.result = result
        self.game.save()

    def _calculate_winners(self, spin_result):
        total_won = 0

        for ticket in self.tickets:
            try:
                if self.get_spin_result(spin_result, ticket):
                    won_amount = self.calculate_prize(ticket.stake, ticket._odd)
                    ticket.won_amount = won_amount
                    total_won += won_amount
                    if won_amount > 0:
                        ticket.redeemed = True  # TODO: in production comment this line
                    ticket.save()

            except Exception as e:
                print(f"An error occurred while processing ticket: {e}")

        return total_won

    def statistics_save(self, total_won, total_gain):
        try:
            if self.special_prize:
                restore_give_away = total_won - self.max_won_amount
                self.agent.spin_give_away_amount = 0 if restore_give_away > 0 else (restore_give_away) * -1
                total_special_prize = self.previous_prize_amount + total_gain * 0.4 - total_won
                self.agent.save()
            elif self.make_prize:
                total_special_prize = self.previous_prize_amount - total_won
            else:
                from decimal import Decimal
                x = (total_gain * 40) / 100
                y = self.previous_prize_amount - total_won
                total_special_prize = y + x

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

    def _finish_and_save(self, result):

        try:
            total_won = self._calculate_winners(result)
            print(f'total won: {total_won}, total stake {self.total_stake}')
            self._update_game_results(result)
            total_gain = self.total_stake - total_won
            total_special_prize, gain_percentage, loss_percent = self.statistics_save(total_won, total_gain)

            exp_gain = self.total_stake + (self.agent.spin_margin)
            total_tickets = len(self.tickets)
            total_stake = self.total_stake

            SpinAnalytica.create(
                spin_odd_type=self.agent.spin_odd_type,
                agent=self.agent,
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

        except Exception as e:

            print(f"An error occurred during game analysis: {e}")

