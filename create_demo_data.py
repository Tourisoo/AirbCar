#!/usr/bin/env python3

"""
Visual Demo Script for Booking Request System
This creates sample data to demonstrate the booking workflow
"""

import os
import django
import sys

# Add the Django project to the Python path
sys.path.append('/app/airbcar_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airbcar_backend.settings')
django.setup()

from core.models import User, Partner, Listing, Booking
from django.utils import timezone
from datetime import datetime, timedelta

def create_demo_data():
    print("🎭 Creating Demo Data for Booking System")
    print("=" * 50)
    
    # Create a renter user
    renter, created = User.objects.get_or_create(
        email='renter@demo.com',
        defaults={
            'username': 'demo_renter',
            'first_name': 'John',
            'last_name': 'Doe',
            'is_partner': False
        }
    )
    if created:
        renter.set_password('demo123')
        renter.save()
    print(f"✅ Created renter: {renter.first_name} {renter.last_name}")
    
    # Create a car owner user
    owner, created = User.objects.get_or_create(
        email='owner@demo.com',
        defaults={
            'username': 'demo_owner',
            'first_name': 'Sarah',
            'last_name': 'Smith',
            'is_partner': True
        }
    )
    if created:
        owner.set_password('demo123')
        owner.save()
    print(f"✅ Created car owner: {owner.first_name} {owner.last_name}")
    
    # Create partner profile
    partner, created = Partner.objects.get_or_create(
        user=owner,
        defaults={
            'company_name': 'Sarah\'s Car Rentals',
            'tax_id': 'DEMO123456'
        }
    )
    print(f"✅ Created partner: {partner.company_name}")
    
    # Create a car listing
    listing, created = Listing.objects.get_or_create(
        partner=partner,
        make='Toyota',
        model='Camry',
        defaults={
            'year': 2023,
            'location': 'Casablanca, Morocco',
            'price_per_day': 350.00,
            'fuel_type': 'Gasoline',
            'transmission': 'Automatic',
            'seating_capacity': 5,
            'vehicle_condition': 'Excellent',
            'vehicle_description': 'Comfortable sedan perfect for city trips'
        }
    )
    print(f"✅ Created listing: {listing.make} {listing.model} ({listing.year})")
    
    # Create different types of booking requests
    tomorrow = timezone.now() + timedelta(days=1)
    next_week = timezone.now() + timedelta(days=7)
    
    # Pending booking request
    pending_booking, created = Booking.objects.get_or_create(
        user=renter,
        listing=listing,
        start_time=tomorrow,
        end_time=tomorrow + timedelta(days=3),
        defaults={
            'price': 1050.00,
            'status': 'pending',
            'request_message': 'Hi! I need this car for a business trip to Rabat. I\'m a careful driver with 5 years experience.'
        }
    )
    if created:
        print(f"✅ Created pending booking: #{pending_booking.id}")
    
    # Accepted booking
    accepted_booking, created = Booking.objects.get_or_create(
        user=renter,
        listing=listing,
        start_time=next_week,
        end_time=next_week + timedelta(days=2),
        defaults={
            'price': 700.00,
            'status': 'accepted',
            'accepted_at': timezone.now(),
            'request_message': 'Planning a weekend getaway to Marrakech!'
        }
    )
    if created:
        print(f"✅ Created accepted booking: #{accepted_booking.id}")
    
    print(f"\n🎯 Demo URLs to Test:")
    print(f"Frontend: http://localhost:3000")
    print(f"Partner Dashboard: http://localhost:3000/partner/dashboard")
    print(f"Your Bookings: http://localhost:3000/your-bookings")
    print(f"\n🔐 Demo Login Credentials:")
    print(f"Renter: renter@demo.com / demo123")
    print(f"Car Owner: owner@demo.com / demo123")
    
    return {
        'renter': renter,
        'owner': owner,
        'partner': partner,
        'listing': listing,
        'pending_booking': pending_booking,
        'accepted_booking': accepted_booking
    }

if __name__ == "__main__":
    demo_data = create_demo_data()
    
    print(f"\n📊 Current Booking Statuses:")
    print("=" * 30)
    for booking in Booking.objects.all():
        print(f"#{booking.id}: {booking.status.upper()} - {booking.user.first_name} → {booking.listing.make} {booking.listing.model}")
