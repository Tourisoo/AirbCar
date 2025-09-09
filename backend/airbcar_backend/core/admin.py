from django.contrib import admin
from .models import User, Partner, Listing, Booking, ListingImage
from django.contrib import admin
# from .models import ListingImage

admin.site.register(User)
admin.site.register(Partner)
admin.site.register(Listing)
admin.site.register(Booking)
admin.site.register(ListingImage)

# class ListingImageAdmin(admin.ModelAdmin):
#     list_display = ['listing', 'image_url']
#     search_fields = ['listing__make', 'listing__model']

# admin.site.register(ListingImage, ListingImageAdmin)
