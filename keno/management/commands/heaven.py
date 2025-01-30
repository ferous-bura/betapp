import os
import sys
import django
from getpass import getpass

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
django.setup()

from django.contrib.auth import authenticate
from keno.models import Cashier, Agent

def authenticate_admin():
    username = getpass("admin username: ")
    password = getpass("admin password: ")  # Hide password input
    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
        return user
    else:
        print("Invalid admin credentials.")
        return None

def change_cashier_username():
    cashier_id = input("Enter the ID of the cashier whose username you want to change: ")
    try:
        cashier = Cashier.objects.get(id=cashier_id)
        print(f"Cashier name: {cashier.cashier.username}")
        new_username = input("Enter the new username for the cashier: ")
        cashier.cashier.username = new_username
        cashier.cashier.save()
        print("Cashier username updated successfully.")
    except Cashier.DoesNotExist:
        print("Cashier not found.")

def change_agent_username():
    agent_id = input("Enter the ID of the agent whose username you want to change: ")
    try:
        agent = Agent.objects.get(id=agent_id)
        new_username = input("Enter the new username for the agent: ")
        agent.u_id = new_username
        agent.save()
        print("Agent username updated successfully.")
    except Agent.DoesNotExist:
        print("Agent not found.")

def change_agent_give_away_amount():
    agent_id = input("Enter the ID of the agent whose give_away_amount you want to change: ")
    try:
        agent = Agent.objects.get(id=agent_id)
        new_amount = input("Enter the new give_away_amount for the agent: ")
        agent.give_away_amount = int(new_amount)
        agent.save()
        print("Agent give_away_amount updated successfully.")
    except (Agent.DoesNotExist, ValueError):
        print("Agent not found or invalid amount.")

def change_cashier_password():
    cashier_id = input("Enter the ID of the cashier whose password you want to change: ")
    try:
        cashier = Cashier.objects.get(id=cashier_id)
        print(f"Cashier name: {cashier.cashier.username}")
        new_password = input("Enter the new password for the cashier: ")
        cashier.cashier.set_password(new_password)
        cashier.cashier.save()
        print("Cashier password updated successfully.")
    except Cashier.DoesNotExist:
        print("Cashier not found.")

def change_agent_locked_status():
    agent_id = input("Enter the ID of the agent whose locked status you want to change: ")
    try:
        agent = Agent.objects.get(id=agent_id)
        new_status = input("Enter the new locked status for the agent (True/False): ")
        agent.locked = new_status.lower() == 'true'
        agent.save()
        print("Agent locked status updated successfully.")
    except Agent.DoesNotExist:
        print("Agent not found.")

def change_agent_u_id():
    agent_id = input("Enter the ID of the agent whose u_id you want to change: ")
    try:
        agent = Agent.objects.get(id=agent_id)
        new_u_id = input("Enter the new u_id for the agent: ")
        agent.u_id = new_u_id
        agent.save()
        print("Agent u_id updated successfully.")
    except Agent.DoesNotExist:
        print("Agent not found.")

def change_cashier_access():
    cashier_id = input("Enter the ID of the cashier whose access you want to change: ")
    try:
        cashier = Cashier.objects.get(id=cashier_id)
        print(f"Cashier name: {cashier.cashier.username}")
        new_access = input("Enter the new access status for the cashier (True/False): ")
        cashier.has_access = new_access.lower() == 'true'
        cashier.save()
        print("Cashier access status updated successfully.")
    except Cashier.DoesNotExist:
        print("Cashier not found.")

def main():
    admin_user = authenticate_admin()
    if not admin_user:
        sys.exit()

    print("Options:")
    print("1. Change cashier username")
    print("2. Change agent username")
    print("3. Change agent give_away_amount")
    print("4. Change cashier password")
    print("5. Change agent locked status")
    print("6. Change agent u_id")
    print("7. Change cashier access status")
    print("8. Exit")

    while True:
        choice = input("Enter your choice (1-8): ")
        if choice == '1':
            change_cashier_username()
        elif choice == '2':
            change_agent_username()
        elif choice == '3':
            change_agent_give_away_amount()
        elif choice == '4':
            change_cashier_password()
        elif choice == '5':
            change_agent_locked_status()
        elif choice == '6':
            change_agent_u_id()
        elif choice == '7':
            change_cashier_access()
        elif choice == '8':
            print("Exiting...")
            sys.exit()
        else:
            print("Invalid choice. Please enter a number from 1 to 8.")

if __name__ == "__main__":
    main()
