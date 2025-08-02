#!/bin/bash
set -e

# Change to the Django project directory
cd /app/airbcar_backend

# Run Django migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminadmin')
EOF

# Finally run the main process (your server)
exec "$@"
