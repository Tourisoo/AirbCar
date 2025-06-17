from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    default_currency = models.CharField(max_length=3, default='USD')
    is_partner = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    email_verification_token = models.CharField(max_length=36, blank=True, null=True)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
    class Meta:
        indexes = [
            models.Index(fields=['email']),
    ]

class Partner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='partner')
    company_name = models.CharField(max_length=100)
    tax_id = models.CharField(max_length=50, blank=False)
    verification_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    verification_document = models.FileField(upload_to='partner_docs/', blank=True, null=True)

    def __str__(self):
        return f"{self.company_name} ({self.user.username})"

    class Meta:
        indexes = [
            models.Index(fields=['verification_status']),
        ]

class Listing(models.Model):
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='listings')
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} for User {self.user}"