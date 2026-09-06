# Headset Sales Project

## Project Structure

- **Deployed site:** buysilentdiscoheadphones.com (Vercel, deploys from `prototype/` directory)
- **Vercel project name:** `prototype` (NOT `headset-sales`)
- **Quote pages:** `prototype/quotes/*.html` - branded quote pages sent to leads
  - alice.html, chris.html, devon.html, devy.html, lizeddy.html, nikos.html, viva-cinemas.html, vladyslav.html
- **Quote template reference:** Use `devon.html` as the most complete template for new quotes
- **Local path:** `/Users/nichuzz/creations/Landingpages/Headset-sales/`
- **Edge function:** `supabase-edge-function/supabase/functions/headset-lead-capture/index.ts` (deploys to Supabase project `qlwfcfypnoptsocdpxuv`). NOTE: there are two copies of this file, both must be updated together.

## Key Rules

- Headphones are **on-ear** design. Never say "over-ear".
- Never copy prices from existing pages. Check the pricing memory or ask Nic.
- Deploy to Vercel project `prototype`, NOT `headset-sales`.
- Never use em dashes. Use periods, commas, or " - " instead.
- All CTAs should say "Build Your Package" (not "Get Your Quote" or "Get a Quote").
- Current promo: 5 free headsets with orders above 10. No 10% off / WELCOME10 codes.
- Cisco (aka Silent Disco Jesus) "helped create" the headsets. He did NOT "choose the manufacturer."
- Copy should pass the 12-year-old test. If a facilitator wouldn't understand it, simplify it.

## Skills

- **`/hopkins`** - Write and audit copy using Claude Hopkins' Scientific Advertising method. 10-rule pass/fail audit.
- **`/design`** - Audit and fix visual design using 35 testable rules from Hobday, Refactoring UI, and Dieter Rams.
- **`ads-agent/hopkins-ad-review-prompt.md`** - Standalone prompt for reviewing Meta ad copy in another agent.

## Design System

- **Font:** Geist (NOT Poppins). Some subpages still load Poppins and need updating.
- **Buttons:** Pill shape (border-radius: 9999px), gold primary with glow shadow, active:scale(0.98) press state
- **Border radius:** 16px / 20px
- **Section padding:** 5rem / 3rem
- **Header:** Glass blur (backdrop-filter: 12px, rgba white 0.85)
- **Purple gradient:** 3-stop (#4a0ea8 to #5e17eb to #7c3aed)
- **Brand logos:** Rental clients, not buyers. Heading says "Brands Who've Used Our Headphones" (honest framing)
- **Testimonials:** Rental clients, not buyers. Heading says "What People Say About Our Headphones"
