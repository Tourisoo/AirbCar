from django.test import TestCase

# Create your tests here.
# tests/test_models.py

from core.models import User, Partner, Listing, Booking

class RelationshipSmokeTest(TestCase):
    def test_user_partner_listing_booking_relationship(self):
        # Create a user who is a partner
        user = User.objects.create(username='smoketest', email='smoke@example.com', is_partner=True)
        
        # Create partner linked to the user
        partner = Partner.objects.create(user=user, company_name='SmokeCars', tax_id='12345', verification_document='smoke.pdf')
        
        # Create a listing under that partner
        listing = Listing.objects.create(partner=partner, make='Tesla', model='Model S', year=2021, price_per_day=100)
        
        # Create a booking linked to the user and listing
        booking = Booking.objects.create(user=user, listing=listing)
        
        # Assertions (this confirms the full chain is working)
        self.assertEqual(partner.user.email, 'smoke@example.com')  # User <-> Partner
        self.assertIn(listing, partner.listings.all())             # Partner <-> Listings
        self.assertEqual(booking.listing, listing)                 # Booking <-> Listing
        self.assertEqual(booking.user, user)                       # Booking <-> User
        self.assertEqual(booking.listing.partner.company_name, 'SmokeCars')  # Full chain

