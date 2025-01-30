from django.shortcuts import redirect, render, get_object_or_404
from django.views import View

from datetime import datetime
import json
from django.http import JsonResponse
from django.shortcuts import render

from django.views import View
from game_utils.auth_decorators import user_type_redirect
from game_utils.time_file import get_local_time_date, get_local_time_now, single_date
from game_utils.et_names import names

from keno.utils.mobile_ticket import MobileSaveSelection
import logging

logger = logging.getLogger(__name__)
from django.shortcuts import redirect
from django.shortcuts import render
from django.views import View
import time
from datetime import datetime, timedelta
from keno.models import MobileGame, MobileTicket
import json
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from zuser.models import Player
from django.db.models import Sum, Q
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

import random

def mobile_dice(request):
    return render(request, 'mobile/dice.html', context={'game_type': 'dice'})

def mobile_spin(request):
    return render(request, 'mobile/spin.html', context={'game_type': 'spin'})

def mobile_bingo(request):
    return render(request, 'mobile/bingo.html', context={'game_type': 'bingo'})

def generate_nums():
  B = random.sample(range(1, 15), 5)
  I = random.sample(range(16, 31), 5)
  N = random.sample(range(31, 45), 5)
  G = random.sample(range(46, 60), 5)
  O = random.sample(range(61, 75), 5)
  return [B,I,N,G,O]


def bingo_card_results(request):
    card = []
    for _ in range(3):
        card.append(generate_nums())
    print(card)
    return JsonResponse(card, safe=False)

def get_bingo_cards(request):
    card = []
    for _ in range(5):
        card.append(generate_nums())
    print(card)
    return JsonResponse(card, safe=False)

def get_results(request):
    # Generate 20 unique random numbers between 1 and 80
    random_numbers = random.sample(range(1, 81), 20)
    return JsonResponse(random_numbers, safe=False)

def mask_name(name):
    if len(name) <= 2:
        return '*' * len(name)
    else:
        return name[:-2] + '***'

def get_live_bets(request):
    chat_messages = []
    for _ in range(10):
        sender_name = random.choice(list(names.keys()))
        message_length = random.randint(1, 10)
        message = ', '.join(str(random.randint(1, 80)) for _ in range(message_length))
        time = random.randint(1, 12) * 10  # Time (stake) between 100 and 200

        masked_name = mask_name(sender_name)
        chat_messages.append({
            'senderName': masked_name,
            'message': message,
            'time': time
        })

    return JsonResponse(chat_messages, safe=False)

def place_bet(json_data, player):
    latest_game = MobileGame.objects.latest_keno_open()
    if not latest_game:
        return JsonResponse({'status': 'error', 'message': 'please wait a moment, game is not created'})
    else:
        current_time = get_local_time_now()
        latest_game_created_at = timezone.localtime(latest_game.created_at)
        time_difference = current_time - latest_game_created_at

        if not time_difference.total_seconds() < 235:
            time.sleep(5)
            return JsonResponse({'status': 'error', 'message': 'time is up'})
        else:
            input_type = json_data.get('input_type')
            _selection = MobileSaveSelection()
            message = 'saved successfully'
            print(message)
            if input_type == "single":
                r = _selection.add_single_ticket(json_data, player)
            elif input_type == "multiple":
                r = _selection.add_multiple_tickets(json_data, player)
            
            return JsonResponse({'message': message, 'status': 'success', 'data': r}, status=200)

def balance_report(request):
    player = Player.objects.get(player=request.user)
    data = {}
    json_data = json.loads(request.body)
    requested_date_str = json_data.get('date')
    if requested_date_str:
        data = get_ticket_data_by_date(player, requested_date_str)
    else:
        data = get_ticket_data(player)
    return JsonResponse(data)

@csrf_exempt
@login_required
def mobile_keno(request):
    if request.method == 'POST':
        content_type = request.headers.get('Content-Type')
        custom_user = request.user
        player = get_object_or_404(Player, player=custom_user)
        if 'application/json' in content_type:
            json_data = json.loads(request.body)
            action = json_data.get('action')
            if action == 'place_bet':
                return place_bet(json_data, player)
            elif action == 'get_result':
                return get_result(request, json_data)
            elif action == 'balance_report':
                return balance_report(request)
            elif action == 'ticket_history':
                response_data = MobileTicket.objects.last_100_selections(player)
                # print(response_data)
                return JsonResponse(response_data, safe=False, status=200)
            else:
                result = {'status': 'error', 'message': 'Invalid action'}
                return JsonResponse(result, status=400)
        else:
            result = {'status': 'error', 'message': 'Unsupported content type'}
            return JsonResponse(result, status=400)

    # If the request method is not POST
    return JsonResponse({'message': 'Only POST requests are allowed', 'status': 'error'}, status=405)

@user_type_redirect
def main_page(request):
    custom_user = request.user
    try:
        player = get_object_or_404(Player, player=custom_user)
    except ObjectDoesNotExist:
        return redirect('/dashboard')
    return render(request, 'mobile/keno.html', {'game_type' : 'keno', 'player': player, 'custom_user':custom_user})

def get_result(request):
    start_time = time.time()
    while True:
        latest_game = MobileGame.objects.latest_keno_result()
        try:
            result = latest_game.result
        except:
            print(f'no result for mobile')
        if result:
            response_data = MobileTicket.objects.get_response_data(latest_game, request)
            return JsonResponse(response_data)
        if time.time() - start_time > 4 * 60:
            response_data = {'latest_result': 'No new result is made'}
            return JsonResponse(response_data)
        time.sleep(5)


def latest_game_num(request):
    start_time = time.time()
    while True:
        latest_game = MobileGame.objects.latest_keno()
        if latest_game:
            creation_time = latest_game.created_at.strftime('%Y-%m-%d %H:%M:%S')
            creation_time = datetime.strptime(creation_time, '%Y-%m-%d %H:%M:%S')

            creation_time_plus_one_sec = creation_time + timedelta(seconds=1)
            creation_time = creation_time_plus_one_sec.strftime('%Y-%m-%d %H:%M:%S')
            response_data = {
                'latest_game': latest_game.game_num,
                'creation_time': creation_time
            }
            return JsonResponse(response_data)
        if time.time() - start_time > 4 * 60:
            response_data = {'latest_game': 'No new game made'}
            return JsonResponse(response_data)
        time.sleep(5)


class MobilePlayers(View):
    redirect_authenticated_user = True  # Redirect authenticated user if they try to access the login page

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.context = {'status': 200}
        self.model = MobileGame
        self.common_context = {'app_name': 'BettingApp'}
        self.template_name = 'mobile/keno.html'
        self.enable_feature_x = True
        self.default_filter = {'status': 'active'}
        self.keno_odd_beta = [
            [1, 4],
            [2, 15],
            [3, 35],
            [4, 100],
            [5, 300],
            [6, 1800],
            [7, 2150],
            [8, 3000],
            [9, 4200],
            [10, 5000]
        ]
        self.numbers_list = list(range(1, 81))

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if user.groups.filter(name='Cashier').exists():
            return redirect('/cashier/')
        elif user.groups.filter(name='Agent Admin').exists():
            return redirect('/dashboard/')
        elif user.groups.filter(name='Company Admin').exists() or request.user.is_staff:
            return redirect('/dashboard/')
        else:
            pass

        request_type = request.GET.get('type')

        if request_type == 'printBalance':
            day = request.GET.get('day')
            data = {
                "agent": "Agent Name",
                "cashier": "Cashier Name",
                "date": "2024-03-18",
                "betCount": 100,
                "payin": 5000,
                "payout": 3000,
                "canceled": 200,
                "net": 1800
            }
            return JsonResponse(data)
        elif request_type == 'ticket_history':
            ticket_history_data = [
                {
                    'code': '123456',
                    'id': 1,
                    'on': '2024-03-19',
                    'stake': 100
                },
                {
                    'code': '789012',
                    'id': 2,
                    'on': '2024-03-18',
                    'stake': 200
                }
            ]
            response_data = ticket_history_data
            return JsonResponse(response_data, safe=False)
        today = get_local_time_date()
        game_instance = self.model.objects.latest_keno()
        if game_instance:
            game_num = game_instance.game_num
            self.context = {
                'numbers_list': self.numbers_list,
                'keno_odd': self.keno_odd_beta,
                'game_num': game_num,
            }

        return render(request, self.template_name, self.context)
    
    def add_ticket(self, request):
        json_data = json.loads(request.body)
        selection_data = json_data.get('selection')
        _stake = json_data.get('stake')
        selection = list(map(int, selection_data))
        if not isinstance(selection, list):
            raise ValueError('Invalid selection format')
        latest_game = MobileGame.objects.latest_keno()
        single_selection = MobileSaveSelection()
        sel_game, user_identifier = single_selection.save_single_ticket(selection, _stake, request)

        data = {
            'status': 'active',
            'message': 'Ticket is added',
            'user': {'stake': 100, },
        }
        if user_identifier:
            data.set_cookie('user_identifier', user_identifier)        
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        content_type = request.headers.get('Content-Type')

        if 'application/json' in content_type:
            json_data = json.loads(request.body)
            action = json_data.get('action')
            print(f'------action {action} -----------')
            if action == 'place_bet':
                return self.add_ticket(request)
            elif action == 'update_ticket':
                return self.update_tickets(request)
            elif action == 'cancel_ticket':
                return self.cancel_ticket(request)
            elif action == 'get_result':
                return self.get_result(request)
            elif action == 'redeem_ticket':
                return self.redeem_ticket(request)
            elif action == 'balance_report':
                return self.balance_report(request)
            # Add more actions as needed
            else:
                result = {'status': 'error', 'message': 'Invalid action'}
                return JsonResponse(result, status=400)
        else:
            result = {'status': 'error', 'message': 'Unsupported content type'}
            return JsonResponse(result, status=400)

def get_ticket_data(player):
    today = get_local_time_date()
    yesterday = today - timedelta(days=1)

    # Query today's data
    today_data = MobileTicket.objects.filter(
        played_by=player,
        created_at__date=today
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Query yesterday's data
    yesterday_data = MobileTicket.objects.filter(
        played_by=player,
        created_at__date=yesterday
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Set default values for redeemed and canceled amounts
    default_bets_today = 0 if today_data['bets'] is None else today_data['bets']
    default_redeemed_today = 0 if today_data['redeemed'] is None else today_data['redeemed']
    default_canceled_today = 0 if today_data['canceled'] is None else today_data['canceled']

    default_bets_yesterday =  0 if yesterday_data['bets'] is None else yesterday_data['bets']
    default_redeemed_yesterday = 0 if yesterday_data['redeemed'] is None else yesterday_data['redeemed']
    default_canceled_yesterday = 0 if yesterday_data['canceled'] is None else yesterday_data['canceled']
    # Set the deposited amount to 0
    deposited_amount = 0

    # Organize the data into the desired structure
    ticket_data = {
        "err": "false",
        "today": {
            "bets": {"amount": default_bets_today},
            "redeemed": {"amount": default_redeemed_today},
            "canceled": {"amount": default_canceled_today},
            "deposited": {"amount": deposited_amount}
        },
        "yesterday": {
            "bets": {"amount": default_bets_yesterday},
            "redeemed": {"amount": default_redeemed_yesterday},
            "canceled": {"amount": default_canceled_yesterday},
            "deposited": {"amount": deposited_amount}
        }
    }

    print(ticket_data)


    return ticket_data

def get_ticket_data_by_date(player, requested_date):
    date = single_date(requested_date)
    print(date)
    today_data = MobileTicket.objects.filter(
        played_by=player,
        created_at__date=date
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Set default values for redeemed and canceled amounts
    default_bets_today = 0 if today_data['bets'] is None else today_data['bets']
    default_redeemed_today = 0 if today_data['redeemed'] is None else today_data['redeemed']
    default_canceled_today = 0 if today_data['canceled'] is None else today_data['canceled']

    deposited_amount = 0
    ticket_data = {
                    "bets": {"amount": default_bets_today},
                    "redeemed": {"amount": default_redeemed_today},
                    "canceled": {"amount": default_canceled_today},
                    "deposited": {"amount": deposited_amount}
                }
    print(ticket_data)
    return ticket_data