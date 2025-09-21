# Car Rental Booking Integration Test Guide

## Overview
This guide will help you test the car rental booking functionality that integrates the frontend with the backend API.

## Prerequisites
1. Django backend server running on http://localhost:8000
2. Next.js frontend server running on http://localhost:3000
3. Database migrations applied
4. At least one listing (car) in the database

## Test Steps

### 1. Setup Test Data
First, ensure you have test listings in your database. You can add them via Django admin or API.

### 2. Test Authentication
1. Navigate to the frontend
2. Register/login with a user account
3. Verify JWT token is stored in localStorage

### 3. Test Booking Flow
1. Go to `/search` page
2. Click on a car to view details
3. Click "Book Now" button
4. Fill out the booking form:
   - Select pickup and return dates
   - Fill in personal information
   - Add driving license number
5. Click "Continue" to proceed to confirmation
6. Review booking details
7. Click "Submit Request"
8. Verify booking is created successfully

### 4. Test Bookings List
1. Navigate to `/bookings` page (or click "My Bookings" in header)
2. Verify your booking appears in the list
3. Check booking details are correct
4. Test cancellation functionality if needed

## API Endpoints Tested

### POST /bookings/
Creates a new booking with the following data:
```json
{
  "listing": 1,
  "start_time": "2024-08-20T10:00:00.000Z",
  "end_time": "2024-08-21T10:00:00.000Z",
  "price": 445,
  "status": "pending"
}
```

### GET /bookings/
Retrieves all bookings for the authenticated user.

### PATCH /bookings/{id}/
Updates booking status (e.g., for cancellation).

## Expected Behavior

1. **Booking Creation**: 
   - Form validation prevents invalid submissions
   - Success message appears on successful booking
   - User is redirected to bookings page

2. **Bookings List**:
   - Shows only user's own bookings
   - Displays booking status with appropriate colors
   - Allows cancellation of pending bookings

3. **Error Handling**:
   - Network errors are caught and displayed
   - Invalid form data is validated
   - Authentication errors redirect to login

## Troubleshooting

### Common Issues

1. **"Listing not found" error**:
   - Ensure the car ID in the URL corresponds to an existing listing
   - Check that listings are properly created in the database

2. **Authentication errors**:
   - Verify JWT token is valid and not expired
   - Check that user is properly logged in

3. **API connection issues**:
   - Ensure backend server is running
   - Check CORS settings in Django
   - Verify API_BASE_URL in frontend

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Check network tab** to see API requests and responses
3. **Check Django logs** for backend errors
4. **Verify database** to see if bookings are being created

## Test Data Examples

### Sample Listing (via Django admin or API):
```python
{
    "make": "Dacia",
    "model": "Duster",
    "year": 2020,
    "location": "Agadir, Morocco",
    "price_per_day": 420,
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "seating_capacity": 5,
    "vehicle_condition": "Excellent"
}
```

### Sample User for Testing:
```python
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
}
```

## Success Criteria

✅ User can successfully create a booking
✅ Booking appears in the user's bookings list
✅ Booking data is correctly stored in the database
✅ User can view booking details
✅ User can cancel pending bookings
✅ Error handling works properly
✅ Authentication is enforced
