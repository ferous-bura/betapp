import os
import sys
import subprocess

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

def main():
    project_dir = resource_path('.')
    os.environ['DJANGO_SETTINGS_MODULE'] = 'game.settings'
    os.environ['PYTHONPATH'] = project_dir
    subprocess.run([sys.executable, "-m", "celery", "-A", "game", "worker", "-l", "INFO", "--pool=solo"], env=os.environ)

if __name__ == "__main__":
    main()
