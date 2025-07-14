# FROM python:3.8-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY . .
# WORKDIR /app/airbcar_backend
# EXPOSE 8000
# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh
# ENTRYPOINT ["bash", "/entrypoint.sh"]
# CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

FROM python:3.8-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
WORKDIR /app/airbcar_backend
EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["bash", "/entrypoint.sh"]
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); if not User.objects.filter(username='admin').exists(): User.objects.create_superuser('admin', 'admin@example.com', 'adminadmin')" | python manage.py shell
# ENTRYPOINT [ "echo", "from django.contrib.auth import get_user_model; User = get_user_model(); if not User.objects.filter(username='admin').exists(): User.objects.create_superuser('admin', 'admin@example.com', 'adminadmin')", "|", "python", "manage.py", "shell"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]