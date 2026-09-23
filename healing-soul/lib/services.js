// Service-category structure for the medallion journey (homepage) and /services/<slug> pages.
// Drip and diagnostics menus are pulled from lib/data.js so there is one catalog to maintain.
import { serviceCategories } from './data';

const cat = (id) => serviceCategories.find((c) => c.id === id);
const asCards = (id) =>
  (cat(id)?.services || []).map((s) => ({ name: s.title, copy: s.desc, tag: s.tags?.[0], bullets: s.bullets, price: s.price }));

export const SERVICES = [
  {
    slug: 'at-home-testing',
    priceFrom: null, // e.g. 199 → shows "From $199" in the pop-up; null hides it
    number: '01',
    icon: 'house',
    back: ['AT', 'HOME'],
    label: 'At-Home Testing',
    sub: 'Blood · Urine · Respiratory · Results Review',
    eyebrow: 'Begin with clarity',
    title: 'Testing, brought to you',
    summary:
      'Blood work, urine testing, and respiratory swabs collected in the comfort and privacy of your home — with your results reviewed and explained by our Nurse Practitioner.',
    heroLede:
      'Collected in your home and dropped off directly at the lab for processing and quick results. Lab interpretation and ongoing monitoring recommended.',
    includedLede: 'Your path begins here. Everything below can be done in a single visit.',
    included: [
      {
        name: 'At-Home Blood Draw',
        copy: 'Venipuncture performed in your home by a licensed nurse. Standard and specialty panels, from routine wellness screening to targeted testing.',
        tag: 'Phlebotomy',
      },
      {
        name: 'Urine Testing',
        copy: 'Private, guided specimen collection at home for urinalysis and related testing.',
        tag: 'Urinalysis',
      },
      {
        name: 'Respiratory Swabs',
        copy: 'COVID-19 PCR, plus rapid RSV and influenza A & B. Collected in-home, with results reviewed by a clinician.',
        tag: 'COVID-19 PCR · RSV · Flu A/B',
      },
      {
        name: 'Direct to the Lab',
        copy: 'Every specimen is collected by our nurse team and dropped off directly at Labcorp by the Healing Soulutions team — no third-party couriers.',
        tag: 'Labcorp',
      },
      {
        name: 'Lab Result Interpretation',
        copy: 'A Nurse Practitioner reviews and interprets your laboratory results and discusses findings and next steps with you.',
        tag: 'NP Review',
      },
    ],
    steps: [
      ['Book', "Choose a time and tell us what you'd like tested. We'll confirm any fasting or prep instructions."],
      ['We come to you', 'Your nurse arrives with everything needed and collects your specimens. Most visits take under 30 minutes.'],
      ['Straight to the lab', 'The Healing Soulutions team delivers your specimens directly to Labcorp — no third-party couriers.'],
      [
        'Understand your results',
        'Results are delivered securely, then reviewed with you by our Nurse Practitioner, with next steps if any are needed.',
      ],
    ],
    seo: {
      title: 'At-Home Testing in NYC — Blood Draws, Urine, Respiratory Swabs | Healing Soulutions',
      description:
        'At-home blood draws, urine testing, COVID-19 PCR and rapid RSV / flu A & B swabs, delivered directly to Labcorp by the Healing Soulutions team, with Nurse Practitioner result interpretation. Manhattan and the New York metro area.',
    },
  },
  {
    slug: 'supplement-protocols',
    priceFrom: null, // e.g. 199 → shows "From $199" in the pop-up; null hides it
    number: '02',
    icon: 'pill',
    back: ['YOUR', 'PLAN'],
    label: 'Supplement Protocols',
    sub: 'Labs-based or consult-based',
    eyebrow: 'Guided by your goals',
    title: 'A protocol made for you',
    summary:
      "A personalized supplement plan built from your labs when you have them, or from a consult when you don't — with specific product selections and a follow-up schedule.",
    heroLede:
      'Not a generic list. A plan built around your labs, your goals, and your life — using only brands that pass our certification and third-party testing standards.',
    includedLede: 'Start from your labs or from a conversation. Either way, you leave with a written protocol built from brands we trust.',
    included: [
      {
        name: 'Protocol Consult',
        copy: 'A focused review of your goals, current supplements, and lifestyle. In person or virtual.',
        tag: 'Virtual or in-home',
      },
      {
        name: 'Labs-Based Protocol',
        copy:
          'When you have recent blood work — ours or your own — your protocol is matched to your actual values, not averages.',
        tag: 'Built from your results',
      },
      {
        name: 'How We Vet Every Brand',
        copy: 'Before a product goes on your protocol it has to clear our quality bar: made in a cGMP-compliant facility (FDA 21 CFR Part 111), NSF/ANSI 173 or USP Verified where available, NSF Certified for Sport or Informed Sport for any performance product, and lot-specific third-party testing for identity, potency, heavy metals, microbes, and contaminants. No proprietary blends that hide doses.',
        tag: 'cGMP · NSF · USP · Informed Sport',
      },
      {
        name: 'Healing Soulutions Supplement Brand Partnerships & Affiliations',
        copy: 'Our brand partnerships and affiliations include, but are not limited to:',
        brands: [
          ['Thorne', 'Practitioner-grade, research-backed formulas. Four rounds of in-house testing on every batch — raw materials through finished product — with select products NSF Certified for Sport.'],
          ['Pure Encapsulations', 'Hypoallergenic formulas free of unnecessary additives. NSF-GMP registered; raw materials and finished products independently tested for purity and potency by third-party labs including Eurofins and Intertek.'],
          ['Metagenics', 'Practitioner brand manufactured to NSF, USP, and Australian TGA standards. Its TruQuality program publishes batch-specific test results, with finished products also independently third-party tested.'],
          ['Ortho Molecular Products', 'Practitioner-only, evidence-based formulas. Manufactures its own products and tests every formula in its in-house laboratory for purity, strength, and composition.'],
          ['Promix', 'Clean sports nutrition with minimal, additive-free ingredients. Independently tested by third-party labs (Eurofins, Covance) for heavy metals, glyphosate, and allergens, with results searchable by lot number.'],
          ['Pendulum', 'Next-generation probiotics built on clinically studied strains, including Akkermansia. Third-party tested for purity, potency, and consistency, with traceable strain identification.'],
          ['Omni-Biotic', 'Austrian probiotic maker whose product-specific formulas are validated in clinical studies. Every strain identified to the sub-strain level; manufactured to WHO, NSF, and ISO GMP standards.'],
          ['Needed', 'Fertility, pregnancy, and postpartum specialists. Every batch tested at an accredited third-party lab for potency, pesticides, solvents, and heavy metals.'],
          ['Renue By Science', 'Longevity-focused formulas including NMN and NAD+ precursors. Third-party tested in ISO- and cGMP-certified labs, with batch-numbered test reports published.'],
          ['Momentous', 'Performance and recovery formulas. Every batch third-party tested for banned substances, with most products NSF Certified for Sport or Informed Sport.'],
        ],
        after: 'All independently third-party tested, as published by each brand. Every product on your protocol is named by brand, form, dose, and timing.',
        tag: 'Practitioner-grade partners',
      },
      {
        name: 'Fertility Optimization',
        copy: 'Nutrition and supplement support for natural conception or alongside IVF — built from your labs, timed to your cycle, and coordinated with your fertility clinic\u2019s plan. Led by nurses with hands-on IVF experience.',
        tag: 'Preconception · IVF support',
      },
      {
        name: 'Follow-Up & Adjustment',
        copy: 'A scheduled check-in to review how the plan is working and adjust before your next labs.',
        tag: 'Ongoing',
      },
    ],
    steps: [
      ['Consult', 'Share your goals, history, and any recent labs.'],
      ['Receive your protocol', 'A written plan with named, third-party-tested products, doses, and a schedule — usually within a few days.'],
      ['Follow up', 'We check in, adjust, and re-test when it makes sense.'],
    ],
    disclaimer:
      'Supplement protocols are educational and wellness-focused and are not intended to diagnose, treat, cure, or prevent any disease.',
    seo: {
      title: 'Personalized Supplement Protocols in NYC | Healing Soulutions',
      description:
        'Nurse-built supplement protocols from your labs or a consult, including fertility optimization and IVF support, using only cGMP, NSF, USP, or Informed Sport certified, third-party-tested brands such as Thorne, Momentous, and Pure Encapsulations. Manhattan and the New York metro area.',
    },
  },
  {
    slug: 'iv-injections',
    priceFrom: 349,
    priceLabel: 'Signature drips $349 · Injections from $85',
    menu: true, // renders the full Drip Menu on the category page
    number: '03',
    icon: 'iv',
    back: ['IV &', 'INJECTIONS'],
    backTight: true,
    label: 'IV & Injections',
    sub: 'Signature drips · Injections',
    eyebrow: 'Restore & replenish',
    title: 'IV & injections, at home',
    summary:
      'Signature IV Soulutions, custom drips, and prescribed injections administered by your nurse — the third step of your plan.',
    heroLede:
      'Hydration, nutrients, and targeted injections — administered by a registered nurse in your home, hotel, or office.',
    includedLede: 'Every Signature Soulution is one flat price. Longevity drips, boosters, and injections are priced below — travel included within our service area.',
    included: asCards('infusion'),
    steps: [
      ['Book', 'Choose a drip or injection and a time. A short intake follows.'],
      ['We come to you', 'Your nurse sets up, administers, and monitors the full visit.'],
      ['Feel the difference', 'Most infusions take 45–60 minutes; injections, under 15.'],
    ],
    seo: {
      title: 'Mobile IV Therapy & Injections in NYC | Healing Soulutions',
      description:
        'Nurse-administered signature IV drips, custom infusions, and prescribed injections delivered to your home, hotel, or office in Manhattan and the New York metro area.',
    },
  },
];

export const BOOK_STEP = {
  number: '04',
  icon: 'swan',
  back: ['BOOK', 'NOW'],
  label: 'Book a Visit',
  sub: 'Choose a convenient time',
  href: '/book',
};

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug);
}
