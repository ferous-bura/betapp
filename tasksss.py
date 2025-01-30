# my_task.py

from datetime import datetime
import time

def main():
    while True:
        print(f"Task executed at: {datetime.now()}")
        time.sleep(240)  # Sleep for 4 minutes (240 seconds)

if __name__ == "__main__":
    main()
