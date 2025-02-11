import os
import sys
import subprocess
import threading
import psutil

def start_scheduler():
    # Ensure the Python path includes the current directory
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.daemon = True
    scheduler_thread.start()
    return scheduler_thread

def run_scheduler():
    from scheduler import start_scheduler
    start_scheduler()

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
    
    sys.argv = ["manage.py", "runserver", "127.0.0.1:8000", "--noreload"]
    django_process = threading.Thread(target=execute_from_command_line, args=(sys.argv,))
    django_process.start()
    return django_process

def quit_app():
    # Terminate the Django server process
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if "python" in proc.info['name'] and "manage.py" in " ".join(proc.info['cmdline']):
            proc.terminate()

    try:
        subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], check=True)
    except subprocess.CalledProcessError:
        pass

def main():
    start_django_server()
    start_scheduler()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        quit_app()

if __name__ == "__main__":
    main()
