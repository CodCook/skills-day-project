"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/lib/store';
import Link from 'next/link';

export default function BookSession({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [successRef, setSuccessRef] = useState('');

  useEffect(() => {
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data: Session[]) => {
        const found = data.find(s => s.id === params.id);
        setSession(found || null);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: params.id,
          studentName: name,
          studentEmail: email,
          studentId: studentId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to book session');
      } else {
        setSuccessRef(data.bookingRef);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-10 font-semibold">Loading session details...</div>;
  if (!session) return <div className="text-center py-10 text-red-600 font-semibold">Session not found.</div>;

  if (successRef) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-green-700">Booking Confirmed!</h2>
        <div className="bg-green-50 border border-green-200 p-4 rounded text-green-900">
          <p className="text-sm uppercase tracking-wide">Your Booking Reference</p>
          <p className="text-3xl font-mono font-bold mt-1 text-navy">{successRef}</p>
        </div>
        <p className="text-gray-600">We have reserved your seat for <strong>{session.title}</strong>.</p>
        <div className="pt-4 flex flex-col space-y-3">
          <Link href="/my-bookings" className="block w-full py-2 bg-navy text-white rounded font-medium hover:bg-gold hover:text-navy transition-colors">
            View My Bookings
          </Link>
          <Link href="/" className="block w-full py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-2xl font-bold text-navy border-b pb-2">Session Summary</h1>
        <div className="card p-5 space-y-2">
          <h2 className="text-lg font-bold">{session.title}</h2>
          <p className="text-sm text-gray-600">🕒 {session.time}</p>
          <p className="text-sm text-gray-600">📍 {session.location}</p>
          <div className="pt-2">
            <span className="px-2 py-1 text-xs font-bold rounded-lg border bg-blue-50 text-navy border-blue-200">
              {session.remainingSeats} Seats Remaining
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Book Your Seat</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                placeholder="Student Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                placeholder="student@udst.edu.qa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input type="text" required value={studentId} onChange={e => setStudentId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                placeholder="60000000" />
            </div>
            <button type="submit" disabled={session.remainingSeats === 0}
              className="w-full bg-navy text-white hover:bg-gold hover:text-navy py-2 rounded font-semibold transition-colors disabled:opacity-50">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
