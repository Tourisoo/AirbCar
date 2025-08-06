#!/bin/bash

# set -e
# python manage.py migrate --no-input
# exec "$@"


# echo "Waiting for postgres..."
# while ! nc -z $DB_HOST $DB_PORT; do
#   sleep 0.1
# done
# echo "PostgreSQL started"
# python manage.py migrate
# python manage.py runserver 0.0.0.0:8000


# Wait until PostgreSQL is ready
echo "Waiting for PostgreSQL to be available at $DATABASE_HOST:$DATABASE_PORT..."

while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 1
  echo "Still waiting..."
done

echo "PostgreSQL is up! Running the app..."

exec "$@"
