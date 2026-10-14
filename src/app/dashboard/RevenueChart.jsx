'use client';

import { etb, when } from '@/lib/format';

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const money = etb;
const dateLabel = (isoDate) => when(`${isoDate}T00:00:00.000Z`, 'short');
const dateLabelFull = (isoDate) => when(`${isoDate}T00:00:00.000Z`, 'date');

function niceCeiling(value) {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return factor * magnitude;
}

function RevenueByArea({ rows }) {
  const width = 920;
  const height = 330;
  const margin = { top: 30, right: 20, bottom: 66, left: 105 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxValue = niceCeiling(Math.max(0, ...rows.map((row) => row.revenue)));
  const slotWidth = rows.length ? plotWidth / rows.length : plotWidth;
  const barWidth = Math.min(54, slotWidth * 0.54);
  const ticks = [0, 1, 2, 3, 4].map((index) => (maxValue * index) / 4);

  return (
    <section className="ops-chart-card" aria-labelledby="revenue-chart-title">
      <div className="ops-chart-heading"><div><span className="eyebrow dark">REVENUE MIX</span><h3 id="revenue-chart-title">Revenue by neighbourhood</h3><p>Gross order value, including delivery fees · ETB</p></div><span className="ops-chart-unit">UNIT · ETB</span></div>
      {rows.length ? (
        <div className="ops-svg-frame" style={{ height: 330 }}>
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="revenue-chart-title revenue-chart-description" preserveAspectRatio="xMidYMid meet">
            <desc id="revenue-chart-description">Vertical bar chart of gross order value by neighbourhood. The vertical scale starts at zero and uses Ethiopian birr labels. Exact values are also listed in the table below.</desc>
            <defs><pattern id="revenue-stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#e7a94a" /><rect width="2" height="8" fill="#9e6720" /></pattern></defs>
            {ticks.map((tick, index) => {
              const y = margin.top + plotHeight - (tick / maxValue) * plotHeight;
              return <g key={index}><line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#d9d6d0" strokeDasharray={index === 0 ? '0' : '4 5'} strokeWidth={index === 0 ? 1.8 : 1} /><text x={margin.left - 12} y={y + 4} textAnchor="end" fontSize="12" fill="currentColor">{money(tick)}</text></g>;
            })}
            <text x="18" y={margin.top + plotHeight / 2} fontSize="12" fill="currentColor" transform={`rotate(-90 18 ${margin.top + plotHeight / 2})`} textAnchor="middle">Revenue (ETB)</text>
            {rows.map((row, index) => {
              const barHeight = Math.max(2, (row.revenue / maxValue) * plotHeight);
              const x = margin.left + slotWidth * index + (slotWidth - barWidth) / 2;
              const y = margin.top + plotHeight - barHeight;
              const shortName = row.area.length > 12 ? `${row.area.slice(0, 11)}…` : row.area;
              return <g key={row.area}><rect x={x} y={y} width={barWidth} height={barHeight} rx="5" fill="url(#revenue-stripe)" stroke="#8b5c1c" strokeWidth="1" /><text x={x + barWidth / 2} y={Math.max(18, y - 8)} textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">{number.format(row.revenue)}</text><text x={x + barWidth / 2} y={margin.top + plotHeight + 23} textAnchor="middle" fontSize="11" fill="currentColor">{shortName}</text></g>;
            })}
          </svg>
        </div>
      ) : <div className="ops-chart-empty"><strong>No revenue data yet</strong><span>Completed order activity will appear here when orders are available.</span></div>}
      <p className="ops-chart-scroll-note">On smaller screens, swipe across the chart to inspect every neighbourhood. The table below contains every exact value.</p>
      <table className="ops-summary-table">
        <caption>Revenue by neighbourhood data table, in Ethiopian birr (ETB)</caption>
        <thead><tr><th scope="col">Neighbourhood</th><th scope="col" className="num-cell">Gross revenue (ETB)</th><th scope="col" className="num-cell">Orders</th></tr></thead>
        <tbody>{rows.length ? rows.map((row) => <tr key={row.area}><th scope="row">{row.area}</th><td className="num-cell">{money(row.revenue)}</td><td className="num-cell">{number.format(row.orders)}</td></tr>) : <tr><td colSpan="3" className="ops-table-empty">No revenue data is available for this range.</td></tr>}</tbody>
      </table>
    </section>
  );
}

function OrdersOverTime({ rows, range, hasOrders }) {
  const width = 920;
  const height = 310;
  const margin = { top: 28, right: 28, bottom: 58, left: 68 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxCount = Math.max(1, ...rows.map((row) => row.orders));
  const roundedMax = Math.max(4, Math.ceil(maxCount / 4) * 4);
  const x = (index) => margin.left + (rows.length <= 1 ? 0 : (index / (rows.length - 1)) * plotWidth);
  const y = (count) => margin.top + plotHeight - (count / roundedMax) * plotHeight;
  const points = rows.map((row, index) => `${x(index)},${y(row.orders)}`).join(' ');

  return (
    <section className="ops-chart-card" aria-labelledby="orders-chart-title">
      <div className="ops-chart-heading"><div><span className="eyebrow dark">ORDER ACTIVITY</span><h3 id="orders-chart-title">Orders per day</h3><p>{dateLabelFull(range.start)} – {dateLabelFull(range.end)} · count of non-cancelled orders</p></div><span className="ops-chart-unit">UNIT · ORDERS / DAY</span></div>
      {hasOrders ? <div className="ops-svg-frame" style={{ height: 310 }}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="orders-chart-title orders-chart-description" preserveAspectRatio="xMidYMid meet">
          <desc id="orders-chart-description">Line chart showing the number of non-cancelled orders for each day in the labelled seven-day range. Each point is labelled with its order count, and the matching values are available in the table below.</desc>
          {[0, 1, 2, 3, 4].map((tick) => {
            const value = (roundedMax * tick) / 4;
            const axisY = y(value);
            return <g key={tick}><line x1={margin.left} y1={axisY} x2={width - margin.right} y2={axisY} stroke="#d9d6d0" strokeDasharray={tick === 0 ? '0' : '4 5'} strokeWidth={tick === 0 ? 1.8 : 1} /><text x={margin.left - 12} y={axisY + 4} textAnchor="end" fontSize="12" fill="currentColor">{number.format(value)}</text></g>;
          })}
          <text x="19" y={margin.top + plotHeight / 2} fontSize="12" fill="currentColor" transform={`rotate(-90 19 ${margin.top + plotHeight / 2})`} textAnchor="middle">Orders per day</text>
          <polyline points={points} fill="none" stroke="#244a78" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
          {rows.map((row, index) => <g key={row.date}><circle cx={x(index)} cy={y(row.orders)} r="5.5" fill="#fff" stroke="#244a78" strokeWidth="3" /><text x={x(index)} y={y(row.orders) - 13} textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{row.orders}</text><text x={x(index)} y={margin.top + plotHeight + 25} textAnchor="middle" fontSize="11" fill="currentColor">{dateLabel(row.date)}</text></g>)}
        </svg>
      </div> : <div className="ops-chart-empty"><strong>No order activity yet</strong><span>Daily order counts and the line chart will appear when orders are available.</span></div>}
      <p className="ops-chart-scroll-note">On smaller screens, swipe across the chart to inspect the full date range. The table below contains every daily count.</p>
      <table className="ops-summary-table">
        <caption>Daily order count data table for {dateLabelFull(range.start)} to {dateLabelFull(range.end)}</caption>
        <thead><tr><th scope="col">Date</th><th scope="col" className="num-cell">Orders (count)</th></tr></thead>
        <tbody>{hasOrders ? rows.map((row) => <tr key={row.date}><th scope="row">{when(`${row.date}T00:00:00.000Z`, 'weekday')}</th><td className="num-cell">{number.format(row.orders)}</td></tr>) : <tr><td colSpan="2" className="ops-table-empty">No daily order data is available yet.</td></tr>}</tbody>
      </table>
    </section>
  );
}

export default function RevenueChart({ revenueByArea, ordersByDay, range, hasOrders }) {
  return <div className="ops-charts-grid"><RevenueByArea rows={revenueByArea} /><OrdersOverTime rows={ordersByDay} range={range} hasOrders={hasOrders} /></div>;
}
