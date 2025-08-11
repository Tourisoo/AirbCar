#!/usr/bin/env python
"""
CI test script that ensures proper database configuration
"""
import os
import sys

# Force environment variables for CI
if os.environ.get('GITHUB_ACTIONS'):
    os.environ['DB_HOST'] = 'localhost'
    print(f"CI Script: Forced DB_HOST to localhost")

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airbcar_backend.settings_ci')

# Import and setup Django
import django
django.setup()

# Run tests
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    # Print debug info
    from django.conf import settings
    print(f"CI Script: Using database host: {settings.DATABASES['default']['HOST']}")
    print(f"CI Script: Using database name: {settings.DATABASES['default']['NAME']}")
    
    # Execute test command
    execute_from_command_line(['manage.py', 'test'])
