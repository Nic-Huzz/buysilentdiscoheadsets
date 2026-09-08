# Session Handoff: Meta Ads Relaunch (2026-09-08)

## What was done

### Carousel A - Built and uploaded to Meta
- **5-slide carousel** created for breathwork facilitator audience
  - Slide 1: Breathwork facilitator photo (from `why-breathwork-video.mp4` 3-second screengrab), text-top layout, "Reformers let Pilates studios charge 3x more. Here's how breathwork facilitators are doing the same."
  - Slide 2: Merged pricing proof with bridge line "Reformers created a premium tier in Pilates. Headphones are doing the same." + 3 pricing rows (9D $60, Dawnbreaker $50, Sanctum $70) + "All use headphones. All charge 2-3x more."
  - Slide 3: Equipment slide with `why-breathwork.jpg` photo, "Sound so good they forget the outside world.", $39 per headset, 3 green checkmarks (sound cocoon, 10hr/500m/3ch, 1000+ shipped)
  - Slide 4: Merged offer+CTA, "3 free headsets with any order", From $39/headphone, URL, "Build Your Package"
  - Slide 5: Founder video (full 2:24 from `prototype/images/founder-video.mp4`)
- **Build script:** `ads-agent/generated-ads/build-carousel-v2.py` - generates HTML + PNGs via Playwright
- **Final PNGs:** `ads-agent/generated-ads/carousel-a-final/slide_{1-5}.png`
- **Slide images hosted at:** `buysilentdiscoheadphones.com/images/ad-slides/slide_{1-4}.png` (deployed to Vercel prod for Meta upload)

### Caption (safety/drop-in rewrite)
```
Breathwork facilitators: the reason your participants can't fully let go has nothing to do with your facilitation.

It's how safe they feel.

The safer someone feels, the more likely they are to drop in. But in a room full of people, the nervous system stays on guard. Other people's breathing. Movement. Outside noise. The body keeps scanning instead of opening.

Headphones have a superpower: they make people feel safe by immersing them completely. Your voice in their ears. Nothing else. The nervous system stops protecting and starts releasing.

After 300+ sessions, this is the single biggest upgrade I've made. Beginners who used to hold back suddenly drop in. Advanced breathers go somewhere new.

Build your package at buysilentdiscoheadphones.com
```

### Meta Ads Campaign - Created and activated
- **Campaign:** `Headsets — Leads — Sep 2026` (ID: `120249922875160055`)
- **Ad Set:** `Breathwork — Leads` (ID: `120249922878100055`)
- **Ad:** `Carousel A - Breathwork Reformer` (ID: `120249922880490055`)
- **Creative:** ID `1992082198164024`
- Status: ACTIVE, processing as of 2026-09-08 12:09 WITA

### Also created (NOT active - can be deleted)
- **Traffic campaign:** `Headsets — Creative Test — Sep 2026` (ID: `120249920665750055`) - superseded by Leads campaign

### Landing page updates
- Promo changed from "5 free headsets" to "3 free headsets" (confirmed deployed)
- Slide 2 closing line changed from "guided wellness experiences" to "breathwork"

### Hopkins audit completed
- All 6 original slides scored individually
- Slide 4 (old specs) scored 10/20 and was rebuilt
- Slide 3 (pricing proof) scored 20/20
- Merged slides 2+3 and 5+6 to tighten carousel from 6 to 5 slides

## Decisions made

1. **Leads objective over Traffic.** Cowork analysis recommended Traffic for creative volume testing (4 concepts). We're only running 1 creative, so volume isn't needed. Campaign 2 data proved Leads finds better people (women 35-54, UK/US who actually convert). Learning phase concern is acceptable at $12/day.
   - WHY: One creative doesn't need volume split-testing. We want converters, not page viewers.

2. **$12/day CBO, single ad set.** Freedom Club says $10/ad set, Hormozi says $100/day. $12/day is a middle ground for bootstrap with one creative.
   - WHY: Enough to get data in 7 days ($84 total) without burning cash on an unproven creative.

3. **3 free headsets (down from 5).** At $43/headset (price increase of $4), 5 free = $215 value = 50% of a 10-unit order. 3 free = $129 = 30%. Much more sustainable.
   - WHY: Cowork analysis flagged the flat 5-free offer as too generous on small orders.

4. **Pilates Reformer analogy kept for female breathwork audience.** Most female facilitators 35-54 understand the Pilates premium tier. Male equivalent (Peloton, CrossFit, golf simulators) tabled for Carousels B/C.
   - WHY: Campaign 2 buyer profile is women 35-54. Reformer resonates with this demographic.

5. **Text-top layout on slide 1.** Original text-bottom covered the participant lying down. Text at top keeps the full breathwork scene visible.

6. **Merged old slides 2+3 into one pricing proof slide with bridge line.** The old slide 2 ("Reformers turned a $20 class into a $50 class") didn't make sense without Pilates context. Bridge line lands the analogy in one sentence, then pricing data proves it.

7. **Instagram download (720p) sharper than Clideo (1080p).** Clideo re-encoded with worse compression despite higher pixel count. Used Instagram source upscaled with LANCZOS.

8. **Singapore removed from targeting.** Meta requires Singapore Universal Ads Declaration. UK/US are the real converters anyway. Current targeting: US, GB, CA, AU, DE, NL.

## In progress / next steps

1. **Ad is LIVE and processing.** Check back in 2 days (2026-09-10) for first read. Do NOT change anything for 7 days (until 2026-09-15).

2. **Report page not built.** User requested an edge function to track Facebook ad spend + profit. Not started.
   - Spec: Pull Meta Ads spend via API, compare against leads/orders in Supabase, show profit/loss dashboard
   - Could be a simple HTML page at `/ads-report` or a Supabase edge function

3. **Old Traffic campaign needs cleanup.** `Headsets — Creative Test — Sep 2026` (ID: `120249920665750055`) is paused and unused. Delete it.

4. **Old Campaign 2 was showing ACTIVE.** `TOF Silent Disco — Lead Opt — Testing` (ID: `120249113767170055`) needs to be paused if not already, or it competes for same audience.

5. **Carousels B + C not started.** Angles identified:
   - B: Objection Killer ("Is it actually better, or just a novelty?") - 18/20 Hopkins score
   - C: Dance/venue freedom ("Host events anywhere. Beach, rooftop, park.")
   - Alternative: Run Clubs (free to paid transformation)
   - Decision: Wait for Carousel A data before building B+C

6. **Edge function email still says "5 free headsets."** Both copies need updating to "3 free":
   - `supabase-edge-function/headset-lead-capture/index.ts`
   - `supabase-edge-function/supabase/functions/headset-lead-capture/index.ts`

7. **Ad slides still hosted on production site.** `prototype/images/ad-slides/` contains 4 PNGs used only for Meta upload. Can be removed after confirming Meta cached them.

## Gotchas discovered

1. **Supabase has no headset-specific leads table.** `lead_captures` and `email_captures` are from FindMyFlow, not headset sales. Headset leads come through the edge function which sends emails but doesn't write to a dedicated table. Building the report page will need a new table or querying email logs.

2. **Meta MCP can't activate campaigns.** By design - "Create everything PAUSED." User must toggle manually in Ads Manager.

3. **Meta MCP local image upload doesn't work from CLI.** The `ads_creative_upload_local_image` tool requires the Meta Ads app UI for file transfer. Workaround: host images on Vercel, use URL upload via `ads_creative_upload_image`.

4. **Singapore requires special declaration for ads.** `SINGAPORE_UNIVERSAL` regional regulated category needed. Easier to just exclude SG from targeting.

5. **Video upload is async.** `ads_creative_upload_video` returns immediately with "uploading" status. Video may take minutes to process. If carousel preview shows broken video, wait and retry.

6. **40 contacts vs 12 tracked.** User says ~40 total contacts from ad period, but only 12 are in the performance tracker. The gap is DMs/WhatsApp/direct emails not tracked in any system. Real cost per contact is ~AU$5, not AU$39. The report page should include manual DM logging.

## Recommendations

1. **Build the ad spend report page** (user requested, not started). Simple dashboard: Meta API spend data + Supabase lead count + manual DM tally. Deploy as a protected page on the site or a standalone edge function.

2. **Check ad performance on 2026-09-10** (day 2). Freedom Club cadence. Look at: impressions, CPM, CTR, any leads. Don't change anything.

3. **Update edge function email** from "5 free" to "3 free" before any leads come in. Both copies: `supabase-edge-function/headset-lead-capture/index.ts` and `supabase-edge-function/supabase/functions/headset-lead-capture/index.ts`.

4. **Create a Supabase table for headset leads.** The edge function should write to a `headset_leads` table in addition to sending emails. This makes the report page possible and gives you actual data to query.

5. **Pause old Campaign 2** (`TOF Silent Disco — Lead Opt — Testing`) if not already done. It's competing for the same breathwork audience.

6. **After 7 days:** If Carousel A is converting, scale budget 20% ($12 → $14.40). If not, build Carousel B (Objection Killer angle) and add to the same ad set. Meta CBO will split delivery between them.
