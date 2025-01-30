import os
import django

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')

# Set up Django
django.setup()
import time
from spin.models import Spin
from spin.algorithm.main import SpinAlgorithm
from spin.utils.spin_creator_ import Spinner

def spin_result(latest_game=None):

    latest_game = Spin.objects.latest_keno_open()
    if latest_game:
        print('init result')
        start_time = time.time()
        spin_result = SpinAlgorithm(game_instance=latest_game)
        result = spin_result.main()
        end_time = time.time()

        game_num = latest_game.game_num
        game_num += 1
        game_instance = Spin.objects.create(game_num=game_num)
        end_time = time.time()
        elapsed_time = end_time - start_time

        start_time_tickets = time.time()
        create_spin()
        end_time = time.time()
        elapsed_time = end_time - start_time_tickets
        # print(f'Time: {elapsed_time} seconds taken for creating tickets ')
    else:
        latest_game = Spin.objects.create(game_num=5010)
        start_time = time.time()
        spin_result = SpinAlgorithm(game_instance=latest_game)
        result = spin_result.main()
        end_time = time.time()
        elapsed_time = end_time - start_time
        # print(f'Time: {elapsed_time} seconds taken for result: {result} ')

        start_time_game = time.time()
        game_num = latest_game.game_num
        game_num += 1
        game_instance = Spin.objects.create(game_num=game_num)
        end_time = time.time()
        elapsed_time = end_time - start_time_game
        # print(f'Time: {elapsed_time} seconds taken for creating game instance: {game_instance.game_num} ')
        start_time_tickets = time.time()
        create_spin()
        end_time = time.time()
        elapsed_time = end_time - start_time_tickets
        # print(f'Time: {elapsed_time} seconds taken for creating tickets ')

def create_spin():
    start_time = time.time()  # Record the start time
    spinner = Spinner()
    create_spinner = spinner.create_and_save_combinations()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    # print(f'Time taken for game: {elapsed_time} seconds')

spin_result()
# for i in range(1,23):
#     run_result()
# comp()
