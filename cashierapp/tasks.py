from django.utils import timezone
from django.contrib.auth.models import User

from zuser.models import Agent

# @shared_task
def update_cashier_status():
    # Get all agents
    agents = Agent.objects.all()

    for agent in agents:
        logged_in_user_ids = User.objects.filter(last_login__gte=timezone.now() - timezone.timedelta(days=1),
                                                  cashier__agent=agent).values_list('id', flat=True)
        if logged_in_user_ids.exists():
            agent.is_open = True
        else:
            agent.is_open = False

        agent.save()
