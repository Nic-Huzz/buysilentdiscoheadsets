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

### HIGH PRIORITY — Backlinks (The Real Bottleneck)

Without backlinks, all the on-page SEO work is wasted. Need 5-10 quality links:

- [ ] **Event equipment directories** — Submit to The Bash, Eventective, PartySlate, WeddingWire vendor listings
- [ ] **Reddit presence** — Answer questions in r/silentdisco, r/eventplanning, r/weddingplanning (genuine helpful answers, not spam)
- [ ] **HARO / Connectively** — Sign up and respond to journalist queries about events/entertainment
- [ ] **Guest post** — Write 1-2 articles for event planning blogs (offer silent disco expertise)
- [ ] **Google Business Profile** — Create if not exists. Helps domain trust and entity recognition.
- [ ] **Bing Places listing** — ChatGPT uses Bing index. Free listing helps visibility.

### Medium Priority

- [ ] **Google Merchant Center** — Product feed for Shopping results + AI Overviews
- [ ] **Wikidata entity** — Create entry for "Buy Silent Disco Headsets" business
- [ ] **1 YouTube video** — Even a 2-minute demo. Google AI Overviews embed YouTube frequently.
- [ ] **Core Web Vitals** — Check in GSC once more pages are indexed (LCP < 2.0s, INP < 150ms, CLS < 0.1)
- [ ] **Add width/height to img tags** — Missing across all pages; causes CLS (layout shift)
- [ ] **Clarify price positioning** — Comparison table frames "$70-100" as "sweet spot" but product is $49
- [ ] **Newsletter form** — Has no action attribute or JS handler; submitting does nothing

### Ongoing / Quarterly

- [ ] **Run `python3 rank-tracker.py` weekly** — Track indexed pages, impressions, positions
- [ ] **Quarterly content freshness** — Update stats/prices, refresh dateModified, add new FAQs from GSC query data
- [ ] **AI citation monitoring** — Manual searches on ChatGPT/Perplexity/Google for "silent disco headphones"
- [ ] **Dec 2026** — Update `priceValidUntil` schema from `2026-12-31` to `2027-12-31`

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
