from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SpinMainGameView, SpinResultViewSet

router = DefaultRouter()
router.register(r'api', SpinResultViewSet, basename='spin')


urlpatterns = [
    path('', SpinMainGameView.as_view(), name='spin-main-game'),
]

urlpatterns += router.urls
