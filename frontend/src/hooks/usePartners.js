import { useState, useEffect } from 'react';

const PARTNERS_API_URL = 'http://localhost:8000/partners/';
const PARTNER_REGISTER_API_URL = 'http://localhost:8000/api/partners/register/';

// Get partner data (hook)
export function usePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(PARTNERS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch partners');
        const data = await response.json();
        setPartners(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  return { partners, loading, error };
}

// Post partner data
export async function createPartner(partner) {
  let token = null;
  if (typeof window !== 'undefined') {
    try {
      token = localStorage.getItem('access_token') || localStorage.getItem('token');
    } catch (e) {}
  }
  const response = await fetch(PARTNERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(partner),
  });
  if (!response.ok) throw new Error('Failed to create partner');
  return response.json();
}

// Register or convert current user to partner (auth required)
export async function registerPartner(partner) {
  let token = null;
  if (typeof window !== 'undefined') {
    try {
      token = localStorage.getItem('access_token') || localStorage.getItem('token');
    } catch (e) {}
  }
  if (!token) {
    throw new Error('Please sign in to continue.');
  }
  // Include current user's email/username from token if available
  let payload;
  try {
    payload = JSON.parse(atob(token.split('.')[1]));
  } catch {}
  const enriched = {
    ...partner,
    user_email: payload?.email,
    user_username: payload?.username
  };
  let response = await fetch('http://localhost:8000/partners/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(enriched),
  });
  // Fallback: if the dedicated register endpoint is missing, try the DRF viewset route
  if (response.status === 404) {
    response = await fetch(PARTNERS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(enriched),
    });
  }
  if (!response.ok) {
    let errText = 'Failed to register partner';
    try {
      const errBody = await response.json();
      if (errBody?.errors) {
        errText = typeof errBody.errors === 'string' ? errBody.errors : JSON.stringify(errBody.errors);
      } else if (errBody?.detail) {
        errText = errBody.detail;
      }
    } catch (_) {
      try { errText = await response.text(); } catch {}
    }
    if (response.status === 401) errText = 'Your session expired. Please sign in again.';
    if (response.status === 400 && !errText) errText = 'Please check the form fields and try again.';
    throw new Error(errText);
  }
  return response.json();
}

// Update partner data
export async function updatePartner(id, updates) {
  const response = await fetch(`${PARTNERS_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update partner');
  return response.json();
}

// Delete partner data
export async function deletePartner(id) {
  const response = await fetch(`${PARTNERS_API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete partner');
  return response.json();
}
