# AddVehicleModal Backend Integration

This document explains how the AddVehicleModal component has been successfully integrated with the Django backend.

## Overview

The AddVehicleModal component now connects directly to the Django REST API backend to create vehicle listings for partners. The integration includes:

- User authentication validation
- Partner status verification
- Vehicle data mapping
- File upload handling
- Error handling and validation
- Success feedback

## Components Updated

### 1. AddVehicleModal.js (`/frontend/src/app/components/AddVehicleModal.js`)

**Key Changes:**
- Added authentication context integration
- Implemented backend API calls using `createListing` hook
- Added partner status validation
- Enhanced file upload handling with backend storage
- Improved error handling and user feedback

**Features:**
- Validates user is signed in
- Checks if user has partner status
- Maps frontend form data to backend API format
- Handles photo uploads to backend storage
- Provides real-time validation and error messages

### 2. Partner Dashboard (`/frontend/src/app/partner/dashboard/page.js`)

**Key Changes:**
- Updated vehicle submission handler to work with backend
- Added real partner data loading
- Integrated with AddVehicleModal for seamless vehicle addition
- Enhanced error handling

### 3. File Upload Utilities (`/frontend/src/utils/fileUpload.js`)

**New Features:**
- Centralized file handling logic
- Backend photo upload integration
- File validation (size, type)
- Error handling for upload failures

## API Integration

### Backend Endpoints Used

1. **Authentication:**
   - `POST /api/token/` - User login
   - `POST /api/register/` - User registration
   - `GET /api/verify-token/` - Token validation

2. **Partner Management:**
   - `POST /partners/` - Partner registration
   - `GET /partners/` - Partner data retrieval

3. **Vehicle Listings:**
   - `POST /listings/` - Create new vehicle listing
   - `GET /listings/` - Retrieve partner's listings
   - `PATCH /listings/{id}/` - Update listing (including photo uploads)

### Data Mapping

Frontend form fields are mapped to backend model fields:

```javascript
Frontend → Backend
brand → make
dailyRate → price_per_day
seatingCapacity → seating_capacity
condition → vehicle_condition
description → vehicle_description
features → features (JSON array)
```

## How to Use

### For Users:

1. **Sign Up/Sign In:**
   - Users must be authenticated to add vehicles
   - Visit `/auth/signin` or `/auth/signup`

2. **Register as Partner:**
   - Visit `/partner` to register as a partner
   - Complete partner registration form
   - This sets `is_partner = true` in user profile

3. **Add Vehicle:**
   - Access partner dashboard at `/partner/dashboard`
   - Click "Add Vehicle" button
   - Complete the 5-step form:
     - Step 1: Basic Information (brand, model, year, etc.)
     - Step 2: Specifications (seating, condition)
     - Step 3: Features (optional accessories)
     - Step 4: Pricing & Location
     - Step 5: Photos (at least front photo required)

4. **Photo Upload:**
   - Upload photos for front, side, back, and interior views
   - Photos are validated and stored in backend
   - Preview available during upload

### For Developers:

1. **Start Backend:**
   ```bash
   cd backend/airbcar_backend
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Integration:**
   - Visit `/test-add-vehicle` for integration testing
   - Check console logs for API responses
   - Verify data in Django admin panel

## Error Handling

The integration includes comprehensive error handling:

- **Authentication Errors:** User not signed in
- **Authorization Errors:** User not a partner
- **Validation Errors:** Missing required fields
- **File Upload Errors:** Invalid file types, size limits
- **Network Errors:** Backend connectivity issues
- **Server Errors:** Backend validation failures

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── AddVehicleModal.js (✅ Updated)
│   │   ├── partner/
│   │   │   └── dashboard/page.js (✅ Updated)
│   │   └── test-add-vehicle/page.js (✅ New)
│   ├── hooks/
│   │   └── useListYourVehicle.js (✅ Existing)
│   ├── contexts/
│   │   └── AuthContext.js (✅ Existing)
│   └── utils/
│       └── fileUpload.js (✅ New)

backend/
├── airbcar_backend/
│   └── core/
│       ├── models.py (✅ Existing)
│       ├── serializers.py (✅ Existing)
│       ├── views.py (✅ Existing)
│       └── urls.py (✅ Existing)
```

## Testing

1. **Manual Testing:**
   - Use the test page at `/test-add-vehicle`
   - Complete the full partner registration and vehicle addition flow
   - Verify data appears in Django admin

2. **API Testing:**
   - Use Postman to test API endpoints directly
   - Check authentication headers
   - Verify data format and validation

## Next Steps

1. **Enhanced Photo Management:**
   - Multiple photo uploads per listing
   - Photo ordering and management
   - Image optimization and resizing

2. **Advanced Features:**
   - Vehicle availability calendar
   - Pricing rules and discounts
   - Vehicle verification process

3. **UI Improvements:**
   - Toast notifications instead of alerts
   - Progress indicators
   - Better mobile responsiveness

## Troubleshooting

### Common Issues:

1. **"Please sign in to add a vehicle"**
   - User not authenticated
   - Check localStorage for access_token

2. **"You need to register as a partner first"**
   - User hasn't completed partner registration
   - Visit `/partner` to register

3. **"Failed to add vehicle"**
   - Check browser console for detailed error
   - Verify backend is running
   - Check API endpoint URLs

4. **Photo upload failures**
   - Check file size (max 5MB)
   - Verify file type (images only)
   - Check backend storage configuration

### Debug Mode:

Enable debug mode by checking browser console logs during form submission. All API calls and errors are logged for troubleshooting.
