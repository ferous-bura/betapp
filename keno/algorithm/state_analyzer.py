import os
import django
import json

from keno.utils.raw_result import lucky_odd_price, turn_odd_type_to_price
from zuser.models import GameHistory
from ..models import GameResult

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "game.settings")

django.setup()


class AgentStateAnalyzer:

    def __init__(self, agent, game_instnace):

        self.margin = agent.agent_margin
        self.game = game_instnace
        # self.summary = Agent.objects.latest_summary()

    def main(self):
        """
        analyze the overall agents state and decide in which strategy to generate the result and to put
        a range on the gain and loss depending on the previous agents state

        and return response to the keno result class
        """

        
        context = {'gain_perc': self.margin}  # Initialize context with a default value

        # if self.game.result_gen_try == 1:
        #     context['gain_perc'] = 10
        # elif self.game.result_gen_try == 2:
        #     context['gain_perc'] = 20
        # elif self.game.result_gen_try == 3:
        #     context['gain_perc'] = 50
        # elif self.game.result_gen_try == 0:
        #     context['gain_perc'] = 60
        # else:
        #     context['gain_perc'] = 0

        return context
