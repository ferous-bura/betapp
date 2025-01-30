from django.urls import path, include
# from allauth.account.views import LoginView

from .views import (
	company_list, lock_agent,
	company_detail, 
	company_create, 
	company_update, 
	company_delete, agent_detail, cashier_create, cashier_detail, login_view,
    signup_view, forgot_password_view,create_superuser_view, logout_view, change_password)
app_name = 'zuser'

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('forgot-password/', forgot_password_view, name='forgot_password'),
    path('create-superuser/', create_superuser_view, name='create_superuser'),
    path('logout/', logout_view, name='logout'),
    # path('', LoginView.as_view(), name='home-to-login'),
    path('company/', company_list, name='company_list'),
    path('company/<int:company_id>/', company_detail, name='company_detail'),
    path('company/create/', company_create, name='company_create'),
    path('company/<int:company_id>/update/', company_update, name='company_update'),
    path('company/<int:company_id>/delete/', company_delete, name='company_delete'),
    path('agent/<int:agent_id>/', agent_detail, name='agent_detail'),
    path('agent-lock/<int:agent_id>/', lock_agent, name='agent_lock_unlock'),
    path('cashier-create/<int:agent_id>/', cashier_create, name='cashier_create'),
    path('cashier-detail/<int:cashier_id>/', cashier_detail, name='cashier_detail'),
    path('change-password/', change_password, name='change_password'),
]
