from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User, Booking, Partner, Listing

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
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['role'] = user.role
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
            'is_verified': self.user.is_verified,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
            'role': self.user.role
        }
        
        return data

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'default_currency',
            'is_partner', 'is_verified', 'password', 'profile_picture', 'email_verified',
            'name', 'license_info', 'address', 'role', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'is_partner', 'is_verified', 'email_verified']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number', ''),
            default_currency=validated_data.get('default_currency', 'USD'),
            is_partner=validated_data.get('is_partner', False),
            name=validated_data.get('name', ''),
            role=validated_data.get('role', 'user')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class PartnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Partner
        fields = '__all__'

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with this email exists.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, required=True)
    confirm_password = serializers.CharField(min_length=6, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def validate_password(self, value):
        return value
