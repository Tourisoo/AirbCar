export async function createListing(vehicleData) {
  // Read JWT token
  let token = null;
  if (typeof window !== 'undefined') {
    try {
      token = localStorage.getItem('access_token') || localStorage.getItem('token');
    } catch (_) {}
  }
  if (!token) {
    throw new Error('Please sign in to add a vehicle.');
  }

  // Map frontend fields to backend Listing fields
  const payload = {
    make: vehicleData.brand || '',
    model: vehicleData.model || '',
    year: vehicleData.year ? parseInt(vehicleData.year, 10) : null,
    location: vehicleData.location || '',
    price_per_day: vehicleData.dailyRate ? Number(vehicleData.dailyRate) : 0,
    availability: true,
    fuel_type: vehicleData.fuelType || '',
    transmission: vehicleData.transmission || '',
    seating_capacity: vehicleData.seatingCapacity ? Number(vehicleData.seatingCapacity) : null,
    vehicle_condition: vehicleData.condition || '',
    vehicle_description: vehicleData.description || '',
    available_features: Array.isArray(vehicleData.features) ? vehicleData.features : [],
    features: Array.isArray(vehicleData.features) ? vehicleData.features : [],
    rating: 0.0
  };

  // Basic validation
  const required = ['make', 'model', 'year', 'fuel_type', 'transmission', 'seating_capacity', 'vehicle_condition', 'price_per_day'];
  const missing = required.filter((k) => payload[k] === null || payload[k] === '' || Number.isNaN(payload[k]));
  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  const response = await fetch('http://localhost:8000/listings/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = 'Failed to add vehicle';
    try {
      const err = await response.json();
      if (err?.errors) message = JSON.stringify(err.errors);
      if (err?.detail) message = err.detail;
    } catch (_) {
      try { message = await response.text(); } catch {}
    }
    if (response.status === 401) message = 'Your session expired. Please sign in again.';
    throw new Error(message);
  }

  return response.json();
}

export async function updateListing(listingId, updates) {
  let token = null;
  if (typeof window !== 'undefined') {
    try { token = localStorage.getItem('access_token') || localStorage.getItem('token'); } catch (_) {}
  }
  if (!token) throw new Error('Please sign in to update a vehicle.');

  // Map partial updates similarly to create
  const payload = {
    ...(updates.brand !== undefined ? { make: updates.brand } : {}),
    ...(updates.model !== undefined ? { model: updates.model } : {}),
    ...(updates.year !== undefined ? { year: parseInt(updates.year, 10) } : {}),
    ...(updates.location !== undefined ? { location: updates.location } : {}),
    ...(updates.dailyRate !== undefined ? { price_per_day: Number(updates.dailyRate) } : {}),
    ...(updates.fuelType !== undefined ? { fuel_type: updates.fuelType } : {}),
    ...(updates.transmission !== undefined ? { transmission: updates.transmission } : {}),
    ...(updates.seatingCapacity !== undefined ? { seating_capacity: Number(updates.seatingCapacity) } : {}),
    ...(updates.condition !== undefined ? { vehicle_condition: updates.condition } : {}),
    ...(updates.description !== undefined ? { vehicle_description: updates.description } : {}),
    ...(updates.features !== undefined ? { available_features: updates.features, features: updates.features } : {}),
    ...(updates.availability !== undefined ? { availability: !!updates.availability } : {}),
  };

  const res = await fetch(`http://localhost:8000/listings/${listingId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'Failed to update vehicle';
    try { const err = await res.json(); if (err?.errors) message = JSON.stringify(err.errors); if (err?.detail) message = err.detail; } catch(_) { try { message = await res.text(); } catch(_){} }
    if (res.status === 401) message = 'Your session expired. Please sign in again.';
    throw new Error(message);
  }
  return res.json();
}

export async function deleteListing(listingId) {
  let token = null;
  if (typeof window !== 'undefined') {
    try { token = localStorage.getItem('access_token') || localStorage.getItem('token'); } catch (_) {}
  }
  if (!token) throw new Error('Please sign in to delete a vehicle.');

  const res = await fetch(`http://localhost:8000/listings/${listingId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = 'Failed to delete vehicle';
    try { const err = await res.json(); if (err?.errors) message = JSON.stringify(err.errors); if (err?.detail) message = err.detail; } catch(_) { try { message = await res.text(); } catch(_){} }
    if (res.status === 401) message = 'Your session expired. Please sign in again.';
    throw new Error(message);
  }
  // DRF returns 204 No Content typically
  return true;
}


