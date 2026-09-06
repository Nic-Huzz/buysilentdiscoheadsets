# Session Handoff: Hopkins Copy + Design Overhaul (2026-09-06)

## What was done

### Skills Created
- **`/hopkins` copywriter skill** (`~/.claude/skills/hopkins-copywriter/SKILL.md`) - v3 with 10-rule pass/fail audit based on all 21 chapters of Scientific Advertising. Product knowledge baked in, scoring rubric, decision tree by copy type.
- **`/design` visual design skill** (`~/.claude/skills/visual-design/SKILL.md`) - v2 with 35-rule audit from Anthony Hobday, Refactoring UI, Dieter Rams, and anti-AI-slop patterns. 59 points possible, 4 tiers.
- **`/hopkins` command** (`~/.claude/commands/hopkins.md`) - slash command for copy writing/auditing
- **`/design` command** (`~/.claude/commands/design.md`) - slash command for design auditing
- **Hopkins ad review prompt** (`ads-agent/hopkins-ad-review-prompt.md`) - standalone prompt for reviewing Meta ad copy in another agent

### Landing Page Copy Changes (`prototype/index.html`)
- **Hero**: Added eyebrow "For Wellness Facilitators", price in sub ($39 per headset, direct from factory), specific bullets (sound cocoon, 10hr battery, 500m range), "Build Your Package" CTA, promo badge (5 free headsets with orders above 10), proof line (1,000+ headsets to 7 countries)
- **Brand Trust**: "Companies Who Trust Our Headphones" changed to "Brands Who've Used Our Headphones" (honest framing, these are rental clients). Removed stats line (redundant with hero). Fixed logo grid to consistent 3-column with aspect-ratio
- **Product Overview**: "Our Silent Disco Headphones" changed to "What You Get for $39 Per Headset". Cut "premium" superlative. Removed link to specs page (funnel leak). Added gray background
- **Founder Message**: Complete rewrite. Now tells the supply chain story: tested every brand, $79 and $39 are same quality, went direct to factory, Cisco (Silent Disco Jesus) helped create the headsets. Added founder video (compressed 259MB to 18MB at 720p). Added Cisco photo with caption. Video plays in the section, poster is founder portrait
- **Comparison Table**: Moved founder message ABOVE comparison (story then proof). Updated to 30-headset math. Competitors: Party Headphones (US), Silent Sounds (Australia, A$100/headset), Silent Disco Direct (UK). Our row has gold prices on purple gradient. Added savings callout + CTA below table
- **Testimonials**: Heading changed to "What People Say About Our Headphones". Reordered strongest first. Cleaned up filler words and grammar
- **Packages**: Renamed "Professional" to "Becoming Best in Market", "Scale" to "Ready To Go Big". Trimmed from 6 to 4 bullets each. Removed "Premium" from headphone counts. Added inline link to custom builder in sub-text. Removed 6-headset minimum, now starts at 10
- **Equipment Section**: Title "Silent Disco Headphones & Transmitters" to "The Equipment". Cut from 7 to 4 bullets each. Removed IEC 61000, "Immersive Audio", redundant specs. Added gray background
- **Reformer Section**: Made key line "Headsets are the Reformer of wellness" larger (1.25rem), centered, bright white. Supporting text dimmed to 0.7 opacity. Better visual hierarchy
- **ROI Calculator**: Added "Build Your Package" CTA after the calculator
- **All CTAs**: Consistently say "Build Your Package" throughout
- **Mid-page CTA**: Updated from "Get Your Quote" to "Build Your Package"
- **Popup**: Changed from 10% off / WELCOME10 to "Claim 5 Free Headsets" with orders above 10. Updated success state, form subject, JS tags (popup-free-headsets), Meta pixel event name

### CSS Changes (`prototype/css/styles.css`)
- **Font**: Poppins replaced with Geist (both heading and body)
- **Buttons**: border-radius changed to 9999px (pill shape). Added gold gradient shadow. Added active:scale(0.98) press state. Added .btn-ghost class
- **Border radius**: 12px/16px increased to 16px/20px
- **Section padding**: 3.5rem/2.5rem increased to 5rem/3rem
- **Header**: Solid white changed to glass blur (rgba 0.85 + backdrop-filter 12px)
- **Hero**: New classes: .hero-eyebrow (gold), .hero-sub, .hero-cta-wrapper, .hero-promo (outlined gold pill badge), .hero-proof (0.7 opacity). Text opacity hierarchy (0.85 body, 0.7 secondary, 0.6 proof). Gold radial glow behind hero image
- **Mobile hero**: Image-first layout with gradient fade into purple background (768px breakpoint). Image goes edge-to-edge, no border-radius. Gold glow hidden on mobile. Float animation disabled on mobile
- **Purple gradient**: Updated to 3-stop (#4a0ea8 to #5e17eb to #7c3aed) matching rental site
- **New utilities**: .text-gold-gradient, @keyframes float, .animate-float
- **Product images**: Removed 3px purple border. Other images toned to 1px subtle
- **Founder section**: Complete redesign with .founder-section grid, .founder-video-wrapper, .founder-story, .founder-cisco card
- **Brand logos**: Fixed to consistent repeat(3, 1fr) grid with aspect-ratio 3/2, object-fit contain

### Edge Function (`supabase-edge-function/`)
- Both copies updated: email body changed from WELCOME10/10% off to "5 FREE HEADSETS - ORDERS ABOVE 10"
- Email subject updated to "Your 5 free headsets + the 5 principles behind 200+ sessions"
- "This code is valid for 72 hours" changed to "This offer is valid through the end of the month"
- CTA changed from "Shop Now - 10% Off" to "Build Your Package"
- **Deployed** to Supabase on 2026-09-06

### Other Files
- `email-welcome-flow.md`: Added note that emails 2-4 still reference old 10%/WELCOME10 and need updating. Prices need updating from $35 to $39
- `prototype/images/nic-and-cisco.jpg`: Photo of Nic with Cisco (Silent Disco Jesus) added
- `prototype/images/founder-video.mp4`: Founder video (18MB, 720p, 2:24 duration)

## Decisions made

1. **Hopkins audit framework**: Pass/fail against specific book chapters, not 1-5 vibes. 10 rules in 3 weighted tiers. Tier 1 dealbreakers (salesman test, audience selection, specificity) worth 3x more than polish.
   - WHY: Previous 1-5 scoring was arbitrary and I was grading my own homework. Binary pass/fail with calibration examples from the actual book is more honest.

2. **Never fabricate specifics**: If a fact isn't known, flag with [VERIFY] and ask. This was added after the first audit invented "Amazon booked 200 for a team retreat."
   - WHY: Hopkins' entire method is built on real specifics. Inventing impressive facts to demonstrate a framework about real facts is ironic and dangerous.

3. **SEO H1 preserved**: "Buy Silent Disco Headphones" kept as H1 for Google ranking. Visual eyebrow + sub headline serve the reader instead.
   - WHY: Rewriting the H1 for Hopkins-style copy would tank organic search traffic. Both can coexist.

4. **Rental testimonials/logos reframed honestly**: Changed "Companies Who Trust" to "Brands Who've Used" and "What Our Customers Say" to "What People Say About Our Headphones" because these are rental clients, not buyers.
   - WHY: Hopkins rule - never fabricate. Claiming rental clients as buyers is misleading.

5. **Founder message above comparison table**: Flow is now Product Overview, Founder story (why cheaper), Comparison (proof with numbers).
   - WHY: Story sets up the claim, table proves it. Research (Julian Shapiro, Stripe) confirmed social proof logos should stay right after hero.

6. **5 free headsets promo replaces 10% off**: More tangible, specific, and generous than a vague percentage. Matches Hopkins Ch.6 (specific offers outperform vague discounts).
   - WHY: 10% of $39 = $3.90 savings per headset. Nobody gets excited about that. 5 free headsets is something you can picture.

7. **Geist font replaces Poppins**: Matches the rental site (same brand). More modern, cleaner than Poppins.

8. **Cisco credit corrected**: He "helped create" the headsets, not "chose the manufacturer." Accurate framing matters.

9. **Price updated to $39** throughout (was $35). Per memory update from 2026-09-06.

10. **Minimum order changed to 10 headsets** (was 6). Aligns with the "5 free headsets with orders above 10" promo.

## In progress / next steps

1. **Specs page (`silent-disco-headphones.html`) needs alignment**: Agent review completed (see task output). Critical fixes: Poppins still loaded (line 40), "Premium" language throughout, inline button style overrides. Copy is mostly fine since it's SEO-focused.

2. **Email welcome flow emails 2-4** (`email-welcome-flow.md`): Still reference WELCOME10, 10% off, and $35 pricing. Email 1 is updated and deployed. Emails 2-4 need rewriting with new promo language and $39 pricing.

3. **Comparison table**: User wants to manually update one competitor row. Current state: Party Headphones (US), Silent Sounds (Australia A$100), Silent Disco Direct (UK $46). User may swap one.

4. **All other subpages** (programmatic SEO pages, buy-vs-rent, how-to-host, etc.): Still load Poppins font. Should be updated to Geist for consistency. Most have their own popup that may need updating.

5. **Visual design pass on remaining sections**: We reviewed Hero, Brand Trust, Product Overview, Founder, Comparison, Reformer, Equipment, Packages. Still need visual review of: ROI Calculator, Why Headsets cards, Story Timeline, FAQ, Footer.

## Gotchas discovered

1. **Two edge function files**: `supabase-edge-function/headset-lead-capture/index.ts` AND `supabase-edge-function/supabase/functions/headset-lead-capture/index.ts` contain the same code. Both must be updated together. Only the second path deploys.

2. **Hero `overflow: hidden`**: The hero section has `overflow: hidden` which clips pseudo-elements that extend beyond bounds. The gold glow `::before` uses z-index layering (before=0, img=1, after=2, text=3) to work within this constraint. The mobile gradient fade `::after` must also respect this.

3. **Mobile hero negative margins**: At 768px, hero-image uses `margin: 0 calc(-1 * var(--spacing-md))` to go edge-to-edge. At 480px, container padding changes to `--spacing-sm`, so the negative margin must also change to `calc(-1 * var(--spacing-sm))` or the image overflows causing horizontal scroll.

4. **Quote pages still show $35**: This is correct. Those are historical quotes sent to specific customers at the old price. Don't update them.

5. **`.btn { width: 100% }` on mobile**: This applies to ALL elements with `.btn` class. If you add a `.btn` class to something that shouldn't be full-width on mobile (like the promo badge was initially), it'll stretch. Use a different class for non-button pill elements.

6. **Founder section CSS was completely rewritten**: Old classes `.founder-message`, `.founder-message-photo`, `.founder-message-text` are replaced by `.founder-section`, `.founder-video-wrapper`, `.founder-story`, `.founder-cisco`. Any other pages using the old classes will break.

## Recommendations

1. **Deploy to Vercel preview first** and check on a real phone before pushing to production. Lots of CSS changes that need real-device testing, especially the mobile hero gradient fade.

2. **Get one real buyer testimonial**. The current 5 testimonials are all rental clients from Bali with vague enthusiasm. One specific quote from someone who BOUGHT headsets through the site ("I bought 30, ran my first event, 45 people showed up") would be worth more than all five combined.

3. **Update the specs page font** (Poppins to Geist, line 40). Quick win, biggest visual inconsistency if someone lands on it from Google.

4. **Record the video talking points**: Session provided a shot list for the founder video. Key beats: tested every brand, $79 and $39 are same quality, went direct to factory, demo the 3-channel switch, Cisco connection. Keep it under 90 seconds, natural light, no script.

5. **A/B test the hero headline**: The current H1 is "Buy Silent Disco Headphones" (SEO) with an eyebrow "For Wellness Facilitators." This is the biggest conversion lever on the page. Consider testing "Run Events Anywhere" or "Sound So Good They Forget the Outside World" as the visual headline.
