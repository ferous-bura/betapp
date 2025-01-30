import time
from keno.utils.combination_creator import KenoCombination, MobileKenoCombination
from keno.algorithm.main import KenoManager
from keno.models import Game
from zuser.utils.bulk_cashiers import company_creator
# from game_utils.cprofile import log_and_profile

def company_create():
    start_time = time.time()  # Record the start time
    try:
        company = company_creator()
        if company:
            print('finished creating all companies')
        else:
            print('failed to create companies')
    except Exception as e:
        print(f'failed to create companies, reason is: {e}')
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for all company agent and cashiers to: {elapsed_time} seconds')


# to create bulk games
def bulk_create_game():
    start_time = time.time()  # Record the start time
    keno_combination = KenoCombination()
    keno_combination.create_and_save_combinations()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for game: {elapsed_time} seconds')

# @log_and_profile
def create_tickets():
    start_time = time.time()  # Record the start time
    keno_combination = KenoCombination()
    keno_combination.create_combinations_per_game()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for game: {elapsed_time} seconds')


# @log_and_profile
def run_result(latest_game=None):

    latest_game = Game.objects.latest_keno_open()
    if latest_game:
        print('init result')
        start_time = time.time()
        keno_result = KenoManager(game_instance=latest_game)
        result = keno_result.main()
        end_time = time.time()

        game_num = latest_game.game_num
        game_num += 1
        game_instance = Game.objects.create(game_num=game_num)
        end_time = time.time()
        elapsed_time = end_time - start_time

        start_time_tickets = time.time()
        create_tickets()
        end_time = time.time()
        elapsed_time = end_time - start_time_tickets
        print(f'Time: {elapsed_time} seconds taken for creating tickets ')
    else:
        latest_game = Game.objects.create(game_num=1230)
        start_time = time.time()
        keno_result = KenoManager(game_instance=latest_game)
        result = keno_result.main()
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f'Time: {elapsed_time} seconds taken for result: {result} ')

        start_time_game = time.time()
        game_num = latest_game.game_num
        game_num += 1
        game_instance = Game.objects.create(game_num=game_num)
        end_time = time.time()
        elapsed_time = end_time - start_time_game
        print(f'Time: {elapsed_time} seconds taken for creating game instance: {game_instance.game_num} ')
        start_time_tickets = time.time()
        create_tickets()
        end_time = time.time()
        elapsed_time = end_time - start_time_tickets
        print(f'Time: {elapsed_time} seconds taken for creating tickets ')

# for i in range(1,23):
#     run_result()
# comp()
