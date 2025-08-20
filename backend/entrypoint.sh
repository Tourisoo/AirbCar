# #!/bin/bash


# # Wait until PostgreSQL is ready
echo "Waiting for PostgreSQL to be available at $DATABASE_HOST:$DATABASE_PORT..."

while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 1
  echo "Still waiting..."
done

echo "PostgreSQL is up! Running the app..."

exec "$@"


# set -euo pipefail

# export DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE:-airbcar_backend.settings}

# echo "[entrypoint] Waiting for PostgreSQL at $DATABASE_HOST:$DATABASE_PORT..."
# while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
#   sleep 1
# done
# echo "[entrypoint] DB up."

# echo "[entrypoint] Applying migrations..."
# python manage.py migrate --noinput

# echo "[entrypoint] Creating superuser if missing..."
# python - <<'PY'
# import os
# os.environ.setdefault("DJANGO_SETTINGS_MODULE","airbcar_backend.settings")
# import django
# django.setup()
# from django.contrib.auth import get_user_model
# U=get_user_model()
# u=os.getenv("DJANGO_SUPERUSER_USERNAME","admin")
# e=os.getenv("DJANGO_SUPERUSER_EMAIL","admin@example.com")
# p=os.getenv("DJANGO_SUPERUSER_PASSWORD","adminpass")
# if not U.objects.filter(username=u).exists():
#   U.objects.create_superuser(u,e,p)
#   print("[entrypoint] Superuser created:", u)
# else:
#   print("[entrypoint] Superuser exists:", u)
# PY

# echo "[entrypoint] Starting server..."
# exec "$@"

#!/bin/bash
# echo "[entrypoint] Waiting for PostgreSQL at db:5432..."
# for i in {1..60}; do
#   if psql -h db -U airbcar_user -d airbcar_db -c '\l' > /dev/null 2>&1; then
#     echo "[entrypoint] DB up."
#     break
#   fi
#   echo "[entrypoint] Waiting for DB... ($i/60)"
#   sleep 2
# done
# if [ $i -eq 60 ]; then
#   echo "[entrypoint] Error: Database connection timeout."
#   exit 1
# fi
# echo "[entrypoint] Applying migrations..."
# python manage.py migrate
# Skip createsuperuser for now
# echo "[entrypoint] Creating superuser if missing..."
# python manage.py createsuperuser --noinput
# exec python manage.py runserver 0.0.0.0:8000
