import Link from 'next/link';
import { motion } from 'framer-motion';
import { Session } from '@/lib/store';

export default function SessionCard({ session }: { session: Session }) {
  const isFull = session.remainingSeats === 0;
  const capacityRatio = session.remainingSeats / session.capacity;
  const progressColor = isFull ? 'bg-red-500' : capacityRatio < 0.3 ? 'bg-red-400' : 'bg-gold';

  return (
    <motion.div 
      whileHover={!isFull ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={`glass p-6 flex flex-col justify-between shadow-sm overflow-hidden rounded-lg ${isFull ? 'grayscale opacity-75' : ''}`}
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
}
