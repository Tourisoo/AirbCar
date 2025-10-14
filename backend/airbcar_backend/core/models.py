from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from supabase import create_client, Client


class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(unique=True)
    profile_picture = models.URLField(blank=True, null=True)
    default_currency = models.CharField(max_length=3, default='USD')
    address = models.TextField(blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    license_number = models.TextField(blank=True, null=True)
    id_front_document_url = models.URLField(blank=True, null=True)
    id_back_document_url = models.URLField(blank=True, null=True)
    id_verification_status = models.CharField(max_length=20, default='pending')
    license_origin_country = models.CharField(max_length=75, blank=True, null=True)
    nationality = models.CharField(max_length=75, null=True, blank=True)
    country_of_residence = models.CharField(max_length=75, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    role = models.CharField(max_length=50, default='user')
    is_partner = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    email_verification_token = models.CharField(max_length=36, blank=True, null=True)
    email_verified = models.BooleanField(default=False)

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
    rating = models.FloatField(default=0.0, blank=True, null=True)
    features = models.JSONField(default=list)
    pictures = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey('Listing', on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(default=timezone.now)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    date = models.DateField(auto_now_add=True)
    
    # New fields for request workflow
    requested_at = models.DateTimeField(default=timezone.now)
    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Optional message from renter to car owner
    request_message = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-requested_at']
        indexes = [
            models.Index(fields=['status', '-requested_at']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['listing', 'status']),
        ]

    def __str__(self):
        return f"Booking {self.id} - {self.get_status_display()} ({self.user.first_name or self.user.username})"

    @property
    def car_owner(self):
        """Get the car owner (partner) for this booking"""
        return self.listing.partner.user
    
    @property 
    def is_pending(self):
        return self.status == 'pending'
    
    @property
    def is_accepted(self):
        return self.status == 'accepted'
    
    @property
    def can_be_cancelled(self):
        return self.status in ['pending', 'accepted'] and self.start_time > timezone.now()
