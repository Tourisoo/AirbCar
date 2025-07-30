```markdown
# Airbcar Backend API Documentation

## Overview
* **Date**: June 9, 2025  
* **For**: Frontend Dev (Naoufal)  
* **Repo**: airbcar_backend  
* **Status**: Day 1 Complete (Login, Partial Sign-up, User APIs)  
* **Base URL**: `http://localhost:8000/` (dev)  
* **Note**: APIs use JSON and JWT authentication where noted.

## APIs

### 1. Login
* **Method**: POST  
* **URL**: `/api/token/`  
* **Body**:  
  ```json
  {
    "username": "testuser2",
    "password": "testpass123"
  }
  ```  
* **Response (200)**:  
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 4,
      "username": "testuser2",
      "email": "test2@example.com",
      "is_partner": false,
      "is_verified": false
    }
  }
  ```  
* **Errors**: 401 (invalid credentials)  
* **Notes**: Use `access` token in `Authorization: Bearer <token>`.

### 2. Refresh Token
* **Method**: POST  
* **URL**: `/api/token/refresh/`  
* **Body**:  
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```  
* **Response (200)**:  
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```  
* **Errors**: 401 (invalid/expired token)

### 3. Sign-up
* **Method**: POST  
* **URL**: `/api/register/`  
* **Body**:  
  ```json
  {
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "testpass123",
    "phone_number": "+1234567890" // optional
  }
  ```  
* **Response (201)**:  
  ```json
  {
    "id": 4,
    "username": "testuser2",
    "email": "test2@example.com",
    "phone_number": "+1234567890",
    "default_currency": "USD",
    "is_partner": false,
    "is_verified": false
  }
  ```  
* **Errors**: 400 (duplicate email/username)  
* **Notes**: `email_verification_token` not confirmed; check Day 2.

### 4. List Users
* **Method**: GET  
* **URL**: `/api/users/list/`  
* **Headers**: `Authorization: Bearer <token>` (optional)  
* **Response (200)**:  
  ```json
  [
    {
      "id": 4,
      "username": "testuser2",
      "email": "test2@example.com",
      "phone_number": "+1234567890",
      "is_partner": false,
      "is_verified": false
    }
  ]
  ```  
* **Errors**: 401 (if auth required)

### 5. User ViewSet
* **Base URL**: `/api/users/`  
* **Methods**:  
  * GET `/api/users/`: List users  
  * GET `/api/users/<id>/`: Get user (e.g., `/api/users/4/`)  
  * POST `/api/users/`: Create user (use `/api/register/`)  
  * PUT/PATCH `/api/users/<id>/`: Update user (WIP)  
  * DELETE `/api/users/<id>/`: Delete user (WIP)  
* **Headers**: `Authorization: Bearer <token>`  
* **Example (GET /api/users/4/)**:  
  ```json
  {
    "id": 4,
    "username": "testuser2",
    "email": "test2@example.com",
    "is_partner": false
  }
  ```  
* **Notes**: PUT, PATCH, DELETE in progress (Day 4)

## Frontend Guide

### Setup
1. **Run Backend**:  
   * Clone `airbcar_backend`, use `main` branch.  
   * In WSL:  
     ```bash
     cd airbcar_backend
     source env/bin/activate
     pip install -r requirements.txt
     sudo service postgresql start
     python manage.py migrate
     python manage.py runserver
     ```  
2. **Fix psycopg error**:  
   ```bash
   pip uninstall django -y && pip install django==4.2.21
   ```  
3. **DB**: PostgreSQL (`airbcar_db`, user: `airbcar_user`, pass: `amineamine`)  
4. **Or**: Ask Amine for dev server IP (local preferred).

### How to Use
* **Sign up**: POST `/api/register/`  
* **Login**: POST `/api/token/` for access/refresh tokens  
* **Store tokens**: In `localStorage` or cookies  
* **Use**: `Authorization: Bearer <access_token>` for `/api/users/`  
* **Refresh**: POST `/api/token/refresh/`  
* **Check**: `is_partner`, `is_verified` for UI logic  
* **Test**: Use Postman with `testuser2` (`test2@example.com`, `testpass123`)

## Pending
* Email verification (Day 2)  
* Password reset (Month 1)  
* More user APIs (Day 4)

## Contact
Amine for issues. Sync on Day 2 (June 10) for updates.
```
