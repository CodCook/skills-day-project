"use client";

import { useEffect, useState, FormEvent } from 'react';
import { Session } from '@/lib/store';

export default function AdminPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [title, setTitle] = useState('');
  const [mentor, setMentor] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchSessions = async () => {
    const res = await fetch('/api/sessions');
    const data = await res.json();
    setSessions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, mentor, location, time, capacity: parseInt(capacity) 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to add session');
      } else {
        setSuccess(true);
        setTitle('');
        setMentor('');
        setLocation('');
        setTime('');
        setCapacity('20');
        fetchSessions();
      }
    } catch (err) {
       setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-navy border-b-2 border-gold pb-2 inline-block">Admin Dashboard</h1>
      
      <div className="glass p-6 shadow-sm rounded-lg border border-gray-100">
        <h2 className="text-xl font-bold text-navy mb-4">Add New Session</h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded">Session added successfully!</div>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mentor</label>
            <input type="text" required value={mentor} onChange={e => setMentor(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-navy" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input type="text" required value={time} onChange={e => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM" className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" required value={location} onChange={e => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
            <input type="number" min="1" required value={capacity} onChange={e => setCapacity(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-navy" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading}
              className="bg-gold text-navy font-bold py-2 px-6 rounded hover:bg-navy hover:text-white transition-colors">
              {loading ? 'Adding...' : 'Add Session'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full text-left">
          <thead className="bg-navy text-white text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Mentor</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-center">Bookings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white/50">
            {sessions.map(s => (
              <tr key={s.id} className="hover:bg-white/80 transition-colors text-sm text-navy">
                <td className="px-6 py-4 font-medium">{s.title}</td>
                <td className="px-6 py-4">{s.mentor || 'N/A'}</td>
                <td className="px-6 py-4">{s.location}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.remainingSeats === 0 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-navy'}`}>
                    {s.capacity - s.remainingSeats} / {s.capacity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
