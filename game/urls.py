from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from spin.views import keno_update_view, spin_update_view

urlpatterns = [
    path('', include('cashierapp.urls')),
    path('api/', include('keno.api.urls')),
    path('spin/', include('spin.api.urls')),
    path('users/', include('django.contrib.auth.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('zuser/', include('zuser.urls')),
    path('mobile/', include('mobile.urls')),
    path('admin/', admin.site.urls),
    path('keno-update-view/', keno_update_view, name='kuv'),
    path('spin-update-view/', spin_update_view, name='suv'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns += [
#         path('debug/', include(debug_toolbar.urls)),
#     ]

# if not settings.DEBUG:
#     urlpatterns +=static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)