# Healing Soulutions — Website

Concierge & mobile nursing website (Next.js, pages router).

## Run locally
```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure
- `pages/` — routed pages: `/` (home), `/services`, `/book`, `/about`, `/privacy`, `/terms`, plus `/api/*`.
- `components/` — Nav, Footer, SceneBackground, icons, LegalLayout (shared).
- `lib/data.js` — service catalog, time slots, and the four patient consents.
- `public/` — logo assets: `emblem.png`, `wordmark.png`, `favicon.png`.
- `styles/globals.css` — theme (deep emerald + gold), typography, layout.

## Environment variables (set in your host, e.g. Vercel)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Stripe secret + IntakeQ keys used by `pages/api/*` (see those files).

## TO FILL IN (placeholders / your facts)
- `pages/about.js` — NP credentials/bio (marked `[PLACEHOLDER]`).
- Advertising claims ("Fully Insured", "HIPAA Compliant", "Same-Day Availability") — verify these are accurate for your practice.
- Lab/diagnostics: confirm CLIA / NY CLEP status if any testing is performed on-site (send-out to an accredited lab is how the copy is written).
- Consent effective dates are set to August 1, 2026 — confirm with counsel.

## Legal
Consents and the Privacy/Terms pages are drafts for attorney review — not legal advice.
