#!/bin/bash
set -e

# Run Django migrations
python manage.py migrate --no-input

# Skip superuser creation since we have restored database with existing users

# Finally run the main process (your server)
exec "$@"
