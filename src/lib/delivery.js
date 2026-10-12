export const DELIVERY_AREAS = [
  'Bole',
  'Kazanchis',
  'Piassa',
  'Lideta',
  'Mexico',
  'Saris',
  'CMC',
  'Gerji',
  'Megenagna',
  'Gurd Shola',
  'Mekanisa'
];

// Demo delivery prices shown by this project. The server calculates the fee
// from the selected option rather than trusting a value submitted by a client.
export const DELIVERY_OPTIONS = {
  standard: {
    label: 'Standard delivery',
    eta: '35–50 min',
    fee: 60,
    description: 'Everyday delivery at the standard rate.'
  },
  express: {
    label: 'Express delivery',
    eta: '20–30 min',
    fee: 100,
    description: 'Priority preparation and delivery.'
  }
};
