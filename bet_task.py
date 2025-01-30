from datetime import datetime
import time
import requests

def call_keno_update_view():
    # response = requests.get('http://127.0.0.1:8000/keno-update-view/')
    response = requests.get('https://mayabet2.pythonanywhere.com/keno-update-view/')  # Replace with your actual URL
    print(response.text)

def call_spin_update_view():
    # response = requests.get('http://127.0.0.1:8000/spin-update-view/')
    response = requests.get('https://mayabet2.pythonanywhere.com/spin-update-view/')  # Replace with your actual URL
    print(response.text)

def main():
    while True:
        call_keno_update_view()
        #call_spin_update_view()
        print(f"Task Bura executed at: {datetime.now()}")
        time.sleep(240)  # Sleep for 4 minutes (240 seconds)

if __name__ == "__main__":
    main()
