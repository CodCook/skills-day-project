"use client";

import { useEffect, useState } from 'react';
import { Session } from '@/lib/store';
import SessionCard from '@/components/sessions/SessionCard';

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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-navy border-b-2 border-gold pb-2 inline-block">Available Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
