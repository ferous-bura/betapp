import json
import time
import logging
from django.http import JsonResponse
from django.views import View
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.utils import timezone

from cashierapp.cashier_fetch import get_ticket_data, get_ticket_print_data
from spin.models import Spin, SpinTicket
from game_utils.auth_decorators import user_type_redirect
from spin.utils.value_handler import SaveValue
from zuser.models import Cashier
from game_utils.time_file import get_local_time_now

logger = logging.getLogger(__name__)

# @method_decorator(user_type_redirect, name='dispatch')
class CashierSpinView(View):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.numbers_list = list(range(1, 37))

    def get(self, request, *args, **kwargs):
        request_type = request.GET.get('type')
        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
        print(f'get custom user {custom_user}')

        if request_type == 'printBalance':
            return self.report_print(request)
        elif request_type == 'ticket_history':
            return self.ticket_history(request)
        elif request_type == 'cancel_ticket':
            return self.cancel_ticket(request)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid request type'}, status=400)

    def post(self, request, *args, **kwargs):
        content_type = request.headers.get('Content-Type')
        custom_user = request.user
        print(f'custom user {custom_user}')

        cashier = get_object_or_404(Cashier, cashier=custom_user)

        if 'application/json' in content_type:
            json_data = json.loads(request.body)
            action = json_data.get('action')

            if action == 'spin_bet':
                return self.place_bet(json_data, cashier)
            elif action == 'redeem_ticket':
                return self.redeem_ticket(request, json_data)
            elif action == 'scanned_barcode':
                return self.scanned_barcode(request, json_data)
            elif action == 'get_result':
                return self.get_result(request, json_data)
            elif action == 'balance_report':
                return self.balance_report(request)
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid action'}, status=400)
        else:
            return JsonResponse({'status': 'error', 'message': 'Unsupported content type'}, status=400)

    def place_bet(self, json_data, cashier):
        latest_game = Spin.objects.latest_spin_open()
        if not latest_game:
            print('no latest game')
            return JsonResponse({'status': 'error', 'message': 'Please wait a moment, game is not created'})
        
        current_time = get_local_time_now()
        latest_game_created_at = timezone.localtime(latest_game.created_at)
        time_difference = current_time - latest_game_created_at

        if time_difference.total_seconds() >= 225:
            time.sleep(5)
            return JsonResponse({'status': 'error', 'message': 'Time is up'})
        
        input_type = json_data.get('input_type')
        user_data = json_data.get('user')
        _selection = SaveValue()
        if input_type == "single":
            result = _selection.save_single_tickets(user_data, cashier)
        elif input_type == "multiple":
            result = _selection.add_multiple_tickets(user_data, cashier)
        return JsonResponse(result)

    def cancel_ticket(self, request):
        code = request.GET.get('code')
        tickets = SpinTicket.objects.filter(unique_identifier=code)
        result = {}  # Initialize result dictionary

        if tickets.exists():
            for ticket in tickets:
                game_result = ticket.check_for_result(ticket._game.game_num)
                if not ticket.redeemed and game_result is None:
                    on_date = ticket.created_at.strftime('%Y-%m-%d')
                    ticket.cancelled = True
                    ticket.save()
                    result = {
                        'status': 200,
                        'message': 'Ticket cancelled successfully',
                        'by': request.user.username,
                        'on': on_date,
                        'code': code
                    }
                elif ticket.redeemed:
                    result = {'status': 304, 'message': 'Ticket is already redeemed'}
                else:
                    result = {'status': 404, 'message': 'Ticket is not found'}
        else:
            result = {'status': 404, 'message': 'Ticket is not found'}
        print(f'result {result}')

        return JsonResponse(result)

    def redeem_ticket(self, request, json_data):
        code = int(json_data.get('code'))
        tickets = SpinTicket.objects.filter(unique_identifier=code)

        if tickets.exists():
            for ticket in tickets:
                if not ticket.redeemed:
                    try:
                        ticket.redeemed = True
                        ticket.save()
                        result = {
                            'status': 200,
                            'message': 'Ticket redeemed successfully',
                            'by': ticket.cashier_by,
                            'on': get_local_time_now(),
                            'amount': ticket.won_amount
                        }
                    except Exception as e:
                        result = {
                            'status': 500,
                            'message': f'Failed to redeem ticket: {str(e)}'
                        }
                else:
                    result = {'status': 304, 'message': 'Ticket is already redeemed'}
        else:
            result = {'status': 404, 'message': 'Ticket is not found'}

        return JsonResponse(result)

    def balance_report(self, request):
        cashier = Cashier.objects.get(cashier=request.user)
        data = get_ticket_data(cashier)
        return JsonResponse(data)

    def report_print(self, request):
        day = request.GET.get('day', 'today')
        cashier = Cashier.objects.get(cashier=request.user)
        data = get_ticket_print_data(cashier, day, request.user.username)
        return JsonResponse(data)

    def scanned_barcode(self, request, json_data):
        code = json_data.get('ticket_id')
        ticket = SpinTicket.objects.filter(unique_identifier=code).first()

        if ticket is None:
            return JsonResponse({'error': 'Ticket not found'}, status=404)

        cashier = get_object_or_404(Cashier, cashier=request.user)
        data = ticket.to_data_structure(cashier.cashier.username)
        return JsonResponse(data, safe=False)

    def get_result(self, request, json_data):
        date_of_creation = json_data.get('time')
        game_num = json_data.get('game_id')
        cashier = Cashier.objects.get(cashier=request.user)
        agent = cashier.agent
        response = Spin.objects.get_result(game_num, date_of_creation, agent)
        return JsonResponse(response)

    def ticket_history(self, request):
        cashier = get_object_or_404(Cashier, cashier=request.user)
        response_data = SpinTicket.objects.last_100_selections(cashier)
        return JsonResponse(response_data, safe=False)
