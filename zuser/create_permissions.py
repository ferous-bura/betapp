import os
import sys
import django


# Set the path to your Django project and the settings module
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ['DJANGO_SETTINGS_MODULE'] = 'game.settings'

# Initialize Django
django.setup()

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from keno.models import Game, Ticket
from zuser.models import System, Company, Agent, Cashier, Player


def create_standard_permissions(model, action):
    content_type = ContentType.objects.get_for_model(model)
    codename = f'{action}_{model.__name__.lower()}'
    name = f'{action.capitalize()} {model.__name__.lower()}'

    # Check if the permission already exists
    permission, created = Permission.objects.get_or_create(
        codename=codename,
        content_type=content_type,
        defaults={'name': name}
    )

    if not created:
        print(f"Permission '{codename}' for model '{model.__name__.lower()}' already exists.")


def create_permissions():
    models = [System, Company, Agent, Cashier, Player, Ticket, Game]

    # Create standard permissions
    for model in models:
        for action in ['add', 'view', 'change', 'delete', 'lock']:
            create_standard_permissions(model, action)

    print("Permissions created successfully.")


# Run the function to create permissions
create_permissions()
