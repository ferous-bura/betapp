import subprocess

def run_django():
    subprocess.Popen(['python', 'manage.py', 'runserver', '9000'])

def run_celery_worker():
    subprocess.Popen(['celery', '--app=game', 'worker', '-l', 'INFO', '--pool=solo'])

def run_celery_beat():
    subprocess.Popen(['celery', '-A', 'game', 'beat', '--loglevel=info'])

if __name__ == "__main__":
    run_django()
    run_celery_worker()
    run_celery_beat()
