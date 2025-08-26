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
from core.views import home_view, user_list, booking_list, UserViewSet, \
    PartnerViewSet, ListingViewSet, BookingViewSet, UserRegisterView, \
    PasswordResetRequestView, PasswordResetConfirmView, UserVerificationView, \
    TokenVerifyView, AdminVerificationView, CustomLoginView, verify_email, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'partners', PartnerViewSet) # add partner
router.register(r'listings', ListingViewSet) # add a listing
router.register(r'bookings', BookingViewSet) # add a booking


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view),
    path('', include(router.urls)),
    path('api/users/list/', user_list, name='user_list'),
    path('api/bookings/list/', booking_list, name='bookings_list'),
    path('api/token/', CustomLoginView.as_view(), name='token_obtain_pair'), # sign-in
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/verify-token/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/verify-admin/', AdminVerificationView.as_view(), name='admin_verify'),
    path('api/register/', UserRegisterView.as_view(), name='user_register'), # sign-up
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/verify-email/', UserVerificationView.as_view(), name='user_verify_email'),
    path("verify-email/", verify_email, name="verify_email"),
    path('api/profile/', UserProfileView.as_view(), name='user_profile') # update user - patch req 
    # path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

