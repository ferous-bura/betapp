import os
import sys
import subprocess
import threading
import time
import atexit
import win32event
import win32api
import winerror

# Ensure only one instance is running
mutex = win32event.CreateMutex(None, False, "mayabet_2_single_instance_mutex")
if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
    print("Another instance is already running.")
    sys.exit(0)

def launch_service(script_name):
    return subprocess.Popen([sys.executable, script_name])

def launch_chrome(username):
    print("Launching Chrome...")
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
    print("Chrome launched.")

def quit_app():
    subprocess.run(["taskkill", "/f", "/im", "python.exe"], check=True)
    subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], check=True)
    print("Application quit.")

def run_in_thread(target, *args):
    thread = threading.Thread(target=target, args=args)
    thread.start()
    return thread

def read_username():
    documents_dir = os.path.join(os.path.expanduser('~'), 'Documents')
    license_dir = os.path.join(documents_dir, '.app')
    license_path = os.path.join(license_dir, 'license.dat')
    try:
        with open(license_path, "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""

def main():
    saved_username = read_username()
    if not saved_username:
        print("Password is needed")
        return

    # Start services
    django_thread = run_in_thread(launch_service, "run_django.py")
    celery_worker_thread = run_in_thread(launch_service, "run_celery_worker.py")
    celery_beat_thread = run_in_thread(launch_service, "run_celery_beat.py")

    print("Please wait...")
    time.sleep(10)

    launch_chrome(saved_username)

    def on_exit():
        quit_app()
        django_thread.join()
        celery_worker_thread.join()
        celery_beat_thread.join()

    atexit.register(on_exit)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        on_exit()

if __name__ == "__main__":
    main()
