import os
import sys
import subprocess
import threading
import psutil
import time
import signal

def start_scheduler():
    try:
        # Ensure the Python path includes the current directory
        sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
        scheduler_thread = threading.Thread(target=run_scheduler)
        scheduler_thread.daemon = True
        scheduler_thread.start()
        return scheduler_thread
    except Exception as e:
        print(f"Error starting scheduler: {e}")
        return None

def run_scheduler():
    try:
        from scheduler import start_scheduler
        start_scheduler()
    except Exception as e:
        print(f"Error running scheduler: {e}")

def start_django_server():
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
        from django.core.management import execute_from_command_line
        
        sys.argv = ["manage.py", "runserver", "127.0.0.1:8000", "--noreload"]
        django_thread = threading.Thread(target=execute_from_command_line, args=(sys.argv,))
        django_thread.daemon = True  # Make thread daemon so it exits when main program exits
        django_thread.start()
        return django_thread
    except Exception as e:
        print(f"Error starting Django server: {e}")
        return None

def quit_app():
    print("Shutting down services...")
    try:
        # Terminate Django server processes
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if "python" in proc.info['name'].lower() and any(cmd in " ".join(proc.info['cmdline']) for cmd in ["manage.py", "runserver"]):
                    proc.terminate()
                    proc.wait(timeout=5)  # Wait for process to terminate
            except (psutil.NoSuchProcess, psutil.TimeoutExpired, psutil.AccessDenied):
                continue
    except Exception as e:
        print(f"Error during shutdown: {e}")

def signal_handler(signum, frame):
    print(f"Received signal {signum}")
    quit_app()
    sys.exit(0)

def main():
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    django_thread = start_django_server()
    scheduler_thread = start_scheduler()

    if not django_thread or not scheduler_thread:
        print("Failed to start all services")
        quit_app()
        sys.exit(1)

    print("All services started successfully")
    
    try:
        while True:
            time.sleep(1)  # Reduce CPU usage
    except KeyboardInterrupt:
        quit_app()

if __name__ == "__main__":
    main()