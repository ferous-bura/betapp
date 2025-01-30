from django.utils import timezone
from django.db import models
from django.contrib.auth.models import Group, User
from django.http import Http404
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator
from game_utils.time_file import get_local_time_now
from datetime import timedelta

ODD_CHOICES = [
    ('promo4', 'Promo 4'),
    ('mohio', 'Mohio'),
    ('promo', 'Promo'),
    ('promo2', 'Promo 2'),
    ('promo3', 'Promo 3'),
    ('promo5', 'Promo 5'),
    ('promo6', 'Promo 6'),
    ('type1', 'Type 1'),
    ('type2', 'Type 2'),
    ('mohio2', 'Mohio 2'),
]


class Role(models.Model):
    name = models.CharField(max_length=255, unique=True)
    group = models.OneToOneField(Group, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"


class System(models.Model):
    system_address = models.TextField()
    system_time_created = models.DateTimeField(auto_now_add=True)
    system_time_updated = models.DateTimeField(auto_now=True)
    system_name = models.CharField(max_length=255)
    system_email = models.EmailField()
    system_phone_number = models.CharField(max_length=20)

    # class Meta:
    #     permissions = [
    #         ("add_system_custom", "Can add system"),
    #         ("change_system_custom", "Can change system"),
    #         ("delete_system_custom", "Can delete system"),
    #     ]

    def __str__(self):
        return self.system_name


class CompanyUserManager(models.Manager):
    def has_open(self, company):
        open_agent_exists = company.agents.filter(is_open=True)
        return open_agent_exists

    def has_locked(self, company):
        locked_agent_exits = company.agents.filter(locked=True)
        return locked_agent_exits

    def all_agents(self, company):
        agents = company.agents.all()
        return agents


class Company(models.Model):
    company_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="company_user")
    company_address = models.TextField(default="123 Main Street, City")
    company_phone_number = models.CharField(max_length=20, null=True, blank=True, default="555-1234")
    company_capital = models.DecimalField(max_digits=10, decimal_places=2, default=100000.00)
    subscription_start = models.DateTimeField(null=True, blank=True, default=None)
    subscription_end = models.DateTimeField(null=True, blank=True, default=None)
    margin = models.IntegerField(default=10, blank=True, null=True, validators=[
            MinValueValidator(5),
            MaxValueValidator(50),
        ])
    objects = CompanyUserManager()

    # class Meta:
    #     permissions = [
    #         ("add_company_custom", "Can add company"),
    #         ("change_company_custom", "Can change company"),
    #         ("delete_company_custom", "Can delete company"),
    #     ]

    def __str__(self):
        return f"{self.company_user.first_name}'s Company"

    def get_absolute_url(self):
        return reverse('zuser:company_detail', kwargs={'company_id': self.pk})


class AgentUserManager(models.Manager):
    def filter_agents_by_company(self, company):
        return self.filter(company=company)

    def filter_cashiers(self, company):
        agents = Agent.objects.filter(company=company)
        cashiers = Cashier.objects.filter(agent__in=agents)
        return cashiers

    def non_member_users(self):
        return self.filter(company__isnull=True, agent_user__isnull=True)

    def active_agents(self, company):
        """
        Get active agents under a company.
        """
        return self.get_queryset().filter(company=company).filter(is_open=True)

    def get_unique_agent_or_404(self, u_id):
        """
        Returns a tuple containing the unique agent and its full name based on the combination of company and agent ID.
        Raises Http404 if no matching agent is found.
        """
        try:
            unique_agent = self.get_queryset().get(u_id=u_id)
            return unique_agent
        except Agent.DoesNotExist:
            raise Http404("Agent does not exist")

    def get_agent_by_username(self, username):
        """
        Retrieves the agent based on the username.
        """
        try:
            # first_name, last_name = full_name.split('_', 1)
            return self.get(full_name=username)
        except (ValueError, Http404):
            raise Http404("Invalid username or agent does not exist")

    def latest_summary(self):
        try:
            return self.latest('updated_at')
        except Agent.DoesNotExist:
            return None

class Agent(models.Model):

    full_name = models.CharField(max_length=100)
    give_away_amount = models.IntegerField(default=0)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='agents')
    agent_capital = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    agent_address = models.TextField(default="123 Main Street, City")
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True, default="555-1234")
    keno_margin = models.IntegerField(default=10, blank=True, null=True, validators=[
            MinValueValidator(5),
            MaxValueValidator(50),
        ])
    spin_margin = models.IntegerField(default=10, blank=True, null=True, validators=[
        MinValueValidator(5),
        MaxValueValidator(50),
    ])
    spin_give_away_amount = models.IntegerField(default=0)

    is_open = models.BooleanField(default=False)
    locked = models.BooleanField(default=False,  verbose_name="lock agent?")
    keno_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')
    spin_odd_type = models.CharField(max_length=20, choices=ODD_CHOICES, default='promo4')

    updated_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now=True)
    objects = AgentUserManager()
    u_id = models.CharField(max_length=100, default='')

    # def __str__(self):
    #     return f"Agent: {self.full_name}"

    def get_absolute_url(self):
        return reverse('zuser:agent_detail', kwargs={'agent_id': self.pk})

    def generate_username(self):
        """
        Generates a unique username combining the agent's ID and full name.
        """
        return f"{self.id}_{self.full_name.replace(' ', '_')}"

class Cashier(models.Model):
    cashier = models.OneToOneField(User, on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='cashier')
    lock = models.BooleanField(default=False)
    has_access = models.BooleanField(default=False)

    @property
    def user(self, request):
        return User.objects.get_user_from_request(request)

    def __str__(self):
        return f"Cashier: {self.cashier.username}, Agent: {self.agent.full_name}"

    def get_absolute_url(self):
        return reverse('zuser:cashier_detail', kwargs={'cashier_id': self.pk})


class PlayerUserManager(models.Manager):
    pass


class Player(models.Model):
    player = models.OneToOneField(User, on_delete=models.CASCADE)
    lock = models.BooleanField(default=False)
    give_away_amount = models.IntegerField(default=0)

    @property
    def user(self, request):
        return User.objects.get_user_from_request(request)

class GameHistoryManager(models.Manager):
    def get_benefit_percent(self):
        try:
            admin_user = User.objects.get(username='admin')

            game_history = self.get(owner=admin_user)
            return game_history.keno_margin
        except (User.DoesNotExist, GameHistory.DoesNotExist):
            return None


class GameHistory(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    giveaway = models.IntegerField(null=True, blank=True)
    keno_margin = models.IntegerField(default=20)

    objects = GameHistoryManager()


def check_time_difference(logout_user):
    updated_at = logout_user.updated_at
    current_time = get_local_time_now()
    time_difference = current_time - updated_at
    if time_difference < timedelta(days=7):
        print('less than 1 min')
    else:
        logout_user.loggout = True
        logout_user.save()
    return logout_user

class LogoutUser(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='loggeduser')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)
    loggout = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.pk is None:  # Check if the object is being created for the first time
            self.created_at = get_local_time_now()
        self.updated_at = get_local_time_now()
        super().save(*args, **kwargs)


