
from zuser.models import Company, Cashier, LogoutUser, Player, check_time_difference
from zuser.assign_permissions import assign_cashier_permissions, assign_company_permissions, assign_player_permissions
from django.shortcuts import get_object_or_404
from keno.models import GameAnalytica
from django.contrib.auth.signals import user_logged_in
import requests
from django.conf import settings
from django.contrib.auth import logout
from django.contrib import messages
from django.shortcuts import redirect
from game_utils.auth_decorators import is_cashier
import socket
from django.db.models.signals import post_save
from django.dispatch import receiver
import requests
from django.conf import settings
# from django.core.mail import send_mail
# from django.core.mail import EmailMessage
# from .tgbot import trigger_message_sending
# Ensure AppConfig is referenced to trigger its ready() method
default_app_config = 'zuser.apps.zuserConfig'

@receiver(post_save, sender=Player)
def player_created(sender, instance, created, **kwargs):
    if created:
        assign_player_permissions(sender, instance)

@receiver(post_save, sender=Cashier)
def cashier_created(sender, instance, created, **kwargs):
    if created:
        assign_cashier_permissions(sender, instance)

@receiver(post_save, sender=Company)
def company_created(sender, instance, created, **kwargs):
    if created:
        assign_company_permissions(sender, instance)

def is_connected():
    try:
        # Connect to a well-known external server (Google's public DNS)
        socket.create_connection(("8.8.8.8", 53), timeout=5)
        # print(f'connected to Google public DNS')
        return True
    except OSError:
        print(f'not connected to internet')
        return False

#@receiver(user_logged_in)
def send_login_data(sender, user, request, **kwargs):
    if is_cashier(user):
        try:
            custom_user = request.user
            cashier = get_object_or_404(Cashier, cashier=custom_user)
            agent = cashier.agent
            # print(f'agent {agent}')
            if agent:
                if is_connected() == True:
                    send_data_to_server(agent)
                logout_user, created = LogoutUser.objects.get_or_create(agent=agent)
                logout_user = check_time_difference(logout_user)
                # print(f'logout_user {logout_user.loggout}')
                # print(f'is_connected() {is_connected()}')
                if logout_user.loggout == True:
                    messages.error(request, f"Error: connect to the internet! or call help: 0921163932")
                    logout(request)
                    return redirect('zuser:login')
        except Exception as e:
            print(f'cant get user, {e}')

def send_data_to_server(agent):
    logout_user, created = LogoutUser.objects.get_or_create(agent=agent)
    try:
        ga = GameAnalytica.objects.get_previous_data(agent)
        total_tickets_sum = 0
        total_stake_sum = 0
        total_gain_sum = 0
        total_won_sum = 0
        cancelled_tickets_sum = 0
        for obj in ga:
                    # Aggregate values for each attribute
            total_tickets_sum += obj.total_tickets
            total_stake_sum += obj.total_stake
            total_gain_sum += obj.total_gain
            total_won_sum += obj.total_won
            cancelled_tickets_sum += obj.cancelled_tickets
        u_id = agent.u_id
        agent_full_name = agent.full_name
        payload = {
                    'u_id': u_id,
                    'agent_full_name': agent_full_name,
                    "total_tickets": total_tickets_sum,
                    "total_stake": total_stake_sum,
                    "net": total_gain_sum,
                    "won": total_won_sum,
                    "cancelled_tickets": cancelled_tickets_sum
                }
        headers = {
                    'Authorization': 'Bearer randomenum1234',
                }
        try:
            response = requests.post(settings.CLOUD_APP_LOGIN_URL, json=payload, headers=headers)
            response.raise_for_status()
            # trigger_message_sending(payload)
            response_data = response.json()
            logout_user.loggout = response_data.get('lock')
            logout_user.save()
            agent.give_away_amount = response_data.get('give_away_amount')
            agent.keno_margin = response_data.get('margin')
            agent.save()
        except requests.exceptions.RequestException as e:
            print(f"Error sending data: {e}")

    except Exception as e:
        print(f'failed to get data {e}')
