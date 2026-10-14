const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  timeZone: 'Africa/Addis_Ababa',
});
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
  timeZone: 'Africa/Addis_Ababa',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', timeZone: 'Africa/Addis_Ababa',
});
const weekdayDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  timeZone: 'Africa/Addis_Ababa',
});
const relativeFormatters = {
  second: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
  minute: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
  hour: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
  day: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
  month: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
  year: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
};

function validDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format Ethiopian birr consistently across server and client views. */
export function etb(value) {
  const amount = Number(value);
  return `ETB ${currencyFormatter.format(Number.isFinite(amount) ? amount : 0)}`;
}

/** Format a date/time in Addis Ababa time. style: full | date | short | weekday. */
export function when(value, style = 'full') {
  const date = validDate(value);
  if (!date) return 'Date unavailable';
  const formatter = style === 'date'
    ? dateFormatter
    : style === 'short'
      ? shortDateFormatter
      : style === 'weekday'
        ? weekdayDateFormatter
        : dateTimeFormatter;
  return formatter.format(date);
}

/** Format a timestamp as a human-friendly relative time. */
export function relative(value, now = Date.now()) {
  const date = validDate(value);
  const reference = validDate(now);
  if (!date || !reference) return 'Time unavailable';

  const seconds = (date.getTime() - reference.getTime()) / 1000;
  const absolute = Math.abs(seconds);
  if (absolute < 45) return relativeFormatters.second.format(Math.round(seconds), 'second');
  if (absolute < 45 * 60) return relativeFormatters.minute.format(Math.round(seconds / 60), 'minute');
  if (absolute < 22 * 60 * 60) return relativeFormatters.hour.format(Math.round(seconds / 3600), 'hour');
  if (absolute < 26 * 24 * 60 * 60) return relativeFormatters.day.format(Math.round(seconds / 86400), 'day');
  if (absolute < 320 * 24 * 60 * 60) return relativeFormatters.month.format(Math.round(seconds / (30 * 86400)), 'month');
  return relativeFormatters.year.format(Math.round(seconds / (365 * 86400)), 'year');
}
