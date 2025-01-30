import time
import asyncio
from keno.models import Game
from auto import create_tickets
from .task_utils import (
    create_game_instance,
    create_game_result
)
from asgiref.sync import sync_to_async  # Import sync_to_async for database access

async def game_tasks():
    start_time = time.time()  # Record the start time
    latest_game = await sync_to_async(Game.objects.latest_keno_open)()
    if latest_game is not None:
        await sync_to_async(create_game_result)(latest_game)
        await sync_to_async(create_game_instance)(latest_game)
    else:
        await sync_to_async(create_game_instance)()
    await sync_to_async(create_tickets)()
    end_time = time.time()  # Record the end time
    elapsed_time = end_time - start_time
    print(f'Time taken for game: {elapsed_time} seconds')
    return "Task Game Complete"

async def run_task():
    interval_minutes = 4
    interval_seconds = interval_minutes * 60

    while True:
        print('task has started')
        await game_tasks()  # Await the completion of the asynchronous task
        print('task has ended')
        await asyncio.sleep(interval_seconds)  # Sleep asynchronously

# asyncio.run(run_task())
