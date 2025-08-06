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
    username_field = 'email'  # Use email field instead of username
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['is_partner'] = user.is_partner
        token['is_verified'] = user.is_verified
        return token

    def validate(self, attrs):
        # Override to authenticate with email instead of username
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    # Set the user for parent validation
                    self.user = user
                    # Call parent validate with username instead of email
                    attrs['username'] = user.username
                    attrs.pop('email')  # Remove email from attrs
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
                else:
                    raise serializers.ValidationError('Invalid email or password')
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid email or password')
        else:
            raise serializers.ValidationError('Email and password required')

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'default_currency', 'is_partner', 'is_verified', 'password', 'profile_picture', 'email_verified']
        read_only_fields = ['id', 'is_partner', 'is_verified', 'email_verified']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number', ''),
            default_currency=validated_data.get('default_currency', 'USD'),
            is_partner=validated_data.get('is_partner', False)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class PartnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Partner
        fields = ['id', 'user', 'company_name', 'tax_id', 'verification_status', 'created_at']

class ListingSerializer(serializers.ModelSerializer):
    partner = PartnerSerializer(read_only=True)
    class Meta:
        model = Listing
        fields = ['id', 'partner', 'make', 'model', 'year', 'price_per_day', 'availability', 'created_at']

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)
    class Meta:
        model = Booking
        fields = ["id", "user", "listing", "date"]

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, required=True)
    
    def validate_password(self, value):
        # You can add additional password validation here if needed
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)