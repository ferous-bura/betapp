import os
import django
from django.contrib.auth.models import User
from allauth.account.models import EmailAddress
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
django.setup()


def create_user(i):
    fake = Faker()
    first_name = f"COM_{fake.first_name()}" if i < 11 else fake.first_name()
    last_name = fake.last_name()
    username = fake.user_name()
    password = fake.password()
    email = fake.email()

    # Create a user
    user = User.objects.create_user(username=username, password=password, email=email,
                                    first_name=first_name, last_name=last_name)

    # Confirm the user's email address
    EmailAddress.objects.create(user=user, email=email, primary=True, verified=True)

    print(f"User created: {user.username}")

if __name__ == "__main__":
    for i in range(1,101):
        create_user(i)
