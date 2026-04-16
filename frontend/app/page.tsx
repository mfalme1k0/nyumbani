import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <section className="card">
        <div className="header">
          <div>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 700 }}>Nyumbani</p>
            <h1 style={{ margin: '0.5rem 0' }}>Modern real estate experience for tenants and agents</h1>
          </div>
          <Link href="/tenant">
            <button className="button">Enter Tenant Dashboard</button>
          </Link>
        </div>
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>
          Search properties, track lease status, report maintenance, and manage portfolio from a single platform.
        </p>
      </section>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '1.5rem' }}>
        <div className="card">
          <h2>Tenant Experience</h2>
          <p>Discover vacancy, favorite listings, submit applications, and access tenant forums.</p>
        </div>
        <div className="card">
          <h2>Agent Dashboard</h2>
          <p>Manage properties, occupancy, payments, and maintenance requests in one control center.</p>
        </div>
        <div className="card">
          <h2>Forum & Support</h2>
          <p>Enable tenant conversations and agent moderation for complaints and community collaboration.</p>
        </div>
      </div>
    </main>
  );
}
