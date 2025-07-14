#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for postgres at $DATABASE_HOST:$DATABASE_PORT..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 0.1
done
echo "Postgres is up - continuing"

# Apply Django migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Create superuser if it doesn't exist
# This is executed *after* the database is ready and migrations are applied.
# Ensure no invisible characters or incorrect indentation in this line.
echo "from django.contrib.auth import get_user_model; User = get_user_model(); if not User.objects.filter(username='admin').exists(): User.objects.create_superuser('admin', 'adminadmin')" | python manage.py shell

# Execute the main command passed to CMD (e.g., runserver)
echo "Starting Django development server..."
exec "$@"