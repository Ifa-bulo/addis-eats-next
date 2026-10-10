import { NextResponse } from 'next/server';
import { getOrderForUser } from '@/lib/data';
import { getSession } from '@/lib/session';

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const order = getOrderForUser(id, session.id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order, { headers: { 'Cache-Control': 'no-store' } });
}
