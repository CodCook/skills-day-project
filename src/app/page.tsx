"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Session } from '@/lib/store';
import { motion } from 'framer-motion';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        {sessions.map((session, index) => {
          const isFull = session.remainingSeats === 0;
          const capacityRatio = session.remainingSeats / session.capacity;
          const progressColor = isFull ? 'bg-red-500' : capacityRatio < 0.3 ? 'bg-red-400' : 'bg-gold';
          // Bento Grid logic: first item takes more space if desired, or alternate
          const colSpan = index === 0 ? 'lg:col-span-2' : (index === 3 || index === 4) ? 'lg:col-span-2' : 'lg:col-span-1';

          return (
            <motion.div 
              key={session.id} 
              whileHover={!isFull ? { scale: 1.02 } : {}}
              transition={{ duration: 0.2 }}
              className={`glass p-6 flex flex-col justify-between shadow-sm overflow-hidden rounded-lg ${isFull ? 'grayscale opacity-75' : ''} ${colSpan}`}
            >
              <div>
                <h2 className="text-xl font-bold text-navy mb-2 line-clamp-2">{session.title}</h2>
                <div className="text-gray-600 mb-4 space-y-1 text-sm">
                  {session.mentor && <p className="font-medium">👨‍🏫 {session.mentor}</p>}
                  <p>📍 {session.location}</p>
                  <p>🕒 {session.time}</p>
                </div>
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`${progressColor} h-2.5 rounded-full transition-all duration-500`} 
                    style={{ width: `${((session.capacity - session.remainingSeats) / session.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                  <span>{session.remainingSeats} / {session.capacity} Seats Available</span>
                </div>
                
                <Link
                  href={`/book/${session.id}`}
                  className={`block text-center w-full py-2 rounded font-semibold transition-colors ${
                    isFull 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300' 
                      : 'bg-navy text-white hover:bg-gold hover:text-navy border border-transparent tracking-wide'
                  }`}
                  style={{ pointerEvents: isFull ? 'none' : 'auto' }}
                >
                  {isFull ? 'Session Full' : 'Book Now'}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
