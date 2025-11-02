FROM python:3.8-slim
RUN apt-get update && apt-get install -y netcat-openbsd postgresql-client curl && apt-get clean
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["bash", "/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]