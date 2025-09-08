"""
Local development settings for airbcar_backend project.
Use this for running tests and development outside of Docker.
"""

import sys
from .settings import *

# Override database settings for local development
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres.wtbmqtmmdobfvvecinif',
        'PASSWORD': 'Mayache+123455',
        'HOST': 'aws-1-eu-north-1.pooler.supabase.com',
        'PORT': '5432',
    }
}


# For testing, you can also use an in-memory SQLite database
if 'test' in sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }

# For testing, we'll use a simpler file storage that doesn't require Pillow
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
# Disable some features that might cause issues in testing
MEDIA_ROOT = '/tmp/test_media/'
