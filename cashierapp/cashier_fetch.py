from datetime import timedelta
from django.db.models import Q, Sum

from keno.models import Ticket
from spin.models import SpinTicket
from game_utils.time_file import get_local_time_date, get_local_time_now, get_local_time_yesterday, single_date

now = get_local_time_now()
today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
today_end = today_start + timedelta(days=1)
yesterday_start = today_start - timedelta(days=1)
yesterday_end = today_start

def get_ticket_data(cashier):
    today = get_local_time_date()
    yesterday = today - timedelta(days=1)

    # Query today's Ticket data
    today_ticket_data = Ticket.objects.filter(
        cashier_by=cashier,
        created_at__date=today
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Query yesterday's Ticket data
    yesterday_ticket_data = Ticket.objects.filter(
        cashier_by=cashier,
        created_at__date=yesterday
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Query today's SpinTicket data
    today_spin_data = SpinTicket.objects.filter(
        cashier_by=cashier,
        created_at__date=today
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Query yesterday's SpinTicket data
    yesterday_spin_data = SpinTicket.objects.filter(
        cashier_by=cashier,
        created_at__date=yesterday
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Helper function to set default values
    def get_default(data, key):
        return 0 if data[key] is None else data[key]

    # Combine today's data
    today_bets = get_default(today_ticket_data, 'bets') + get_default(today_spin_data, 'bets')
    today_redeemed = get_default(today_ticket_data, 'redeemed') + get_default(today_spin_data, 'redeemed')
    today_canceled = get_default(today_ticket_data, 'canceled') + get_default(today_spin_data, 'canceled')

    # Combine yesterday's data
    yesterday_bets = get_default(yesterday_ticket_data, 'bets') + get_default(yesterday_spin_data, 'bets')
    yesterday_redeemed = get_default(yesterday_ticket_data, 'redeemed') + get_default(yesterday_spin_data, 'redeemed')
    yesterday_canceled = get_default(yesterday_ticket_data, 'canceled') + get_default(yesterday_spin_data, 'canceled')

    # Set the deposited amount to 0
    deposited_amount = 0

    # Organize the data into the desired structure
    ticket_data = {
        "err": "false",
        "today": {
            "bets": {"amount": today_bets},
            "redeemed": {"amount": today_redeemed},
            "canceled": {"amount": today_canceled},
            "deposited": {"amount": deposited_amount}
        },
        "yesterday": {
            "bets": {"amount": yesterday_bets},
            "redeemed": {"amount": yesterday_redeemed},
            "canceled": {"amount": yesterday_canceled},
            "deposited": {"amount": deposited_amount}
        }
    }

    return ticket_data

def get_ticket_data2(cashier):
    today = get_local_time_date()
    yesterday = today - timedelta(days=1)

    # Query today's data
    today_data = Ticket.objects.filter(
        cashier_by=cashier,
        created_at__date=today
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Query yesterday's data
    yesterday_data = Ticket.objects.filter(
        cashier_by=cashier,
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

   # print(ticket_data)

    return ticket_data


def get_ticket_print_data(cashier, date, username):
    if date == 'today':
        date = get_local_time_date()
    elif date == 'yesterday':
        date = get_local_time_yesterday()
    else:
        date = single_date(date)

    t = Ticket.objects.filter(cashier_by=cashier, created_at__date=date)
    _data = t.aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    default_bets = 0 if _data['bets'] is None else _data['bets']
    default_redeemed = 0 if _data['redeemed'] is None else _data['redeemed']
    default_canceled = 0 if _data['canceled'] is None else _data['canceled']
    betCount = t.filter(cancelled=True)
    net = default_bets - default_redeemed - default_canceled
    data = {
        "agent": cashier.agent.full_name,
        "cashier":username,
        "date":date,
        "betCount":len(betCount),
        "payin":default_bets,
        "payout":default_redeemed, 
        "canceled":default_canceled,
        "net":net
    }
   # print(data)

    return data


#spin

def get_spinticket_data(cashier):
    today = get_local_time_date()
    yesterday = today - timedelta(days=1)

    # Query today's data
    today_data = SpinTicket.objects.filter(
        cashier_by=cashier,
        created_at__date=today
    ).aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    # Query yesterday's data
    yesterday_data = SpinTicket.objects.filter(
        cashier_by=cashier,
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

   # print(ticket_data)

    return ticket_data


def get_spinticket_print_data(cashier, date, username):
    if date == 'today':
        date = get_local_time_date()
    elif date == 'yesterday':
        date = get_local_time_yesterday()
    else:
        date = single_date(date)

    t = SpinTicket.objects.filter(cashier_by=cashier, created_at__date=date)
    _data = t.aggregate(
        bets=Sum('stake'),
        redeemed=Sum('won_amount', filter=Q(redeemed=True)),
        canceled=Sum('stake', filter=Q(cancelled=True)),
    )

    default_bets = 0 if _data['bets'] is None else _data['bets']
    default_redeemed = 0 if _data['redeemed'] is None else _data['redeemed']
    default_canceled = 0 if _data['canceled'] is None else _data['canceled']
    betCount = t.filter(cancelled=True)
    net = default_bets - default_redeemed - default_canceled
    data = {
        "agent": cashier.agent.full_name,
        "cashier":username,
        "date":date,
        "betCount":len(betCount),
        "payin":default_bets,
        "payout":default_redeemed, 
        "canceled":default_canceled,
        "net":net
    }
   # print(data)

    return data
