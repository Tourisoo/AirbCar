from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseBadRequest
from .models import User, Booking, Partner, Listing, ListingImage
from .serializers import UserSerializer, BookingSerializer, PartnerSerializer, \
    ListingSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import uuid
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

User = get_user_model()

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


class UserVerificationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'is_verified': user.is_verified,
            'email_verified': user.email_verified
        })

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

        token_generator = PasswordResetTokenGenerator()
        if user and token_generator.check_token(user, token):
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token or user'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user  # Always return the authenticated user
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class AdminVerificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Check if user is admin/staff
        if request.user.is_staff or request.user.is_superuser:
            return Response({'is_admin': True}, status=status.HTTP_200_OK)
        else:
            return Response({'is_admin': False}, status=status.HTTP_403_FORBIDDEN)


class CustomLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_email = None
        
        # Handle email login  
        if email and not username:
            user_email = email
        elif username and not email:
            # If username provided, find the user's email
            try:
                user = User.objects.get(username=username)
                user_email = user.email
            except User.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        elif email and username:
            # If both provided, use email
            user_email = email
        else:
            return Response({'error': 'Username or email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user using email as username (since USERNAME_FIELD = 'email')
        user = authenticate(username=user_email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Add custom claims
            access_token['username'] = user.username
            access_token['email'] = user.email
            access_token['is_partner'] = user.is_partner
            access_token['is_verified'] = user.is_verified
            
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_partner': user.is_partner,
                    'is_verified': user.is_verified
                }
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class TokenVerifyView(generics.GenericAPIView):
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
            'is_superuser': user.is_superuser
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)

class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all().prefetch_related('listings')
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        partner = serializer.save(user=self.request.user)
        if not self.request.user.is_partner:
            self.request.user.is_partner = True
            self.request.user.save(update_fields=['is_partner'])

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        # Get or create partner for the authenticated user
        partner, created = Partner.objects.get_or_create(
            user=self.request.user,
            defaults={
                'company_name': f"{self.request.user.username}'s Company",
                'tax_id': 'PENDING',
            }
        )
        
        # Ensure user is marked as partner
        if not self.request.user.is_partner:
            self.request.user.is_partner = True
            self.request.user.save(update_fields=['is_partner'])
        
        listing = serializer.save(partner=partner)

        # Handle multiple images uploaded with the listing creation
        files = []
        # Common array field names
        files += self.request.FILES.getlist('images')
        files += self.request.FILES.getlist('images[]')
        # Also accept single keys image, image1..image4 for convenience
        for key in ['image', 'image1', 'image2', 'image3', 'image4']:
            f = self.request.FILES.get(key)
            if f:
                files.append(f)

        for f in files:
            ListingImage.objects.create(listing=listing, image=f)

    @action(detail=True, methods=['post'], url_path='upload-image', parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        listing = self.get_object()
        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({'error': 'No image provided. Use form-data key "image".'}, status=status.HTTP_400_BAD_REQUEST)
        # create image record
        img = ListingImage.objects.create(listing=listing, image=file_obj)
        from .serializers import ListingImageSerializer
        return Response(ListingImageSerializer(img).data, status=status.HTTP_201_CREATED)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        listing_id = self.request.data.get('listing')
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'listing': 'Listing not found'})
        serializer.save(user=self.request.user, listing=listing)

# def home_view(request):
#     return HttpResponse("<h1>Welcome Home<h1>")

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

def user_list(request):
    users = User.objects.all()
    if not users:
        return HttpResponse("No Users found.")
    greetings = [f"Hi my name is {user.username}, with the id {user.id}, im using {user.email}" for user in users]
    return HttpResponse("<br>".join(greetings))

def booking_list(request):
    bookings = Booking.objects.all()
    if not bookings:
        return HttpResponse("No bookings found.")
    greeting = [f"booking ID: {booking.id}, user: {booking.user.username}, Car: {booking.listing}, Date: {booking.date}" for booking in bookings]
    return HttpResponse("<br>".join(greeting))

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
                <p><strong>POST</strong> <code>/api/token/</code></p>
                <pre>{
  "username": "testuser2",
  "password": "testpass123"
}</pre>
                <p><strong>Returns:</strong> JWT <code>access</code> & <code>refresh</code> tokens + user info</p>
            </div>

            <div class="section">
                <h2>🔁 Refresh Token</h2>
                <p><strong>POST</strong> <code>/api/token/refresh/</code></p>
                <pre>{
  "refresh": "your_refresh_token_here"
}</pre>
            </div>

            <div class="section">
                <h2>📝 Register (Sign-up)</h2>
                <p><strong>POST</strong> <code>/api/register/</code></p>
                <pre>{
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
                    <li>GET <code>/api/users/list/</code> — User list view</li>
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

# @api_view(['POST'])
# def upload_listing_image(request, listing_id):
#     """
#     API view to handle uploading of images for listings.
#     """
#     listing = Listing.objects.get(id=listing_id)
#     image_file = request.FILES.get('image')

#     if image_file:
#         # Generate a unique file name
#         file_name = f"listing_{listing_id}/{image_file.name}"
        
#         try:
#             # Upload image to Supabase and get the URL
#             image_url = upload_image_to_supabase(image_file, file_name)
            
#             # Save the image URL to the ListingImage model
#             ListingImage.objects.create(listing=listing, image_url=image_url)
            
#             return Response({"message": "Image uploaded successfully", "image_url": image_url}, status=status.HTTP_200_OK)
        
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     return Response({"error": "No image provided."}, status=status.HTTP_400_BAD_REQUEST)
