# import io
# from supabase import create_client, Client
# from django.conf import settings

# url = settings.SUPABASE_URL
# key = settings.SUPABASE_KEY
# supabase: Client = create_client(url, key)

# def upload_image_to_supabase(image_file, file_name):
#     # Get the Supabase storage bucket (e.g., car-listings)
#     bucket = supabase.storage.from_('car-listings')
    
#     # Upload the image
#     response = bucket.upload(file_name, image_file)
    
#     if response.status_code == 200:
#         # Return the public URL of the uploaded image
#         return bucket.get_public_url(file_name)['publicURL']
#     else:
#         raise Exception("Failed to upload image to Supabase")
