import time
from keno.algorithm.mobile_algorithm import MobileKenoManager
from keno.utils.combination_creator import KenoCombination, MobileKenoCombination
from keno.algorithm.main import KenoManager
from keno.models import MobileGame

from zuser.utils.bulk_cashiers import company_creator


def comp():
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
def bulk_create_mobilegame():
    start_time = time.time()  # Record the start time
    keno_combination = MobileKenoCombination()
    keno_combination.create_and_save_combinations()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for game: {elapsed_time} seconds')


def create_mobiletickets():
    start_time = time.time()  # Record the start time
    keno_combination = MobileKenoCombination()
    keno_combination.create_combinations_per_game()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for game: {elapsed_time} seconds')


def run_mobile_result(latest_game=None):

    latest_game = MobileGame.objects.latest_keno_open()
    if latest_game:
        print('init result')
        start_time = time.time()
        keno_result = MobileKenoManager(game_instance=latest_game)
        result = keno_result.main()
        end_time = time.time()

        elapsed_time = end_time - start_time
        print(f'Time: {elapsed_time} seconds taken for result: {result} ')
        game_num = latest_game.game_num
        game_num += 1
        game_instance = MobileGame.objects.create(game_num=game_num)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f'Time: {elapsed_time} seconds taken for creating game instance: {game_instance.game_num} ')

        start_time_tickets = time.time()
        create_mobiletickets()
        end_time = time.time()
        elapsed_time = end_time - start_time_tickets
        print(f'Time: {elapsed_time} seconds taken for creating tickets ')
    else:
        latest_game = MobileGame.objects.create(game_num=1230)
        start_time = time.time()
        keno_result = KenoManager(game_instance=latest_game)
        result = keno_result.main()
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f'Time: {elapsed_time} seconds taken for result: {result} ')

        start_time_game = time.time()
        game_num = latest_game.game_num
        game_num += 1
        game_instance = MobileGame.objects.create(game_num=game_num)
        end_time = time.time()
        elapsed_time = end_time - start_time_game
        print(f'Time: {elapsed_time} seconds taken for creating game instance: {game_instance.game_num} ')
        start_time_tickets = time.time()
        create_mobiletickets()
        end_time = time.time()
        elapsed_time = end_time - start_time_tickets
        print(f'Time: {elapsed_time} seconds taken for creating tickets ')
