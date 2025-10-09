from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # Authentication
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Profile Management
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('profile/detail/', views.UserProfileDetailView.as_view(), name='profile-detail'),
    path('current/', views.current_user_view, name='current-user'),
    
    # Password Management
    path('password/change/', views.PasswordChangeView.as_view(), name='password-change'),
    
    # Admin endpoints
    path('list/', views.UserListView.as_view(), name='user-list'),
]
