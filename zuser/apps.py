# zuser/apps.py
from django.apps import AppConfig
from django.db.models.signals import post_migrate

def create_default_groups(sender, **kwargs):
    from zuser.assign_permissions import create_groups
    create_groups()

class ZuserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'zuser'

    def ready(self):
        # post_migrate.connect(create_default_groups, sender=self)
        from . import signals
