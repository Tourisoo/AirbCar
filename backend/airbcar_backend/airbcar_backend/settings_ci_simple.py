"""
Django CI settings for airbcar_backend project.

This file is a copy of settings.py, intended for CI/CD usage. Adjust as needed for your CI environment.
"""

from .settings import *

# Example CI overrides (customize as needed):
DEBUG = False
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# You can override database settings here for CI if needed:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
