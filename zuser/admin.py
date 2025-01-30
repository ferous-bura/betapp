from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User

from .models import Agent, Cashier, Company, Player, LogoutUser


# Define your custom UserAdmin
class UserAdmin(BaseUserAdmin):
    actions = ['grant_agent_permissions', 'grant_cashier_permissions']

    def grant_agent_permissions(self, request, queryset):
        # Define the permission codenames for Agent
        agent_permissions_codenames = ['view_agent', 'change_agent']

        # Get the corresponding permissions
        agent_permissions = Permission.objects.filter(codename__in=agent_permissions_codenames)

        # Grant the permissions to selected users
        for user in queryset:
            user.user_permissions.set(agent_permissions)
        self.message_user(request, f"Agent permissions granted to {queryset.count()} selected users.")

    grant_agent_permissions.short_description = "Grant Agent Permissions"

    def grant_cashier_permissions(self, request, queryset):
        # Define the permission codenames for Cashier
        cashier_permissions_codenames = ['view_cashier', 'change_cashier']

        # Get the corresponding permissions
        cashier_permissions = Permission.objects.filter(codename__in=cashier_permissions_codenames)

        # Grant the permissions to selected users
        for user in queryset:
            user.user_permissions.set(cashier_permissions)
        self.message_user(request, f"Cashier permissions granted to {queryset.count()} selected users.")

    grant_cashier_permissions.short_description = "Grant Cashier Permissions"

admin.site.register(Company)

class AgentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'company', 'agent_capital', 'keno_margin', 'give_away_amount', 'is_open', 'locked')

admin.site.register(Agent, AgentAdmin)
admin.site.register(Cashier)
admin.site.register(Permission)
admin.site.register(ContentType)
admin.site.register(Player)
admin.site.register(LogoutUser)
