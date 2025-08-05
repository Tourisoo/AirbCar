# Airbcar API Tests

This directory contains Postman collections and Newman test configurations for testing the Airbcar backend API.

## Files

- `airbcar-api-collection.json` - Main Postman collection with all API endpoints
- `airbcar-test-environment.json` - Environment variables for testing

## Prerequisites

1. **Backend Running**: Make sure the Airbcar backend is running on `http://localhost:8000`
2. **Newman Installed**: Install Newman globally:
   ```bash
   npm install -g newman
   ```

## Running Tests Locally

### Basic test run:
```bash
newman run ./tests/airbcar-api-collection.json
```

### With environment variables:
```bash
newman run ./tests/airbcar-api-collection.json -e ./tests/airbcar-test-environment.json
```

### With custom base URL:
```bash
newman run ./tests/airbcar-api-collection.json --environment-var "base_url=http://your-server:8000"
```

### Generate HTML report:
```bash
newman run ./tests/airbcar-api-collection.json -e ./tests/airbcar-test-environment.json -r html --reporter-html-export test-report.html
```

## Test Coverage

The collection includes tests for:

1. **Authentication**:
   - User registration
   - User login (JWT token generation)
   - Token refresh

2. **User Management**:
   - List all users
   - Get user by ID
   - User CRUD operations (via ViewSet)

3. **Health Check**:
   - Basic server connectivity test

## Test Data

The tests use the following test user credentials:
- Username: `testuser2`
- Email: `test2@example.com`
- Password: `testpass123`

For registration tests, random usernames and emails are generated using Postman's built-in variables.

## Environment Variables

- `base_url`: Backend server URL (default: `http://localhost:8000`)
- `access_token`: JWT access token (automatically set after login)
- `refresh_token`: JWT refresh token (automatically set after login)

## CI/CD Integration

These tests are automatically run in the GitHub Actions workflow in the `api-tests` job.

## Troubleshooting

1. **Connection refused**: Make sure the backend server is running
2. **401 Unauthorized**: Check if the test user exists in the database
3. **Token expired**: The login test will refresh tokens automatically
4. **Collection not found**: Make sure you're running the command from the project root directory
