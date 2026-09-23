// The Drip Menu — single source of truth for IV & injection pricing.
// Mirrors the printed Healing Soulutions Drip Menu (PDF). Edit prices here only.

export const SIGNATURE_PRICE = 349;
export const BOOSTER_PRICE = 45;
export const INJECTION_PRICE = 85;

export const SIGNATURE = [
  {
    name: 'The Pure Hydration Soulution',
    tagline: 'Full-body replenishment — post-workout & marathon training, exhaustion & recovery, colonoscopy prep & aftercare, or an everyday hydration boost.',
    contents: '500 mL–1,000 mL Lactated Ringer’s or Normal Saline • Magnesium • Calcium • balanced electrolytes',
  },
  {
    name: 'The Myers’ Soulution',
    badge: 'House favorite',
    tagline: 'Our all-in-one wellness classic for energy, immunity & overall vitality.',
    contents: 'Vitamin C • B-Complex • B12 • Magnesium • Calcium',
  },
  {
    name: 'The Hangover Soulution',
    tagline: 'Bounce back fast — clears headache, nausea, dehydration & fatigue.',
    contents: 'B-Complex • B12 • Glutathione • Magnesium • anti-nausea • anti-inflammatory • antacid',
  },
  {
    name: 'The Migraine Soulution',
    tagline: 'Targeted relief for migraines & tension headaches, with light-sensitive comfort.',
    contents: 'Magnesium • B-Complex • anti-inflammatory (Toradol) • anti-nausea (Zofran) • optional antihistamine',
  },
  {
    name: 'The Stomach Bug Soulution',
    tagline: 'Stomach flu, food poisoning & vomiting — deep rehydration plus a gut reset.',
    contents: 'B-Complex • Magnesium • anti-nausea (Zofran) • antacid (Pepcid) • Glutathione',
  },
  {
    name: 'The Immunity Soulution',
    tagline: 'Cold & flu defense — fight illness off early and recover faster.',
    contents: 'B-Complex • Vitamin C • Glutathione • Zinc',
  },
  {
    name: 'The Energy & Focus Soulution',
    tagline: 'Beat burnout — sustained energy and sharp mental clarity.',
    contents: 'B-Complex • B12 • Taurine • Amino Blend • Magnesium',
  },
  {
    name: 'The Beauty Glow Soulution',
    tagline: 'Radiance from within — skin, hair & nails, with a detox boost.',
    contents: 'high-dose Glutathione • Vitamin C • Biotin • B-Complex',
  },
  {
    name: 'The Recovery & Performance Soulution',
    tagline: 'Athletic recovery & muscle repair — before the event or after the finish line.',
    contents: 'Amino Blend • B-Complex • Magnesium • Glutathione • Vitamin C • anti-inflammatory',
  },
  {
    name: 'The Jet Lag Soulution',
    tagline: 'Land ready — rehydrate, reset, and recover from long-haul travel.',
    contents: 'Hydration • B-Complex • Magnesium • Vitamin C',
  },
  {
    name: 'The Antioxidant Soulution',
    price: 479,
    tagline: 'Cellular defense & detox support — for recovery, resilience, and healthy aging.',
    contents: 'NAC • Vitamin C • Glutathione',
    extra: 'Add Alpha Lipoic Acid +$45 (infused separately, light-protected)',
  },
  {
    name: 'The High-Dose Vitamin C Soulution',
    price: 849,
    badge: 'Special order',
    special: 'Special order — stand-alone high-dose vitamin C is prepared to order. Please book at least 72 hours in advance.',
    tagline: 'Stand-alone high-dose vitamin C, 25 g and above, infused slowly over 60–90 minutes.',
    contents: '25 g+ Vitamin C in 500 mL–1,000 mL LR or NS',
    extra: '+$79 per additional 4 g • higher doses require lab clearance',
  },
  {
    name: 'The Custom Soulution',
    tagline: 'Build your own — choose your nutrients with our clinician for a fully personalized infusion.',
    contents: 'Your choice of base fluid, vitamins, minerals, amino acids & add-ons',
  },
];

export const LONGEVITY = {
  lede: 'The gold standard in cellular renewal — supporting brain health, energy, focus, and healthy aging at the cellular level. Infused slowly for comfort.',
  items: [
    {
      name: 'The NAD+ Soulution',
      dose: '500 mg • standard dose',
      price: 695,
      copy: 'Pure NAD+ coenzyme infused directly into the bloodstream for cellular repair, mental clarity, sustained energy, and healthy aging.',
    },
    {
      name: 'The Niagen Soulution',
      badge: 'Premium',
      dose: '500 mg • standard dose',
      price: 795,
      copy: 'Our premium longevity infusion featuring patented NIAGEN® (nicotinamide riboside) — a next-generation NAD+ precursor prized for smoother, gentler tolerance and efficient cellular uptake.',
    },
  ],
  includes: 'Every NAD+ & Niagen Soulution includes complimentary Vitamin C • B-Complex • B12 • Glutathione 1,000 mg, in 500 mL–1,000 mL LR or NS.',
  ladder: [
    ['250 mg', 475, 595],
    ['500 mg', 695, 795],
    ['750 mg', 895, 995],
    ['1,000 mg', 1095, 1295],
  ],
};

export const BOOSTERS = [
  ['Energy & Metabolism', 'B-Complex · B12 · Thiamine (B1) · Taurine · Amino Blend · L-Carnitine · MICC lipotropic'],
  ['Immunity & Antioxidant', 'Vitamin C · Glutathione · Zinc · Vitamin D · CoQ-10 · Alpha Lipoic Acid'],
  ['Recovery & Beauty', 'Magnesium · Mineral Blend · L-Glutamine · Lysine · Biotin'],
  ['Comfort Medications', 'Anti-Nausea · Anti-Inflammatory · Antacid'],
];

export const UPGRADES = [
  ['High-Dose Vitamin C', '+$79 / 4 g'],
  ['Additional Fluids', '+$150 / 1,000 mL'],
  ['NAD+ Booster 50 mg', '+$75'],
];

export const INJECTIONS = [
  ['B12 Energy Shot', 85],
  ['Beauty Shot (Glutathione)', 85],
  ['Vitamin D3 Shot', 85],
  ['Immunity Shot (Tri-Immune)', 85],
  ['Skinny Shot (MIC + B12)', 85],
  ['B12 + Full B-Complex (B1–B6) — anti-aging & immunity', 129],
];

export const CONCIERGE = [
  ['Travel included', 'within our service area'],
  ['Same-day rush', 'requests within 4 hours, +$79'],
  ['Group bookings (3+)', 'save 10% — perfect for events, bridal parties & recovery days'],
  ['Membership & multi-session packages', 'available for longevity & wellness regulars'],
  ['Good-faith wellness evaluation', 'included with every visit, by our medical team'],
  ['HSA / FSA', 'welcome'],
];

export const MENU_DISCLAIMER =
  'These statements have not been evaluated by the Food & Drug Administration. IV therapy is not intended to diagnose, treat, cure, or prevent any disease and is not a substitute for emergency or primary medical care. All treatments are administered under medical direction following a good-faith evaluation; not all clients are candidates for every therapy, and services may be declined for safety reasons. Clients must be 18 or older. Prices are subject to change and may vary with add-ons, dosing, and travel distance. NIAGEN® is a registered trademark of its respective owner. If you are experiencing a medical emergency, call 911.';

export const usd = (n) => `$${n.toLocaleString('en-US')}`;
