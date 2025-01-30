from django.utils import timezone
import logging
import json
from django.db import IntegrityError
from django.db import transaction
from spin.models import Spin, SpinTicket

from spin.utils.raw_result import special_cases
from game_utils.time_file import get_local_time_date, game_start_on


logger = logging.getLogger(__name__)

class SaveValue:

    def save_single_tickets(self, user_bet_data, cashier):
        try:
            bet = json.loads(user_bet_data)
            latest_game = Spin.objects.latest_spin_open()
            bet_val = bet['val']
            bet_kind = bet['kind']
            bet_odd = bet['odd']
            bet_stake = bet['stake']
            win_type = "Number" if bet['win_type'] == "Win" else bet['win_type']
            if latest_game:
                try:
                    with transaction.atomic():
                        ticket = SpinTicket.objects.create(
                            _game=latest_game,
                            cashier_by=cashier,

                            choice_val=bet_val,
                            kind=bet_kind,
                            _odd=bet_odd,
                            stake=bet_stake,
                            win_type=win_type,

                            multiple_stake=0,
                        )
                        current_date = get_local_time_date()
                        year = str(current_date.year)[-2:]
                        month = str(current_date.month).zfill(2)
                        day = str(current_date.day).zfill(2)

                        ticket.unique_identifier = f"{ticket.id}{latest_game.game_num}{day}{month}11"
                        ticket.save()

                        print(f' - Created combination: {ticket}')

                        can_won = ticket.get_possible_won()

                        r = {
                            'err': 'false',
                            'status': 'success',
                            'message': 'ticket created successfully',
                            'id': ticket._game.game_num,
                            'on': ticket.created_at,
                            'code': ticket.unique_identifier,
                            'by': cashier.cashier.username,
                            'agent': cashier.agent.full_name,
                            'gameStartsOn': game_start_on(), # TODO: make this real
                            'TotalStake': ticket.stake,
                            'toWinMin': 0,
                            'toWinMax': ticket.get_possible_won(),
                            'company': cashier.agent.company.company_user.username,
                            'user': [
                                {
                                    'val': special_cases[bet_val] if bet['win_type'] not in ["Win", "Split", "Corner", "Six"] else bet_val,
                                    'odd': bet_odd,
                                    'win_type': win_type,
                                    'can_won': can_won,
                                    'stake': ticket.stake,
                                }
                            ]
                        }
                        print(f'resullt {r}')
                        return r
                except Exception as e:
                    print(f"Error occurred: {e}")
                    return {"status": "error", "message": "transaction failed"}
            else:
                return {"status": "error", "message": "No open game found"}
        
        except (ValueError, IntegrityError) as e:
            logger.error(f"Error creating combinations: {e}")
            return {"status": "error", "message": f"Error: {e}"}

    def add_multiple_tickets(self, user_bet_data, cashier):

        # print(f'user_bet_data {user_bet_data}')

        latest_game = Spin.objects.latest_spin_open()

        if latest_game:

            result = []
            multi_Stake = 0
            user_data = []
            possible_won = 0

            current_date = get_local_time_date()
            year = str(current_date.year)[-2:]
            month = str(current_date.month).zfill(2)
            day = str(current_date.day).zfill(2)

            tickets = json.loads(user_bet_data)
            first_ticket = None
            try:
                with transaction.atomic():
                    for bet_key in tickets:
                        bet = tickets[bet_key]
                        # print(f' bet {bet}')
                        # if not isinstance(bet, list):
                        #     raise ValueError('Invalid ticket_numbers format')
                        ticket = self.save_multiple_tickets(bet, cashier, latest_game)
                        multi_Stake += ticket.stake
                        result.append(ticket)
                        if first_ticket is None:
                            first_ticket = ticket
                            multiple_id = f'{first_ticket.id}{latest_game.game_num}{day}{month}11'

                    for ticket in result:
                        ticket.multiple_stake = multi_Stake
                        ticket.unique_identifier = multiple_id
                        ticket.save()

            except Exception as e:
                print(f'transaction error {e}')
                return {"status": "error", "message": "transaction error"}
            # print(f'resulttt {result}, multi_Stake {multi_Stake}')
            # bet = json.loads(user_bet_data)
            for ticket in result:
                win_type = ticket.win_type
                can_won = ticket.get_possible_won()

                bet_val = ticket.choice_val
                bet_kind = ticket.kind
                bet_odd = ticket._odd
                bet_stake = ticket.stake
                user_data.append({
                    'val': special_cases[bet_val] if bet_val in special_cases else bet_val,
                    'odd': bet_odd,
                    'win_type': win_type,
                    'can_won': can_won,
                    'stake': bet_stake,
                })
                possible_won += can_won

            r = {
                'err': 'false',
                'status': 'success',
                'message': 'ticket created successfully',
                'id': ticket._game.game_num,
                'on': ticket.created_at,
                'code': ticket.unique_identifier,
                'by': cashier.cashier.username,
                'agent': cashier.agent.full_name,
                'gameStartsOn': game_start_on(), # TODO: make this real
                'TotalStake': multi_Stake,
                'toWinMin': 0,
                'toWinMax': possible_won,
                'company': ticket.cashier_by.agent.company.company_user.username,
                'user': user_data,
            }
            # print(r)
            return r
        else:
            return {"status": "error", "message": "No open game found"}

    def save_multiple_tickets(self, bet, cashier, latest_game):
        try:
            bet_val = bet['val']
            bet_kind = bet['kind']
            bet_odd = bet['odd']
            bet_stake = bet['stake']
            bet_win_type = "Number" if bet['win_type'] == "Win" else bet['win_type']

            if latest_game:
                # print(f'latest game {latest_game}')
                ticket = SpinTicket.objects.create(
                    _game=latest_game,
                    cashier_by=cashier,

                    choice_val=bet_val,
                    kind=bet_kind,
                    win_type=bet_win_type,
                    _odd=bet_odd,
                    stake=bet_stake,

                    ticket_type='Multiple',
                )

                # print(f' - Created combination: {ticket}')

                return ticket
            else:
                return {"status": "error", "message": "No open game found"}

        except (ValueError, IntegrityError) as e:
            logger.error(f"Error creating combinations: {e}")
            return {"status": "error", "message": f"Error: {e}"}
