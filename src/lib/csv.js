function csvCell(value) {
  let text = value == null ? '' : (typeof value === 'string' ? value : String(value));
  // Reduce spreadsheet formula-injection risk for untrusted text fields.
  if (typeof value === 'string' && /^[\t ]*[=+\-@]/.test(text)) text = `'${text}`;
  if (/[",\r\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

/** Convert an array of row arrays into RFC 4180-style CSV. */
export function toCsv(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  return `\uFEFF${safeRows.map((row) => (Array.isArray(row) ? row : [row]).map(csvCell).join(',')).join('\r\n')}`;
}

/** Trigger a browser CSV download. Returns false during server rendering. */
export function downloadCsv(filename, csvText) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
