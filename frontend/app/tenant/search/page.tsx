'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const API_BASE = 'http://localhost:4000/api';

type Property = {
  id: string;
  title: string;
  location: string;
  rent_amount: number;
  beds: number;
  baths: number;
  area_sqft?: number;
  security_rating?: number;
  status?: string;
  available?: boolean;
};

export default function TenantSearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (location) query.append('location', location);
      if (minRent) query.append('minRent', minRent);
      if (maxRent) query.append('maxRent', maxRent);
      if (search) query.append('search', search);
      const response = await fetch(`${API_BASE}/properties?${query.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load properties');
      }
      setProperties(data.properties || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE}/favorites`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setFavorites((data.favorites || []).map((item: any) => item.id || item.property_id || ''));
      }
    } catch {
      // ignore silently for now
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  const handleFavorite = async (propertyId: string) => {
    const isFavorite = favorites.includes(propertyId);
    try {
      if (isFavorite) {
        await fetch(`${API_BASE}/favorites/${propertyId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        setFavorites((current) => current.filter((id) => id !== propertyId));
      } else {
        const response = await fetch(`${API_BASE}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ propertyId })
        });
        if (!response.ok) {
          throw new Error('Unable to favorite property');
        }
        setFavorites((current) => [...current, propertyId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties;
  }, [properties]);

  return (
    <main className="container">
      <div className="header">
        <div>
          <p style={{ margin: 0, color: '#10b981', fontWeight: 700 }}>Tenant Search</p>
          <h1 style={{ margin: '0.5rem 0' }}>Discover homes and save favorites</h1>
        </div>
        <Link href="/tenant">
          <button className="button secondary">Back to Tenant Home</button>
        </Link>
      </div>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Search filters</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
          />
          <input
            value={minRent}
            onChange={(event) => setMinRent(event.target.value)}
            placeholder="Min rent"
            type="number"
          />
          <input
            value={maxRent}
            onChange={(event) => setMaxRent(event.target.value)}
            placeholder="Max rent"
            type="number"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Keyword"
          />
        </div>
        <button className="button" style={{ marginTop: '1rem' }} onClick={fetchProperties}>
          Search
        </button>
      </section>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <div className="header">
          <h2>Listings</h2>
          <p>{loading ? 'Loading homes...' : `${filteredProperties.length} properties found`}</p>
        </div>

        {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: '1rem' }}>
          {filteredProperties.map((property) => (
            <article key={property.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                </div>
                <button
                  className="button secondary"
                  onClick={() => handleFavorite(property.id)}
                  style={{ minWidth: 'auto' }}
                >
                  {favorites.includes(property.id) ? '★' : '☆'}
                </button>
              </div>
              <p>Rent: ${property.rent_amount}/mo</p>
              <p>{property.beds} beds • {property.baths} baths</p>
              <p>{property.area_sqft ?? 0} sqft • {property.status}</p>
              <small>Security rating: {property.security_rating ?? 0}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
