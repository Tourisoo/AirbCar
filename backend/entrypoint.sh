# #!/bin/bash

echo "Waiting for PostgreSQL to be available at $DATABASE_HOST:$DATABASE_PORT..."

while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 1
  echo "Still waiting..."
done

echo "PostgreSQL is up! Running the app..."

exec "$@"