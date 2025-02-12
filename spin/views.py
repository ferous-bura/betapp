# Inside views.py of your Django app (e.g., betapp)
from django.http import HttpResponse
from keno.tasks import keno_update_tasks
from spin.tasks import update_spin_game
from datetime import datetime

def keno_update_view(request):
    keno_update_tasks()  # Call your keno update task
    print(f"Keno update executed at: {datetime.now()}")
    return HttpResponse(f"Keno update executed at: {datetime.now()}")

def spin_update_view(request):
    update_spin_game()  # Call your spin update task
    return HttpResponse(f"Spin game update executed at: {datetime.now()}")
