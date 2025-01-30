from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import KenoResultViewSet, KenoMainGameView

router = DefaultRouter()
router.register(r'keno', KenoResultViewSet, basename='keno')


urlpatterns = [
    path('', KenoMainGameView.as_view(), name='keno-main-game'),
]

urlpatterns += router.urls
