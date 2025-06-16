"""
URL configuration for airbcar_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import home_view, user_list, booking_list, UserViewSet, PartnerViewSet, ListingViewSet, BookingViewSet, UserRegisterView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'bookings', BookingViewSet)


urlpatterns = [

    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api/users/list/', user_list, name='user_list'),
    path('api/bookings/list/', booking_list, name='bookings_list'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserRegisterView.as_view(), name='user_register'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', home_view),
    # path('api-auth/', include('rest_framework.urls')),
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]

