'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const MAP_HEIGHT = 360;

export default function DeliveryMap({ courier, destination, area }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const courierMarkerRef = useRef(null);
  const deliveryMarkerRef = useRef(null);
  const routeRef = useRef(null);
  const latestRef = useRef({ courier, destination, area });
  const [mapError, setMapError] = useState(false);
  latestRef.current = { courier, destination, area };

  useEffect(() => {
    let disposed = false;
    let localMap = null;
    let invalidateTimer = null;

    import('leaflet').then((L) => {
      if (disposed || !elementRef.current) return;
      const latest = latestRef.current;
      localMap = L.map(elementRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = localMap;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(localMap);

      const courierIcon = L.divIcon({
        className: 'ae-map-icon-shell',
        html: '<span class="ae-map-icon ae-map-icon-courier" aria-hidden="true">🚴</span>',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });
      const deliveryIcon = L.divIcon({
        className: 'ae-map-icon-shell',
        html: '<span class="ae-map-icon ae-map-icon-delivery" aria-hidden="true">⌂</span>',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      courierMarkerRef.current = L.marker([latest.courier.lat, latest.courier.lng], {
        icon: courierIcon,
        title: 'Estimated courier position',
        alt: 'Estimated courier position',
        keyboard: true,
      }).addTo(localMap).bindPopup('Courier position · demo estimate');
      deliveryMarkerRef.current = L.marker([latest.destination.lat, latest.destination.lng], {
        icon: deliveryIcon,
        title: 'Approximate delivery area centre',
        alt: `Approximate delivery area centre for ${latest.area}`,
        keyboard: true,
      }).addTo(localMap).bindPopup(`Approximate delivery area · ${latest.area}`);
      routeRef.current = L.polyline([
        [latest.courier.lat, latest.courier.lng],
        [latest.destination.lat, latest.destination.lng],
      ], { color: '#264f7e', weight: 4, opacity: 0.8, dashArray: '7 8' }).addTo(localMap);
      localMap.fitBounds(L.latLngBounds(
        [latest.courier.lat, latest.courier.lng],
        [latest.destination.lat, latest.destination.lng]
      ).pad(0.3), { maxZoom: 14 });
      invalidateTimer = window.setTimeout(() => {
        if (!disposed) localMap?.invalidateSize();
      }, 0);
    }).catch(() => { if (!disposed) setMapError(true); });

    return () => {
      disposed = true;
      if (invalidateTimer) window.clearTimeout(invalidateTimer);
      if (localMap) localMap.remove();
      mapRef.current = null;
      courierMarkerRef.current = null;
      deliveryMarkerRef.current = null;
      routeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const courierMarker = courierMarkerRef.current;
    const deliveryMarker = deliveryMarkerRef.current;
    const route = routeRef.current;
    if (!map || !courierMarker || !deliveryMarker || !route) return;
    courierMarker.setLatLng([courier.lat, courier.lng]);
    deliveryMarker.setLatLng([destination.lat, destination.lng]);
    route.setLatLngs([[courier.lat, courier.lng], [destination.lat, destination.lng]]);
    import('leaflet').then((L) => {
      if (mapRef.current !== map) return;
      map.fitBounds(L.latLngBounds(
        [courier.lat, courier.lng],
        [destination.lat, destination.lng]
      ).pad(0.3), { maxZoom: 14 });
    });
  }, [courier.lat, courier.lng, destination.lat, destination.lng]);

  return (
    <div className="ae-delivery-map-shell">
      <div className="ae-delivery-map-legend" aria-label="Map legend">
        <span><i className="ae-legend-courier" aria-hidden="true" /> Courier estimate</span>
        <span><i className="ae-legend-delivery" aria-hidden="true" /> Delivery area</span>
      </div>
      {mapError ? (
        <div className="ae-delivery-map-error" role="status" style={{ height: MAP_HEIGHT }}>
          <strong>Map tiles could not be loaded.</strong>
          <span>The delivery details are still available in the text panel beside this map.</span>
        </div>
      ) : (
        <div ref={elementRef} className="ae-delivery-map" style={{ height: MAP_HEIGHT }} role="application" aria-label={`Map for the delivery area ${area}. Keyboard users can focus the courier and delivery markers.`} />
      )}
      <p className="ae-map-attribution-note">Map data © OpenStreetMap contributors. Pins show neighbourhood-level demo estimates, not live GPS.</p>
    </div>
  );
}
