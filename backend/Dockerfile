
FROM python:3.8-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set working directory to Django project
WORKDIR /app/airbcar_backend 

EXPOSE 8000

# Create a simple startup script inline
RUN echo '#!/bin/bash\nset -e\npython manage.py migrate\necho "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='\''admin'\'').exists() or User.objects.create_superuser('\''admin'\'', '\''admin@example.com'\'', '\''adminadmin'\'')" | python manage.py shell\nexec "$@"' > /start.sh && chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]