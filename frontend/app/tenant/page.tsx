import Link from 'next/link';

const sampleProperties = [
  { id: '1', title: 'Sunrise Villa', location: 'Nairobi', rent: 850, beds: 3, baths: 2 },
  { id: '2', title: 'RoofTop Suite', location: 'Mombasa', rent: 620, beds: 2, baths: 1 }
];

export default function TenantDashboard() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <p style={{ margin: 0, color: '#10b981', fontWeight: 700 }}>Tenant Portal</p>
          <h1 style={{ margin: '0.5rem 0' }}>Find your next home and track your move-in</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/tenant/search">
            <button className="button secondary">Search homes</button>
          </Link>
          <Link href="/agent">
            <button className="button secondary">Switch to Agent</button>
          </Link>
        </div>
      </div>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Search results</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '1rem' }}>
          {sampleProperties.map((property) => (
            <article key={property.id} className="card">
              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <p>Rent: ${property.rent}/mo</p>
              <p>{property.beds} beds • {property.baths} baths</p>
              <button className="button" style={{ marginTop: '1rem' }}>View details</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
