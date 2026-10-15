// Prices hidden from the public site on Oct 15, 2026 at Berit's request.
// Kept here, exact, so they can be restored. Not imported anywhere.
export const HIDDEN_PRICES = {
  atHomeLabVisit: {
    quickItem: ['At-Home Lab Visit', '$695', 'draw + provider results review'],
    priceFrom: 695,
    priceLabel: 'At-home lab visit $695 · includes provider interpretation',
    cardPrice: '$695 · includes provider interpretation',
  },
  labsBasedProtocol: {
    quickItem: ['Labs-Based Protocol', '$395 on its own', '$200 when added to an At-Home Lab Visit'],
    cardPrice: '$395 on its own · $200 when added to an At-Home Lab Visit',
    copySentence: 'Booked with our At-Home Lab Visit, provider interpretation is already included, so the protocol is $200.',
  },
};

// Added Oct 15, 2026: standalone injection and same-day rush prices hidden (originals).
export const HIDDEN_INJECTION_PRICES = {
  INJECTION_PRICE: 85, INJECTION_VISIT_MIN: 249,
  INJECTION_PACK: ['4-Shot Package (any $85 shot, used within 60 days)', 299],
  INJECTION_NOTE: 'Shot prices apply when added to an IV visit. Stand-alone injection visits are $249 minimum (one shot included); additional shots at the listed price.',
  INJECTIONS: [['B12 Energy Shot',85],['Beauty Shot (Glutathione)',85],['Vitamin D3 Shot',85],['Immunity Shot (Tri-Immune)',85],['Skinny Shot (MIC + B12)',85],['CoQ-10 Shot',85],['B12 + Full B-Complex (B1-B6) - anti-aging & immunity',129]],
  dataJsCard: "price 'from $85'; bullets listed with $85/$129/$299/$249 amounts (see git history a3dfce4 lib/data.js)",
  sameDayRush: ['Same-day rush', 'requests within 4 hours, +$99'],
  servicesQuick: ['Injections', '$85', 'B12, D3, glutathione & more'],
};
