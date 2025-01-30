from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from django.contrib import admin
from .models import Game, Ticket, GameResult, GameAnalytica
from .models import MobileTicket, MobileGame, MobileGameAnalytica, MobileGameResult

@admin.register(GameAnalytica)
class GameAnalyticaAdmin(admin.ModelAdmin):
    list_display = ('agent_name', 'game_num', 'total_stake', 'total_gain', 'total_won', 'total_tickets', 'total_special_prize', 'prize_made', 'expected_gain', 'gain_percentage', 'loss_percent','created_at', 'updated_at')
    list_filter = ('total_stake', 'keno_odd_type', 'agent', 'gameId', 'choosen_strategy', 'special_prize', 'created_at', 'updated_at')
    search_fields = ('keno_odd_type', 'choosen_strategy')

    def game_num(self, obj):
        return obj.gameId.game_num

    def agent_name(self, obj):
        return obj.agent.full_name

class TicketAdmin(admin.ModelAdmin):
    list_display = ('_game', 'game_num', 'redeemed', 'agent_locked', 'cancelled', 'cashier_by', 'choice_list', 'stake', 'multiple_stake', 'won_amount', 
                    'created_at', 'updated_at')
    list_filter = ('cashier_by', '_game', 'created_at', 'updated_at', 'won_amount', 'stake')
    search_fields = ('won_amount', 'cashier_by')
    readonly_fields = ('created_at', 'updated_at')

    def game_num(self, obj):
        return obj._game.game_num

    def agent_name(self, obj):
        return obj.cashier_by.agent.full_name

    def agent_locked(self, obj):
        return obj.cashier_by.agent.locked

admin.site.register(Ticket, TicketAdmin)

class GameAdmin(admin.ModelAdmin):
    list_display = ('game_num', 'game_type','status', 'created_at', 'updated_at')

admin.site.register(Game, GameAdmin)

class SelectionMobileAdmin(admin.ModelAdmin):
    list_display = ('_game', 'created_by', 'choice_list', 'keys_found', 'can_won', 'exact_match', 'lucky', 'stake', 'full_win', 'won_amount', 'created_at', 'updated_at', 'ussid')
    list_filter = ('created_at', 'updated_at', 'lucky', 'full_win')
    search_fields = ('_game__name', 'created_by__username', 'company_by__name', 'agent_by__name', 'ussid')
    readonly_fields = ('created_at', 'updated_at', 'ussid')

# admin.site.register(SelectionMobile, SelectionMobileAdmin)

# admin.site.register(GameMobile)

class GameResultAdmin(admin.ModelAdmin):
    list_display = ('value', 'order', 'gameId', 'game_num', 'resultId', 'game_created_at', 'game_updated_at')
    list_filter = ('gameId', 'value')

    def game_num(self, obj):
        return obj.gameId.game_num

    def game_created_at(self, obj):
        return obj.gameId.created_at

    def game_updated_at(self, obj):
        return obj.gameId.updated_at

admin.site.register(GameResult, GameResultAdmin)


@admin.register(MobileGameAnalytica)
class MobileGameAnalyticaAdmin(admin.ModelAdmin):
    list_display = ('game_num', 'gain_percentage', 'total_tickets', 'total_stake', 'total_won', 'total_gain',  'total_special_prize', 'prize_made', 'expected_gain', 'loss_percent','created_at', 'updated_at')
    list_filter = ('total_stake', 'keno_odd_type', 'gameId', 'choosen_strategy', 'special_prize', 'created_at', 'updated_at')
    search_fields = ('keno_odd_type', 'choosen_strategy')

    def game_num(self, obj):
        return obj.gameId.game_num

class MobileTicketAdmin(admin.ModelAdmin):
    list_display = ('_game', 'game_num', 'redeemed', 'cancelled', 'played_by', 'choice_list', 'stake', 'multiple_stake', 'won_amount', 
                    'created_at', 'updated_at')

    def game_num(self, obj):
        return obj._game.game_num

admin.site.register(MobileTicket, MobileTicketAdmin)


class MobileGameAdmin(admin.ModelAdmin):
    list_display = ('game_num', 'game_type','status', 'created_at', 'updated_at')

admin.site.register(MobileGame, MobileGameAdmin)

class MobileSelectionMobileAdmin(admin.ModelAdmin):
    list_display = ('_game', 'played_by', 'choice_list', 'keys_found', 'can_won', 'exact_match', 'lucky', 'stake', 'full_win', 'won_amount', 'created_at', 'updated_at', 'ussid')
    list_filter = ('created_at', 'updated_at', 'lucky', 'full_win')
    readonly_fields = ('created_at', 'updated_at', 'ussid')

# admin.site.register(SelectionMobile, SelectionMobileAdmin)

# admin.site.register(GameMobile)

class MobileGameResultAdmin(admin.ModelAdmin):
    list_display = ('value', 'order', 'gameId', 'game_num', 'resultId', 'game_created_at', 'game_updated_at')
    list_filter = ('gameId', 'value')

    def game_num(self, obj):
        return obj.gameId.game_num

    def game_created_at(self, obj):
        return obj.gameId.created_at

    def game_updated_at(self, obj):
        return obj.gameId.updated_at

admin.site.register(MobileGameResult, MobileGameResultAdmin)
