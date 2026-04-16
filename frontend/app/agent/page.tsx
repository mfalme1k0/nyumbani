import Link from 'next/link';

export default function AgentDashboard() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <p style={{ margin: 0, color: '#8b5cf6', fontWeight: 700 }}>Agent Console</p>
          <h1 style={{ margin: '0.5rem 0' }}>Manage properties, tenants, and finance</h1>
        </div>
        <Link href="/tenant">
          <button className="button secondary">Switch to Tenant</button>
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '1.5rem' }}>
        <div className="card">
          <h2>Portfolio</h2>
          <p>Post new listings, update availability, and preview occupancy status.</p>
        </div>
        <div className="card">
          <h2>Maintenance</h2>
          <p>Track requests from tenants and assign work orders to your operations team.</p>
        </div>
        <div className="card">
          <h2>Payments</h2>
          <p>Review rent history and overdue balances for each lease.</p>
        </div>
      </div>
    </main>
  );
}
