import os
import sys
import subprocess

# Default values
CONFIG_FILE = "config.txt"
DEFAULT_SCREEN_POS = "1900"
DEFAULT_USER_DATA_DIR = os.path.join(os.path.expanduser("~"), "Documents", "ChromeUserData")
DEFAULT_URL = "https://mayabet2.pythonanywhere.com/api/"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Load config file
config = {}
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, "r", encoding="utf-8") as file:
        for line in file:
            if "=" in line:
                key, value = line.strip().split("=", 1)
                config[key] = value
else:
    print("ERROR: config.txt not found!")
    input("Press Enter to exit...")
    sys.exit(1)

# Extract values with defaults
USERNAME = config.get("USERNAME", "")
SCREEN_POS = config.get("SCREEN_POS", DEFAULT_SCREEN_POS)
USER_DATA_DIR = config.get("USER_DATA_DIR", DEFAULT_USER_DATA_DIR)
URL = config.get("URL", DEFAULT_URL)

# Validate Username
if not USERNAME:
    print("ERROR: Username is missing in config.txt!")
    input("Press Enter to exit...")
    sys.exit(1)

# Validate Chrome Path
if not os.path.exists(CHROME_PATH):
    print(f"ERROR: Chrome not found at {CHROME_PATH}!")
    input("Press Enter to exit...")
    sys.exit(1)

# Build the Chrome launch command
FULL_URL = f"{URL}?username={USERNAME}"
OPTIONS = [
    "--start-fullscreen",
    "--kiosk",
    "--incognito",
    "--disable-notifications",
    "--disable-extensions",
    f"--window-position={SCREEN_POS},0",
    f"--user-data-dir={USER_DATA_DIR}"
]

# Launch Chrome
try:
    subprocess.Popen([CHROME_PATH] + OPTIONS + [FULL_URL], shell=True)
except Exception as e:
    print(f"ERROR: Failed to launch Chrome - {e}")
    input("Press Enter to exit...")
    sys.exit(1)
