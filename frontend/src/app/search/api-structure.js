// Car search API endpoints and data structures

// GET /api/cars/search
// Parameters: location, pickupDate, dropoffDate, pickupTime
// Response format:
{
  "results": [
    {
      "id": 1,
      "name": "Dacia Duster 2020",
      "brand": "Dacia",
      "model": "Duster",
      "year": 2020,
      "image": "https://example.com/car-image.jpg",
      "images": [
        "https://example.com/car-image-1.jpg",
        "https://example.com/car-image-2.jpg"
      ],
      "price_per_day": 420,
      "currency": "MAD",
      "location": "Agadir",
      "transmission": "Manual",
      "fuel_type": "Diesel",
      "seats": 5,
      "doors": 4,
      "air_conditioning": true,
      "rating": 4.8,
      "review_count": 124,
      "verified_agency": true,
      "agency": {
        "id": 1,
        "name": "Premium Car Rental",
        "verified": true,
        "rating": 4.9
      },
      "features": [
        "Air Conditioning",
        "GPS Navigation",
        "Bluetooth",
        "USB Port",
        "Power Steering"
      ],
      "availability": {
        "available": true,
        "pickup_date": "2025-08-15",
        "dropoff_date": "2025-08-20"
      },
      "insurance_options": [
        {
          "type": "basic",
          "name": "Basic Insurance",
          "price_per_day": 50,
          "coverage": "Third party liability"
        },
        {
          "type": "comprehensive",
          "name": "Comprehensive Insurance",
          "price_per_day": 120,
          "coverage": "Full coverage including theft and damage"
        }
      ],
      "extras": [
        {
          "id": 1,
          "name": "GPS Navigation",
          "price_per_day": 25,
          "included": true
        },
        {
          "id": 2,
          "name": "Child Seat",
          "price_per_day": 30,
          "included": false
        },
        {
          "id": 3,
          "name": "Additional Driver",
          "price_per_day": 40,
          "included": false
        }
      ]
    }
  ],
  "filters": {
    "price_range": {
      "min": 200,
      "max": 1500
    },
    "transmission_types": ["Manual", "Automatic"],
    "fuel_types": ["Petrol", "Diesel", "Electric", "Hybrid"],
    "seat_options": [2, 4, 5, 7, 8],
    "locations": ["Agadir", "Casablanca", "Marrakesh", "Rabat", "Tangier"]
  },
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_results": 42,
    "per_page": 10
  }
}

// GET /api/cars/:id
// Detailed car information for the car details page

// POST /bookings
// Create a new booking
{
  "car_id": 1,
  "pickup_date": "2025-08-15",
  "dropoff_date": "2025-08-20",
  "pickup_time": "10:00",
  "pickup_location": "Agadir Airport",
  "dropoff_location": "Agadir Airport",
  "extras": [2, 3], // IDs of selected extras
  "insurance_type": "comprehensive",
  "customer_info": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+212-xxx-xxx-xxx",
    "driving_license": "ABC123456"
  },
  "payment_info": {
    "method": "credit_card",
    "card_token": "tok_xxxxxxxxxxxx"
  }
}
