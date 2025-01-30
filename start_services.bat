start /B python manage.py runserver 9000 & start /B celery --app=game worker -l INFO --pool=solo & start /B celery -A game beat --loglevel=info &
