import time
from celery import shared_task

from keno.models import Game
from auto import create_tickets
from keno.task_utils import (
    create_game_instance,
    create_game_result
)

def game_instance_tasks():
    start_time = time.time()  # Record the start time
    latest_game = Game.objects.latest_keno_open()
    if latest_game != None:
        create_game_result(latest_game)
        create_game_instance(latest_game)
    else:
        create_game_instance()
    create_tickets()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for game: {elapsed_time} seconds')
    return "Task Game Complete"
