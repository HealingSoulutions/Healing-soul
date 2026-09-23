// The Drip Menu — single source of truth for IV & injection pricing.
// Mirrors the printed Healing Soulutions Drip Menu (PDF). Edit prices here only.

export const SIGNATURE_PRICE = 349;
export const BOOSTER_PRICE = 49;
export const GLUTATHIONE_PRICE = 49; // per 600 mg, up to 3,000 mg
export const INJECTION_PRICE = 85;

export const SIGNATURE = [
  {
    name: 'The Dehydration Soulution',
    price: 279,
    badge: 'Entry drip',
    tagline: 'Pure IV fluids, nothing added — fast rehydration for heat, travel, illness, or a long night.',
    contents: '500 mL–1,000 mL Lactated Ringer’s or Normal Saline only • no additives',
  },
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
    contents: 'Magnesium • B-Complex • anti-inflammatory • anti-nausea • optional antihistamine',
  },
  {
    name: 'The Stomach Bug Soulution',
    tagline: 'Stomach flu, food poisoning & vomiting — deep rehydration plus a gut reset.',
    contents: 'B-Complex • Magnesium • anti-nausea • antacid • Glutathione',
  },
  {
    name: 'The Gut Health Soulution',
    tagline: 'Soothe, rebuild & rebalance — digestive comfort, post-antibiotic recovery, and gut-lining support.',
    contents: 'L-Glutamine • B-Complex • Magnesium • Zinc • Glutathione',
  },
  {
    name: 'The Reproductive Health Soulution',
    badge: 'IV + IM',
    tagline: 'Preconception & fertility support — for natural conception or alongside IVF, timed to your cycle.',
    contents: 'IV: Vitamin C • B-Complex • B12 • Magnesium • Zinc • Glutathione',
    extra: 'IM: CoQ-10 injection included at the same visit • pairs with our Fertility Optimization protocol',
  },
  {
    name: 'The Liver Detox Soulution',
    tagline: 'Support your body’s natural detox pathways — after travel, indulgence, medication courses, or a heavy season.',
    contents: 'Glutathione • Vitamin C • B-Complex • Magnesium • Taurine • Alpha Lipoic Acid',
    extra: 'Add NAC +$49 · increase glutathione up to 3,000 mg at $49 per 600 mg',
  },
  {
    name: 'The Immunity Soulution',
    tagline: 'Cold & flu defense — fight illness off early and recover faster.',
    contents: 'B-Complex • Vitamin C • Glutathione • Zinc',
  },
  {
    name: 'The Energy Soulution',
    tagline: 'Beat burnout — sustained, steady energy without the crash.',
    contents: 'B-Complex • B12 • Taurine • Amino Blend • Magnesium',
  },
  {
    name: 'The Brain & Focus Soulution',
    tagline: 'Mental clarity, concentration & cognitive support — for deep work, exams, and long days.',
    contents: 'B-Complex • B12 • Magnesium • Taurine • Alpha Lipoic Acid • Glutathione',
    extra: 'Add NAD+ Booster 50 mg +$75',
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
    extra: 'Add Alpha Lipoic Acid +$79 (infused separately, light-protected)',
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
    contents: 'Base: your choice of fluid plus any two nutrients',
    extra: 'Each additional booster +$49 · premium upgrades as listed below',
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
  includes: 'Every NAD+ & Niagen Soulution includes a $150 nutrient base at no charge — Vitamin C • B-Complex • B12 • Glutathione 1,000 mg — in 500 mL–1,000 mL LR or NS.',
  ladder: [
    ['250 mg', 395, 595],
    ['500 mg', 695, 795],
    ['750 mg', 895, 995],
    ['1,000 mg', 1095, 1295],
  ],
};

export const BOOSTERS = [
  ['Energy & Metabolism', 'B-Complex · B12 · Thiamine (B1) · Taurine · Amino Blend · L-Carnitine · MICC lipotropic'],
  ['Immunity & Antioxidant', 'Vitamin C · Glutathione ($49 per 600 mg, up to 3,000 mg) · Zinc · Vitamin D · Alpha Lipoic Acid'],
  ['Recovery & Beauty', 'Magnesium · Mineral Blend · L-Glutamine · Lysine · Biotin'],
  ['Comfort Medications', 'Anti-Nausea · Anti-Inflammatory · Antacid · Antihistamine · Steroid'],
];

export const UPGRADES = [
  ['High-Dose Vitamin C', '+$79 / 4 g'],
  ['Additional Fluids', '+$150 / 1,000 mL'],
  ['NAD+ Booster 50 mg', '+$75'],
];

export const INJECTION_VISIT_MIN = 249;
export const INJECTION_PACK = ['4-Shot Package (any $85 shot, used within 60 days)', 299];
export const INJECTION_NOTE =
  'Shot prices apply when added to an IV visit. Stand-alone injection visits are $249 minimum (one shot included); additional shots at the listed price.';
export const INJECTIONS = [
  ['B12 Energy Shot', 85],
  ['Beauty Shot (Glutathione)', 85],
  ['Vitamin D3 Shot', 85],
  ['Immunity Shot (Tri-Immune)', 85],
  ['Skinny Shot (MIC + B12)', 85],
  ['CoQ-10 Shot', 85],
  ['B12 + Full B-Complex (B1–B6) — anti-aging & immunity', 129],
];

// The four-step Pathway to Wellness, priced as one bundle.
export const PATHWAY = {
  name: 'The Pathway to Wellness',
  price: 1095,
  compare: 1169,
  lede: 'Steps 1–4 in one booking — two home visits, your labs delivered and interpreted, a protocol built for you, and a follow-up. For best results, this is where we recommend every new client begins.',
  includes: [
    'At-home blood draw, delivered directly to Labcorp',
    'Nurse Practitioner lab interpretation & results call',
    'Written, labs-based supplement protocol',
    'One Signature Soulution IV',
    '30-day follow-up & protocol adjustment',
  ],
  note: 'Laboratory fees are billed by Labcorp and may be covered by insurance. Supplements on your protocol are purchased separately and delivered to you.',
};

// Steps 1 & 2 — testing and protocols.
export const TESTING = [
  ['At-Home Blood Draw', 195, 'Manhattan · delivered directly to Labcorp'],
  ['Urine collection (added to a draw)', 45, ''],
  ['Respiratory swab visit', 175, 'COVID-19 PCR · RSV · Flu A/B · plus test fee'],
  ['NP lab interpretation & results call', 150, 'waived with any Supplement Protocol'],
];
export const PROTOCOLS = [
  ['Protocol Consult', 250, 'virtual or in-home · no labs required'],
  ['Labs-Based Protocol', 350, 'includes NP lab interpretation & written plan'],
  ['Fertility Optimization Protocol', 450, 'cycle-timed · coordinated with your clinic'],
  ['Brain Health & Focus Protocol', 450, 'labs-informed · cognitive support'],
  ['Sleep Architecture Protocol', 450, 'timing, nutrients & habits · with follow-up'],
  ['Follow-Up & Adjustment', 125, ''],
  ['Telehealth NP Consult', 150, '30 minutes · NY & CT'],
];
export const LAB_FEE_NOTE = 'Laboratory fees are billed by Labcorp and may be covered by insurance.';

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
