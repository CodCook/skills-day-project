import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bookingIndex = store.bookings.findIndex(b => b.id === params.id);
  if (bookingIndex === -1) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const booking = store.bookings[bookingIndex];
  const session = store.sessions.find(s => s.id === booking.sessionId);
  
  if (session) {
    session.remainingSeats += 1;
  }

  store.bookings.splice(bookingIndex, 1);

  return NextResponse.json({ success: true });
}
