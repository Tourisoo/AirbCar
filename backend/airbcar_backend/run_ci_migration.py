#!/usr/bin/env python
"""
Direct migration script for CI that bypasses manage.py
"""
import os
import sys

# FORCE the settings module before ANY Django imports
os.environ['DJANGO_SETTINGS_MODULE'] = 'airbcar_backend.settings_ci_simple'

# Force localhost for extra safety
os.environ['DB_HOST'] = 'localhost'

print(f"Migration script: DJANGO_SETTINGS_MODULE = {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"Migration script: DB_HOST = {os.environ.get('DB_HOST')}")

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
import django
django.setup()

# Verify settings
from django.conf import settings
print(f"Migration script: Using settings module: {settings.SETTINGS_MODULE}")
print(f"Migration script: Database HOST: {settings.DATABASES['default']['HOST']}")
print(f"Migration script: Database NAME: {settings.DATABASES['default']['NAME']}")

# Fail fast if wrong HOST
if settings.DATABASES['default']['HOST'] != 'localhost':
    print(f"ERROR: Database HOST is '{settings.DATABASES['default']['HOST']}', expected 'localhost'")
    sys.exit(1)

# Run migrations
from django.core.management import call_command

try:
    print("Running migrations...")
    call_command('migrate', verbosity=2)
    print("Migrations completed successfully!")
except Exception as e:
    print(f"Migration failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
