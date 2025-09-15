import uuid
from supabase import create_client

url = "https://wtbmqtmmdobfvvecinif.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Ym1xdG1tZG9iZnZ2ZWNpbmlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzODE3MCwiZXhwIjoyMDcxODE0MTcwfQ.1WHIBQlRgCy-jHLT-EwXgfGLAUK7G_1GIZPQLLCoXXc"
supabase = create_client(url, key)


def upload_file_to_supabase(file, folder="listings"):
    print("Uploading file to Supabase... called")
    filename = f"{folder}/{uuid.uuid4()}_{file}"    
    file.seek(0)
    file_content = file.read()
    supabase.storage.from_("Pics").upload(filename, file_content, {"content-type": "image/png"})
    return f"{url}/storage/v1/object/public/Pics/{filename}"
