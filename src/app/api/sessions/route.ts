import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(store.sessions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, mentor, location, time, capacity } = body;

    // Server-side validation
    if (!title || !mentor || !location || !time || !capacity) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (capacity < 1) {
      return NextResponse.json({ error: 'Capacity must be at least 1' }, { status: 400 });
    }

    const newSession = store.addSession(body);
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add session' }, { status: 500 });
  }
}
