from django.contrib import admin
from .models import Spin, SpinTicket, SpinAnalytica

admin.site.register(SpinAnalytica)

class SpinTicketAdmin(admin.ModelAdmin):
    list_display = ('_game', 'game_num', 'choice_val', 'kind', 'redeemed', 'created_at', 'agent_locked', 'cancelled', 'cashier_by', 'stake', 'multiple_stake', 'won_amount', 'unique_identifier')

    def game_num(self, obj):
        return obj._game.game_num

    def agent_name(self, obj):
        return obj.cashier_by.agent.full_name

    def agent_locked(self, obj):
        return obj.cashier_by.agent.locked

admin.site.register(SpinTicket, SpinTicketAdmin)

@admin.register(Spin)
class SpinAdmin(admin.ModelAdmin):
    list_display = ('status', 'game_num', 'result',
                    'created_at', 'updated_at', '_done')
