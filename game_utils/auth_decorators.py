from django.http import HttpResponseForbidden
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from functools import wraps
from zuser.models import Cashier

def is_company_admin(user):
    return user.groups.filter(name__in=['Company Admin', 'Company Staff', 'Company Accountant', 'Company IT']).exists()

def is_system_user(user):
    return user.is_staff or user.groups.filter(name__in=['System Admin', 'System Staff', 'System Accountant', 'System IT']).exists()

def is_player(user):
    return user.groups.filter(name='Player').exists()

def is_cashier(user):
    if user.groups.filter(name='Cashier').exists():
        try:
            cashier = Cashier.objects.get(cashier=user)
            if cashier.agent.locked:
                return False
            return True
        except Cashier.DoesNotExist:
            pass
    return False

def is_cashier_admin(user):
    if user.groups.filter(name='Cashier').exists():
        try:
            cashier = Cashier.objects.get(cashier=user)
            if cashier.agent.locked:
                return False
            elif cashier.has_access:
                return True
        except Cashier.DoesNotExist:
            pass
    return False

def user_type_redirect(view_func):
    @wraps(view_func)
    @login_required(login_url='/zuser/login/')
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        path_without_slash = request.path.rstrip('/')
        path_with_slash = f"{path_without_slash}/"

        if is_cashier_admin(user):
            if path_without_slash != '/cashier-dashboard':
                print(f"Redirecting {user.username} to /cashier-dashboard from {request.path}")
                return redirect('/cashier-dashboard/')
        elif is_cashier(user):
            if path_without_slash != '':
                print(f"Redirecting {user.username} to / from {request.path}")
                return redirect('/')
        # elif is_cashier(user):
        #     if path_without_slash != '/spin-view':
        #         print(f"Redirecting {user.username} to / from {request.path}")
        #         return redirect('/spin-view/')
        elif is_player(user):
            if path_without_slash != '/mobile':
                print(f"Redirecting {user.username} to /mobile from {request.path}")
                return redirect('/mobile/')
        elif is_company_admin(user):
            if path_without_slash != '/dashboard':
                print(f"Redirecting {user.username} to /dashboard from {request.path}")
                return redirect('/dashboard/')
        elif is_system_user(user):
            if path_without_slash != '/dashboard':
                print(f"Redirecting {user.username} to /admin from {request.path}")
                return redirect('/dashboard/')
        else:
            print(f"User {user.username} does not have permission to access this page.")
            return HttpResponseForbidden("You do not have permission to access this page.")

        return view_func(request, *args, **kwargs)

    return _wrapped_view
