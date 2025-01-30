from django.apps import AppConfig


class KenoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'keno'

    #def ready(self):
        # from . import scheduler
        # scheduler.start()
        # import keno.local_tasks  # This line connects your signals when the app is ready
