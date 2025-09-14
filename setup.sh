#!/bin/bash

# Development environment setup script
echo "Setting up development environment..."

# Navigate to backend directory
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "env" ]; then
    echo "Creating virtual environment..."
    python3 -m venv env
fi

# Activate virtual environment
echo "Activating virtual environment..."
source env/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f "airbcar_backend/.env" ]; then
    echo "Creating .env file..."
    cat > airbcar_backend/.env << 'EOL'
DATABASE_NAME=postgres
DATABASE_USER=postgres.wtbmqtmmdobfvvecinif
DATABASE_PASSWORD=Mayache+123455
DATABASE_HOST=aws-1-eu-north-1.pooler.supabase.com
DATABASE_PORT=5432
DJANGO_SUPERUSER_USERNAME=amine
DJANGO_SUPERUSER_EMAIL=amine@a.com
DJANGO_SUPERUSER_PASSWORD=amineamine
SECRET_KEY=django-insecure-^pubqu2q2%=t9@(fd&wu3b4q9n4d3nigjo5b3a86i!q33jl=^_
DEBUG=True
EOL
fi

# Navigate to Django project directory
cd airbcar_backend

# Handle migrations
echo "Handling database migrations..."
python3 manage.py migrate core 0003_partner_contact_and_login_fields --fake 2>/dev/null || true
python3 manage.py migrate

echo "Setup complete!"
echo "To start the development server:"
echo "cd backend && source env/bin/activate && cd airbcar_backend && python3 manage.py runserver 8001"