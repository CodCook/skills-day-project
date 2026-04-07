"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Session } from '@/lib/store';

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-navy font-semibold">Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-navy border-b-2 border-gold pb-2 inline-block">Available Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="card p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy mb-2">{session.title}</h2>
              <div className="text-gray-600 mb-4 space-y-1 text-sm">
                <p>📍 {session.location}</p>
                <p>🕒 {session.time}</p>
              </div>
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.remainingSeats > 0 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {session.remainingSeats} / {session.capacity} Seats Available
                </span>
              </div>
            </div>
            <Link
              href={`/book/${session.id}`}
              className={`block text-center w-full py-2 rounded font-semibold transition-colors ${
                session.remainingSeats === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300' 
                  : 'bg-navy text-white hover:bg-gold hover:text-navy border border-transparent'
              }`}
              style={{ pointerEvents: session.remainingSeats === 0 ? 'none' : 'auto' }}
            >
              {session.remainingSeats === 0 ? 'Session Full' : 'Book Now'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
