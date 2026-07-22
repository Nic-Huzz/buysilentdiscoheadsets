# $10K Cold Outreach Plan — Buy Silent Disco Headphones

_Created: 2026-06-16 | Updated: 2026-06-22 | Status: Leads scraped, emails drafted, ready to send_

---

## Goal
**$10,000 in headphone sales within 30 days** via cold email outreach to yoga studios, wellness centres, breathwork facilitators, event planners, and retreat centres across 8 countries.

## What's Done

### 1. Lead Database (709 leads)
- **File:** `lead-scraper/leads_clean.csv`
- **Columns:** business_name, email, all_emails, website, location, country, business_type, search_query
- **Scraped via:** DuckDuckGo HTML search → visit website → extract emails from homepage + /contact pages
- **Scraper script:** `lead-scraper/scrape_leads.py` (Python 3, uses requests + BeautifulSoup)

| Country | Leads | Tier |
|---------|-------|------|
| USA | 169 | Tier 1 (volume) |
| UK | 121 | Tier 2 |
| Australia | 104 | Tier 2 |
| Canada | 81 | Tier 3 |
| UAE | 78 | Tier 2 |
| Switzerland | 69 | Tier 1 (high margin) |
| Singapore | 59 | Tier 1 (high margin) |
| New Zealand | 28 | Tier 3 |

| Business Type | Leads |
|---------------|-------|
| Yoga studios | 279 |
| Wellness centres | 184 |
| Event planners | 161 |
| Breathwork | 85 |

### 2. Cold Email Sequences (4 segments, 18 emails total)
- **File:** `lead-scraper/cold-email-sequences.md`
- **Sequence A:** Yoga studios & wellness centres (5 emails) — "silent yoga" angle
- **Sequence B:** Event planners & wedding venues (5 emails) — noise curfew + ROI angle
- **Sequence C:** Breathwork facilitators & retreat centres (5 emails) — facilitator-to-facilitator, uses Nic's 400+ hr Samma Karuna credential
- **Sequence D:** Ecstatic dance communities (5 emails — was 3, expanded to 5) — venue freedom + 3-channel experience
- **Based on 2026 best practices:** 50-100 words, plain text, 3-5 word subject lines, soft CTA, 5-touch sequence

### 3. Lead-to-Sequence Mapping
Match `business_type` column in CSV to sequence:
- `yoga` + `wellness` → **Sequence A**
- `events` → **Sequence B**
- `breathwork` → **Sequence C**
- Any with "ecstatic dance" in `search_query` → **Sequence D** (override)

### 4. Email template variables
Each email uses these merge fields:
- `{{business_name}}` → `business_name` column
- `{{first_name}}` → extract from email (part before @) or use "there" as fallback
- `{{city}}` → `location` column

---

## What's NOT Done (Next Steps)

### Step 1: Set Up Cold Email Infrastructure (UPDATED 2026-06-22)

**Domain setup (defeat spam filters):**
- Buy **2-3 domains** (e.g. `silentdiscoevents.com`, `getsilentdisco.com`, `silentdiscogear.com`)
- **10 email addresses per domain** = ~30 sending addresses total
- 300 emails/day total (10 per address — stays under spam radar)
- **DO NOT send from main domain** (buysilentdiscoheadphones.com)
- Configure SPF, DKIM, DMARC on each domain

**Tools:**
- [Instantly.ai](https://instantly.ai) — sending platform, handles rotation across accounts + auto follow-ups ($30/mo)
- [Warmer](https://warmer.ai) or Instantly's built-in — domain warmup (2 weeks before full volume)
- [Sales.co](https://sales.co) — alternative/additional sending platform

**Raw advice notes:** `lead-scraper/sales-advice-raw.md`

### Step 2: Email Rules (UPDATED 2026-06-22)
- **Founder in email signature** (not company name — person-to-person)
- **Under 100 words** (current sequences already comply)
- **NO links** — no website links, no calendly, nothing clickable
- **NO open tracking** — tracking pixels trigger spam filters
- **Structure every email:** Reason → Value prop → Ask
- **Email 1 goal:** Get permission to send pricing sheet
- **Email 2 goal:** Send pricing sheet + ask "considering buying in next 6 months?"

### Step 3: New Email Templates (Shorter, Founder-to-Founder)

**Email 1 — Cold Open:**
> I saw {{business_name}}...
>
> Providing headphones to yoga studios in {{city}}.
>
> Can I send you the pricing sheet to open for when the time is right.
>
> Best,
> Nic
> Founder

**Email 2 — Pricing Follow-up (on reply or after 3 days):**
> Hey {{first_name}},
>
> Here's the pricing sheet [attach PDF].
>
> Are you considering buying sometime in the next 6 months?
>
> Nic

_Note: These are shorter/softer than the sequences in `cold-email-sequences.md`. A/B test both approaches — use these for Tier 1 (Switzerland, Singapore, UAE), existing sequences for volume (USA, UK, AU)._

### Step 4: Send Emails

**Option A — Instantly.ai (recommended for scale):**
- Rotate across 30 email addresses automatically
- 300 emails/day once warmed
- Auto follow-ups on the sequence
- Best for USA, UK, Australia volume

**Option B — Manual via Gmail MCP (for personalised Tier 1):**
- Gmail MCP connector available (connector_uuid: 02e41a5e-aea2-4c13-a9a9-f6768ce801a4)
- Low volume (5-10/day), heavily personalised
- Best for Switzerland, Singapore high-value prospects

### Step 5: Track & Close
- Reply to every response within 2 hours
- Move interested leads to WhatsApp — **the sale happens on WhatsApp**, not email
- Track: emails sent, replies, WhatsApp conversations started, sales closed
- Do NOT track opens (tracking disabled to avoid spam filters)

### Step 6: Grow Lead List
- **New lead source:** New daily business registrations (wellness category) — freshly opened studios are actively buying equipment
- Re-run scraper: `python3 lead-scraper/scrape_leads.py --region usa`
- Add queries: "sound healing", "meditation centre", "festival organiser"
- DuckDuckGo rate-limits after ~200 queries — spread across sessions

---

## Pricing & Margins

### Product Costs
| Item | Factory Cost | Sell Price | Margin |
|------|-------------|-----------|--------|
| Headphone | $17 | $39 | $22 (56%) |
| Transmitter | $85 | $169 | $84 (50%) |

### Package P&L (shipping paid by buyer)
| Package | Contents | Price | Cost | Profit | Margin |
|---------|----------|-------|------|--------|--------|
| Starter | 30 HP + 1 TX | $1,339 | $595 | **$744** | 56% |
| Professional | 50 HP + 1 TX | $2,119 | $935 | **$1,184** | 56% |
| Scale | 100 HP + 1 TX | $4,069 | $1,785 | **$2,284** | 56% |

### Shipping (China → customer, paid by buyer)
Rates from supplier's shipping table. Headphone = 0.25kg, Transmitter = ~0.8kg.
| Package | Weight | Shipping Cost |
|---------|--------|--------------|
| Starter (30+1TX) | 8.3kg | ~$104 |
| Professional (50+1TX) | 13.3kg | ~$146 |
| Scale (100+1TX) | 25.8kg | ~$279 |

Full shipping rate table: 0.5kg=$30, 1kg=$35, 1.5kg=$39, 2kg=$44, 2.5kg=$45, 3kg=$53, 3.5kg=$58, 4kg=$62, 4.5kg=$65, 5kg=$70, 5.5kg=$75, 6kg=$81, 6.5kg=$86, 7kg=$90, 7.5kg=$95, 8kg=$99, 8.5kg=$104, 9kg=$109, 9.5kg=$113, 10-20kg=$11/kg, 21kg+=$10.8/kg

### Pricing Strategy
- **Single global price: $39 USD/headphone + shipping** (buyer pays shipping)
- No geo-based pricing — same price for all 8 countries
- Compare-at pricing on website uses real competitor data ($79 Party Headphones US)

### Competitors
| Supplier | Country | Per Headphone | Transmitter |
|----------|---------|--------------|-------------|
| Party Headphones | US | $79 | $259 |
| Quiet Events | US | $47 | $150 |
| Silent Disco Direct | UK | $46 | $190 |
| Hedfone Party | UK | ~£30 ($38) | £48 ($61) |
| Silent Party | AU | ~AUD 75 ($49) | ~AUD 260 ($170) |
| Silent Disco SG | SG | ~$80 | ~$250 |
| **Us** | **Global** | **$39** | **$169** |

---

## Target Country Strategy

### Tier 1 — Best Immediate Targets
- **USA:** Largest wellness market. Differentiate via healing/facilitator branding, not party use. 0% duty.
- **Singapore:** Affluent, English-speaking, ~$80 avg competitor price = fat margins. 9% GST on buyer.
- **Switzerland:** High income, zero duty (abolished 2024), ~$74 avg price, zero competition. 8.1% VAT.

### Tier 2 — Growth Expansion
- **UK:** Strong wellness/ecstatic dance scene. 0% duty, 20% VAT on buyer. Play "healing facilitator kits" angle.
- **Australia:** Yoga/surf/retreat culture. 0% duty, 10% GST. Position as outdoor-ready beach/sunrise kits.
- **UAE:** Wellness/biohacking booming in Dubai. 5% duty + 5% VAT. Target luxury resorts & facilitators.

### Tier 3 — Smaller Niche, Low Competition
- **Canada:** Low seller density (2-3). Bundle with training to justify price. 0% duty, 5-15% HST.
- **New Zealand:** Festival + retreat culture. 1-2 sellers. Easy to dominate. 0% duty, 15% GST.

---

## Revenue Target Math
- **$10K revenue = ~5 Professional sales** ($2,119 × 5 = $10,595)
- **709 leads × 5-10% reply rate = 35-70 replies**
- **709 leads × 1-2% conversion = 7-14 sales**
- **7 sales × $2,119 avg = $14,833 revenue**
- Even at pessimistic 0.5% conversion: 709 × 0.5% = 3.5 sales = $7,417

---

## Website (Already Optimised)

All Freedom Club course learnings have been applied to buysilentdiscoheadphones.com:

### Pages modified:
- `prototype/index.html` — compare-at pricing ($79→$39), Feature+Benefit descriptions, competitor table, guarantee section, bundle packages (Starter/Professional/Scale), package-specific FAQs, "Run Events" section with video
- `prototype/about.html` — full founder story (Bondi→Opera House→Bali), mission, team, stats, Samma Karuna credential
- `prototype/reviews.html` — dedicated reviews page with all 5 testimonials
- `prototype/run-events.html` — "Start a Silent Disco Business" page with 8 event videos, ROI breakdown, event type cards
- `prototype/css/styles.css` — new CSS for bundles, guarantee, comparison table, run-events section
- `prototype/js/script.js` — HEADSET_PRICE fixed to $39
- `prototype/best-silent-disco-headphones.html` — updated packages to 30/50/100
- `prototype/buy-vs-rent-silent-disco-headphones.html` — updated pricing to $39, correct break-even math
- `prototype/how-to-host-a-silent-disco.html` — updated pricing
- `prototype/silent-disco-headphones.html` — updated builder defaults
- `prototype/silent-disco-equipment/index.html` — updated package references
- `prototype/llms.txt` — updated packages, stats
- `vercel.json` — URL redirects: /shop, /starter, /pro, /scale, /reviews, /about, /run-events, /start
- All programmatic SEO pages — 750+ headsets count updated

### Key website numbers (source of truth):
- 200+ events hosted since 2023
- 750+ units shipped
- 6 countries served
- 4.9/5 from 127 reviews
- Guarantee: "1-year warranty + event guarantee" (NOT 30-day money back)
- Founder: Nic "Huzz", 400+ hours breathwork certified (Samma Karuna, Koh Phangan)

### Event videos available:
Saved in `prototype/images/event-videos/`:
- ev-fest.mp4, ev-pov.mp4, ev-high.mp4, collage-vibe-tribe.mp4
- ev-boat.mp4, ev-promo1.mp4, collage-tables.mp4, ev-fest-mov.mp4

---

## Ad Campaign (Drafted, Not Launched)

### Ad scripts + copy: `ad-scripts-and-copy.md`
- **Ad 1: "The Silence Reveal"** — hook with silent crowd, reveal with music
- **Ad 2: "Buy vs Rent — The Math"** — ROI breakdown
- 4 Facebook ad copy variations
- Campaign structure: $50/day, 5 ad sets, 2 ads each

### Recommended targeting per country:
| Ad Set | Interest |
|--------|----------|
| 1 | Event Planning |
| 2 | Breathwork / Yoga Retreat |
| 3 | Wedding Planning |
| 4 | DJ Equipment / Music Production |
| 5 | Broad (22-65+) |

### Pre-requisite: Install Meta Pixel on website (not yet done — need pixel ID from Nic)

---

## Email Flows (Drafted, Not Implemented)

### Klaviyo Welcome Flow: `email-flows.md`
- Pop-up: 10% off + free event planning guide
- 4-email welcome sequence for warm leads (website visitors)
- Different from cold outreach — this is for people who visit the site and subscribe

---

## Files Reference
| File | Purpose |
|------|---------|
| `lead-scraper/leads_clean.csv` | 709 clean leads with emails |
| `lead-scraper/scrape_leads.py` | Lead scraper (Python, DuckDuckGo) |
| `lead-scraper/cold-email-sequences.md` | 4 cold email sequences (18 emails) |
| `lead-scraper/sales-advice-raw.md` | Raw sales advice notes (2026-06-22) |
| `ad-scripts-and-copy.md` | Video ad scripts + Facebook ad copy |
| `email-flows.md` | Klaviyo pop-up + welcome flow |
| `freedom-club-transcripts.md` | Full course transcripts (87k words) |
| `freedom-club-action-items.md` | Course action items checklist |
| `freedom-club-daily-summaries.md` | Course daily summaries |
| `freedom-club-applied-to-headset-biz.md` | Course lessons applied to this business |

---

## For the Next Agent

**Immediate next action:** Ask Nic if he's registered 2-3 cold outreach domains and set up 10 email addresses per domain on Instantly.ai. If yes, help configure sequences with the new shorter templates (no links, no tracking). If no, start with Gmail MCP for high-value Tier 1 prospects (Switzerland, Singapore) while domains warm up.

**Priority order for sending:**
1. Switzerland + Singapore (highest margin, lowest competition) — send manually, personalise heavily
2. USA (highest volume) — use cold email tool once domain is warm
3. UK + Australia (mid-tier) — batch send
4. UAE, Canada, NZ — lower priority, fill in gaps

**The sale happens on WhatsApp.** The email's job is to get a reply. The reply leads to a WhatsApp conversation. The WhatsApp conversation closes the deal. Track WhatsApp conversations as the primary conversion metric, not website purchases.

---

## Recommendations (2026-06-16)

### Immediate (Do Today)
1. **Register 2-3 cold outreach domains** — e.g. `silentdiscoevents.com`, `getsilentdisco.com`, `silentdiscogear.com`. Namecheap, ~$12 each. Domain warming takes 2 weeks — every day delayed pushes sending window back.
2. **Set up Instantly.ai** ($30/mo) — connect all domains, create 10 email addresses per domain (~30 total). Start warming immediately.
3. **Disable open tracking** in Instantly settings — tracking pixels trigger spam filters.
4. **Commit all code changes** — 20+ files modified across the website. Push to deploy on Vercel.

### This Week
4. **Film 3 clips at your next event:**
   - One 15-second "silence reveal" (crowd dancing → take headphones off → silence → put back on)
   - One 15-second guest testimonial
   - One wide shot showing LED glow at night
   - These 3 clips + the ad scripts in `ad-scripts-and-copy.md` = ready-to-launch Facebook ads
5. **Install Meta Pixel** on every page of buysilentdiscoheadphones.com before spending on ads. Need pixel ID from Meta Business Suite.
6. **Start manually emailing 5-10 Swiss/Singapore leads per day** from your existing Gmail while the outreach domain warms up. These are highest-margin prospects — worth personalising heavily.

### Week 2-3
7. **Launch cold email sequences at scale** once domain is warmed (50-100/day ramp to 200+/day).
8. **Launch Facebook ads** at $50/day across 5 interest audiences once you have the video clips edited.
9. **Set up Klaviyo** email pop-up + welcome flow on the website to capture warm leads from ad traffic.

### Ongoing
10. **Re-scrape for more leads** — add queries for "sound healing", "meditation centre", "festival organiser", "team building company" across all 8 countries. The scraper can be re-run anytime: `python3 lead-scraper/scrape_leads.py`
11. **Reply to every email response within 2 hours** — move to WhatsApp immediately.
12. **Film a testimonial at every event** — build a library of 25+ video testimonials over time. This is compound social proof.
