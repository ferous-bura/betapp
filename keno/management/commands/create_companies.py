from django.core.management.base import BaseCommand
from zuser.models import Agent, Cashier, Company
from django.contrib.auth import get_user_model
from faker import Faker

fake = Faker()

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates companies with agents and cashiers'

    def add_arguments(self, parser):
        parser.add_argument('company_quantity', type=int, help='Number of companies to create')
        parser.add_argument('agent_quantity', type=int, help='Number of agents per company to create')
        parser.add_argument('cashier_quantity', type=int, help='Number of cashiers per agent to create')
        parser.add_argument('--password', type=str, help='Password to set for all users', default='qwerty123456')

    def handle(self, *args, **options):
        company_quantity = options['company_quantity']
        agent_quantity = options['agent_quantity']
        cashier_quantity = options['cashier_quantity']
        password = options['password']

        self.create_companies(company_quantity, agent_quantity, cashier_quantity, password)

    def create_companies(self, company_quantity, agent_quantity, cashier_quantity, password):
        for _ in range(company_quantity):
            company = self.company_creator(agent_quantity, cashier_quantity, password)
            if company:
                self.stdout.write(self.style.SUCCESS('Successfully created company'))
            else:
                self.stdout.write(self.style.ERROR('Failed to create company'))

    def company_creator(self, agent_quantity, cashier_quantity, password):
        username = fake.company().replace(" ", "").lower()
        user = User.objects.create_user(username=username, password=password)
        company = Company.objects.create(
            company_user=user,
            company_address=fake.address(),
            company_phone_number=fake.phone_number(),
            company_capital=fake.random_number(digits=6),
            margin=fake.random_int(min=20, max=40)
        )

        for _ in range(agent_quantity):
            agent = self.agent_creator(company, cashier_quantity)
            if agent:
                self.stdout.write(self.style.SUCCESS('Successfully created agent'))
            else:
                self.stdout.write(self.style.ERROR('Failed to create agent'))

        return company

    def agent_creator(self, company, cashier_quantity):
        agent = Agent.objects.create(
            full_name=fake.name(),
            company=company,
            agent_capital=fake.random_number(digits=5),
            phone_number=fake.phone_number(),
            agent_margin=fake.random_int(min=5, max=70)
        )

        for _ in range(cashier_quantity):
            cashier = self.cashier_creator(agent)
            if cashier:
                self.stdout.write(self.style.SUCCESS('Successfully created cashier'))
            else:
                self.stdout.write(self.style.ERROR('Failed to create cashier'))

        return agent

    def cashier_creator(self, agent):
        username = f"{agent.full_name}.c{Cashier.objects.filter(agent=agent).count()}"
        username = username.replace(" ", "").lower()
        user = User.objects.create_user(username=username, password='qwerty123456')
        cashier = Cashier.objects.create(cashier=user, agent=agent)
        return cashier
