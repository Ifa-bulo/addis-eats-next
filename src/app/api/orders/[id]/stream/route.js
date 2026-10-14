import { getOrderForUser } from '@/lib/data';
import { getSession } from '@/lib/session';
import { getTrackingSnapshot } from '@/lib/tracking';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });

  const { id } = await params;
  const order = getOrderForUser(id, session.id);
  if (!order) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });

  const encoder = new TextEncoder();
  let intervalId = null;
  let controllerRef = null;
  let closed = false;
  let lastPacket = '';
  let lastHeartbeat = Date.now();

  const closeStream = () => {
    if (closed) return;
    closed = true;
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    request.signal.removeEventListener('abort', closeStream);
    try { controllerRef?.close(); } catch { /* Stream may already be cancelled. */ }
  };

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      const publish = () => {
        if (closed) return;
        const currentOrder = getOrderForUser(id, session.id);
        if (!currentOrder) {
          try { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ orderId: id, error: 'not_found' })}\n\n`)); } catch {}
          closeStream();
          return;
        }
        const snapshot = getTrackingSnapshot(currentOrder);
        const packet = JSON.stringify(snapshot);
        if (packet !== lastPacket) {
          try { controller.enqueue(encoder.encode(`data: ${packet}\n\n`)); }
          catch { closeStream(); return; }
          lastPacket = packet;
          lastHeartbeat = Date.now();
        } else if (Date.now() - lastHeartbeat >= 15000) {
          try { controller.enqueue(encoder.encode(': keep-alive\n\n')); }
          catch { closeStream(); return; }
          lastHeartbeat = Date.now();
        }
        if (snapshot.terminal) closeStream();
      };

      request.signal.addEventListener('abort', closeStream, { once: true });
      publish();
      if (!closed) intervalId = setInterval(publish, 2500);
    },
    cancel() { closeStream(); },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
