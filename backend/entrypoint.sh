#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be available at $DATABASE_HOST:$DATABASE_PORT..."

while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 3
done

echo "PostgreSQL is up!"

# Only run migrations if FIRST_RUN=1 in .env.local
if [ "$FIRST_RUN" = "1" ]; then
    echo "First run detected. Initializing database..."
    python manage.py migrate --noinput
    
    # Load initial data first (before creating superuser to avoid conflicts)
    if [ "$LOAD_INITIAL_FIXTURE" = "1" ]; then
        echo "Loading initial data from fixtures..."
        if python manage.py loaddata initial_data.json; then
            echo "✅ Initial data loaded successfully!"
        else
            echo "⚠️  Warning: Could not load initial_data.json"
        fi
    fi
    
    # Create superuser AFTER loading fixtures (checks for specific username)
    echo "Checking/creating Django superuser..."
    python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

username = '$DJANGO_SUPERUSER_USERNAME'
email = '$DJANGO_SUPERUSER_EMAIL'
password = '$DJANGO_SUPERUSER_PASSWORD'

# Check if THIS SPECIFIC superuser exists
if User.objects.filter(username=username).exists():
    print(f'✅ Superuser "{username}" already exists')
else:
    # Create new superuser
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f'✅ Created new superuser: {username}')
EOF
    
    echo "Database initialized! Set FIRST_RUN=0 in .env.local to skip this next time."
fi

echo "Starting Django server..."
exec "$@"