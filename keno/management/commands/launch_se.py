import os
import sys
import subprocess
import threading
import time
import psutil
from django.core.management.base import BaseCommand

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

def get_license_path():
    documents_dir = os.path.join(os.path.expanduser('~'), 'Documents')
    license_dir = os.path.join(documents_dir, '.app')
    if not os.path.exists(license_dir):
        os.makedirs(license_dir)
    return os.path.join(license_dir, 'license.dat')

def read_username():
    """Read username from the configuration file."""
    license_path = get_license_path()
    try:
        with open(license_path, "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""

def launch_chrome(username):
    """Launch Chrome browser with the specified URL and options."""
    documents_folder = os.path.join(os.path.expanduser("~"), "Documents")
    user_data_dir = os.path.join(documents_folder, "ChromeUserData")
    second_screen_resolution = (1920, 1080)  # Example resolution, replace with your actual resolution

    url = 'http://127.0.0.1:9000/api/'
    chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    options = [
        "--kiosk",
        "--start-fullscreen",
        "--incognito",
        "--disable-notifications",
        "--disable-extensions",
        f"--window-position={second_screen_resolution[0] + 1},0",
        f"--user-data-dir={user_data_dir}"
    ]
    if username:
        url += f"?username={username}"
    command = [chrome_path, *options, url]

    subprocess.Popen(command)

def start_celery_worker():
    return subprocess.Popen([sys.executable, "-m", "celery", "--app=game", "worker", "-l", "INFO", "--pool=solo"])

def start_celery_beat():
    return subprocess.Popen([sys.executable, "-m", "celery", "-A", "game", "beat", "--loglevel=info"])

def start_django_server():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    sys.argv = ["manage.py", "runserver", "127.0.0.1:9000", "--noreload"]
    execute_from_command_line(sys.argv)

def quit_app():
    # for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
    #     if "celery" in proc.info['name']:
    #         proc.terminate()

    # Terminate the Django server process
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if "python" in proc.info['name'] and "manage.py" in " ".join(proc.info['cmdline']):
            proc.terminate()

    try:
        subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], check=True)
    except subprocess.CalledProcessError:
        pass

class Command(BaseCommand):
    help = 'Launch Django server, Celery worker, Celery beat, and Chrome browser'

    def handle(self, *args, **kwargs):
        username = read_username()
        if not username:
            self.stdout.write(self.style.ERROR("Username is needed"))
            return

        self.stdout.write(self.style.SUCCESS(f"Starting services with username: {username}"))

        # Start Django server, Celery worker, and Celery beat in separate threads
        celery_worker_thread = threading.Thread(target=start_celery_worker)
        celery_beat_thread = threading.Thread(target=start_celery_beat)

        celery_worker_thread.start()
        celery_beat_thread.start()

        # Wait for threads to start services
        time.sleep(10)
        django_thread = threading.Thread(target=start_django_server)
        django_thread.start()
        time.sleep(15)

        # # Launch Chrome
        launch_chrome(username)

        self.stdout.write(self.style.SUCCESS("Services started successfully"))

        # Wait for all threads to complete
        django_thread.join()
        celery_worker_thread.join()
        celery_beat_thread.join()
