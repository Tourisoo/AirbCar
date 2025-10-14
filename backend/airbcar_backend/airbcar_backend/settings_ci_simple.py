"""
Django settings for CI/CD pipeline - simplified settings for testing
"""

from .settings import *

# Override database settings for CI
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'airbcar_db',
        'USER': 'airbcar_user',
        'PASSWORD': 'amineamine',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Disable debug in CI
DEBUG = False

# Use in-memory cache for testing
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Simplified logging for CI
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}

# Use console email backend for testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable file storage in CI
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Simple secret key for testing
SECRET_KEY = 'test-secret-key-for-ci-only'

# Allow all hosts in CI
ALLOWED_HOSTS = ['*']
