import json
from django.db import IntegrityError
from keno.models import Game, Ticket
import logging

from keno.utils.raw_result import get_odd_for_choices
from game_utils.time_file import get_local_time_date, game_start_on

logger = logging.getLogger(__name__)

class SaveSelection:
    def add_single_ticket(self, json_data, cashier):
        selection_data = json_data.get('selection')
        _stake = json_data.get('stake')
        ticket_numbers = list(map(int, selection_data))        
        if not isinstance(ticket_numbers, list):
            raise ValueError('Invalid ticket_numbers format')

        result = self.save_single_tickets(ticket_numbers, _stake, cashier)
        print(f'result {result}')
        return result

    def save_single_tickets(self, ticket_numbers, _stake, cashier):
        try:
            choice_list = json.dumps(ticket_numbers)
            latest_game = Game.objects.latest_keno_open()
            num_choices = len(ticket_numbers)
            keno_odd_type = cashier.agent.keno_odd_type
            odd_for_choices = get_odd_for_choices(num_choices, keno_odd_type)
            if latest_game:
                ticket = Ticket.objects.create(
                    cashier_by=cashier,
                    _game=latest_game,
                    choice_list=choice_list,
                    stake=_stake,
                    ticket_type='Single',
                    _odd=odd_for_choices
                )
                current_date = get_local_time_date()
                year = str(current_date.year)[-2:]
                month = str(current_date.month).zfill(2)
                day = str(current_date.day).zfill(2)

                ticket.unique_identifier = f"{ticket.id}{latest_game.game_num}{day}{month}{year}"
                ticket.save()
                logger.info(f' - Created combination: {ticket}')
                
                can_won = int(ticket.get_possible_won())
                
                r = {
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
                            'selection': [str(num) for num in ticket_numbers],
                            'odd': ticket._odd,
                            'win_type': "Keno",
                            'can_won': can_won,
                            'stake': ticket.stake,
                        }
                    ]
                }
                # print(r)
                return r
            else:
                return {"status": "error", "message": "No open game found"}
        
        except (ValueError, IntegrityError) as e:
            logger.error(f"Error creating combinations: {e}")
            return {"status": "error", "message": f"Error: {e}"}

    def add_multiple_tickets(self, json_data, cashier):
        selection_data = json_data.get('selection')
        result = []
        multiple_identifier = None
        multi_Stake = 0
        user_data = []
        possible_won = 0

        for ticket in selection_data:
            _ticket = list(map(int, ticket.get('selection')))
            _stake = ticket.get('stake')

            if not isinstance(_ticket, list):
                raise ValueError('Invalid ticket_numbers format')                
            result, multiple_identifier, multi_Stake = self.save_multiple_tickets(_ticket, _stake, cashier, multiple_identifier, multi_Stake)
            can_won = int(result.get_possible_won())
            user_data.append({
                'selection': [str(num) for num in _ticket],
                'odd': result._odd,
                'win_type': "Keno",
                'can_won': can_won,
                'stake': result.stake,
            })
            possible_won += can_won
        
        r = {
            'status': 'success',
            'message': 'ticket created successfully',
            'id': result._game.game_num,
            'on': result.created_at,
            'code': result.unique_identifier,
            'by': cashier.cashier.username,
            'agent': cashier.agent.full_name,
            'gameStartsOn': game_start_on(), # TODO: make this real
            'TotalStake': multi_Stake,
            'toWinMin': 0,
            'toWinMax': possible_won,
            'company': result.cashier_by.agent.company.company_user.username,
            'user': user_data,
        }
        # print(r)
        return r

    def save_multiple_tickets(self, ticket_numbers, _stake, cashier, multiple, multi_Stake):
        try:
            choice_list = json.dumps(ticket_numbers)
            latest_game = Game.objects.latest_keno_open()
            num_choices = len(ticket_numbers)
            keno_odd_type = cashier.agent.keno_odd_type
            odd_for_choices = get_odd_for_choices(num_choices, keno_odd_type)
            if latest_game:
                ticket = Ticket.objects.create(
                    cashier_by=cashier,
                    _game=latest_game,
                    choice_list=choice_list,
                    stake=_stake,
                    ticket_type='Multiple',
                    _odd=odd_for_choices,
                )
                if multiple is not None:
                    ticket.unique_identifier = multiple
                    ticket.multiple_stake += int(multi_Stake) + int(ticket.stake)
                    ticket.save()
                else:
                    current_date = get_local_time_date()
                    year = str(current_date.year)[-2:]
                    month = str(current_date.month).zfill(2)
                    day = str(current_date.day).zfill(2)

                    ticket.multiple_stake = ticket.stake
                    ticket.unique_identifier = f"{ticket.id}{latest_game.game_num}{day}{month}{year}"
                    ticket.save()

                logger.info(f' - Created combination: {ticket}')

                return ticket, ticket.unique_identifier, ticket.multiple_stake
            else:
                return {"status": "error", "message": "No open game found"}
        
        except (ValueError, IntegrityError) as e:
            logger.error(f"Error creating combinations: {e}")
            return {"status": "error", "message": f"Error: {e}"}
