import os
import sys
import subprocess
import threading
import time
import psutil
import win32event
import win32api
import winerror
import atexit
import logging

# Initialize the logger
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler("mayabet3.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def ensure_single_instance():
    # Ensure only one instance is running
    mutex = win32event.CreateMutex(None, False, "mayabet_3_single_instance_mutex")
    if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
        logger.error("3.Another instance is already running.")
        sys.exit(0)

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base_path, relative_path)
    logger.debug(f'Resource path for {relative_path} is {path}')
    return path

def save_username(username):
    config_path = os.path.join(os.path.dirname(__file__), "config.txt")
    with open(config_path, "w") as f:
        f.write(username)
    logger.debug(f'Username {username} saved to {config_path}')

def get_license_path():
    documents_dir = os.path.join(os.path.expanduser('~'), 'Documents')
    license_dir = os.path.join(documents_dir, '.app')
    if not os.path.exists(license_dir):
        os.makedirs(license_dir)
        logger.debug(f'License directory created at {license_dir}')
    return os.path.join(license_dir, 'license.dat')

def read_username():
    license_path = get_license_path()
    try:
        with open(license_path, "r") as f:
            username = f.read().strip()
            logger.debug(f'Read username {username} from license path')
            return username
    except FileNotFoundError:
        logger.warning(f'License file not found at {license_path}')
        return ""

def launch_chrome(username):
    logger.info("Launching Chrome...")
    documents_folder = os.path.join(os.path.expanduser("~"), "Documents")
    user_data_dir = os.path.join(documents_folder, "ChromeUserData")
    second_screen_resolution = (1920, 1080)

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
    logger.info("Chrome launched.")

def start_celery_worker():
    logger.info("Starting Celery worker...")
    process = subprocess.Popen([sys.executable, "-m", "celery", "-A", "game", "worker", "-l", "INFO", "--pool=solo"])
    logger.debug(f'Celery worker started with PID {process.pid}')
    return process

def start_celery_beat():
    logger.info("Starting Celery beat...")
    process = subprocess.Popen([sys.executable, "-m", "celery", "-A", "game", "beat", "--loglevel=info"])
    logger.debug(f'Celery beat started with PID {process.pid}')
    return process

def start_django_server():
    logger.info("Starting Django server...")
    project_dir = resource_path('.')
    process = subprocess.Popen([sys.executable, "manage.py", "runserver", "0.0.0.0:9000", "--noreload"], cwd=project_dir)
    logger.debug(f'Django server started with PID {process.pid}')
    return process

def quit_app():
    logger.info("Quitting application...")
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if "celery" in proc.info['name'] or ("python" in proc.info['name'] and "manage.py" in " ".join(proc.info['cmdline'])):
            try:
                proc.terminate()
                proc.wait(timeout=5)
                logger.debug(f'Terminated process {proc.info}')
            except psutil.NoSuchProcess:
                logger.warning(f'No such process: {proc.info}')
            except psutil.TimeoutExpired:
                proc.kill()
                logger.debug(f'Killed process {proc.info}')

    try:
        subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], check=True)
        logger.info("Chrome processes killed.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error killing Chrome processes: {e}")

    logger.info("Application quit.")

def main():
    ensure_single_instance()

    saved_username = read_username()
    if not saved_username:
        logger.error("Password is needed")
        return

    # Start Django server, Celery worker, and Celery beat
    django_server_process = start_django_server()
    celery_worker_process = start_celery_worker()
    celery_beat_process = start_celery_beat()

    logger.info("Please wait...")
    time.sleep(10)

    launch_chrome(saved_username)

    def on_exit():
        quit_app()
        django_server_process.terminate()
        celery_worker_process.terminate()
        celery_beat_process.terminate()
        logger.info("Cleanup complete on exit.")

    atexit.register(on_exit)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        on_exit()

if __name__ == "__main__":
    main()
