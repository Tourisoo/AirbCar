from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import home_view, UserViewSet, PartnerViewSet, ListingViewSet, \
    BookingViewSet, PasswordResetRequestView, PasswordResetConfirmView, \
    UserVerificationView, TokenVerifyView, AdminVerificationView, CustomLoginView, verify_email
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'listings', ListingViewSet, basename='listing')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name= 'home'),
    path('', include(router.urls)),
   
    path('api/register/', UserViewSet.as_view({'post': 'create'}), name='user_register'),
    path('api/login/', CustomLoginView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/verify-token/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/verify-admin/', AdminVerificationView.as_view(), name='admin_verify'),
   
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
  
    path('api/verify-email/', UserVerificationView.as_view(), name='user_verify_email'),
    path("verify-email/", verify_email, name="verify_email"),
]
