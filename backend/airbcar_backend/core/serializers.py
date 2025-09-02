from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User, Booking, Partner, Listing

# The default TokenObtainPairSerializer provided by rest_framework_simplejwt
#  generates JWT tokens with minimal user data (typically just the user ID). 
#  By customizing it, you’ll enhance the token and response to include key fields
#  from the User model, making the login process more informative for the frontend.


#  This serializer class contains the logic for how to take the incoming 
# data from the request and convert it into a model instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Force the username_field to be 'username'
        self.username_field = 'username'
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['is_partner'] = user.is_partner
        token['is_verified'] = user.is_verified
        return token

    def validate(self, attrs):
        print(f"DEBUG: Received attrs: {attrs}")
        print(f"DEBUG: username_field: {self.username_field}")
        
        # Handle both email and username login
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')
        
        print(f"DEBUG: username: {username}, email: {email}, password: {password}")
        
        if not password:
            raise serializers.ValidationError('Password is required')
            
        # If email is provided, look up the user and get their username
        if email and not username:
            try:
                from core.models import User
                user = User.objects.get(email=email)
                print(f"DEBUG: Found user by email: {user.username}")
                attrs['username'] = user.username
                # Remove email from attrs to avoid confusion
                if 'email' in attrs:
                    del attrs['email']
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')
        elif not username and not email:
            raise serializers.ValidationError('Username or email is required')
        
        print(f"DEBUG: Final attrs before parent call: {attrs}")
        
        # Call parent validate method which will authenticate using username
        data = super().validate(attrs)
        
        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_partner': self.user.is_partner,
            'is_verified': self.user.is_verified
        }
        
        return data

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'default_currency',
            'is_partner', 'is_verified', 'password', 'profile_picture', 'email_verified',
            'name', 'license_number', 'address', 'role', 'first_name', 'last_name']
        read_only_fields = ['id', 'is_partner', 'is_verified', 'email_verified']

    def create(self, validated_data):
        # Generate username from email if not provided
        username = validated_data.get('username', validated_data['email'].split('@')[0])
        
        user = User.objects.create(
            username=username,
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number', ''),
            default_currency=validated_data.get('default_currency', 'USD'),
            is_partner=validated_data.get('is_partner', False),
            name=validated_data.get('name', ''),
            license_number=validated_data.get('license_number', ''),
            address=validated_data.get('address', ''),
            role=validated_data.get('role', 'user'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class PartnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Partner
        fields = ['id', 'user', 'company_name', 'tax_id', 'verification_status', 'created_at', 'agree_on_terms', 'verification_document']

class ListingSerializer(serializers.ModelSerializer):
    partner = PartnerSerializer(read_only=True)
    class Meta:
        model = Listing
        fields = [
            'id', 'partner', 'make', 'model', 'year', 'location', 
            'features', 'price_per_day', 'availability', 'rating', 'created_at',
            'fuel_type', 'transmission', 'seating_capacity', 'vehicle_condition', 'available_features']
        read_only_fields = ['partner', 'created_at']

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'listing', 'start_time', 'end_time', 
            'price', 'status', 'date']
        read_only_fields = ['user', 'date']

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, required=True)
    
    def validate_password(self, value):
        # You can add additional password validation here if needed
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)