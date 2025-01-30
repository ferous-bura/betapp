from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from keno.tasks import keno_update_tasks
from spin.tasks import update_spin_game

scheduler = BackgroundScheduler()


def start():
    scheduler.start()


def stop():
    scheduler.shutdown()


def schedule_spin():
    update_spin_game()


def schedule_keno():
    keno_update_tasks()

scheduler.add_job(
    schedule_keno,
    trigger=CronTrigger(minute='*/4'),  # Run every 4 minutes
    id='schedule_game_instance_task',
    name='Run keno creation Task every 4 minutes',
    replace_existing=True,
)

scheduler.add_job(
    schedule_spin,
    trigger=CronTrigger(minute='*/4'),  # Run every 4 minutes
    id='schedule_spin',
    name='Run Spin creation Task every 4 minutes',
    replace_existing=True,
)
