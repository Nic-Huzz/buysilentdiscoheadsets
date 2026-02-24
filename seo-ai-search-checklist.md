# SEO & AI Search Optimization Checklist

## Done (by Claude)

### AI Search Optimization (Phase 1-4)
- [x] Schema fix-up: FAQPage, Product, AggregateRating, Person/Author, BreadcrumbList across all pages
- [x] Outbound citations added to all content pages (+115% visibility per Princeton GEO study)
- [x] Answer-first content summaries on all pages (gold left-border boxes)
- [x] Author bylines with "Last updated" dates on all pages
- [x] CSS for `.answer-summary` and `.author-byline` in both stylesheets

### Bug Fixes
- [x] Fix duplicate warranty FAQ in index.html (removed duplicate from schema + visible FAQ)
- [x] Fix invalid `datePublished`/`dateModified` on Product schemas (removed — only valid on Article/WebPage)
- [x] Fix AggregateRating on Article in best-silent-disco-headphones.html (moved to separate Product schema for rich results eligibility)
- [x] Fix pricing: comparison table $69 → $49, packages corrected ($463 / $1,149 / $2,957)
- [x] Fix range inconsistency: how-to-host page said 200m, now 500m (matches all other pages)
- [x] Fix battery life inconsistency: how-to-host page said 8+ hours, now 10+ hours (matches all other pages)
- [x] Fix HowTo schema estimatedCost: $1,629 → $1,149 (matches corrected package pricing)
- [x] Fix wrong email on support page: `support@celebrateday.com` → `huzz@nichuzz.com`
- [x] Fix homepage logo href: `#` → `index.html`
- [x] Fix OG:image on 5 pages: `.jpg` → `.webp` (matching actual image format)

### Technical SEO
- [x] robots.txt: AI search crawler directives (allow search bots, block training bots)
- [x] robots.txt: Changed Google-Extended from Disallow to Allow (for AI Overviews)
- [x] sitemap.xml: Added all 5 content pages (was missing 4)
- [x] how-silent-disco-headphones-work.html: Changed author from Organization → Person, added Person schema, added byline + answer summary

### Internal Linking
- [x] Added "Guides" footer section to ALL 9 pages (index, silent-disco-headphones, best-silent-disco-headphones, how-to-host, how-they-work, support, about, legal, giveaway-terms)
- [x] Added contextual cross-link from silent-disco-headphones.html → how-to-host-a-silent-disco.html
- [x] Fixed: Homepage previously had ZERO links to content pages — now has 4 in footer
- [x] Fixed: how-to-host-a-silent-disco.html was completely orphaned — now linked from every page footer + contextual link

### Structured Data Validated
- [x] index.html — 4 schema blocks: Organization, Product, FAQPage, Person — all valid
- [x] silent-disco-headphones.html — 4 blocks: Product, FAQPage, BreadcrumbList, Person — all valid
- [x] best-silent-disco-headphones.html — 5 blocks: Article, Product, FAQPage, BreadcrumbList, Person — all valid
- [x] how-to-host-a-silent-disco.html — 6 blocks: Organization, Article, HowTo, FAQPage, BreadcrumbList, Person — all valid
- [x] how-silent-disco-headphones-work.html — 5 blocks: Article, HowTo, FAQPage, BreadcrumbList, Person — all valid
- [x] SEOPage.astro — Organization, Person, Product, BreadcrumbList + dynamic schemas — all valid

---

## Completed (Previously "You Need To Do")

- [x] **Deploy updated files** — All files pushed to production via Vercel (Feb 6)
- [x] **Google Search Console setup** — Verified, sitemap submitted, API connected via `api/gsc.js` + `rank-tracker.py`
- [x] **Bing Webmaster Tools setup** — Verified, imported from GSC
- [x] **Validate structured data live** — All schema validated via Google Rich Results Test (Feb 6)
- [x] **Set up IndexNow** — Key deployed at `/2de1fea9067e497ba26b2ca48f03b7f8.txt`, all URLs submitted
- [x] **Add programmatic SEO pages to sitemap** — All 7 programmatic pages in sitemap.xml
- [x] **Ahrefs audit fixes (Feb 23)** — 35 files fixed: meta descriptions, titles, OG/Twitter tags, internal links, broken images, noindex on portal pages, Use Cases footer added site-wide
- [x] **IndexNow resubmission (Feb 23)** — All 17 URLs resubmitted, HTTP 200
- [x] **Sitemap lastmod refresh (Feb 23)** — All dates updated to 2026-02-23

## GSC Analysis (Feb 23) — THE REAL PROBLEM

**90-day data shows the site is essentially invisible on Google:**
- 0 clicks total
- 8 impressions total
- Only 8 of 17 pages indexed
- "silent disco headphones" — NOT RANKING AT ALL
- Site doesn't appear when you Google the domain name directly

**9 KEY PAGES NOT INDEXED (including the most valuable ones):**
- `/silent-disco-headphones.html` (product page)
- `/best-silent-disco-headphones.html` (buyer's guide)
- `/how-silent-disco-headphones-work.html`
- `/silent-disco-vs-bluetooth-headphones.html`
- `/buy-vs-rent-silent-disco-headphones.html`
- 5 of 7 programmatic SEO pages

**Root cause: No backlinks.** Ahrefs shows only 1 dofollow incoming link. On-page SEO is strong but Google won't rank a site with zero domain authority.

## You Need To Do (Updated Feb 23)

### CRITICAL — Do This Week

- [ ] **Manual URL inspection in GSC** — Go to GSC > URL Inspection > paste each of the 9 unindexed URLs > click "Request Indexing". Do all 9 one by one.
- [ ] **Resubmit sitemap in GSC** — GSC > Sitemaps > resubmit `sitemap.xml`
- [ ] **Bing URL submission** — Submit all 9 unindexed URLs via Bing Webmaster Tools
- [ ] **Check GSC Coverage report** — Look for "Discovered but not indexed" or "Crawled but not indexed" errors

**GSC URL Inspection walkthrough:**
1. Open https://search.google.com/search-console (property: `sc-domain:buysilentdiscoheadsets.com`)
2. Click the URL Inspection bar at the top
3. Paste one URL at a time, wait for inspection to load
4. If "URL is not on Google" or "Discovered - currently not indexed" > click **Request Indexing**
5. Wait ~30 seconds for confirmation, then do the next URL
6. Google limits ~10-12 requests/day. If you hit the limit, finish the rest next day.

**URLs to submit (priority order):**
```
https://buysilentdiscoheadsets.com/silent-disco-headphones.html
https://buysilentdiscoheadsets.com/best-silent-disco-headphones.html
https://buysilentdiscoheadsets.com/how-silent-disco-headphones-work.html
https://buysilentdiscoheadsets.com/silent-disco-vs-bluetooth-headphones.html
https://buysilentdiscoheadsets.com/buy-vs-rent-silent-disco-headphones.html
https://buysilentdiscoheadsets.com/silent-disco-headphones-for-weddings/
https://buysilentdiscoheadsets.com/silent-disco-headphones-for-corporate-events/
https://buysilentdiscoheadsets.com/silent-disco-headphones-for-festivals/
https://buysilentdiscoheadsets.com/silent-disco-headphones-for-birthday-parties/
https://buysilentdiscoheadsets.com/silent-disco-headphones-for-guided-tours/
https://buysilentdiscoheadsets.com/silent-disco-headphones-bali/
```
Also re-check the homepage: `https://buysilentdiscoheadsets.com/`

### HIGH PRIORITY — Backlinks (The Real Bottleneck)

Without backlinks, all the on-page SEO work is wasted. The site has only 1 dofollow incoming link. Need 5-10 quality links to get Google to take the domain seriously. Every competitor ranking above us has hundreds of links.

**Tier 1: Low effort, do this week (15-20 mins each = free backlink + business listing):**

- [ ] **Event equipment directories:**
  - [The Bash](https://www.thebash.com/) — event vendor directory, huge domain authority
  - [Eventective](https://www.eventective.com/) — event vendor directory
  - [WeddingWire](https://www.weddingwire.com/) / [The Knot](https://www.theknot.com/) — vendor listings (weddings page targets this audience)
  - [PartySlate](https://www.partyslate.com/) — event inspiration platform
- [ ] **Google Business Profile** — https://business.google.com — Create listing for "Buy Silent Disco Headsets". Add photos, products, website. Not technically a backlink but helps Google understand you're a real business.
- [ ] **Bing Places listing** — https://www.bingplaces.com/ — ChatGPT pulls from Bing index. Free listing helps visibility.

**Tier 2: Medium effort, high value:**

- [ ] **Reddit (genuine participation, NOT spam):**
  - Search r/silentdisco, r/eventplanning, r/weddingplanning, r/DJs, r/yoga for questions about silent disco equipment
  - Answer helpfully. Mention your site naturally only when directly relevant (e.g., someone asks "where to buy silent disco headphones?")
  - Even without linking, Reddit threads rank in Google and brand mentions = entity signals for AI search
- [ ] **HARO / Connectively** — https://www.connectively.us/ (free tier)
  - Journalists post queries like "looking for event entertainment experts"
  - Respond with a quote + credentials (200+ events since 2022)
  - If they use your quote, you get a backlink from a news site (high DA)
  - Takes 5 mins/day to scan queries, 10 mins to respond when relevant

**Tier 3: Higher effort, compounding returns:**

- [ ] **Guest posts:**
  - Find 2-3 event planning blogs that accept guest content
  - Pitch angle: "I've run 200+ silent disco events - here's what most event planners get wrong"
  - You get a backlink in author bio
  - Search: `"write for us" event planning` or `"guest post" event entertainment`
- [ ] **1 YouTube video:**
  - "How Silent Disco Headphones Work" (2-minute demo)
  - YouTube description links back to site
  - Google AI Overviews embed YouTube results frequently
  - Already have the equipment — just film a quick demo
- [ ] **Digital PR:**
  - Silent disco angle is genuinely interesting to journalists
  - Pitch local Bali media: "Australian brings silent disco to Bali events"
  - Pitch event industry publications with expertise

**What NOT to waste time on:**
- Buying backlinks from Fiverr (Google penalizes this)
- Low-quality directory spam (no traffic directories)
- Blog comment links (nofollow, zero value)
- Link exchanges (Google detects and devalues these)

**Realistic backlink timeline:**

| Week | Action | Expected Links |
|------|--------|---------------|
| Week 1 | GSC submissions + 4 directory listings + Google Business Profile | 4-5 |
| Week 2 | Reddit answers + HARO signup + Bing Places | 1-3 |
| Week 3-4 | Guest post pitch + YouTube video | 1-2 |
| Ongoing | HARO responses + Reddit + content freshness | 1-2/month |

**Target: 10 quality backlinks in the next month.** That should be enough to get Google to start indexing and ranking the content pages. Once indexed, all the on-page SEO work kicks in.

### Medium Priority

- [ ] **Google Merchant Center** — Product feed for Shopping results + AI Overviews
- [ ] **Wikidata entity** — Create entry for "Buy Silent Disco Headsets" business
- [ ] **Core Web Vitals** — Check in GSC once more pages are indexed (LCP < 2.0s, INP < 150ms, CLS < 0.1)
- [ ] **Add width/height to img tags** — Missing across all pages; causes CLS (layout shift)
- [ ] **Clarify price positioning** — Comparison table frames "$70-100" as "sweet spot" but product is $49
- [ ] **Newsletter form** — Has no action attribute or JS handler; submitting does nothing

### Ongoing / Quarterly

- [ ] **Run `python3 rank-tracker.py` weekly** — Track indexed pages, impressions, positions
- [ ] **Quarterly content freshness** — Update stats/prices, refresh dateModified, add new FAQs from GSC query data
- [ ] **AI citation monitoring** — Manual searches on ChatGPT/Perplexity/Google for "silent disco headphones"
- [ ] **Dec 2026** — Update `priceValidUntil` schema from `2026-12-31` to `2027-12-31`

### GSC Monitoring (for agents)

**How to pull GSC data:**
- Run `python3 rank-tracker.py` from the `/Headset-sales` directory
- Credentials: `/Users/nichurrell/Downloads/headset-sales-6317b2b3f175.json`
- GSC property: `sc-domain:buysilentdiscoheadsets.com`
- The script pulls top keywords (by impressions) and top pages (by clicks) for last 28 days
- For custom queries (90-day, per-page keywords, filtered searches), use the Google Search Console API directly via the `google.oauth2` + `googleapiclient` Python libraries (see inline script examples in session history)
- Also available as a Vercel serverless function at `api/gsc.js` (requires admin auth via Supabase)

**Key metrics to track weekly:**
- Number of indexed pages (target: 17, currently 8)
- Total impressions (currently 8 over 90 days)
- Any impressions for "silent disco headphones" (currently: zero)
- Total clicks (currently: 0)
- Average position for target keywords (target: <20)

---

## Advanced AI Search Optimization (Next Level)

These are additional tactics to further improve AI search citability, ranked by expected impact.

### Tier 1 — Highest Impact

- [ ] **Comparison/listicle content pages** — AI engines love structured comparisons with tables. Create pages like:
  - "Silent Disco Headphones vs Bluetooth Headphones" (comparison table)
  - "Top 5 Silent Disco Equipment Brands Compared" (positions you as the authority)
  - Use HTML tables with clear headers — LLMs extract tabular data easily
  - *Why:* Comparison queries are the #1 query type that triggers AI citations

- [ ] **ChatGPT Merchant Feed** — ChatGPT now supports product carousels with "Buy Now" buttons:
  1. Requires Shopify, or submit product feed through ChatGPT's merchant program
  2. Enables instant checkout directly inside ChatGPT responses
  3. *Status:* Rolling out — worth monitoring for when your Shopify theme is live

- [ ] **Topical authority clusters** — Build content depth around your core topic:
  - Hub page: `silent-disco-headphones.html` (already exists)
  - Spoke pages (new): "Silent Disco for Corporate Events", "Silent Disco for Yoga Retreats", "Silent Disco for Festivals", "Silent Disco Equipment Buying Guide"
  - Your programmatic SEO pages partly do this — make sure they interlink heavily
  - *Why:* Sites with 5+ pages on a topic get 3.2x more AI citations than single-page sites (AirOps study)

### Tier 2 — High Impact

- [ ] **YouTube content** — Create even one explainer video ("How Silent Disco Headphones Work" demo):
  - Google AI Overviews frequently embed YouTube results
  - Perplexity cites YouTube transcripts
  - Even a simple 2-3 minute demo with your headphones counts
  - Add structured chapters, detailed description with links back to your site

- [ ] **Entity SEO / Wikidata** — Establish your brand as a recognized entity:
  1. Create a Wikidata entry for "Buy Silent Disco Headsets" (or the parent company)
  2. Ensure consistent NAP (Name, Address, Phone) across all web mentions
  3. Google Knowledge Panel becomes possible once entity is established
  4. *Why:* LLMs weight recognized entities more heavily in recommendations

- [ ] **Bing Places listing** — Since ChatGPT uses Bing's index:
  1. Create a Bing Places business profile
  2. Fill in all details, photos, and product info
  3. This gives ChatGPT additional structured data about your business

- [ ] **Reddit/forum presence** — AI engines frequently cite Reddit threads:
  - Answer questions on r/silentdisco, r/eventplanning, r/weddingplanning
  - Genuinely helpful answers (not spammy) that mention your brand
  - LLMs weight crowd-sourced recommendations highly

- [ ] **Content freshness cycle** — Set up a recurring schedule:
  - Monthly: Update "Best Silent Disco Headphones 2026" with any new info
  - Quarterly: Refresh all content pages, update dateModified
  - Track which pages GSC shows are getting AI search impressions

### Tier 3 — Meaningful Impact

- [ ] **Digital PR / guest content** — Get mentioned on event industry sites:
  - Write guest posts for event planning blogs
  - Get listed in "recommended equipment" roundups
  - Each external mention = a vote of confidence for AI systems
  - *Why:* LLMs aggregate mentions across multiple sources to decide what to recommend

- [ ] **Original research / data** — Publish unique data that others will cite:
  - "2026 Silent Disco Industry Report" (even a short one based on your 200+ events)
  - Survey your customers about event types, sizes, satisfaction
  - Original stats are gold for AI citations — they get referenced repeatedly

- [ ] **Optimize meta descriptions for AI extraction** — Current descriptions are good, but:
  - Include a key number/stat in each meta description
  - Keep under 155 characters
  - AI systems often use meta descriptions as the "snippet" they cite

- [ ] **Third-party review profiles** — Get reviews on platforms AI engines trust:
  - Google Business Profile reviews
  - Trustpilot / G2 (if applicable)
  - LLMs cross-reference review data from multiple sources

- [ ] **Monitor AI citations** — Track how AI engines reference your site:
  - Search ChatGPT, Perplexity, and Google AI Overviews weekly for your target queries
  - Tools: Otterly.AI ($29/mo), or do it manually
  - Document which queries cite you and which don't — this reveals gaps to fill
