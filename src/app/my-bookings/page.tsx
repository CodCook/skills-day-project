"use client";

import { useState, FormEvent } from 'react';
import { Booking, Session } from '@/lib/store';
import Link from 'next/link';

type BookingWithSession = Booking & { session?: Session };

export default function MyBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [bookings, setBookings] = useState<BookingWithSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/bookings?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to search bookings');
      } else {
        setBookings(data);
        setSearched(true);
      }
    } catch (err) {
      setError('An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string, index: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const newBookings = [...bookings];
        newBookings.splice(index, 1);
        setBookings(newBookings);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Error canceling booking');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-navy border-b-2 border-gold pb-2 inline-block">My Bookings</h1>
      
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input type="text" required value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
            placeholder="Enter your student email or ID..." />
          <button type="submit" disabled={loading}
            className="bg-navy text-white hover:bg-gold hover:text-navy px-6 py-2 rounded font-semibold transition-colors disabled:opacity-75">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      </div>

      {searched && !loading && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-10 card text-gray-600">
              No bookings found for {searchQuery}. <Link href="/" className="text-navy hover:underline font-semibold ml-2">Browse Sessions</Link>
            </div>
          ) : (
            bookings.map((booking, idx) => (
              <div key={booking.id} className="card p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono bg-blue-50 text-navy px-2 py-0.5 rounded text-xs border border-blue-200 font-bold">
                      {booking.bookingRef}
                    </span>
                    <h3 className="text-lg font-bold text-navy">{booking.session?.title || 'Unknown Session'}</h3>
                  </div>
                  <p className="text-sm text-gray-600">Student: {booking.studentName} ({booking.studentId})</p>
                  {booking.session && (
                    <p className="text-sm text-gray-500 mt-2">
                      🕒 {booking.session.time} | 📍 {booking.session.location}
                    </p>
                  )}
                </div>
                <button onClick={() => handleCancel(booking.id, idx)}
                  className="w-full md:w-auto border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded font-medium transition-colors text-sm">
                  Cancel Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
