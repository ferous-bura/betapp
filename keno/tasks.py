# from celery import shared_task

from keno.models import Game
from .task_utils import (
    create_game_instance,
    create_game_result
)

# @shared_task
def keno_update_tasks():
    latest_game = Game.objects.non_result_game()
    if latest_game:
        create_game_result(latest_game)
        create_game_instance(latest_game)
    else:
        latest_game = Game.objects.latest_keno_open()
        if latest_game != None:
            create_game_result(latest_game)
            create_game_instance(latest_game)
        else:
            create_game_instance()
    return "Task Game Complete"
