from keno.models import Game, Ticket
from game_utils.time_file import get_date_selection, get_local_time_date
from django.utils import timezone
from django.db.models import Count, Sum
from datetime import timedelta
from django.db.models.functions import TruncMinute
from collections import defaultdict

def zticket_statistics_area():
    # Get current date and time
    now = timezone.now()

    # Define start and end of the current day
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
    
    # Get the last 20 games
    last_20_games = Game.objects.filter(created_at__range=(start_of_day, end_of_day)) \
        .order_by('-created_at')[:20]

    # Construct a dictionary to store ticket statistics for each game
    game_ticket_stats = defaultdict(list)

    # Iterate over the last 20 games
    for game in last_20_games:
        # Get the tickets for the current game
        ticket_stats = Ticket.objects.filter(_game_id=game.id) \
            .annotate(minute=TruncMinute('created_at')) \
            .values('minute') \
            .annotate(total_tickets=Count('id'),
                      total_stake=Sum('stake'),
                      total_won=Sum('won_amount')) \
            .order_by('minute')

        # Store the ticket statistics for the current game
        game_ticket_stats[game.id] = list(ticket_stats)
    for game_id, ticket_stats in game_ticket_stats.items():
        for stats in ticket_stats:
            stats['minute'] = stats['minute'].isoformat()
    # Pass data to the template or return as JSON response
    return {
        'game_ticket_stats': dict(game_ticket_stats),  # Convert defaultdict to dict
    }

def ticket_statistics_area():
    # Get current date and time
    now = timezone.now()

    # Define start and end of the current day
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
    # Get the last 20 games
    last_20_games = Game.objects.filter(created_at__range=(start_of_day, end_of_day)) \
        .order_by('-created_at')[:20]

    # Get the IDs of the last 20 games
    last_20_game_ids = last_20_games.values_list('id', flat=True)

    # Get the tickets for the last 20 games
    # ticket_stats = Ticket.objects.filter(created_at__range=(start_of_day, end_of_day)) \
    ticket_stats = Ticket.objects.filter(_game_id__in=last_20_game_ids) \
        .annotate(minute=TruncMinute('created_at')) \
        .values('minute') \
        .annotate(total_tickets=Count('id'),
                total_stake=Sum('stake'),
                total_won=Sum('won_amount')) \
        .order_by('minute')
    net_balance_data = [stats['total_stake'] - stats['total_won'] for stats in ticket_stats]

    # Format data for Chart.js
    labels = [f"{stats['minute'].strftime('%H:%M')}" for stats in ticket_stats]  # Labels for each hour
    total_tickets_data = [stats['total_tickets'] for stats in ticket_stats]
    total_stake_data = [stats['total_stake'] for stats in ticket_stats]
    total_won_data = [stats['total_won'] for stats in ticket_stats]

    # Pass data to the template or return as JSON response
    print(f'total_tickets_data {total_tickets_data}, total_stake_data {total_stake_data}, total_won_data {total_won_data}')
    return {
        'labels': labels,
        'total_tickets_data': total_tickets_data,
        'total_stake_data': total_stake_data,
        'total_won_data': total_won_data,
        'net_balance_data': net_balance_data,
    }


def get_total_statistics(statistics):
    total_net = sum(statistic['net'] for statistic in statistics)
    total_tickets = sum(statistic['tickets'] for statistic in statistics)
    total_claimed_winning = sum(statistic['claimed_winning'] for statistic in statistics)
    total_gross_stake = sum(statistic['gross_stake'] for statistic in statistics)

    return {
        'total_net': total_net,
        'total_tickets': total_tickets,
        'total_claimed_winning': total_claimed_winning,
        'total_gross_stake': total_gross_stake,
    }

def get_statistics(all_agents, selected_date, from_date, to_date):
    start_date, end_date, start_date_str, end_date_str = get_date_selection(selected_date, from_date, to_date)

    statistics = []
    for agent in all_agents:
        tickets = Ticket.objects.filter(cashier_by__agent=agent)
        
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
        unclaimed_count = unclaimed_tickets.count()
        unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

        cancelled_tickets = tickets.filter(cancelled=True)
        cancelled_count = cancelled_tickets.count()
        cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

        net = total_stake - total_won - cancelled_stake_amount
        ggr = net - unclaimed_winning_amount

        statistics.append({
            'agent_id': agent.id,
            'agent': agent.full_name,
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

def get_agents_summary(company):
    today = get_local_time_date()
    yesterday = today - timedelta(days=1)
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    daily_stats = calculate_daily_statistics(company, today)
    print(f'daily {daily_stats}')
    weekly_stats = calculate_weekly_stat(company, start_of_week, end_of_week)
    yesterday_stats = calculate_yesterday_stat(company, yesterday, yesterday)

    return {
        'daily_stats': daily_stats,
        'weekly_stats': weekly_stats,
        'yesterday_stats': yesterday_stats,
    }

def calculate_yesterday_stat(company, start_date, end_date):
    tickets = Ticket.objects.filter(cashier_by__agent__company=company, created_at__date__range=[start_date, end_date])
    total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
    total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0
    cancelled_tickets = tickets.filter(cancelled=True)
    cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0
    net = total_stake - total_won - cancelled_stake_amount
    return {
        'net': net,
    }

def calculate_weekly_stat(company, start_date, end_date):
    tickets = Ticket.objects.filter(cashier_by__agent__company=company, created_at__date__range=[start_date, end_date])
    total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
    total_won = tickets.filter(cancelled=False).aggregate(total_won=Sum('won_amount'))['total_won'] or 0
    cancelled_tickets = tickets.filter(cancelled=True)
    cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0
    net = total_stake - total_won - cancelled_stake_amount
    return {
        'net': net,
    }


def calculate_daily_statistics(company, date):
    tickets = Ticket.objects.filter(cashier_by__agent__company=company, created_at__date=date)

    cancelled_tickets = tickets.filter(cancelled=True)
    cancelled_count = cancelled_tickets.count()
    cancelled_stake_amount = cancelled_tickets.aggregate(cancelled_stake_amount=Sum('stake'))['cancelled_stake_amount'] or 0

    tickets = tickets.filter(cancelled=False)

    total_stake = tickets.aggregate(total_stake=Sum('stake'))['total_stake'] or 0
    total_won = tickets.aggregate(total_won=Sum('won_amount'))['total_won'] or 0

    claimed_tickets = tickets.filter(redeemed=True)
    claimed_count = claimed_tickets.count()
    claimed_winning_amount = claimed_tickets.aggregate(claimed_winning_amount=Sum('won_amount'))['claimed_winning_amount'] or 0

    unclaimed_tickets = tickets.filter(redeemed=False, won_amount__gte=1)
    unclaimed_count = unclaimed_tickets.count()
    unclaimed_winning_amount = unclaimed_tickets.aggregate(unclaimed_winning_amount=Sum('won_amount'))['unclaimed_winning_amount'] or 0

    net = total_stake - total_won - cancelled_stake_amount
    ggr = net - unclaimed_winning_amount
    tot_stake = total_stake if total_stake > 0 else 1
    net_perc = truncate_decimal((net / tot_stake) * 100)
    total_won_perc = truncate_decimal((claimed_winning_amount / tot_stake) * 100)

    return {
        'start_date': date,
        'end_date': date,

        'net': net,
        'ggr': ggr,

        'net_perc': net_perc,
        'total_won_perc': total_won_perc,

        'tickets': tickets.count(),
        'gross_stake': total_stake,

        'claimed_count': claimed_count,
        'claimed_winning': claimed_winning_amount,

        'unclaimed_count': unclaimed_count,
        'unclaimed_winning': unclaimed_winning_amount,

        'cancelled_count': cancelled_count,
        'cancelled_stake': cancelled_stake_amount,
    }

def truncate_decimal(number):
    return round(number, 1)

def calculate_statistics_2nd(company, start_date, end_date):
    tickets = Ticket.objects.filter(cashier_by__agent__company=company, created_at__date__range=[start_date, end_date])

    # Extract stake and won_amount lists
    stakes = list(tickets.values_list('stake', flat=True))
    won_amounts = list(tickets.filter(cancelled=False).values_list('won_amount', flat=True))

    # Calculate total stake and total won
    total_stake = sum(stakes)
    total_won = sum(won_amounts)

    # Calculate claimed tickets and their winning amounts
    claimed_tickets = tickets.filter(redeemed=True)
    claimed_winning_amount = claimed_tickets.aggregate(total_claimed_winning=Sum('won_amount'))['total_claimed_winning'] or 0

    # Calculate unclaimed tickets and their winning amounts
    unclaimed_tickets = tickets.filter(redeemed=False, won_amount__gte=1)
    unclaimed_winning_amount = unclaimed_tickets.aggregate(total_unclaimed_winning=Sum('won_amount'))['total_unclaimed_winning'] or 0

    # Calculate cancelled tickets and their stake amounts
    cancelled_tickets = tickets.filter(cancelled=True)
    cancelled_stake_amount = cancelled_tickets.aggregate(total_cancelled_stake=Sum('stake'))['total_cancelled_stake'] or 0

    # Calculate net and GGR
    net = total_stake - total_won - cancelled_stake_amount
    ggr = net - unclaimed_winning_amount

    return {
        'start_date': start_date,
        'end_date': end_date,
        'net': net,
        'ggr': ggr,
        'tickets': tickets.count(),
        'gross_stake': total_stake,
        'claimed_count': claimed_tickets.count(),
        'claimed_winning': claimed_winning_amount,
        'unclaimed_count': unclaimed_tickets.count(),
        'unclaimed_winning': unclaimed_winning_amount,
        'cancelled_count': cancelled_tickets.count(),
        'cancelled_stake': cancelled_stake_amount,
    }
