
# # filepath: backend/Dockerfile

# FROM python:3.11-slim
# WORKDIR /app
# COPY backend/requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt
# COPY backend ./
# EXPOSE 8000
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "your_project_name.wsgi:application"]

FROM python:3.8-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["sh", "-c", "cd /app/airbcar_backend && python manage.py runserver 0.0.0.0:8000"]