"""
CI/CD settings for airbcar_backend project.
Use this for running tests in CI environments like GitHub Actions.
"""

import sys
import os
from .settings import *

# Resolve DB host for CI/GitHub Actions
IN_CONTAINER = os.path.exists('/.dockerenv')
IS_GITHUB = os.environ.get('GITHUB_ACTIONS')
DB_HOST = os.environ.get('DB_HOST', 'db' if IN_CONTAINER else 'localhost')
if IS_GITHUB and not IN_CONTAINER and DB_HOST in ('db', ''):
    DB_HOST = '127.0.0.1'

# Override database settings for CI testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'airbcar_db'),
        'USER': os.environ.get('DB_USER', 'airbcar_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'amineamine'),
        'HOST': DB_HOST,  # Prefer localhost on GHA runners
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    
    def __getitem__(self, item):
        return None

# Use this to speed up tests in CI - commented out since we're using real DB
# MIGRATION_MODULES = DisableMigrations()

# Use simple file storage for CI
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# CI-specific media settings
MEDIA_ROOT = '/tmp/test_media/'
STATIC_ROOT = '/tmp/static/'

# Disable logging in tests
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'root': {
        'handlers': ['null'],
    },
}

# Speed up password hashing in tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Override any AWS settings for CI
AWS_STORAGE_BUCKET_NAME = None
AWS_ACCESS_KEY_ID = None
AWS_SECRET_ACCESS_KEY = None

# Ensure we're not trying to use external services
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
