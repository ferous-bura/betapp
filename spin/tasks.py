from spin.models import Spin
from .task_utils import (
    create_game_instance,
    create_game_result
)

def update_spin_game():
    latest_game = Spin.objects.non_result_game()
    if latest_game:
        create_game_result(latest_game)
        create_game_instance(latest_game)
    else:
        latest_game = Spin.objects.latest_spin_open()
        if latest_game != None:
            create_game_result(latest_game)
            create_game_instance(latest_game)
        else:
            create_game_instance()
    return "Task Game Complete"


def run_me(many_times):
    for i in range(1, many_times):
        update_spin_game()