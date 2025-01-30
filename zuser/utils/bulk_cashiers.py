from zuser.models import Agent, Cashier, Company
from django.contrib.auth import get_user_model
from faker import Faker

fake = Faker()

User = get_user_model()

# def margin_modifier():

def company_creator():
    username = fake.company()
    username = username.replace(" ", "").lower()
    password = 'poiuy09876' # **qwerty123456$#
    first_name = 'MayaBet'
    last_name = '0989587072'
    user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name)
    company = Company.objects.create(
        company_user=user,
        company_address=fake.address(),
        company_phone_number=fake.phone_number(),
        company_capital=fake.random_number(digits=6),
        margin=fake.random_int(min=20, max=40)
    )
    quantity = 3
    for i in range(quantity):
        try:
            agent = agent_creator(company)
            print(f'{i}.agent: {agent}')
        except Exception as e:
            print(e)
            return None
    return True


def agent_creator(company):
    agent = Agent.objects.create(
        full_name=fake.name(),
        company=company,
        agent_capital=fake.random_number(digits=5),
        phone_number=fake.phone_number(),
        keno_margin=30,
        u_id='unknown'
    )
    quantity = 3
    for i in range(quantity):
        try:
            cashier = cashier_creator(agent, i)
            print(f'--{i}.cashier: {cashier}')
        except Exception as e:
            print(e)

def cashier_creator(agent, i):
    cashiers = Cashier.objects.filter(agent=agent)
    cashier_count = cashiers.count()
    username = f"{agent.full_name}.c{cashier_count + i}"
    username = username.replace(" ", "").lower()
    password = 'qwerty123456'
    user = User.objects.create_user(username=username, password=password)
    cashier = Cashier.objects.create(
        cashier = user, agent = agent
    )
    return cashier
