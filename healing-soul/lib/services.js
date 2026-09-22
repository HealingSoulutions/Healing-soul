// Service-category structure for the medallion journey (homepage) and /services/<slug> pages.
// Drip and diagnostics menus are pulled from lib/data.js so there is one catalog to maintain.
import { serviceCategories } from './data';

const cat = (id) => serviceCategories.find((c) => c.id === id);
const asCards = (id) =>
  (cat(id)?.services || []).map((s) => ({ name: s.title, copy: s.desc, tag: s.tags?.[0] }));

export const SERVICES = [
  {
    slug: 'at-home-testing',
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
      'Specimens collected in your own home, on your schedule, and sent to an accredited laboratory — then a clinician who walks you through what the numbers mean.',
    includedLede: 'Book any one on its own, or combine them in a single visit.',
    included: asCards('diagnostics'),
    steps: [
      ['Book', "Choose a time and tell us what you'd like tested. We'll confirm any fasting or prep instructions."],
      ['We come to you', 'Your nurse arrives with everything needed. Most collection visits take under 30 minutes.'],
      [
        'Understand your results',
        'Results are delivered securely, then reviewed with you by our Nurse Practitioner, with next steps if any are needed.',
      ],
    ],
    seo: {
      title: 'At-Home Testing in NYC — Blood Draws, Urine, Respiratory Swabs | Healing Soulutions',
      description:
        'At-home blood draws, urine testing, respiratory swabs, and Nurse Practitioner lab result interpretation. Serving Manhattan and the New York metro area.',
    },
  },
  {
    slug: 'supplement-protocols',
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
      'Not a generic list. A plan built around your labs, your goals, and your life — with specific products, doses, and timing you can actually follow.',
    includedLede: 'Start from your labs or from a conversation. Either way, you leave with a written protocol.',
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
        name: 'Specific Product Selection',
        copy: 'Specific products, not categories: brand, form, dose, and timing, with sourcing guidance.',
        tag: 'Specific, not generic',
      },
      {
        name: 'Follow-Up & Adjustment',
        copy: 'A scheduled check-in to review how the plan is working and adjust before your next labs.',
        tag: 'Ongoing',
      },
    ],
    steps: [
      ['Consult', 'Share your goals, history, and any recent labs.'],
      ['Receive your protocol', 'A written plan with named products, doses, and a schedule — usually within a few days.'],
      ['Follow up', 'We check in, adjust, and re-test when it makes sense.'],
    ],
    disclaimer:
      'Supplement protocols are educational and wellness-focused and are not intended to diagnose, treat, cure, or prevent any disease.',
    seo: {
      title: 'Personalized Supplement Protocols in NYC | Healing Soulutions',
      description:
        'Nurse-built supplement protocols from your labs or a consult, with specific product selections, dosing, and follow-up. Manhattan and the New York metro area.',
    },
  },
  {
    slug: 'iv-injections',
    number: '03',
    icon: 'iv',
    back: ['IV &', 'INJECTIONS'],
    backTight: true,
    label: 'IV & Injections',
    sub: 'Signature drips · Injections',
    eyebrow: 'Restore & replenish',
    title: 'IV & injections, at home',
    summary:
      'Signature IV Soulutions, custom drips, and prescribed injections administered by your nurse — as part of your plan or on their own.',
    heroLede:
      'Hydration, nutrients, and targeted injections — administered by a registered nurse in your home, hotel, or office.',
    includedLede: 'Choose a signature Soulution, or build your own with our clinician.',
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
  icon: 'calendar',
  back: ['BOOK', 'NOW'],
  label: 'Book a Visit',
  sub: 'Choose a convenient time',
  href: '/book',
};

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug);
}
