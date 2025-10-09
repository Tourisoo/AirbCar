from django.http import HttpResponse
from .models import User, Booking, Partner, Listing
from rest_framework import viewsets, generics, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
import uuid
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import upload_file_to_supabase
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (UserSerializer, BookingSerializer, PartnerSerializer, 
    ListingSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer,
    CustomTokenObtainPairSerializer)
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Count, Q, Sum
from rest_framework.views import APIView

User = get_user_model()

class UserVerificationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        token = request.data.get('token')
        if token == user.email_verification_token:
            user.email_verified = True
            user.is_verified = True
            user.email_verification_token = None
            user.save()
            return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserStatusView(generics.GenericAPIView):
    """
    Single endpoint that handles both verification status and token verification
    Replaces: UserVerificationView.get() and TokenVerifyView
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_partner': user.is_partner,
            'is_verified': user.is_verified,
            'email_verified': user.email_verified,
            'is_staff': user.is_staff,
        })

    def post(self, request):
        """Handle email verification"""
        user = request.user
        token = request.data.get('token')
        if token == user.email_verification_token:
            user.email_verified = True
            user.is_verified = True
            user.email_verification_token = None
            user.save()
            return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class AdminStatusView(generics.GenericAPIView):
    """Simplified admin check"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({'is_admin': request.user.is_staff})

# class UserViewSet(viewsets.ModelViewSet):
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated, IsAdminUser]
    
#     def get_queryset(self):
#         return User.objects.all().order_by('-date_joined')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        print("get_queryset called")
        user = self.request.user
        if not user.is_authenticated:
            raise ValidationError({"detail": "You are not loged in."})
        if user.is_staff or user.is_superuser:
            return User.objects.all().order_by('-date_joined')
        return User.objects.filter(id=user.id).order_by('-date_joined')

    def perform_create(self, serializer):
        print("perform_create called")
        user = serializer.save()
        profile_pic = self.request.FILES.get("profile_picture")
        front_doc = self.request.FILES.get("id_front_document_url")
        back_doc = self.request.FILES.get("id_back_document_url")

        if profile_pic:
            url = upload_file_to_supabase(profile_pic, folder=f"id_documents/{user.id}")
            user.profile_picture = url
            user.save(update_fields=["profile_picture"])
        if front_doc:
            url = upload_file_to_supabase(front_doc, folder=f"id_documents/{user.id}")
            user.id_front_document_url = url
            user.save(update_fields=["id_front_document_url"])
        if back_doc:
            url = upload_file_to_supabase(back_doc, folder=f"id_documents/{user.id}")
            user.id_back_document_url = url
            user.save(update_fields=["id_back_document_url"])

        user.email_verification_token = str(uuid.uuid4())
        user.save()

        verification_url = f"{self.request.build_absolute_uri('/verify-email/')}?token={user.email_verification_token}"
        send_mail(
            subject='Verify your email',
            message=f'Click the link to verify your email: {verification_url}',
            from_email='no-reply@airbcar.com',
            recipient_list=[user.email],
            fail_silently=False,
        )

    def perform_update(self, serializer):
        print("perform_update called")
        user = serializer.save()
        
        profile_picture = self.request.FILES.get("profile_picture")
        id_front_document = self.request.FILES.get("id_front_document_url")
        id_back_document = self.request.FILES.get("id_back_document_url")
        print("Files received:", profile_picture, id_front_document, id_back_document)

        if profile_picture:
            url = upload_file_to_supabase(profile_picture, folder=f"id_documents/{user.id}")
            user.profile_picture = url
            user.save(update_fields=["profile_picture"])
        if id_front_document:
            url = upload_file_to_supabase(id_front_document, folder=f"id_documents/{user.id}")
            user.id_front_document_url = url
            user.save(update_fields=["id_front_document_url"])
        if id_back_document:
            url = upload_file_to_supabase(id_back_document, folder=f"id_documents/{user.id}")
            user.id_back_document_url = url
            user.save(update_fields=["id_back_document_url"])

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = super().get_queryset()
        partner_id = self.request.query_params.get('partner_id')
        if partner_id:
            qs = qs.filter(partner_id=partner_id)
        return qs

    def perform_create(self, serializer):
        request = self.request
        pictures = request.FILES.getlist("pictures")
        partner, created = Partner.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': f"{request.user.username}'s Company",
                'tax_id': 'PENDING',
            }
        )
        if not request.user.is_partner:
            request.user.is_partner = True
            request.user.save(update_fields=['is_partner'])
        listing = serializer.save(partner=partner)
        if pictures:
            urls = []
            for pic in pictures:
                url = upload_file_to_supabase(pic, folder=f"listings/{listing.id}")
                urls.append(url)
            listing.pictures = urls
            listing.save(update_fields=["pictures"])

    def perform_update(self, serializer):
        print("perform_update called")
        listing = serializer.save()
        
        pictures = self.request.FILES.getlist("pictures")
        if pictures:
            for picture in pictures:
                url = upload_file_to_supabase(picture, folder=f"listings/{listing.id}")
                listing.pictures.append(url)
            listing.save(update_fields=["pictures"])

# class PartnerViewSet(viewsets.ModelViewSet):
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated, IsAdminUser]
    
#     def get_queryset(self):
#         # For now, return users who are staff or have created listings
#         return User.objects.filter(
#             Q(is_staff=True) | Q(is_superuser=True)
#         ).distinct().order_by('-date_joined')

class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all().prefetch_related('listings')
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise ValidationError({"detail": "You are not loged in."})
        if user.is_staff or user.is_superuser:
            return Partner.objects.all().prefetch_related('listings').order_by('-date_joined')
        if not user.is_partner and user.is_authenticated:
            raise ValidationError({"detail": "You are not loged in."})
        return Partner.objects.filter(user=user).prefetch_related('listings').order_by('-date_joined')

    def perform_create(self, serializer):
        if self.request.user.is_partner:
           raise ValidationError({"detail": "You are already registered as a partner."})

        serializer.save(user=self.request.user)
        if not self.request.user.is_partner:
            self.request.user.is_partner = True
            self.request.user.save(update_fields=['is_partner'])

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        if not user.is_authenticated:
            raise ValidationError({"detail": "You are not loged in."})
        return Booking.objects.filter(user=user).order_by('-date')


    def perform_create(self, serializer):
        listing_id = self.request.data.get('listing')
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'listing': 'Listing not found'})
        serializer.save(user=self.request.user, listing=listing)

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            # Send user to frontend reset page with uid and token as URL parameters
            reset_url = f"http://localhost:3000/auth/reset-password?uid={uid}&token={token}"
            send_mail(
                'Password Reset Request',
                f'Use this link to reset your password: {reset_url}',
                'from@airbcar.com',
                [email],
                fail_silently=False,
            )
            return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    
    def post(self, request, uidb64, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        token_generator = PasswordResetTokenGenerator()
        if user and token_generator.check_token(user, token):
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token or user'}, status=status.HTTP_400_BAD_REQUEST)

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        try:
            # Get basic user stats
            total_users = User.objects.count()
            total_partners = User.objects.filter(
                Q(is_staff=True) | Q(is_superuser=True)
            ).count()
            
            # Get recent users
            recent_users = User.objects.order_by('-date_joined')[:6].values(
                'id', 'username', 'first_name', 'last_name', 'email', 'is_active'
            )
            
            # Get partners with mock listings count
            partners_qs = User.objects.filter(
                Q(is_staff=True) | Q(is_superuser=True)
            ).order_by('-date_joined')[:6]
            
            partners = []
            for partner in partners_qs:
                partners.append({
                    'id': partner.id,
                    'username': partner.username,
                    'first_name': partner.first_name,
                    'last_name': partner.last_name,
                    'email': partner.email,
                    'date_joined': partner.date_joined.isoformat() if partner.date_joined else None,
                    'listings_count': 0,  # Mock data for now
                    'is_active': partner.is_active
                })
            
            return Response({
                'stats': {
                    'total_users': total_users,
                    'total_partners': total_partners,
                    'total_listings': 0,  # Mock data
                    'total_bookings': 0,  # Mock data
                    'total_earnings': 0.0,  # Mock data
                },
                'recent_users': list(recent_users),
                'partners': partners
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Dashboard error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        try:
            total_users = User.objects.count()
            total_partners = Partner.objects.count()
            total_listings = Listing.objects.count()
            total_bookings = Booking.objects.count()
            total_earnings = Booking.objects.aggregate(
                total=Sum('price')
            )['total'] or 0.0
            
            recent_users = User.objects.order_by('-date_joined')[:6].values(
                'id', 'username', 'first_name', 'last_name', 'email', 'is_active'
            )
            
            partners_qs = Partner.objects.select_related('user').annotate(
                listings_count=Count('listings')
            ).order_by('-created_at')[:6]
            
            partners = []
            for partner in partners_qs:
                partners.append({
                    'id': partner.id,
                    'username': partner.user.username,
                    'first_name': partner.user.first_name,
                    'last_name': partner.user.last_name,
                    'email': partner.user.email,
                    'company_name': partner.company_name,
                    'date_joined': partner.created_at.isoformat(),
                    'listings_count': partner.listings_count,
                    'is_active': partner.user.is_active
                })
            
            return Response({
                'stats': {
                    'total_users': total_users,
                    'total_partners': total_partners,
                    'total_listings': total_listings,
                    'total_bookings': total_bookings,
                    'total_earnings': float(total_earnings),
                },
                'recent_users': list(recent_users),
                'partners': partners
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Dashboard error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PartnerStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        try:
            partners_qs = Partner.objects.select_related('user').annotate(
                listings_count=Count('listings')
            ).order_by('-created_at')
            
            partners = []
            for partner in partners_qs:
                partners.append({
                    'id': partner.id,
                    'username': partner.user.username,
                    'first_name': partner.user.first_name,
                    'last_name': partner.user.last_name,
                    'email': partner.user.email,
                    'company_name': partner.company_name,
                    'verification_status': partner.verification_status,
                    'date_joined': partner.created_at.isoformat(),
                    'listings_count': partner.listings_count,
                    'is_active': partner.user.is_active
                })
            
            return Response(partners, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Partners error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def verify_email(request):
    token = request.GET.get("token")
    if not token:
        return HttpResponse("Invalid token", status=400)

    try:
        user = User.objects.get(email_verification_token=token)
        user.is_verified = True
        user.email_verification_token = None
        user.save()
        return HttpResponse("Email successfully verified!")
    except User.DoesNotExist:
        return HttpResponse("Invalid or expired token", status=400)

def home_view(request):
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Airbcar Backend API</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 2rem;
                background-color: #f9f9f9;
                color: #333;
            }
            h1 {
                color: #1e88e5;
                border-bottom: 2px solid #1e88e5;
                padding-bottom: 0.3rem;
            }
            h2 {
                margin-top: 2rem;
                color: #444;
            }
            code {
                background-color: #eaeaea;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.95em;
            }
            pre {
                background-color: #272822;
                color: #f8f8f2;
                padding: 1rem;
                overflow-x: auto;
                border-radius: 5px;
            }
            .section {
                margin-bottom: 2rem;
            }
            .container {
                max-width: 900px;
                margin: auto;
            }
            a {
                color: #1e88e5;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚗 Airbcar Backend API</h1>
            <p><strong>Date:</strong> July 9, 2025</p>
            <p><strong>Dev:</strong> Naoufal (Frontend)</p>
            <p><strong>Status:</strong> Day 1 — Login, Sign-up, User APIs</p>
            <p><strong>Base URL:</strong> <code>http://localhost:8000/</code></p>

            <div class="section">
                <h2>✅ Login</h2>
                <p><strong>POST</strong> <code>/api/login/</code></p>
                <pre>   {
        "username": "testuser2",
        "password": "testpass123"
    }</pre>
                <p><strong>Returns:</strong> JWT <code>access</code> & <code>refresh</code> tokens + user info</p>
            </div>

            <div class="section">
                <h2>🔁 Refresh Token</h2>
                <p><strong>POST</strong> <code>/api/token/refresh/</code></p>
                <pre>   {
        "refresh": "your_refresh_token_here"
    }</pre>
            </div>

            <div class="section">
                <h2>📝 Register (Sign-up)</h2>
                <p><strong>POST</strong> <code>/api/register/</code></p>
                <pre>   {
        "username": "testuser2",
        "email": "test2@example.com",
        "password": "testpass123",
        "phone_number": "+1234567890"
    }</pre>
            </div>

            <div class="section">
                <h2>👥 User APIs</h2>
                <ul>
                    <li>GET <code>/api/users/</code> — List all users</li>
                    <li>GET <code>/api/users/&lt;id&gt;/</code> — Get specific user</li>
                    <li>GET <code>/users/</code> — User list view</li>
                </ul>
            </div>

            <div class="section">
                <h2>🛠️ Dev Setup</h2>
                <pre>
    cd airbcar_backend
    source env/bin/activate
    pip install -r requirements.txt
    sudo service postgresql start
    python manage.py migrate
    python manage.py runserver
                </pre>
            </div>

            <div class="section">
                <h2>📌 Notes</h2>
                <ul>
                    <li>Tokens must be used as: <code>Authorization: Bearer &lt;access&gt;</code></li>
                    <li>Pending: Email verification, Password reset</li>
                    <li>Contact: Amine</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_content)
