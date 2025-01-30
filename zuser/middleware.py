from .models import UserProfile


class RoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_profile = None

        if hasattr(request, 'user') and request.user.is_authenticated:
            try:
                user_profile = UserProfile.objects.get(user=request.user)
            except UserProfile.DoesNotExist:
                pass

        request.role = user_profile.role if user_profile else None

        response = self.get_response(request)

        return response
