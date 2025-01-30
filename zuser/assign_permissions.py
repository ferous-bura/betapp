from django.contrib.auth.models import Group, Permission


def is_cashier_with_access(user):
    return user.groups.filter(name='Cashier').exists() and user.cashier.has_access

def assign_player_permissions(sender, instance, **kwargs):
    permiss_codenames = ['view_player', 'change_player']
    permiss = Permission.objects.filter(codename__in=permiss_codenames)
    instance.player.user_permissions.set(permiss)
    player_group = None

    try:
        player_group = Group.objects.get(name='Player')
    except Group.DoesNotExist:
        print("One or both of the groups do not exist.")

    if player_group:
        instance.player.groups.set([player_group])
        print("Player user permissions and groups assigned successfully.")
    else:
        print("Player user permissions assigned, but one or both groups do not exist.")

def assign_cashier_permissions(sender, instance, **kwargs):
    selection_game_permissions_codenames = ['add_ticket', 'view_ticket', 'change_ticket']
    selection_game_permissions = Permission.objects.filter(codename__in=selection_game_permissions_codenames)
    instance.cashier.user_permissions.set(selection_game_permissions)
    cashier_group = None

    try:
        cashier_group = Group.objects.get(name='Cashier')
    except Group.DoesNotExist:
        print("One or both of the groups do not exist.")

    if cashier_group:
        instance.cashier.groups.set([cashier_group])
        print("Cashier user permissions and groups assigned successfully.")
    else:
        print("Cashier user permissions assigned, but one or both groups do not exist.")


def assign_agent_permissions(sender, instance, **kwargs):
    agent_permissions_codenames = ['view_agent']
    cashier_permissions_codenames = ['add_cashier', 'view_cashier', 'change_cashier', 'lock_cashier']
    agent_permissions = Permission.objects.filter(codename__in=agent_permissions_codenames)
    cashier_permissions = Permission.objects.filter(codename__in=cashier_permissions_codenames)
    instance.agent_user.user_permissions.set(agent_permissions | cashier_permissions)
    agent_group = None

    try:
        agent_group = Group.objects.get(name='Agent Admin')
    except Group.DoesNotExist:
        print("One or both of the groups do not exist.")

    if agent_group:
        instance.agent_user.groups.set([agent_group])
        print("Agent user permissions and groups assigned successfully.")
    else:
        print("Agent user permissions assigned, but one or both groups do not exist.")


def assign_company_permissions(sender, instance, **kwargs):
    agent_permissions_codenames = ['add_agent', 'view_agent', 'change_agent', 'lock_agent']
    cashier_permissions_codenames = ['view_cashier', 'change_cashier']
    agent_permissions = Permission.objects.filter(codename__in=agent_permissions_codenames)
    cashier_permissions = Permission.objects.filter(codename__in=cashier_permissions_codenames)
    instance.company_user.user_permissions.set(agent_permissions | cashier_permissions)
    company_group = None

    try:
        company_group = Group.objects.get(name='Company Admin')
    except Group.DoesNotExist:
        print("One or both of the groups do not exist.")

    if company_group:
        instance.company_user.groups.set([company_group])
        print("Company user permissions and groups assigned successfully.")
    else:
        print("Company user permissions assigned, but one or both groups do not exist.")


def create_or_get_group(name):
    group, created = Group.objects.get_or_create(name=name)
    if created:
        print(f"Group '{name}' created.")
    else:
        pass
    return group


def create_groups():
    group_names = [
        'System Admin', 'System Staff', 'System Accountant', 'System IT',
        'Company Admin', 'Company IT', 'Company Staff', 'Company Accountant',
        'Agent Admin', 'Cashier' , 'Player'
    ]

    groups = [create_or_get_group(name) for name in group_names]

    return groups


def assign_permissions_to_groups(_groups):
    # Define a list of permission codenames
    permission_codenames = [
        'add_system', 'view_system', 'change_system', 'delete_system', 'lock_system',
        'add_company', 'view_company', 'change_company', 'delete_company', 'lock_company',
        'add_agent', 'view_agent', 'change_agent', 'delete_agent', 'lock_agent',
        'add_cashier', 'view_cashier', 'change_cashier', 'delete_cashier', 'lock_cashier', 
        'add_ticket', 'view_ticket', 'change_ticket', 'view_player', 'change_player'
    ]
    
    permissions = [Permission.objects.get(codename=codename) for codename in permission_codenames]

    for group in _groups:
        group.permissions.set(permissions)

    print("Groups and permissions created successfully.")


_groups = create_groups()
# assign_permissions_to_groups(_groups)
