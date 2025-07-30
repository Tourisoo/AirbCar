# from rest_framework import viewsets
# from rest_framework_simplejwt.views import TokenObtainPairView
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import UserViewSet, BookingViewSet
# # from .models import User, Booking
# # from .serializers import UserSerializer, BookingSerializer
# # from rest_framework.permissions import IsAuthenticated

# # class UserViewSet(viewsets.ModelViewSet):
# #     queryset = User.objects.all()
# #     serializer_class = UserSerializer
# #     # permission_classes = [IsAuthenticated]

# # class BookingViewSet(viewsets.ModelViewSet):
# #     queryset = Booking.objects.all()
# #     serializer_class = BookingSerializer
# #     # permission_classes = [IsAuthenticated]


# urlpatterns = [
#     path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
# ]