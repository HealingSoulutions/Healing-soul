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
