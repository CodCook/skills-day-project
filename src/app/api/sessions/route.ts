import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(store.sessions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSession = store.addSession(body);
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add session' }, { status: 500 });
  }
}
