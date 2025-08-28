import { useState, useEffect } from 'react';

const PARTNERS_API_URL = '/api/partners';

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
  const response = await fetch(PARTNERS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partner),
  });
  if (!response.ok) throw new Error('Failed to create partner');
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
