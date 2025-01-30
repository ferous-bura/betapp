from django.utils import timezone
import json
from django.db import IntegrityError
from keno.models import MobileGame, MobileTicket
from django.db.models import Sum, Max
from keno.utils.raw_result import get_odd_for_choices
from game_utils.time_file import get_local_time_date, game_start_on

import logging
logger = logging.getLogger(__name__)

class MobileSaveSelection:

    def add_single_ticket(self, json_data, player):
        selection_data = json_data.get('selection')
        _stake = json_data.get('stake')
        ticket_numbers = list(map(int, selection_data))
        if not isinstance(ticket_numbers, list):
            raise ValueError('Invalid ticket_numbers format')

        result = self.save_single_tickets(ticket_numbers, _stake, player)
        return result

    def save_single_tickets(self, ticket_numbers, _stake, player):
        try:
            choice_list = json.dumps(ticket_numbers)
            latest_game = MobileGame.objects.latest_keno_open()
            if latest_game:
                ticket = MobileTicket.objects.create(
                    played_by=player,
                    _game=latest_game,
                    choice_list=choice_list,
                    stake=_stake,
                    ticket_type='Single',
                )
                current_date = get_local_time_date()

                year = str(current_date.year)[-2:]
                month = str(current_date.month).zfill(2)
                day = str(current_date.day).zfill(2)

                ticket.unique_identifier = f"{ticket.id}{latest_game.game_num}{day}{month}{year}"
                ticket.save()
                logger.info(f' - Created combination: {ticket}')
                r = {
                    'status': 'success',
                    'message': 'ticket created successfully',
                    'id': ticket.id,
                    'on': ticket.created_at,
                    'code': ticket.unique_identifier,
                    'by': ticket.played_by.player.username,
                    'gameStartsOn': game_start_on(), # TODO: make this real
                    'TotalStake': ticket.stake,
                    'toWinMin': ticket.won_amount,
                    'toWinMax': ticket.won_amount,
                    'user': [
                        {
                            'selection': [str(num) for num in ticket_numbers],
                            'odd': 2.5,  # Modify as needed
                            'win_type': "Jackpot",  # Modify as needed
                            'val': "7",  # Modify as needed
                            'stake': 10,  # Modify as needed
                        }
                    ]
                }
                print(r)
                return r
            else:
                return {"status": "error", "message": "No open game found"}
        
        except (ValueError, IntegrityError) as e:
            logger.error(f"Error creating combinations: {e}")
            return {"status": "error", "message": f"Error: {e}"}

    def add_multiple_tickets(self, json_data, player):
        selection_data = json_data.get('selection')
        result = None
        multiple_identifier = None
        multi_Stake = 0
        user_data = []
        possible_won = 0

        for ticket in selection_data:
            _ticket = list(map(int, ticket.get('selection')))
            _stake = ticket.get('stake')
            num_choices = len(_ticket)
            keno_odd_type = 'B'
            odd_for_choices = get_odd_for_choices(num_choices, keno_odd_type)

            if not isinstance(_ticket, list):
                raise ValueError('Invalid ticket_numbers format')                
            result, multiple_identifier, multi_Stake = self.save_multiple_tickets(_ticket, _stake, player, multiple_identifier, multi_Stake)
            user_data.append({
                'selection': [str(num) for num in _ticket],  # Convert numbers to strings
                'odd': odd_for_choices,  # Modify as needed
                'win_type': "Jackpot",  # Modify as needed
                'val': "7",  # Modify as needed
                'stake': result.stake,  # Modify as needed
            })
            possible_won += int(result.get_possible_won())
            print(possible_won)

        if result and result.ticket_type == 'Multiple':
            similar_tickets = MobileTicket.objects.filter(unique_identifier=result.unique_identifier, ticket_type='Multiple')
            max_multiple_stake = similar_tickets.aggregate(max_multiple_stake=Max('multiple_stake'))['max_multiple_stake']

        r = {
            'status': 'success',
            'message': 'ticket created successfully',
            'id': result.id,
            'on': result.created_at,
            'code': result.unique_identifier,
            'by': result.played_by.player.username,
            'gameStartsOn': game_start_on(), # TODO: make this real
            'TotalStake': max_multiple_stake,
            'toWinMin': max_multiple_stake,
            'toWinMax': possible_won,
            'user': user_data,
        }
        print(r)
        return r

    def save_multiple_tickets(self, ticket_numbers, _stake, player, multiple, multi_Stake):
        try:
            choice_list = json.dumps(ticket_numbers)
            latest_game = MobileGame.objects.latest_keno_open()
            if latest_game:
                ticket = MobileTicket.objects.create(
                    played_by=player,
                    _game=latest_game,
                    choice_list=choice_list,
                    stake=_stake,
                    ticket_type='Multiple',
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

                return ticket, ticket.unique_identifier, ticket.stake
            else:
                return {"status": "error", "message": "No open game found"}
        
        except (ValueError, IntegrityError) as e:
            logger.error(f"Error creating combinations: {e}")
            return {"status": "error", "message": f"Error: {e}"}
