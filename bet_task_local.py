from datetime import datetime
import time
import requests

def call_keno_update_view():
    start_time = time.time()  # Start time of the function
    response = requests.get('http://127.0.0.1:8000/keno-update-view/')
    # response = requests.get('https://mayabet2.pythonanywhere.com/keno-update-view/')  # Replace with your actual URL
    print(response.text)
    end_time = time.time()  # End time of the function
    return end_time - start_time  # Return the execution time

def call_spin_update_view():
    start_time = time.time()  # Start time of the function
    response = requests.get('http://127.0.0.1:8000/spin-update-view/')
    # response = requests.get('https://mayabet2.pythonanywhere.com/spin-update-view/')  # Replace with your actual URL
    print(response.text)
    end_time = time.time()  # End time of the function
    return end_time - start_time  # Return the execution time

def main():
    while True:

        keno_execution_time = call_keno_update_view()
        total_execution_time = keno_execution_time  # + spin_execution_time if needed
        sleep_time = max(240 - total_execution_time, 0)  # Ensure sleep time is not negative
        print(f"Task Bura executed at: {datetime.now()}")
        print(f"Execution time: {total_execution_time:.2f} seconds")
        print(f"Sleeping for: {sleep_time:.2f} seconds")

        # Sleep for the remaining time
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()