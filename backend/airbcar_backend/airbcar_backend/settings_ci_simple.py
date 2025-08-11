"""
Simplified CI settings that forces localhost database connection
"""

import os

# Basic Django settings
SECRET_KEY = 'test-secret-key-for-ci'
DEBUG = True
ALLOWED_HOSTS = ['*']

# Installed apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'core',
    'storages',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'airbcar_backend.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'airbcar_backend.wsgi.application'

# Database - FORCE localhost for CI
print("=== SETTINGS_CI_SIMPLE.PY LOADING ===")
print(f"Environment DB_HOST: {os.environ.get('DB_HOST', 'NOT SET')}")
print(f"Environment DATABASE_HOST: {os.environ.get('DATABASE_HOST', 'NOT SET')}")

# Support both DB_* and DATABASE_* environment variable formats
db_name = os.environ.get('DB_NAME') or os.environ.get('DATABASE_NAME', 'airbcar_db')
db_user = os.environ.get('DB_USER') or os.environ.get('DATABASE_USER', 'airbcar_user')
db_password = os.environ.get('DB_PASSWORD') or os.environ.get('DATABASE_PASSWORD', 'amineamine')
db_port = os.environ.get('DB_PORT') or os.environ.get('DATABASE_PORT', '5432')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': db_name,
        'USER': db_user,
        'PASSWORD': db_password,
        'HOST': 'localhost',  # FORCED to localhost for CI - NO ENVIRONMENT VARIABLE
        'PORT': db_port,
    }
}

# Print debug info
print(f"CI Simple Settings - Database HOST: {DATABASES['default']['HOST']}")
print(f"CI Simple Settings - Database NAME: {DATABASES['default']['NAME']}")
print("=== SETTINGS_CI_SIMPLE.PY LOADED ===")

# Auth settings
AUTH_PASSWORD_VALIDATORS = []
AUTH_USER_MODEL = 'core.User'

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = '/tmp/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = '/tmp/test_media/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# File storage
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Speed up tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Disable logging
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
