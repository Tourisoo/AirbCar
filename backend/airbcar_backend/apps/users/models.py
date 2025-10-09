from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    # Contact Information
    email = models.EmailField(unique=True, verbose_name="Email Address")
    phone_number = models.CharField(
        max_length=15, 
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        verbose_name="Phone Number"
    )
    
    # Profile Information
    profile_picture = models.URLField(blank=True, null=True, verbose_name="Profile Picture")
    date_of_birth = models.DateField(blank=True, null=True, verbose_name="Date of Birth")
    
    # Address Information
    address = models.TextField(blank=True, null=True, verbose_name="Address")
    city = models.CharField(max_length=50, blank=True, null=True, verbose_name="City")
    country = models.CharField(max_length=75, blank=True, null=True, verbose_name="Country")
    postal_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Postal Code")
    nationality = models.CharField(max_length=75, null=True, blank=True, verbose_name="Nationality")
    
    # Driver's License Information
    license_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="License Number")
    license_origin_country = models.CharField(max_length=75, blank=True, null=True, verbose_name="License Origin Country")
    license_issue_date = models.DateField(blank=True, null=True, verbose_name="License Issue Date")
    license_expiry_date = models.DateField(blank=True, null=True, verbose_name="License Expiry Date")
    
    # Verification Documents
    id_front_document_url = models.URLField(blank=True, null=True, verbose_name="ID Front Document")
    id_back_document_url = models.URLField(blank=True, null=True, verbose_name="ID Back Document")
    
    # Status Fields
    id_verification_status = models.CharField(
        max_length=20, 
        default='pending',
        choices=[
            ('pending', 'Pending'),
            ('verified', 'Verified'),
            ('rejected', 'Rejected'),
        ],
        verbose_name="ID Verification Status"
    )
    
    # User Type and Permissions
    role = models.CharField(
        max_length=20,
        choices=[
            ('customer', 'Customer'),
            ('partner', 'Partner'),
            ('admin', 'Administrator'),
        ],
        default='customer',
        verbose_name="User Role"
    )
    
    is_partner = models.BooleanField(default=False, verbose_name="Is Partner")
    is_verified = models.BooleanField(default=False, verbose_name="Is Verified")
    
    # Email Verification
    email_verified = models.BooleanField(default=False, verbose_name="Email Verified")
    email_verification_token = models.CharField(max_length=36, blank=True, null=True)
    
    # Preferences
    default_currency = models.CharField(
        max_length=3, 
        default='MAD',
        choices=[
            ('MAD', 'Moroccan Dirham'),
            ('EUR', 'Euro'),
            ('USD', 'US Dollar'),
        ],
        verbose_name="Default Currency"
    )
    preferred_language = models.CharField(
        max_length=10,
        choices=[
            ('en', 'English'),
            ('fr', 'Français'),
            ('ar', 'العربية'),
        ],
        default='en',
        verbose_name="Preferred Language"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.email} ({self.get_full_name()})"
    
    def get_full_name(self):
        """Return the full name for the user."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name
    
    @property
    def is_admin(self):
        """Check if user is an administrator."""
        return self.role == 'admin' or self.is_superuser
    
    @property
    def display_name(self):
        """Return display name for the user."""
        full_name = self.get_full_name()
        return full_name if full_name else self.email
    
    def can_rent_cars(self):
        """Check if user can rent cars (verified with license)."""
        return (
            self.is_verified and 
            self.license_number and 
            self.id_verification_status == 'verified'
        )


class UserProfile(models.Model):
    """
    Extended profile information for users
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Additional profile fields that might be added later
    bio = models.TextField(blank=True, null=True, max_length=500, verbose_name="Bio")
    website = models.URLField(blank=True, null=True, verbose_name="Website")
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('private', 'Private'),
        ],
        default='private'
    )
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    marketing_emails = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"Profile of {self.user.email}"
