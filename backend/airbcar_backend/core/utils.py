import uuid
from supabase import create_client

# import io
# from supabase import create_client, Client
# from django.conf import settings
# url = settings.SUPABASE_URL
# key = settings.SUPABASE_KEY
# supabase: Client = create_client(url, key)
# def upload_image_to_supabase(image_file, file_name):
#     bucket = supabase.storage.from_('car-listings')
#     response = bucket.upload(file_name, image_file)
#     if response.status_code == 200:
#         # Return the public URL of the uploaded image
#         return bucket.get_public_url(file_name)['publicURL']
#     else:
#         raise Exception("Failed to upload image to Supabase")

url = "https://wtbmqtmmdobfvvecinif.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Ym1xdG1tZG9iZnZ2ZWNpbmlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzODE3MCwiZXhwIjoyMDcxODE0MTcwfQ.1WHIBQlRgCy-jHLT-EwXgfGLAUK7G_1GIZPQLLCoXXc"
supabase = create_client(url, key)

def upload_file_to_supabase(file, folder="listings"):
    filename = f"{folder}/{uuid.uuid4()}_{file}"

    print("Uploading file to Supabase:", filename)
    
    # Read the file content
    file.seek(0)  # Reset file pointer to beginning
    file_content = file.read()
    
    # Upload the file content
    supabase.storage.from_("Pics").upload(filename, file_content)

    return f"{url}/storage/v1/object/public/Pics/{filename}"