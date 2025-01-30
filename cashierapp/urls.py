from django.urls import path
from .views import (
        CashierView, 
        CashierDashboard, 
        cashier_tickets_statistics_view, 
        game_result_stats_view, 
        cashier_tickets_view, 
    )
from .spin_view import CashierSpinView

app_name = 'cashierapp'

urlpatterns = [
    path('', CashierView.as_view(), name='cashier_url'),
    path('spin-view/', CashierSpinView.as_view(), name='cashierspin_url'),
    path('cashier-dashboard/', CashierDashboard.as_view(), name='dashboard'),
    path('cashier-tickets/', cashier_tickets_statistics_view, name='cashier_tickets'),
    path('all-tickets/', cashier_tickets_view, name='all_tickets'),
    path('game-stats/', game_result_stats_view, name='game_results_stats'),
]
