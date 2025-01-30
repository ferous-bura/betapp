from datetime import time
from django.core.exceptions import ValidationError

from keno.algorithm.main import KenoManager
from keno.algorithm.mobile_algorithm import MobileKenoManager
from game_utils.time_file import get_local_time_date, get_local_time_now
from .models import Game, MobileGame

def create_game_result(latest_game):
    try:
        keno_result = KenoManager(game_instance=latest_game)
        keno_result.main()
    except ValidationError as e:
        return None

def create_game_instance(latest_game=None):
    now = get_local_time_now()
    minutes_since_midnight = (now - now.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds() / 60
    games_since_midnight = minutes_since_midnight // 4
    game_num = 3000 + int(games_since_midnight)
    if latest_game and latest_game.game_num == game_num:
        game_num += 1
    game_instance = Game.objects.create(game_num=game_num)
    return game_instance
