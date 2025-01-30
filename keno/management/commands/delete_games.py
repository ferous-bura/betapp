# delete_all_games.py

from django.core.management.base import BaseCommand
from keno.models import Game

class Command(BaseCommand):
    help = 'Deletes all game instances from the database'

    def handle(self, *args, **options):
        Game.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all game instances'))
