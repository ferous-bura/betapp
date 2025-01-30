import time
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import reverse
from django.views import View
from django.contrib.auth.models import Group, Permission
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_GET

from game_utils.auth_decorators import is_system_user, user_type_redirect
from dashboard.analyzer import get_initial_data
from dashboard.balance_sheet import get_agents_summary, get_statistics, get_total_statistics, ticket_statistics_area, truncate_decimal, zticket_statistics_area
from keno.models import Game, Ticket, GameResult
from game_utils.time_file import single_date
from zuser.forms import AgentForm, CompanyCreateForm
from zuser.models import Agent, Cashier, Company

User = get_user_model()


@method_decorator(user_type_redirect, name='dispatch')
class DashboardView(View):
    template_name = "dashboard/index.html"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    def get(self, request, *args, **kwargs):
        self.context = self.get_context_data(request)
        return render(request, self.template_name, self.context)

    def post(self, request, *args, **kwargs):
        self.context = self.get_context_data(request)
        return render(request, self.template_name, self.context)

    def get_context_data(self, request):
        companies = Company.objects.all()
        agents = Agent.objects.all()
        cashiers = Cashier.objects.all()
        self.context = self.system(companies, agents) if is_system_user(request.user) else self.company(request, agents, cashiers)
        return self.context

    def company(self, request, agents, cashiers):
        daily_gain_loss_com = Ticket.objects.daily_total_gain_loss_com(request)
        weekly_gain_loss_com = Ticket.objects.weekly_total_gain_loss_com(request)
        initial_data = []
        start_time = time.time()
        all_agents_summary = get_agents_summary(request.user.company_user)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Time taken to process get_agents_summary: {elapsed_time} seconds")
        for agent in agents:
            initial_data = get_initial_data(agent)
        statistics_area = ticket_statistics_area()
        zticket = zticket_statistics_area()
        print(f'zticket {zticket}')
        self.company_context = {
            'initial_data': initial_data,
            'form': CompanyCreateForm(),
            'total_cashiers':cashiers.count(),
            'total_agents':agents.count(),
            'daily_gain_loss': daily_gain_loss_com,
            'weekly_gain_loss': weekly_gain_loss_com,
            'all_agents_summary': all_agents_summary,
            'statistics_area': statistics_area,
            'zticket_statistics_area': zticket,
        }
        self.active_agents(request)
        return self.company_context

    def system(self, companies, agents):
        daily_gain_loss_sys = Ticket.objects.daily_total_gain_loss()
        weekly_gain_loss_sys = Ticket.objects.weekly_total_gain_loss()

        self.system_context = {
            'user_type': 'system',
            'add_type': 'Add System',
            'companies': companies,
            'agents': agents,
            'total_companies':companies.count(),
            'total_agents':agents.count(),
            'daily_gain_loss': daily_gain_loss_sys,
            'weekly_gain_loss': weekly_gain_loss_sys,
        }
        return self.system_context

    def active_agents(self, request):
        company_id = request.user.company_user
        open_agents = Company.objects.has_open(company_id)
        locked_agents = Company.objects.has_locked(company_id)
        all_agents = Company.objects.all_agents(company_id)
        all_cashiers = Agent.objects.filter_cashiers(company_id)
        open_agent_count = open_agents.count() if open_agents.count() > 0 else 0
        locked_agents_count = locked_agents.count() if locked_agents.count() > 0 else 0
        total_agents_count = all_agents.count() if all_agents.count() > 0 else 0
        total_cashiers_count = len(all_cashiers) if len(all_cashiers) > 0 else 0
        open_agent_count_perc = truncate_decimal((open_agent_count / total_agents_count) * 100) if total_agents_count > 0 else 0

        self.company_context.update({
            'total_cashiers_count': total_cashiers_count,
            'total_agent_count': total_agents_count,
            'open_agent_count': open_agent_count,
            'locked_agents_count': locked_agents_count,
            'open_agent_count_perc': open_agent_count_perc,
        })

    def perform_search(self, queryset):
        # Add your search logic here
        # Example: Searching based on a query parameter
        search_query = self.request.GET.get('search_query', '')
        if search_query:
            queryset = queryset.filter(your_search_field__icontains=search_query)
        return queryset

@method_decorator(user_type_redirect, name='dispatch')
class ManageCompanies(View):
    template_name = 'dashboard/manage_companies.html'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def get(self, request, *args, **kwargs):
        all_companies = Company.objects.all()
        companies_with_permissions = []
        for company in all_companies:
            agents = company.agents.all()
            permissions = company.company_user.user_permissions.values_list('codename', flat=True)
            groups = list(company.company_user.groups.values_list('name', flat=True)) or None
            companies_with_permissions.append({
                'company': company,
                'permissions': permissions,
                'groups': groups,
                'agents': agents,
            })

        self.context = {
            'companies': companies_with_permissions,
            'form': CompanyCreateForm(),
        }

        return render(request, self.template_name, self.context)

    def post(self, request, *args, **kwargs):

        all_companies = Company.objects.all()
        companies_with_permissions = []
        for company in all_companies:
            agents = company.agents.all()
            permissions = company.company_user.user_permissions.values_list('codename', flat=True)
            groups = list(company.company_user.groups.values_list('name', flat=True)) or None
            companies_with_permissions.append({
                'company': company,
                'permissions': permissions,
                'groups': groups,
                'agents': agents,
            })

        self.context = {
            'companies': companies_with_permissions,
            'form': CompanyCreateForm(),
        }
        form = CompanyCreateForm(request.POST)
        if form.is_valid():
            form.save()
            form = CompanyCreateForm()
            self.context['form'] = form
            return redirect(reverse('dashboard:manage_company'))
        return render(request, self.template_name, self.context)

@method_decorator(user_type_redirect, name='dispatch')
class ManageAgents(View):
    template_name = 'dashboard/manage_agents.html'

    def get_form(self, request, data=None):
        company = request.user.company_user
        form = AgentForm(company, data)
        form.fields['company'].initial = company
        return form

    def get_all_agents(self, request):
        agents_list = Agent.objects.filter_agents_by_company(request.user.company_user)
        return [
            {
                'agent': agent,
            }
            for agent in agents_list
        ]

    def get(self, request, *args, **kwargs):
        form = self.get_form(request)
        self.context = {'form': form, 'agents': self.get_all_agents(request)}
        return render(request, self.template_name, self.context)

    def post(self, request, *args, **kwargs):
        form = self.get_form(request, request.POST)
        if form.is_valid():
            form.save()
            self.context = {'form': self.get_form(request), 'agents': self.get_all_agents(request)}
            return render(request, self.template_name, self.context)
        else:
            self.context = {'form': form, 'agents': self.get_all_agents(request)}
        return render(request, self.template_name, self.context)

@method_decorator(user_type_redirect, name='dispatch')
class ManageCashiers(View):
    template_name = 'dashboard/manage_cashiers.html'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.context = {'status': 'Active'}

    def get(self, request, *args, **kwargs):
        self.create_context(request)
        return render(request, self.template_name, self.context)

    def post(self, request, *args, **kwargs):
        selected_agent = request.POST.get('agents_list')
        print(selected_agent)
        if request.method == 'POST':
            agent = get_object_or_404(Agent, pk=selected_agent)
            cashiers = Cashier.objects.filter(agent=agent)
            cashier_count = cashiers.count()
            quantity = int(request.POST.get('quantity'))
            for q in range(quantity):
                username = f"{agent.full_name}.c{cashier_count + q}"
                username = username.replace(" ", "").lower()
                password = request.POST.get('pw')
                if User.objects.filter(username=username).exists():
                    username = f"{username}-{q}"
                user = User.objects.create_user(username=username, password=None)
                user.set_password(password)
                user.save()
                new_cashier = Cashier.objects.create(
                    cashier=user, agent=agent
                )
                print(f'user: {user} ,  new_cashier: {new_cashier}')
            return redirect(reverse('dashboard:manage_cashier'))
        # return redirect(reverse('dashboard:manage_agent'))
        self.create_context(request)
        return render(request, self.template_name, self.context)

    def create_context(self, request):
        agents_list = Agent.objects.filter_agents_by_company(request.user.company_user)
        selection_game_manager = Ticket.objects.get_selection_games_info_by_cashier
        cashiers_list = []
        cashier_info = {}
        for agent in agents_list:
            cashiers_list.extend(Cashier.objects.filter(agent=agent))
        for cashier in cashiers_list:
            count_bets, total_choice_count = selection_game_manager(cashier)
            cashier_info[cashier] = {'count_bets': count_bets, 'total_choice_count': total_choice_count}
        self.context = {'agents': agents_list, 'cashier_info': cashier_info}

@method_decorator(user_type_redirect, name='dispatch')
class ManageUserPermissionsView(View):
    template_name = 'dashboard/manage_permissions.html'

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        groups = Group.objects.all()
        permissions = Permission.objects.all()

        return render(request, self.template_name, {'user': user, 'groups': groups, 'permissions': permissions})

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        # Handle adding or removing permissions
        permissions_to_add = request.POST.getlist('permissions_to_add')
        permissions_to_remove = request.POST.getlist('permissions_to_remove')

        for permission_id in permissions_to_add:
            permission = get_object_or_404(Permission, id=permission_id)
            user.user_permissions.add(permission)

        for permission_id in permissions_to_remove:
            permission = get_object_or_404(Permission, id=permission_id)
            user.user_permissions.remove(permission)

        # Handle adding or removing from groups
        groups_to_add = request.POST.getlist('groups_to_add')
        groups_to_remove = request.POST.getlist('groups_to_remove')

        for group_id in groups_to_add:
            group = get_object_or_404(Group, id=group_id)
            user.groups.add(group)

        for group_id in groups_to_remove:
            group = get_object_or_404(Group, id=group_id)
            user.groups.remove(group)

        return render(request, self.template_name, {'user': user, 'message': 'Permissions and groups updated successfully.'})

def agents_statistics_view(request):
    agents = request.GET.getlist('agents[]')
    selected_date = request.GET.get('selectedDate')
    print(selected_date)
    start_date = request.GET.get('fromDate')
    end_date = request.GET.get('toDate')
    company = request.user.company_user
    agent_ids = agents if agents else None
    try:
        if agent_ids is None:
            all_agents = Agent.objects.filter(company=company)  # Filter by multiple agent ids
        else:
            all_agents = Agent.objects.filter(id__in=agent_ids, company=company)  # Filter by multiple agent ids
    except Agent.DoesNotExist:
        return JsonResponse({'error': 'Company is not found'}, status=404)
    statistics = get_statistics(all_agents, selected_date, start_date, end_date)
    statistics_card = get_total_statistics(statistics)
    return JsonResponse({'ticket_statistics':statistics, 'statistics_card': statistics_card})

def shop_reports(request):
    selected_date = request.GET.get('selectedDate')
    start_date = request.GET.get('fromDate')
    end_date = request.GET.get('toDate')
    company = request.user.company_user
    all_agents = Agent.objects.filter(company=company)
    statistics = get_statistics(all_agents, selected_date, start_date, end_date)
    context = {'ticket_statistics':statistics}
    return render(request, "dashboard/shop-reports.html", context)

def tickets_view(request):
    company = request.user.company_user
    all_cashiers = Cashier.objects.filter(agent__company=company)
    context = {'all_cashiers':all_cashiers}
    return render(request, "dashboard/tickets.html", context)

def tickets_statistics_view(request):
    selected_cashiers = request.GET.getlist('selectCashiers[]')
    from_date = request.GET.get('fromDate')
    to_date = request.GET.get('toDate')
    page_number = request.GET.get('page')
    page_size = request.GET.get('page_size')
    company=request.user.company_user
    tickets = Ticket.objects.filter(cashier_by__cashier__id__in=selected_cashiers, cashier_by__agent__company=company).order_by('-created_at')
    if from_date and to_date:
        tickets = tickets.filter(created_at__range=[from_date, to_date])
    statistics = fetch_statistics(tickets, page_number, page_size)
    has_next = statistics.has_next()
    serialized_statistics = serialize_statistics(tickets)
    return JsonResponse({'ticket_statistics': serialized_statistics, 'has_next': has_next})

def fetch_statistics(tickets, page_number, page_size):
    paginator = Paginator(tickets, page_size)
    try:
        page_tickets = paginator.page(page_number)
        has_next = page_tickets.has_next()
    except PageNotAnInteger:
        page_tickets = paginator.page(1)
        has_next = page_tickets.has_next()
    except EmptyPage:
        page_tickets = []
        has_next = False
    page = paginator.get_page(page_number)
    return page

def serialize_statistics(statistics):
    serialized_statistics = [
        {
            'agent_name': stat.cashier_by.agent.full_name,
            'cashier_username': stat.cashier_by.cashier.username,
            'gross_stake': stat.stake,
            'game_num': stat._game.game_num,
            'net_winning': stat.won_amount,
            'code': Ticket.objects.generate_unique_ticket_identifier(stat.id, stat._game.game_num),
            'date': stat.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # Format date as desired
            'redeemed': stat.redeemed,
            'cancelled':stat.cancelled
        }
        for stat in statistics
    ]

    return serialized_statistics

@login_required
def game_results_view(request):
    company = request.user.company_user
    all_agents = Agent.objects.filter(company=company)
    return render(request, "dashboard/game-results.html", context=({'all_agents':all_agents}))

@require_GET
def game_result_stats_view(request):
    agent_id = request.GET.get('selectAgent')
    date = request.GET.get('date')
    if agent_id:
        agent = get_object_or_404(Agent, pk=agent_id)
        games = Game.objects.filter(status='CLOSED').order_by('-created_at')
        date = single_date(date)
        games = games.filter(created_at__date=date)
        serialized_results = serialize_results(games, agent)
        return JsonResponse({'game_results': serialized_results})
    else:
        return JsonResponse({'game_results':'[]'})

def serialize_results(games, agent):
    serialized_results = [
        {
            'shop': agent.full_name,
            'game_id': game.game_num,
            'action': game.status,
            'result': GameResult.objects.filter_by_game_and_agent(game.id, agent)
        }
        for game in games
    ]

    return serialized_results
