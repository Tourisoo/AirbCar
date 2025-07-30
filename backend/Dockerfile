
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
WORKDIR /app/airbcar_backend 
EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]