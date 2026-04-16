import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nyumbani',
  description: 'Dual-sided real estate platform for tenants and agents'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
