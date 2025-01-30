from django.utils import timezone
from datetime import datetime, timedelta

def game_start_on():
    start_time = get_local_time_now() - calculate_schedule()
    return start_time

def calculate_schedule():
    now = datetime.now()
    seconds_until_next_run = (240 - ((now.second + 60 * now.minute) % 240))
    return timedelta(seconds=seconds_until_next_run)

def get_local_time_yesterday():
    today = timezone.localtime(timezone.now()).date()
    yesterday = today - timedelta(days=1)
    print(f'yesterday {yesterday}')
    return yesterday

def get_local_time_date():
    return timezone.localtime(timezone.now()).date()

def get_local_time_now():
    return timezone.localtime(timezone.now())

def single_date(date):
    if date:
        _date = timezone.make_aware(timezone.datetime.strptime(date, '%Y-%m-%d'))
    else:
        _date = timezone.localdate()
    date_str = _date.strftime('%Y-%m-%d') if _date else None
    return date_str

def get_date_selection(selected_date, from_date, to_date):
    start_date = None
    end_date = None
    
    if not selected_date:
        if from_date:
            start_date = timezone.make_aware(timezone.datetime.strptime(from_date, '%Y-%m-%d'))
        if to_date:
            end_date = timezone.make_aware(timezone.datetime.strptime(to_date, '%Y-%m-%d'))
    else:
        if selected_date == 'today':
            start_date = timezone.localdate()
            end_date = start_date + timedelta(days=1)
        # elif selected_date == 'yesterday':
        #     start_date = timezone.localdate() - timedelta(days=1)
        #     end_date = timezone.localdate()

        elif selected_date == 'yesterday':
            end_date = get_local_time_date()  # Set end_date to the current date (inclusive)
            start_date = end_date - timedelta(days=1)  # Set start_date to the day before end_date
            # start_date = get_local_time_date()
            # end_date = start_date - timedelta(days=1)

        elif selected_date == 'this_week':
            # Calculate the start of the week (Monday)
            start_of_week = timezone.localdate() - timedelta(days=timezone.localdate().weekday())
            # Calculate the end of the week (Sunday)
            end_of_week = start_of_week + timedelta(days=6)
            
            start_date = start_of_week
            end_date = end_of_week + timedelta(days=1)  # Add one day to include the entire end day

        elif selected_date == 'last_week':
            # Calculate the start of last week
            start_of_last_week = timezone.localdate() - timedelta(weeks=1, days=timezone.localdate().weekday())
            # Calculate the end of last week
            end_of_last_week = start_of_last_week + timedelta(days=6)
            
            start_date = start_of_last_week
            end_date = end_of_last_week + timedelta(days=1)  # Add one day to include the entire end day

        elif selected_date == 'this_month':
            # Calculate the start of the current month
            start_of_month = timezone.localdate().replace(day=1)
            # Calculate the start of the next month
            next_month = start_of_month.replace(month=start_of_month.month + 1)
            # Determine the end of the current month
            end_of_month = next_month if next_month.year == start_of_month.year else start_of_month - timedelta(days=1)
            
            start_date = start_of_month
            end_date = end_of_month + timedelta(days=1)  # Add one day to include the entire end day

        elif selected_date == 'last_month':
            # Calculate the start of last month
            start_of_last_month = timezone.localdate().replace(day=1) - timedelta(days=1)
            start_of_last_month = start_of_last_month.replace(day=1)
            # Calculate the end of last month
            end_of_last_month = timezone.localdate().replace(day=1) - timedelta(days=1)
            
            start_date = start_of_last_month
            end_date = end_of_last_month + timedelta(days=1)  # Add one day to include the entire end day

        elif selected_date == 'this_year':
            # Calculate the start of the current year
            start_of_year = timezone.localdate().replace(month=1, day=1)
            # Calculate the end of the current year
            end_of_year = timezone.localdate().replace(month=12, day=31)
            
            start_date = start_of_year
            end_date = end_of_year + timedelta(days=1)  # Add one day to include the entire end day

        # Ensure start_date and end_date are datetime.datetime objects
        start_date = timezone.make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = timezone.make_aware(datetime.combine(end_date, datetime.max.time()))
    start_date_str = start_date.strftime('%Y-%m-%d') if start_date else None
    end_date_str = end_date.strftime('%Y-%m-%d') if end_date else None

    return start_date,end_date,start_date_str,end_date_str
