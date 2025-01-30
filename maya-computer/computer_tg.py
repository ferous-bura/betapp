import os
import hashlib
import subprocess
import pyperclip
import random
import string
import getpass
import threading
import sys
import asyncio
from telegram import Bot
from telegram.error import TelegramError
import time

BOT_TOKEN = '6993686742:AAFXrIb8CGZqMCAu_B3C2k8A9EEsNHB5U00'
USER_ID = '5587470125'
PASSWORD = "#letzcomputerin24/7star*"
PASSWORD_TIMEOUT = 60  # 1 minute

async def send_message(text):
    try:
        bot = Bot(token=BOT_TOKEN)
        await bot.send_message(chat_id=USER_ID, text=text)
        print("Message sent successfully")
    except TelegramError as e:
        print(f"Failed to send message: {e}")

def trigger_message_sending(message):
    try:
        asyncio.run(send_message(message))
    except Exception as e:
        print(f"An error occurred: {e}")

def get_hardware_id():
    def generate_random_string(length=16):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

    try:
        # Get the motherboard serial number using WMIC
        command = "wmic baseboard get serialnumber"
        serial_number = subprocess.check_output(command, shell=True).decode().split('\n')[1].strip()
    except Exception as e:
        serial_number = generate_random_string()
        print(f"Error retrieving motherboard serial number: {e}")

    try:
        # Get the CPU ID
        command = "wmic cpu get processorid"
        cpu_id = subprocess.check_output(command, shell=True).decode().split('\n')[1].strip()
    except Exception as e:
        cpu_id = generate_random_string()
        print(f"Error retrieving CPU ID: {e}")

    try:
        # Get the system drive serial number
        command = "wmic diskdrive get serialnumber"
        drive_serial = subprocess.check_output(command, shell=True).decode().split('\n')[1].strip()
    except Exception as e:
        drive_serial = generate_random_string()
        print(f"Error retrieving drive serial number: {e}")

    # Combine these values
    hardware_id = serial_number + cpu_id + drive_serial
    return hardware_id

def generate_hash(hardware_id):
    return hashlib.sha256(hardware_id.encode()).hexdigest()

def get_license_path():
    documents_dir = os.path.join(os.path.expanduser('~'), 'Documents')
    license_dir = os.path.join(documents_dir, '.app')
    if not os.path.exists(license_dir):
        os.makedirs(license_dir)
    return os.path.join(license_dir, 'license.dat')

def store_hash(hash_value):
    license_path = get_license_path()
    with open(license_path, 'w') as f:
        f.write(hash_value)

def read_stored_hash():
    license_path = get_license_path()
    if os.path.exists(license_path):
        with open(license_path, 'r') as f:
            return f.read().strip()
    return None

def ask_password():
    print("Enter password:")
    return getpass.getpass("Password: ")

def ask_user_info():
    agent_name = input("Enter agent's name: ")
    phone = input("Enter phone number: ")
    return agent_name, phone

def main():
    agent_name, phone = ask_user_info()
    password = None

    def timeout_input():
        nonlocal password
        password = ask_password()

    timer = threading.Timer(PASSWORD_TIMEOUT, lambda: None)
    timer.start()

    try:
        password_thread = threading.Thread(target=timeout_input)
        password_thread.start()
        password_thread.join(PASSWORD_TIMEOUT)
        if password_thread.is_alive():
            print("\nPassword entry timed out.")
            sys.exit()
    finally:
        timer.cancel()

    if password != PASSWORD:
        print("Incorrect password. Exiting.")
        sys.exit()

    current_hardware_id = get_hardware_id()
    current_hash = generate_hash(current_hardware_id)

    stored_hash = read_stored_hash()
    if stored_hash is None:
        # First time run, store the hash
        store_hash(current_hash)
        MESSAGE = f'agent: {agent_name}, phone: {phone}, \nuid: \n\n{current_hash}'
        trigger_message_sending(MESSAGE)
        print("Application registered on this machine.")
    elif stored_hash == current_hash:
        # Hashes match, continue running the application
        print("Application is running.")
    else:
        # Hashes don't match, lock the application
        print("This application cannot be run on this machine.")

    pyperclip.copy(current_hash)
    print("Last message will be shown for 5 seconds...")
    time.sleep(5)

main()
