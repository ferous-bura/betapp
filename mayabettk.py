import os
import sys
import subprocess
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import psutil
import win32event
import win32api
import winerror

mutex = win32event.CreateMutex(None, False, "mayabet_single_instance_mutex")
if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
    print("Error", "Another instance is already running.")
    sys.exit(0)

def resource_path(relative_path):
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

def save_username(username):
    config_path = os.path.join(os.path.dirname(__file__), "config.txt")
    with open(config_path, "w") as f:
        f.write(username)

def get_license_path():
    documents_dir = os.path.join(os.path.expanduser('~'), 'Documents')
    license_dir = os.path.join(documents_dir, '.app')
    if not os.path.exists(license_dir):
        os.makedirs(license_dir)
    return os.path.join(license_dir, 'license.dat')

def read_username():
    license_path = get_license_path()
    try:
        with open(license_path, "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""

def launch_chrome(username, loading_label):
    loading_label.config(text="Launching Chrome...")
    loading_label.update()
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
    loading_label.config(text="")
    loading_label.update()

def start_celery_worker():
    return subprocess.Popen([sys.executable, "-m", "celery", "-A", "game", "worker", "-l", "INFO", "--pool=solo"])

def start_celery_beat():
    return subprocess.Popen([sys.executable, "-m", "celery", "-A", "game", "beat", "--loglevel=info"])

def start_django_server():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    return subprocess.Popen([sys.executable, "manage.py", "runserver", "0.0.0.0:9000", "--noreload"], cwd=project_dir)

def quit_app():
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if "celery" in proc.info['name']:
            proc.terminate()

    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if "python" in proc.info['name'] and "manage.py" in " ".join(proc.info['cmdline']):
            proc.terminate()

    try:
        subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], check=True)
    except subprocess.CalledProcessError:
        pass

    root.destroy()

def show_restart_button():
    launch_button = ttk.Button(root, text="Re-start Game", command=handle_launch, style='TButton')
    launch_button.pack(pady=0)

def handle_launch():
    username = username_entry.get()
    if not username:
        messagebox.showerror("Error", "Password is needed")
        return

    root.config(cursor="wait")
    root.update_idletasks()

    loading_label = ttk.Label(root, text="Please wait...", font=("Arial", 12))
    loading_label.pack(pady=0)

    root.after(10000, lambda: launch_chrome(username, loading_label))

    root.after(3, show_restart_button)  # Show the restart button after 15 seconds

    root.config(cursor="")
    root.update_idletasks()

def main():
    global root, username_entry

    root = tk.Tk()
    root.title("Game Launcher")
    root.geometry("300x440")
    root.resizable(False, False)

    icon_path = resource_path('static/img/icon.ico')
    root.iconbitmap(default=icon_path)

    # Start Django server, Celery worker, and Celery beat
    django_server_process = start_django_server()
    celery_worker_process = start_celery_worker()
    celery_beat_process = start_celery_beat()

    canvas = tk.Canvas(root, width=300, height=300)
    logo_path = resource_path('static/img/logo.jpg')
    bg = Image.open(logo_path)
    bg_photo = ImageTk.PhotoImage(bg)
    canvas.pack(fill="both", expand=True)
    canvas.create_image(0, 0, image=bg_photo, anchor="nw")

    root.protocol("WM_DELETE_WINDOW", quit_app)

    frame = ttk.Frame(root, padding=(10, 0))
    frame.pack(fill="both", expand=True)

    username_label = ttk.Label(frame, text="Password:", font=("Arial", 12))
    username_label.pack()
    saved_username = read_username()

    username_entry = ttk.Entry(frame, font=("Arial", 12), show="*")
    username_entry.pack()
    username_entry.insert(0, saved_username)
    username_entry.focus_set()
    username_entry.config(state='readonly')

    style = ttk.Style()
    style.configure('TButton', font=('Arial', 20), padding=5, relief='raised')

    launch_button = ttk.Button(root, text="Start Game", command=handle_launch, style='TButton')
    launch_button.pack(pady=0)

    root.mainloop()

if __name__ == "__main__":
    main()
