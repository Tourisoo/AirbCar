#!/bin/bash
set -e

# Run Django migrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "from django.contrib.auth import get_user_model; User = get_user_model(); \
if not User.objects.filter(username='admin').exists(): \
    User.objects.create_superuser('admin', 'admin@example.com', 'adminadmin')" | python manage.py shell

# Finally run the main process (your server)
exec "$@"
