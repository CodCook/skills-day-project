import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, studentName, studentEmail, studentId } = body;

    if (!sessionId || !studentName || !studentEmail || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!studentEmail.toLowerCase().endsWith('@udst.edu.qa')) {
      return NextResponse.json({ error: 'Email must be a valid @udst.edu.qa address' }, { status: 400 });
    }

    const session = store.sessions.find(s => s.id === sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.remainingSeats <= 0) {
      return NextResponse.json({ error: 'Session is full' }, { status: 400 });
    }

    const existingBooking = store.bookings.find(
      b => b.sessionId === sessionId && (b.studentEmail.toLowerCase() === studentEmail.toLowerCase() || b.studentId === studentId)
    );
    if (existingBooking) {
      return NextResponse.json({ error: 'You have already booked this session (duplicate email or student ID)' }, { status: 400 });
    }

    // Atomic-like update in JS main thread
    const bookingRef = `UDST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: crypto.randomUUID(),
      bookingRef,
      sessionId,
      studentName,
      studentEmail,
      studentId,
      createdAt: new Date().toISOString()
    };

    store.bookings.push(newBooking);
    session.remainingSeats -= 1;

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const query = searchParams.get('query');
  
  const searchTerm = query || email;

  if (!searchTerm) {
    return NextResponse.json({ error: 'Search parameter is required' }, { status: 400 });
  }

  const userBookings = store.bookings.filter(b => 
    b.studentEmail.toLowerCase() === searchTerm.toLowerCase() || 
    b.studentId === searchTerm
  );
  const result = userBookings.map(booking => {
    const session = store.sessions.find(s => s.id === booking.sessionId);
    return { ...booking, session };
  });

  return NextResponse.json(result);
}
