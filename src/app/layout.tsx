import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'UDST Skills Day Booking',
  description: 'Book your sessions for UDST Skills Day',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter min-h-screen flex flex-col`}>
        <header className="bg-navy text-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold bg-gold text-navy px-3 py-1 rounded">
              UDST Skills Day
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-gold transition-colors">Sessions</Link>
              <Link href="/my-bookings" className="hover:text-gold transition-colors">My Bookings</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200 mt-8">
          © 2026 University of Doha for Science and Technology
        </footer>
      </body>
    </html>
  );
}
