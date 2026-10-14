const AREA_CENTERS = {
  Bole: { lat: 8.9962, lng: 38.7870 },
  Kazanchis: { lat: 9.0162, lng: 38.7660 },
  Piassa: { lat: 9.0350, lng: 38.7468 },
  Lideta: { lat: 9.0181, lng: 38.7418 },
  Mexico: { lat: 9.0090, lng: 38.7460 },
  Saris: { lat: 8.9450, lng: 38.7250 },
  CMC: { lat: 9.0352, lng: 38.8230 },
  Gerji: { lat: 8.9950, lng: 38.8170 },
  Megenagna: { lat: 9.0220, lng: 38.8050 },
  'Gurd Shola': { lat: 9.0450, lng: 38.8050 },
  Mekanisa: { lat: 8.9765, lng: 38.7140 },
};

const STATUS_PROGRESS = {
  received: 0.12,
  preparing: 0.28,
  'out-for-delivery': 0.72,
  delivered: 1,
  cancelled: 0.2,
};

export function getTrackingSnapshot(order) {
  const area = String(order.area || '').trim() || 'Bole';
  const destination = AREA_CENTERS[area] || AREA_CENTERS.Bole;
  const status = String(order.status || 'received');
  const progress = STATUS_PROGRESS[status] ?? 0.18;
  // Stable demo starting point near the area centre. Replace with courier GPS
  // coordinates when a real rider-location source becomes available.
  const hash = String(order.id || area).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const direction = hash % 2 === 0 ? 1 : -1;
  const start = {
    lat: destination.lat + 0.014 * direction,
    lng: destination.lng - 0.012,
  };
  const courierCoordinates = {
    lat: Number((start.lat + (destination.lat - start.lat) * progress).toFixed(6)),
    lng: Number((start.lng + (destination.lng - start.lng) * progress).toFixed(6)),
  };
  const deliveryAddress = String(order.deliveryAddress || '').trim()
    || `Specific street address not recorded. Delivery area: ${area}.`;
  const terminal = status === 'delivered' || status === 'cancelled';

  return {
    orderId: String(order.id),
    status,
    area,
    deliveryAddress,
    deliveryCoordinates: destination,
    courierCoordinates,
    updatedAt: order.updatedAt || order.createdAt || new Date(0).toISOString(),
    createdAt: order.createdAt || null,
    deliveryOption: order.deliveryOption || 'standard',
    terminal,
  };
}
