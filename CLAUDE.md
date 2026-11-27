# Headset Sales Project

## Project Structure

- **Deployed site:** buysilentdiscoheadphones.com (Vercel, deploys from `prototype/` directory)
- **Vercel project name:** `prototype` (NOT `headset-sales`)
- **Quote pages:** `prototype/quotes/*.html` - branded quote pages sent to leads
  - alice.html, chris.html, devon.html, devy.html, living-balance.html, lizeddy.html, meagan.html, nadene.html, nikos.html, rhys.html, viva-cinemas.html, vladyslav.html
- **Quote template reference:** Use `nadene.html` as the template for all new quotes. Key features: split hero with product image, interactive package selector with radio buttons, itemized quote summary with add-on checkboxes, payment section, print invoice, founder section, growth stages, benefit-led product specs, ROI calculator. All add-ons from the main website must be included as checkboxes (Custom Logo, Marketing Footage Pack, Marketing Poster Templates, Website Creation).
- **Local path:** `/Users/nichuzz/creations/Landingpages/Headset-sales/`
- **Edge function:** `supabase-edge-function/supabase/functions/headset-lead-capture/index.ts` (deploys to Supabase project `qlwfcfypnoptsocdpxuv`). NOTE: there are two copies of this file, both must be updated together.

## Key Rules

- Headphones are **on-ear** design. Never say "over-ear".
- Never copy prices from existing pages. Check the pricing memory or ask Nic.
- Deploy to Vercel project `prototype`, NOT `headset-sales`.
- Never use em dashes. Use periods, commas, or " - " instead.
- All CTAs should say "Get A Quote" (changed from "Build Your Package" on Nov 27 2026).
- Current promo: 2 free headsets with any order (on top of paid quantity). Minimum order is 10 paid headsets, so the smallest package is always 12 total (10 paid + 2 free). No 10% off / WELCOME10 codes. Valid until end of November 2026.
- **Every quote must include a charging cable** ($19 USD). This is easy to forget.
- Cisco (aka Silent Disco Jesus) "helped create" the headsets. He did NOT "choose the manufacturer."
- Copy should pass the 12-year-old test. If a facilitator wouldn't understand it, simplify it.

## Skills

- **`/hopkins`** - Write and audit copy using Claude Hopkins' Scientific Advertising method. 10-rule pass/fail audit.
- **`/design`** - Audit and fix visual design using 35 testable rules from Hobday, Refactoring UI, and Dieter Rams.
- **`/pseo`** - Programmatic SEO: audit, interview, prune, generate, and batch-fix the 21 use-case/programmatic pages. Hopkins-grade copy + AI citation optimization.
- **`ads-agent/hopkins-ad-review-prompt.md`** - Standalone prompt for reviewing Meta ad copy in another agent.

## Shipping

- **Full rate tables:** `SHIPPING.md` - source of truth for DDP shipping costs by destination
- **Box weights:** 10 headsets = 5 kg, 20 headsets = 7.5 kg, 30 headsets = 10 kg. Add 0.5 kg for transmitter + cable.
- **Method:** Air DDP (door to door, customs included), 8-10 days after takeoff
- **Destinations with rate cards:** Germany, UK. For others, ask Nic or the factory.
- **Free shipping threshold:** 20+ headsets at $45 tier only. Below 20, quote shipping from SHIPPING.md.
- When quoting shipping, always round weight UP to the next 0.5 kg step.

## Design System

- **Font:** Poppins for quote pages. Geist for main landing page (may migrate to Poppins later).
- **Buttons:** Pill shape (border-radius: 9999px), gold primary with glow shadow, active:scale(0.98) press state
- **Border radius:** 16px / 20px
- **Section padding:** 5rem / 3rem
- **Header:** Glass blur (backdrop-filter: 12px, rgba white 0.85)
- **Purple gradient:** 3-stop (#4a0ea8 to #5e17eb to #7c3aed)
- **Brand logos:** Rental clients, not buyers. Heading says "Brands Who've Used Our Headphones" (honest framing)
- **Testimonials:** Rental clients, not buyers. Heading says "What People Say About Our Headphones"
