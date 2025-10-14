# #!/bin/bash

echo "Waiting for PostgreSQL to be available at $DATABASE_HOST:$DATABASE_PORT..."

while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 3
done

echo "PostgreSQL is up!"

exec "$@"