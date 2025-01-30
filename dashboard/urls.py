from django.urls import path
from .views import (DashboardView, tickets_view, tickets_statistics_view, game_results_view, game_result_stats_view, shop_reports,
                    ManageCompanies, ManageUserPermissionsView,
                    ManageAgents, ManageCashiers, agents_statistics_view)

app_name = 'dashboard'

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard_view'),
    path('manage-company/', ManageCompanies.as_view(), name='manage_company'),
    path('manage-agent/', ManageAgents.as_view(), name='manage_agent'),
    path('manage-cashier/', ManageCashiers.as_view(), name='manage_cashier'),
    path('manage-permission-group/<int:user_id>/', ManageUserPermissionsView.as_view(), name='manage_permission_group'),
    path('tickets/', tickets_view, name='tickets'),
    path('tickets-statistics/', tickets_statistics_view, name='tickets_statistics'),
    path('game-results/', game_results_view, name='game_results'),
    path('game-stats/', game_result_stats_view, name='game_results_stats'),
    path('shop-reports/', shop_reports, name='shop_agent_reports'),
    path('api-statistics/', agents_statistics_view, name='api_statistics'),
]
