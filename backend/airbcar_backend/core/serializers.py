from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User, Booking, Partner, Listing


# The default TokenObtainPairSerializer provided by rest_framework_simplejwt
#  generates JWT tokens with minimal user data (typically just the user ID). 
#  By customizing it, you’ll enhance the token and response to include key fields
#  from the User model, making the login process more informative for the frontend.


#  This serializer class contains the logic for how to take the incoming 
#  data from the request and convert it into a model instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Force username field to accept email
        self.username_field = 'email'
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['is_partner'] = user.is_partner
        token['is_verified'] = user.is_verified
        return token

    def validate(self, attrs):
        # Rename email to username for Django's authentication
        if 'email' in attrs:
            attrs['username'] = attrs['email']
            
        return super().validate(attrs)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'default_currency',
            'is_partner', 'is_verified', 'password', 'profile_picture', 'email_verified',
            'license_number', 'address', 'role', 'first_name', 'last_name', 'issue_date', 
            'license_origin_country', 'nationality', 'country_of_residence', 'city', 'postal_code',
            'date_of_birth', 'id_verification_status', 'id_front_document_url', 'id_back_document_url', 'is_staff']
        read_only_fields = ['id', 'is_partner', 'is_verified', 'email_verified', 
            'id_front_document_url', 'id_back_document_url', 'profile_picture']

    def create(self, validated_data):
        print("User create serializer called")
        password = validated_data.pop('password')
        if 'username' not in validated_data or not validated_data['username']:
            validated_data['username'] = validated_data['email']
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class PartnerSerializer(serializers.ModelSerializer):
    
    class ListingBriefSerializer(serializers.ModelSerializer):
        class Meta:
            model = Listing
            fields = ['id', 'make', 'model', 'year', 'location', 'price_per_day', 'pictures']

    class UserBriefSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture']
    
    listings = ListingBriefSerializer(many=True, read_only=True)
    user = UserBriefSerializer(read_only=True)
    class Meta:
        model = Partner
        fields = ['id', 'company_name', 'tax_id', 'user', 'verification_status', 'created_at', 
            'agree_on_terms', 'verification_document', 'listings']

class ListingSerializer(serializers.ModelSerializer):
    partner = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Listing
        fields = ['id', 'partner', 'make', 'model', 'year', 'location', 'features', 
            'price_per_day', 'availability', 'rating', 'created_at', 'fuel_type', 
            'transmission', 'seating_capacity', 'vehicle_condition', 'pictures', 'vehicle_description']
        read_only_fields = ['partner', 'created_at', 'rating']

    def to_internal_value(self, data):
        # Remove 'pictures' from validation since we'll handle it in the view
        if 'pictures' in data:
            data = data.copy()  # Make a copy to avoid modifying the original
            data.pop('pictures')
        return super().to_internal_value(data)

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)
    car_owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'listing', 'start_time', 'end_time', 'price', 'status', 'date',
            'requested_at', 'accepted_at', 'rejected_at', 'cancelled_at',
            'request_message', 'rejection_reason', 'car_owner'
        ]
        read_only_fields = ['user', 'date', 'requested_at', 'accepted_at', 'rejected_at', 'cancelled_at', 'car_owner']

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, required=True)
    
    def validate_password(self, value):
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
