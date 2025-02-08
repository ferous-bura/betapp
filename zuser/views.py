from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse

from django.contrib.auth import get_user_model, logout, authenticate, login
from django.contrib.auth.forms import PasswordResetForm, UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.utils.decorators import method_decorator
from game_utils.auth_decorators import user_type_redirect
from .models import Company, Agent, Cashier, Player
from .forms import CompanyForm, AgentForm, ChangePasswordForm

def create_superuser_view(request):
    template_name = 'account/create_superuser.html'
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            # Redirect to some page indicating successful superuser creation
            return redirect('/admin')
    else:
        form = UserCreationForm()
    return render(request, template_name, {'form': form})

def logout_view(request):
    logout(request)
    # Redirect to some page after logout
    return redirect('/zuser/login/')  # Replace 'index' with the name of your desired page

def signup_view(request):
    success_url_name = '/mobile/'
    template_name = 'registration/signup.html'
    form_class = UserCreationForm

    if request.method == 'POST':
        form = form_class(request.POST)
        if form.is_valid():
            user = form.save()
            # Create a Player associated with the newly created user
            Player.objects.create(player=user)
            # Redirect to login page or some other page after successful account creation
            return redirect(success_url_name)
    else:
        form = form_class()

    # Add 'form-control' class to form fields
    for field in form.fields.values():
        field.widget.attrs.update({'class': 'form-control'})

    # Add placeholders to the fields
    form.fields['username'].widget.attrs['placeholder'] = 'Username'
    form.fields['password1'].widget.attrs['placeholder'] = 'Password'
    form.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'

    return render(request, template_name, {'form': form})

def forgot_password_view(request):
    success_url_name = '/users/login'
    template_name = 'account/forgot_password2.html'
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            form.save()
            # Redirect to password reset done page
            return redirect(success_url_name)
    else:
        form = PasswordResetForm()
    return render(request, template_name, {'form': form})

def login_view(request):
    template_name = 'registration/new_login.html'
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_staff:
                    return redirect('/admin')
                login(request, user)
                #messages.success(request, f"Success: Login Successful!")
                return redirect(reverse("cashierapp:cashier_url"))
        else:
            messages.error(request, f"Error: Invalid username or password!")
            return redirect('zuser:login')
    else:
        form = AuthenticationForm(request)
    return render(request, template_name, {'form': form})

# @method_decorator(user_type_redirect, name='dispatch')
def change_password(request):
    cashier_id = request.GET.get('cashier_id')
    cashier = get_object_or_404(Cashier, pk=cashier_id)
    user = cashier.cashier

    if request.method == 'POST':
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            new_password = form.cleaned_data['new_password']
            confirm_new_password = form.cleaned_data['confirm_new_password']
            if new_password == confirm_new_password:
                user.set_password(new_password)
                user.save()
                messages.success(request, 'Password changed successfully.')
            else:
                messages.error(request, 'Passwords do not match.')
            return JsonResponse({'messages': messages})
    else:
        print('change password GET')
        pass

def cashier_detail(request, cashier_id):
    cashier = get_object_or_404(Cashier, pk=cashier_id)
    user = cashier.cashier

    if request.method == 'POST':
        cashier_name = request.POST.get('cashier_name')
        password = request.POST.get('password')
        has_access = request.POST.get('has_access')
        user.username = cashier_name
        if password:
            user.set_password(password)
        if has_access == 'on':
            cashier.has_access = True
        else:
            cashier.has_access = False
        cashier.save()
        user.save()
        messages.success(request, 'Cashier information updated successfully.')
        return redirect('zuser:cashier_detail', cashier_id=cashier.id)
    return render(request, 'zuser/cashier_detail.html', {'cashier': cashier})

def lock_agent(request, agent_id):
    agent = get_object_or_404(Agent, pk=agent_id)
    if request.method == 'POST':
        agent.locked = False if agent.locked else True
        agent.save()
        return redirect(reverse('dashboard:manage_agent'))

def agent_detail(request, agent_id):
    agent = get_object_or_404(Agent, pk=agent_id)
    user_company = agent.company
    cashiers = Cashier.objects.filter(agent=agent)
    if request.method == 'POST':
        form = AgentForm(user_company, request.POST)
        if form.is_valid():
            # form.cleaned_data['agent_user'] = agent
            form.save()
            return redirect(reverse('dashboard:manage_agent'))
        else:
            pass
    else:
        form = AgentForm(user_company, instance=agent)
        pw_form =  ChangePasswordForm()
        return render(request, 'zuser/cashier_list.html', {'agent': agent, 'form': form, 'cashiers': cashiers, 'pw_form': pw_form})

def cashier_create(request, agent_id):
    if request.method == 'POST':
        agent = get_object_or_404(Agent, pk=agent_id)
        cashiers = Cashier.objects.filter(agent=agent)
        print(cashiers)
        cashier_count = cashiers.count() if cashiers else 0
        print(cashier_count)
        quantity = int(request.POST.get('quantity'))
        User = get_user_model()
        phone = agent.phone_number
        for q in range(quantity):
            username = f"{agent.full_name}.c{cashier_count + q}"
            username = username.replace(" ", "").lower()
            password = request.POST.get('pw')
            if User.objects.filter(username=username).exists():
                username = f"{username}-{q}"

            # Create user without setting the password directly
            user = User.objects.create_user(username=username, password=None)
            user.set_password(password)  # Set password separately
            user.save()  # Save user after setting password

            new_cashier = Cashier.objects.create(
                cashier=user, agent=agent
            )
            print(f'user: {user}, new_cashier: {new_cashier}')
    return redirect('dashboard:manage_agent')

def company_list(request):
    companies = Company.objects.all()
    return render(request, 'zuser/company_list.html', {'companies': companies})

@method_decorator(user_type_redirect, name='dispatch')
def company_detail(request, company_id):
    company = get_object_or_404(Company, pk=company_id)
    if request.method == 'POST':
        form = CompanyForm(request.POST, instance=company)
        if form.is_valid():
            form.save()
            return redirect(reverse('dashboard:manage_company'))
    else:
        form = CompanyForm(instance=company)
    context = {'company': company, 'form': form}
    return render(request, 'zuser/company_detail.html', context)


def company_create(request):
    if request.method == 'POST':
        form = CompanyForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('company_list')
    else:
        form = CompanyForm()
    return render(request, 'zuser/company_form.html', {'form': form})


def company_update(request, company_id):
    company = get_object_or_404(Company, pk=company_id)
    if request.method == 'POST':
        form = CompanyForm(request.POST, instance=company)
        if form.is_valid():
            form.save()
            return redirect('company_list')
    else:
        form = CompanyForm(instance=company)
    return render(request, 'zuser/company_form.html', {'form': form})


def company_delete(request, company_id):
    company = get_object_or_404(Company, pk=company_id)
    if request.method == 'POST':
        company.delete()
        return redirect('company_list')
    return render(request, 'zuser/company_confirm_delete.html', {'company': company})


# def loginview(request):
#     return render(request, 'zuser/login.html')

