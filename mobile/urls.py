from django.urls import path
from .views import (MobilePlayers, get_result, main_page, mobile_keno, get_live_bets, get_results,
mobile_bingo, bingo_card_results, get_bingo_cards, mobile_spin, mobile_dice)
app_name = 'mobile'

urlpatterns = [
    path('', main_page, name='keno'),
    path('index/', MobilePlayers.as_view(), name='index'),
    path('latest/', get_result, name='get_latest_result'),
    path('keno-req/', mobile_keno, name='keno_req'),
    path('get-live-bets/', get_live_bets, name='get_live_bets'),
    path('keno-results/', get_results, name='keno_results'),
    path('bingo/', mobile_bingo, name='bingo'),
    path('bingo-results/', bingo_card_results, name='bingo_results'),
    path('bingo-cards/', get_bingo_cards, name='get-bingo-cards'),
    path('spin/', mobile_spin, name='spin'),
    path('dice/', mobile_dice, name='dice'),
]
