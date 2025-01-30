from django.shortcuts import get_object_or_404
from keno.models import GameAnalytica
from datetime import timedelta

from zuser.models import Agent
from game_utils.time_file import get_local_time_now


def get_game_statistics(game_id, company):
    game_analytics = GameAnalytica.objects.filter(gameId=game_id, agent__company=company)
    total_won = sum(analytic.total_won for analytic in game_analytics)
    total_gain = sum(analytic.total_gain for analytic in game_analytics)
    expected_gain = sum(analytic.expected_gain for analytic in game_analytics)
    total_tickets = sum(analytic.total_tickets for analytic in game_analytics)
    total_stake = sum(analytic.total_stake for analytic in game_analytics)
    return {
        'total_won': total_won,
        'total_gain': total_gain,
        'expected_gain': expected_gain,
        'total_tickets': total_tickets,
        'total_stake': total_stake,
    }

def get_agents_today_statistics(agent_id, start_date=None, end_date=None):
    today_start = get_local_time_now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    start = start_date if start_date is not None else today_start
    end = end_date if end_date is not None else today_end
    game_analytics = GameAnalytica.objects.filter(agent=agent_id, created_at__range=(start, end))
    agent = get_object_or_404(Agent, pk=agent_id)
    total_claimed_won = sum(analytic.total_won for analytic in game_analytics)
    total_gain = sum(analytic.total_gain for analytic in game_analytics)
    expected_gain = sum(analytic.expected_gain for analytic in game_analytics)
    total_tickets = sum(analytic.total_tickets for analytic in game_analytics)
    total_stake = sum(analytic.total_stake for analytic in game_analytics)
    cancelled_tickets = sum(analytic.cancelled_tickets for analytic in game_analytics)
    return {
        'shop name': agent.full_name,
        'claimed winning': total_claimed_won,
        'total_gain': total_gain,
        'expected_gain': expected_gain,
        'total_tickets': total_tickets,
        'total_stake': total_stake,
        'cancelled tickets': cancelled_tickets,
    }
    
def get_agent_statistics(agent_id):
    try:
        analytics = GameAnalytica.objects.filter(agent=agent_id)
        statistics = []
        for game_analytic in analytics:
            statistics.append({
                'total_won': game_analytic.total_won,
                'total_gain': game_analytic.total_gain,
                'total_tickets': game_analytic.total_tickets,
                'total_stake': game_analytic.total_stake,
                'loss_percent': game_analytic.loss_percent,
                'choosen_strategy': game_analytic.choosen_strategy,
                'expected_gain': game_analytic.expected_gain,
            })
        return statistics
    except GameAnalytica.DoesNotExist:
        return []  # Return empty list if no analytics found
    except Exception as e:
        # Handle other exceptions, like database connection issues
        print(f"An error occurred: {e}")
        return None


def get_initial_data(agent_id):
    initial_data = []
    game_analytics = GameAnalytica.objects.filter(agent=agent_id)[:10]  # Fetching the first 10 records for demonstration

    for analytics in game_analytics:
        initial_data.append({
            'game_date': analytics.gameId.created_at,
            'game_num': analytics.gameId.game_num,
            'agent_id': analytics.agent.id,
            'total_won': analytics.total_won,
            'total_gain': analytics.total_gain,
            'total_tickets': analytics.total_tickets,
            'total_stake': analytics.total_stake,
        })

    return initial_data


def get_spininitial_data(agent_id):
    initial_data = []
    game_analytics = SpinAnalytica.objects.filter(agent=agent_id)[:10]  # Fetching the first 10 records for demonstration

    for analytics in game_analytics:
        initial_data.append({
            'game_date': analytics.gameId.created_at,
            'game_num': analytics.gameId.game_num,
            'agent_id': analytics.agent.id,
            'total_won': analytics.total_won,
            'total_gain': analytics.total_gain,
            'total_tickets': analytics.total_tickets,
            'total_stake': analytics.total_stake,
        })

    return initial_data


def get_latest_data(agent_id):
    latest_data = []
    game_analytics = GameAnalytica.objects.filter(agent=agent_id).order_by('-created_at')[:10]
    for analytics in game_analytics:
        latest_data.append({
            'game_id': analytics.gameId.id,
            'agent_id': analytics.agent.id,
            'total_won': analytics.total_won,
            'total_gain': analytics.total_gain,
            'total_tickets': analytics.total_tickets,
            'total_stake': analytics.total_stake,
        })

    return latest_data

def get_spinlatest_data(agent_id):
    latest_data = []
    game_analytics = SpinAnalytica.objects.filter(agent=agent_id).order_by('-created_at')[:10]
    for analytics in game_analytics:
        latest_data.append({
            'game_id': analytics.gameId.id,
            'agent_id': analytics.agent.id,
            'total_won': analytics.total_won,
            'total_gain': analytics.total_gain,
            'total_tickets': analytics.total_tickets,
            'total_stake': analytics.total_stake,
        })

    return latest_data
