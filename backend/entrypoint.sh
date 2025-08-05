#!/bin/bash
set -e

# Change to the Django project directory
cd /app/airbcar_backend

# Run Django migrations
python manage.py migrate --no-input

# Skip superuser creation since we have restored database with existing users

# Start the Django development server
python manage.py runserver 0.0.0.0:8000
