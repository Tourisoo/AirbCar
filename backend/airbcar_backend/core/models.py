from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from supabase import create_client, Client


class User(AbstractUser):
    # Store a URL to the profile picture and map it to the existing DB column
    # 'profile_picture_url' to match the current production schema.
    # profile_picture = models.URLField(blank=True, null=True, db_column='profile_picture_url')
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(unique=True)
    # profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    profile_picture = models.URLField(blank=True, null=True)
    default_currency = models.CharField(max_length=3, default='USD')
    is_partner = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    email_verification_token = models.CharField(max_length=36, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    # name = models.CharField(max_length=100, blank=True)
    license_number = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=50, default='user')
    id_type = models.CharField(max_length=50, blank=True, null=True)
    id_number = models.CharField(max_length=100, blank=True, null=True)
    id_expiry_date = models.DateField(blank=True, null=True)
    id_verification_status = models.CharField(max_length=20, default='pending')
    # id_front_document = models.FileField(upload_to='id_documents/', blank=True, null=True)
    # id_back_document = models.FileField(upload_to='id_documents/', blank=True, null=True)
    id_front_document_url = models.URLField(blank=True, null=True)
    id_back_document_url = models.URLField(blank=True, null=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    class Meta:
        indexes = [models.Index(fields=['email'])]

class Partner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='partner')
    company_name = models.CharField(max_length=100, blank=False)
    tax_id = models.CharField(max_length=50, blank=False)
    verification_status = models.CharField(max_length=20, default='pending')
    agree_on_terms = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    verification_document = models.FileField(upload_to='partner_docs/', blank=True, null=True)

    def __str__(self):
        return f"{self.company_name} ({self.user.username})"

    class Meta:
        indexes = [models.Index(fields=['verification_status'])]

class Listing(models.Model):
    partner = models.ForeignKey('Partner', on_delete=models.CASCADE, related_name='listings')
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    location = models.CharField(max_length=100, blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    fuel_type = models.CharField(max_length=20, blank=False, null=False)
    transmission = models.CharField(max_length=25, blank=False, null=False)
    seating_capacity = models.IntegerField(blank=False, null=False)
    vehicle_condition = models.CharField(max_length=50, blank=False, null=False)
    vehicle_description = models.CharField(max_length=500, blank=True, null=True)
    available_features = models.JSONField(default=list)
    rating = models.FloatField(default=0.0, blank=True, null=True)
    features = models.JSONField(default=list)
    picture_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey('Listing', on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(default=timezone.now)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, default='pending')
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} for User {self.user}"
