import json
import time
import logging
from django.http import JsonResponse
from django.views import View
from django.shortcuts import get_object_or_404, render
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.db.models import Sum
from django.views.decorators.http import require_GET
from datetime import datetime, timedelta

from cashierapp.cashier_fetch import get_ticket_data, get_ticket_print_data, get_spinticket_data, get_spinticket_print_data
from dashboard.analyzer import get_initial_data, get_spininitial_data
from keno.models import Game, GameResult, Ticket
from spin.models import Spin, SpinTicket
from keno.utils.tickets_handler import SaveSelection
from spin.utils.spin_creator_ import Spinner
from game_utils.auth_decorators import user_type_redirect
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from zuser.models import Agent, Cashier
from game_utils.time_file import (
    get_date_selection,
    get_local_time_date,
    get_local_time_now,
    get_local_time_yesterday
)

logger = logging.getLogger(__name__)

@method_decorator(user_type_redirect, name='dispatch')
class CashierView(View):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.common_context = {'app_name': 'BettingApp'}
        self.template_name = 'cashierapp/index.html'
        self.numbers_list = list(range(1, 81))


    #@method_decorator(login_required)  # Ensure user is logged in
    def get(self, request, *args, **kwargs):
        request_type = request.GET.get('type')
        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
        agent = cashier.agent
        keno_odd_type = agent.keno_odd_type

        if request_type == 'printBalance':
            return self.report_print(request)
        elif request_type == 'ticket_history':
            return self.ticket_history(request)
        elif request_type == 'cancel_ticket':
            return self.cancel_ticket(request)
        context = {
            'numbers_list': self.numbers_list,
            'cashier': cashier.cashier,
            'keno_odd_type': keno_odd_type,
        }
        return render(request, self.template_name, context)

    #@method_decorator(login_required)  # Ensure user is logged in
    def post(self, request, *args, **kwargs):
        content_type = request.headers.get('Content-Type')
        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
        if 'application/json' in content_type:
            json_data = json.loads(request.body)
            action = json_data.get('action')
            if action == 'place_bet':
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
                result = {'status': 'error', 'message': 'Invalid action'}
                return JsonResponse(result, status=400)
        else:
            result = {'status': 'error', 'message': 'Unsupported content type'}
            return JsonResponse(result, status=400)

    def place_bet(self, json_data, cashier):
        latest_game = Game.objects.latest_keno_open()
        print('am placing bet')
        if not latest_game:
            print('--but no latest game')
            return JsonResponse({'status': 'error', 'message': 'please wait a moment, game is not created'})
        else:
            print('--found latest game')
            current_time = get_local_time_now()
            latest_game_created_at = timezone.localtime(latest_game.created_at)
            time_difference = current_time - latest_game_created_at
           # print(f'time_difference {time_difference}')
           # print(f'latest_game_created_at {latest_game_created_at}')

            if not time_difference.total_seconds() < 225:
                time.sleep(5)
                print('-- time is up')
                return JsonResponse({'status': 'error', 'message': 'time is up'})
            else:
                print('-- can bet')
                input_type = json_data.get('input_type')
                _selection = SaveSelection()
                if input_type == "single":
                    r = _selection.add_single_ticket(json_data, cashier)
                elif input_type == "multiple":
                    r = _selection.add_multiple_tickets(json_data, cashier)
                return JsonResponse(r)

    def cancel_ticket(self, request):
        code = request.GET.get('code')
        tickets = Ticket.objects.filter(unique_identifier=code)
        result = {}  # Initialize result dictionary

        if tickets.exists():  # Check if there are any tickets with the given code
            if tickets.count() > 1:
                for ticket in tickets:  # Iterate over each ticket in the queryset
                    game_result = ticket.check_for_result(ticket._game.game_num)
                    if not ticket.redeemed and game_result is None:
                        on_date = ticket.created_at.strftime('%Y-%m-%d')
                        ticket.cancelled = True
                        ticket.save()
                        result = {
                            'status': 200,
                            'message': 'Ticket Cancelled successfully',
                            'by': request.user.username,
                            'on': on_date,
                            'code': code
                        }
                    elif ticket.redeemed:
                        result = {'status': 304, 'message': 'Ticket is already cancelled'}
                    else:
                        result = {'status': 404, 'message': 'Ticket is not found'}
            else:
                # If only one ticket is found, directly operate on it
                ticket = tickets.first()
                game_result = ticket.check_for_result(ticket._game.game_num)
                if not ticket.redeemed and game_result is None:
                    on_date = ticket.created_at.strftime('%Y-%m-%d')
                    ticket.cancelled = True
                    ticket.save()
                    result = {
                        'status': 200,
                        'message': 'Ticket Cancelled successfully',
                        'by': request.user.username,
                        'on': on_date,
                        'code': code
                    }
                elif ticket.redeemed:
                    result = {'status': 304, 'message': 'Ticket is already cancelled'}
                else:
                    result = {'status': 404, 'message': 'Ticket is not found'}
        else:
            result = {'status': 404, 'message': 'Ticket is not found'}

        return JsonResponse(result)

    def redeem_ticket(self, request, json_data):
        code = int(json_data.get('code'))
        ticket = Ticket.objects.filter(unique_identifier=code)
        print(f'redeem {code} {request.user.username}')
        if ticket.count() > 1:
            for t in ticket:
                if t.redeemed == False and t.won_amount > 0:
                    try:
                        t.redeemed = True
                        t.save()
                        result = {
                            'status': 200,
                            'message': 'Ticket redeemed successfully',
                            'by': t.cashier_by,
                            'on': get_local_time_now(),
                            'amount': t.won_amount
                        }
                    except Exception as e:
                        result = {
                            'status': 500,
                            'message': f'Failed to redeem ticket: {str(e)}'
                        }
                elif t.redeemed == True:
                    result = {'status': 304, 'message': 'Ticket is already redeemed'}
                else:
                    result = {'status': 404, 'message': 'Ticket is not found'}
        else:
            # print('ticket.cashier_by.cashier.username' + ticket.cashier_by.cashier.username)
            ticket = ticket.first()
            if ticket.redeemed == False and ticket.won_amount > 0:
                try:
                    ticket.redeemed = True
                    ticket.save()
                    result = {
                        'status': 200,
                        'message': 'Ticket redeemed successfully',
                        'by': request.user.username,
                        'on': get_local_time_now(),
                        'amount': ticket.won_amount
                    }
                except Exception as e:
                    result = {
                        'status': 500,
                        'message': f'Failed to redeem ticket: {str(e)}'
                    }
            elif ticket.redeemed == True:
                result = {'status': 304, 'message': 'Ticket is already redeemed'}
            else:
                result = {'status': 404, 'message': 'Ticket is not found'}
        return JsonResponse(result)

    def balance_report(self, request):
        day = request.GET.get('day', 'today')  # 'today' will be default if day parameter is not provided

        cashier = Cashier.objects.get(cashier=request.user)
        data = get_ticket_data(cashier)
        return JsonResponse(data)

    def report_print(self, request):
        day = request.GET.get('day', 'today')  # 'today' will be default if day parameter is not provided
       # print(f'day {day}')

        cashier = Cashier.objects.get(cashier=request.user)
        data = get_ticket_print_data(cashier, day, request.user.username)
        return JsonResponse(data)

    def scanned_barcode(self, request, json_data):
        code = json_data.get('ticket_id')
        ticket = Ticket.objects.filter(unique_identifier=code).first()
       # print(f'scanned {code}')

        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
        cashier = cashier.cashier.username
        if ticket is None:
            msg = 'Ticket not found'
            return JsonResponse({'error': msg}, status=404)
        data = ticket.to_data_structure(cashier)
        return JsonResponse(data, safe=False)

    def get_result(self, request, json_data):
        date_of_creation = json_data.get('time')
        game_num = json_data.get('game_id')
        cashier = Cashier.objects.get(cashier=request.user)
        agent = cashier.agent

        response = Game.objects.get_result(game_num, date_of_creation, agent)
        return JsonResponse(response)


    def ticket_history(self, request):
        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
       # print(cashier)
        response_data = Ticket.objects.last_100_selections(cashier)
        return JsonResponse(response_data, safe=False)

@method_decorator(user_type_redirect, name='dispatch')
class CashierDashboard(View):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.common_context = {'app_name': 'BettingApp'}
        self.template_name = 'cashierapp/dashboard_index.html'
        self.enable_feature_x = True
        self.default_filter = {'status': 'active'}
        self.numbers_list = list(range(1, 81))

    def get(self, request, *args, **kwargs):
        request_type = request.GET.get('type')
        # r = run_result()
        # print(r)
        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
        agent = cashier.agent
        all_cahiers = Cashier.objects.filter(agent=agent)
        initial_data = get_initial_data(agent)
        ticket_statistics = get_ticket_statistics(all_cahiers, start_date=None, end_date=None)
        keno_odd_type = agent.keno_odd_type
        cashiers_summary = get_cashiers_summary(agent)
       # print('get')
        if request_type == 'printBalance':
            print('get inside')
            day = request.GET.get('day', 'today')  # 'today' will be default if day parameter is not provided
            print(f'day {day}')
            if day == 'today':
                date = get_local_time_date()
            elif day == 'yesterday':
                date = get_local_time_yesterday()
            else:
                date = day
                # query by date
            data = {
                "agent": agent,
                "cashier":cashier,
                "date":date,
                # "betCount":betCount,
                # "payin":payin,
                # "payout":payout,
                # "canceled":canceled,
                # "net":net
            }

            return JsonResponse(data)
        elif request_type == 'ticket_history':
            response_data = Ticket.objects.last_100_selections()
            return JsonResponse(response_data, safe=False)
        context = {
            'numbers_list': self.numbers_list,
            'keno_odd_type': keno_odd_type,
            'cashier': cashier.cashier,
            'all_cashiers':all_cahiers,
            "agent": agent,
            'initial_data': initial_data,
            'ticket_statistics': ticket_statistics,
            'cashiers_summary': cashiers_summary,
        }
        # game_instance_tasks.delay()

        return render(request, self.template_name, context)

def get_ticket_statistics(all_cahiers, start_date=None, end_date=None):
    today_start = get_local_time_now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    start = start_date if start_date is not None else today_start
    end = end_date if end_date is not None else today_end

    statistics = []

    for cashier in all_cahiers:
        tickets = Ticket.objects.filter(cashier_by=cashier, created_at__range=(start, end))

        total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
        total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0

        claimed_tickets = tickets.filter(redeemed=True)
        claimed_count = claimed_tickets.count()
        claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

        unclaimed_tickets = tickets.filter(redeemed=False)
        unclaimed_count = unclaimed_tickets.count()
        unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

        cancelled_tickets = tickets.filter(cancelled=True)
        cancelled_count = cancelled_tickets.count()
        cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

        ggr = total_stake - total_won - cancelled_stake_amount
        net = total_stake - total_won - cancelled_stake_amount + unclaimed_winning_amount

        statistics.append({
            'cashier': cashier,
            'start_date': start,
            'end_date': end,

            'net': net,
            'ggr': ggr,

            'tickets': tickets.count(),
            'gross_stake': total_stake,

            'claimed_count': claimed_count,
            'claimed_winning': claimed_winning_amount,

            'unclaimed_count': unclaimed_count,
            'unclaimed_winning': unclaimed_winning_amount,

            'cancelled_count': cancelled_count,
            'cancelled_stake': cancelled_stake_amount,
        })

    return statistics

def get_all_ticket_statistics(all_cahiers, start_date=None, end_date=None):
    today_start = get_local_time_now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    start = start_date if start_date is not None else today_start
    end = end_date if end_date is not None else today_end

    statistics = []

    for cashier in all_cahiers:
        tickets = Ticket.objects.filter(cashier_by=cashier, created_at__range=(start, end))

        total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
        total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0

        claimed_tickets = tickets.filter(redeemed=True)
        claimed_count = claimed_tickets.count()
        claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

        unclaimed_tickets = tickets.filter(redeemed=False)
        unclaimed_count = unclaimed_tickets.count()
        unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

        cancelled_tickets = tickets.filter(cancelled=True)
        cancelled_count = cancelled_tickets.count()
        cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

        net = total_stake - total_won - cancelled_stake_amount
        ggr = net - unclaimed_winning_amount

        statistics.append({
            'cashier': cashier,
            'start_date': start,
            'end_date': end,

            'net': net,
            'ggr': ggr,

            'tickets': tickets.count(),
            'gross_stake': total_stake,

            'claimed_count': claimed_count,
            'claimed_winning': claimed_winning_amount,

            'unclaimed_count': unclaimed_count,
            'unclaimed_winning': unclaimed_winning_amount,

            'cancelled_count': cancelled_count,
            'cancelled_stake': cancelled_stake_amount,
        })

    return statistics

def get_cashiers_summary(agent, date=None):
    # Get today's date
    today = get_local_time_date()

    # Calculate start and end dates for yesterday, today, and the past week
    yesterday = today - timedelta(days=1)
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    # Calculate start date for the past week
    start_of_past_week = start_of_week - timedelta(weeks=1)

    # Calculate daily, weekly, and yesterday statistics
    daily_stats = calculate_statistics(agent, today, today)
    weekly_stats = calculate_statistics(agent, start_of_week, end_of_week)
    yesterday_stats = calculate_statistics(agent, yesterday, yesterday)

    return {
        'daily_stats': daily_stats,
        'weekly_stats': weekly_stats,
        'yesterday_stats': yesterday_stats,
    }

def calculate_statistics(agent, start_date, end_date):
    tickets = Ticket.objects.filter(cashier_by__agent=agent, created_at__date__range=[start_date, end_date])

    total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
    total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0

    claimed_tickets = tickets.filter(redeemed=True)
    claimed_count = claimed_tickets.count()
    claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

    unclaimed_tickets = tickets.filter(redeemed=False)
    unclaimed_count = unclaimed_tickets.count()
    unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

    cancelled_tickets = tickets.filter(cancelled=True)
    cancelled_count = cancelled_tickets.count()
    cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

    # net = total_stake - total_won - cancelled_stake_amount
    # ggr = net - unclaimed_winning_amount
    ggr = total_stake - total_won - cancelled_stake_amount
    net = total_stake - total_won - cancelled_stake_amount + unclaimed_winning_amount

    return {
        'start_date': start_date,
        'end_date': end_date,

        'net': net,
        'ggr': ggr,

        'tickets': tickets.count(),
        'gross_stake': total_stake,

        'claimed_count': claimed_count,
        'claimed_winning': claimed_winning_amount,

        'unclaimed_count': unclaimed_count,
        'unclaimed_winning': unclaimed_winning_amount,

        'cancelled_count': cancelled_count,
        'cancelled_stake': cancelled_stake_amount,
    }

def cashier_tickets_statistics_view(request):
    selected_date = request.GET.get('selectedDate')
    from_date = request.GET.get('fromDate')
    to_date = request.GET.get('toDate')
    selected_cashiers = request.GET.getlist('selectCashiers[]')
    custom_user = request.user
    cashier = get_object_or_404(Cashier, cashier=custom_user)
    agent = cashier.agent
    all_cashiers = Cashier.objects.filter(cashier__id__in=selected_cashiers)
    serialized_statistics = serialize_statistics(all_cashiers, selected_date, from_date, to_date)
    return JsonResponse({'ticket_statistics': serialized_statistics})

def serialize_statistics(all_cashiers, selected_date, from_date, to_date):
    start_date, end_date, start_date_str, end_date_str = get_date_selection(selected_date, from_date, to_date)

    statistics = []
    for cashier in all_cashiers:
        tickets = Ticket.objects.filter(cashier_by=cashier)
        if start_date and end_date:
            tickets = tickets.filter(created_at__range=(start_date, end_date))
        elif start_date:
            tickets = tickets.filter(created_at__date=start_date)
        elif end_date:
            tickets = tickets.filter(created_at__date=end_date)
        else:
            tickets = tickets.filter(created_at__date=timezone.localdate())

        total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
        total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0

        claimed_tickets = tickets.filter(redeemed=True)
        claimed_count = claimed_tickets.count()
        claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

        unclaimed_tickets = tickets.filter(redeemed=False)
        # unclaimed_count = unclaimed_tickets.count()
        unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

        cancelled_tickets = tickets.filter(cancelled=True)
        cancelled_count = cancelled_tickets.count()
        cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

        net = total_stake - total_won - cancelled_stake_amount
        ggr = net - unclaimed_winning_amount

        unclaimed_count = tickets.filter(redeemed=False, won_amount__gt=0).count()
        statistics.append({
            'cashier': cashier.cashier.username,
            'start_date': start_date_str,
            'end_date': end_date_str,

            'net': net,
            'ggr': ggr,

            'tickets': tickets.count(),
            'gross_stake': total_stake,

            'claimed_count': claimed_count,
            'claimed_winning': claimed_winning_amount,

            'unclaimed_count': unclaimed_count,
            'unclaimed_winning': unclaimed_winning_amount,

            'cancelled_count': cancelled_count,
            'cancelled_stake': cancelled_stake_amount,
        })
    return statistics

def cashier_tickets_view(request):
    selected_date = request.GET.get('selectedDate')
    from_date = None
    to_date = None
    selected_cashiers = request.GET.get('selectCashiers')
    custom_user = request.user
    cashier = get_object_or_404(Cashier, cashier=custom_user)
    agent = cashier.agent
    cashier = Cashier.objects.get(cashier__id=selected_cashiers)
    serialized_statistics = serialize_tickets(cashier, selected_date, from_date, to_date)
    return JsonResponse({'ticket_property': serialized_statistics})

def serialize_tickets(cashier, selected_date, from_date, to_date):
    start_date, end_date, start_date_str, end_date_str = get_date_selection(selected_date, from_date, to_date)

    statistics = []
    tickets = Ticket.objects.filter(cashier_by=cashier)
    if start_date and end_date:
        tickets = tickets.filter(created_at__range=(start_date, end_date))
    elif start_date:
        tickets = tickets.filter(created_at__date=start_date)
    elif end_date:
        tickets = tickets.filter(created_at__date=end_date)
    else:
        tickets = tickets.filter(created_at__date=timezone.localdate())

    for ticket in tickets:
        statistics.append({
            'ticket':ticket.get_choice_list(),
            'gross_stake': ticket.stake,
            'status': ticket.get_status_dashboard(),
            'won_amount': ticket.won_amount,
            'ticket_number': ticket.unique_identifier,
            'game_type': ticket._game.game_type,
            'game_number': ticket._game.game_num,

            'cashier': cashier.cashier.username,
            'start_date': start_date_str,
            'end_date': end_date_str,

        })
   # print('statistics')
   # print(statistics)
    return statistics

def _single_date(date_str):
    if date_str:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    return timezone.localdate()

@require_GET
def game_result_stats_view(request):
    try:
        custom_user = request.user
        cashier = get_object_or_404(Cashier, cashier=custom_user)
        agent = cashier.agent
        getdate = request.GET.get('getDate')
        game_num = request.GET.get('game_num')

        # Input validation
        if not getdate:
            return JsonResponse({'error': 'Missing getDate parameter'}, status=400)
        if not game_num:
            return JsonResponse({'error': 'Missing game_num parameter'}, status=400)

        _date = _single_date(getdate)
        agent = get_object_or_404(Agent, pk=agent.pk)

        # Debugging information
        # print(f'Agent: {agent}, Date: {_date}, Game Number: {game_num}')

        # Make _date timezone-aware
        _datetime = timezone.make_aware(datetime.combine(_date, datetime.min.time()))

        # Check if the game exists
        if not Game.objects.filter(status='CLOSED', created_at__date=_date, game_num=game_num).exists():
            # print(f'Game with game_num {game_num} on date {_date} not found.')
            return JsonResponse({'game_results': '[]'}, status=404)

        # Retrieve the game object
        game = Game.objects.get(status='CLOSED', created_at__date=_date, game_num=game_num)

        # Serialize results
        serialized_results = serialize_results(game, agent)

        # Debugging information
        # print(f'Game: {game}, Serialized Results: {serialized_results}')

        return JsonResponse({'game_results': serialized_results})
    except Game.DoesNotExist:
        print(f'Game with game_num {game_num} on date {_date} not found.')
        return JsonResponse({'game_results': '[]'}, status=404)
    except Exception as e:
        print(f'Error: {e}')
        return JsonResponse({'error': str(e)}, status=500)

def serialize_results(game, agent):
    return {

        'shop': agent.full_name,
        'game_id': game.game_num,
        'action': game.status,
        'result': GameResult.objects.filter_by_game_and_agent(game, agent)
    }

