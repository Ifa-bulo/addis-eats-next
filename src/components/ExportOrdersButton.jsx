'use client';

import { useState } from 'react';
import { downloadCsv, toCsv } from '@/lib/csv';

export default function ExportOrdersButton({ rows }) {
  const [message, setMessage] = useState('');

  function handleExport() {
    const csv = toCsv([
      ['Order ID', 'Created at', 'Status', 'Delivery area', 'Delivery address', 'Items', 'Subtotal (ETB)', 'Delivery fee (ETB)', 'Total (ETB)'],
      ...(Array.isArray(rows) ? rows : []),
    ]);
    const downloaded = downloadCsv('addis-eats-order-history.csv', csv);
    setMessage(downloaded ? 'CSV downloaded. You can open it in a spreadsheet.' : 'CSV export is available in a browser.');
  }

  return <div className="ae-export-orders-wrap"><button type="button" className="button button-ghost ae-export-orders-button" onClick={handleExport}>↓ Export CSV</button>{message ? <span role="status" aria-live="polite">{message}</span> : null}</div>;
}
