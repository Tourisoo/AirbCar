# Register your models here.
from django.contrib import admin
from .models import User, Partner, Listing, Booking

admin.site.register(User)
admin.site.register(Partner)
admin.site.register(Listing)
admin.site.register(Booking)
