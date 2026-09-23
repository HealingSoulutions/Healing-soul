// Service-category structure for the medallion journey (homepage) and /services/<slug> pages.
// Drip and diagnostics menus are pulled from lib/data.js so there is one catalog to maintain.
import { serviceCategories } from './data';

const cat = (id) => serviceCategories.find((c) => c.id === id);
const asCards = (id) =>
  (cat(id)?.services || []).map((s) => ({ name: s.title, copy: s.desc, tag: s.tags?.[0], bullets: s.bullets, price: s.price }));

export const SERVICES = [
  {
    slug: 'at-home-testing',
    priceFrom: 695,
    priceLabel: 'At-home lab visit $695 · includes NP interpretation',
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
        name: 'At-Home Lab Visit',
        price: '$695 · includes NP interpretation',
        copy: 'Venipuncture performed in your home by a licensed nurse, hand-delivered to Labcorp by our team, then reviewed by our Nurse Practitioner with a results call. Standard and specialty panels, from routine wellness screening to targeted testing. Laboratory fees are billed by Labcorp and may be covered by insurance.',
        tag: 'Phlebotomy',
      },
      {
        name: 'Urine Testing',
        price: '+$45 with a blood draw',
        copy: 'Private, guided specimen collection at home for urinalysis and related testing.',
        tag: 'Urinalysis',
      },
      {
        name: 'Respiratory Swabs',
        price: '$175 visit + test fee',
        copy: 'COVID-19 PCR, plus rapid RSV and influenza A & B. Collected in-home, with results reviewed by a clinician.',
        tag: 'COVID-19 PCR · RSV · Flu A/B',
      },
      {
        name: 'Direct to the Lab',
        copy: 'Every specimen is collected by our nurse team and dropped off directly at Labcorp by the Healing Soulutions team — no third-party couriers.',
        tag: 'Labcorp',
      },
      {
        name: 'Outside Lab Review',
        price: '$150 · waived with any Supplement Protocol',
        copy: 'Already had labs drawn elsewhere? A Nurse Practitioner reviews and interprets those results and discusses findings and next steps with you.',
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
    priceFrom: 250,
    priceLabel: 'Protocols from $250 · 4-week re-panel & adjustment $395',
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
      'Not a generic list. A plan built around your labs, your goals, and your life — using only brands that pass our certification and third-party testing standards, supplied by us and delivered to your door.',
    includedLede: 'Every protocol runs as a 4-week cycle: consult, a written protocol built around up to four products we source directly from the manufacturer and deliver to you, then a repeat blood panel at week 4 with a Nurse Practitioner reassessment and adjustment. Cycles repeat until your goals are met.',
    included: [
      {
        name: 'Protocol Consult',
        booked: 'Starting supplements for the first time, simplifying a cabinet of products, general wellness goals',
        price: '$250',
        copy: 'A focused review of your goals, current supplements, and lifestyle. In person or virtual.',
        tag: 'Virtual or in-home',
      },
      {
        name: 'Labs-Based Protocol',
        booked: 'Low vitamin D or B12, borderline labs, fatigue with normal-range results, optimizing after a physical',
        price: '$350 · includes NP lab interpretation',
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
        after: 'All independently third-party tested, as published by each brand. Every product on your protocol is named by brand, form, dose, and timing — and supplied by us, sourced directly from the manufacturer through our practitioner accounts and delivered to your door, so you never buy through a third-party marketplace.',
        tag: 'Practitioner-grade partners',
      },
      {
        name: 'Fertility Optimization',
        booked: 'Preconception planning, IVF or IUI cycles, egg-quality support, recurrent-cycle fatigue',
        price: '$450',
        copy: 'Nutrition and supplement support for natural conception or alongside IVF — built from your labs, timed to your cycle, and coordinated with your fertility clinic\u2019s plan. Led by nurses with hands-on IVF experience.',
        tag: 'Preconception · IVF support',
      },
      {
        name: 'Brain Health & Focus Protocol',
        booked: 'Brain fog, focus & memory concerns, ADHD-related fatigue, cognitive longevity',
        price: '$450',
        copy: 'A labs-informed supplement plan for concentration, memory, mental stamina, and long-term brain health — built around your goals and paired with the Brain & Focus Soulution when appropriate.',
        tag: 'Cognitive support',
      },
      {
        name: 'Sleep Architecture Protocol',
        booked: 'Trouble falling or staying asleep, unrefreshing sleep, shift work, jet-lag recovery',
        price: '$450',
        copy: 'A structured plan for deeper, more consistent sleep — timing, nutrients, and habits built from your history and labs, with a follow-up to adjust as your sleep changes.',
        tag: 'Sleep optimization',
      },
      {
        name: 'Seasonal Allergy Protocol',
        booked: 'Spring & fall allergies, histamine sensitivity, sinus congestion season',
        price: '$350',
        copy: 'A seasonal plan to support histamine balance and airway comfort before and during allergy season — nutrients, timing, and lifestyle, adjusted as the season changes.',
        tag: 'Histamine support',
      },
      {
        name: 'Iron Deficiency Protocol',
        booked: 'Low ferritin, iron-deficiency anemia, heavy periods, endurance athletes, post-partum iron loss',
        price: '$450',
        copy: 'A labs-based plan for low iron and ferritin — the right form and dose, absorption pairing, and a re-test schedule, coordinated with your physician where treatment is already underway.',
        tag: 'Labs-based · re-test included',
      },
      {
        name: 'Thyroid Health Protocol',
        booked: 'Hypothyroidism nutrient support, Hashimoto\u2019s-related fatigue, borderline TSH, thyroid medication support',
        price: '$450',
        copy: 'Labs-informed nutritional support for thyroid health — built from a full thyroid panel and designed to complement, never replace, care from your endocrinologist or physician.',
        tag: 'Labs-based',
      },
      {
        name: 'Immunity Defense Protocol',
        booked: 'Frequent colds, travel-heavy schedules, parents of young children, post-illness rebuilding',
        price: '$350',
        copy: 'A year-round immune-support plan for frequent travelers, parents, and anyone who gets run down — daily foundations plus a short-course plan for the first sign of illness.',
        tag: 'Immune support',
      },
      {
        name: 'Post-Natal Protocol',
        booked: 'Postpartum recovery, breastfeeding depletion, post-partum hair loss, fatigue after birth',
        price: '$450',
        copy: 'Recovery and replenishment after birth — iron, vitamin D, omega-3s, and the nutrients depleted by pregnancy and breastfeeding, built from your postpartum labs and safe for nursing. Led by nurses with hands-on maternity and IVF experience.',
        tag: 'Postpartum · nursing-safe',
      },
      {
        name: 'Gut Health Protocol',
        booked: 'IBS symptoms, bloating, post-antibiotic recovery, food sensitivities, reflux',
        price: '$450',
        copy: 'A structured plan for digestive comfort and a resilient microbiome — targeted probiotics, gut-lining support, and food timing, built from your history and labs, with a follow-up to adjust. Pairs with the Gut Health Soulution.',
        tag: 'Microbiome · digestive support',
      },
      {
        name: 'Hormonal Health Protocol',
        booked: 'Perimenopause & menopause, PCOS, low testosterone support, stress-related cycle changes',
        price: '$450',
        copy: 'For men and women — labs-informed nutritional support for hormone balance across perimenopause, menopause, andropause, and stress-related shifts, coordinated with any hormone therapy you are already on.',
        tag: 'Male & female · labs-based',
      },
      {
        name: 'Athletic Optimization & Recovery Protocol',
        booked: 'Marathon & triathlon training, strength blocks, recovery from injury, tested athletes',
        price: '$450',
        copy: 'Performance nutrition for training blocks, race prep, and recovery — NSF Certified for Sport and Informed Sport products only, timed to your training calendar. Pairs with the Athletic Performance Support and Recovery Soulutions.',
        tag: 'Certified-for-sport products',
      },
      {
        name: '4-Week Re-Panel & Adjustment',
        booked: 'End of every protocol cycle \u2014 repeat labs, reassessment, dose and product adjustment',
        price: '$395 per cycle \u00b7 $695 booked separately',
        copy: 'At the end of each 4-week cycle: an at-home repeat blood panel delivered to Labcorp, Nurse Practitioner interpretation, and a reassessment that adjusts your protocol for the next cycle. Laboratory fees are billed by Labcorp and may be covered by insurance.',
        tag: 'Every 4 weeks',
      },
      {
        name: 'Check-In (no labs)',
        booked: 'A mid-cycle question, a side effect to review, a product swap',
        price: '$125',
        copy: 'A virtual or in-home check-in between cycles to review how the plan is working and make small adjustments before your next panel.',
        tag: 'As needed',
      },
    ],
    steps: [
      ['Consult', 'Share your goals, history, and any recent labs.'],
      ['Receive your protocol', 'A written plan with named, third-party-tested products, doses, and a schedule — usually within a few days.'],
      ['Re-panel at week 4', 'A repeat blood panel, a Nurse Practitioner reassessment, and an adjusted protocol for the next cycle.'],
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
    priceFrom: 279,
    priceLabel: 'Signature drips from $279 · Pathway bundle $1,595',
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
    includedLede: 'Signature Soulutions are $349; the fluids-only Dehydration Soulution is $279. Longevity drips, boosters, and injections are priced below — travel included within our service area.',
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
