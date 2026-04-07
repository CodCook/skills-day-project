import { Session } from '@/lib/store';

export default function SessionTable({ sessions }: { sessions: Session[] }) {
  return (
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
  );
}
