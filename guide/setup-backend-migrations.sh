#!/bin/bash

# Navigate to Django project directory
cd /Users/naoufal_cn/Desktop/airbcar/backend/airbcar_backend

# Create migrations
echo "Creating migrations..."
python manage.py makemigrations

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

echo "Migration complete!"
