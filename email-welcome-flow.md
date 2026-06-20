# Email Welcome Flow — Buy Silent Disco Headphones

_For buysilentdiscoheadphones.com (sales site, not rental)_
_Platform: Klaviyo or Mailchimp_
_Trigger: Email pop-up sign-up (added to list)_
_Discount code: WELCOME10 (10% off, expires 72 hours)_

---

## Pop-Up Design

**Trigger:** Exit intent + 15-second delay + 50% scroll
**Frequency:** Show once per day, don't show again after submitted

**Headline:** Get 10% Off Your First Order
**Subheading:** Plus our free Silent Disco Event Planning Guide
**Input field:** Email address
**Button:** Send My Discount
**Fine print:** Join 200+ event organizers worldwide. Unsubscribe anytime.

**Success state:** "Check your inbox — your 10% discount and free guide are on the way."

---

## Email 1 — Immediate: Deliver the Discount

**Subject:** Your 10% off is inside + free event guide
**Preview text:** Here's everything you need to run your first silent disco

---

Hey {{first_name|default:"there"}},

Welcome — here's your 10% discount code:

**WELCOME10**

[Shop Now — 10% Off →]

I also put together a free Silent Disco Event Planning Guide — everything I've learned from 200+ events, from gear setup to playlist strategy.

[Download the Guide →]

This code is valid for 72 hours.

Talk soon,
Nic
Founder, Buy Silent Disco Headphones

---

## Email 2 — Day 1: The Founder Story

**Subject:** I started with 20 headphones on Bondi Beach
**Preview text:** Here's how a fear challenge became a global headphone brand

---

Hey {{first_name|default:"there"}},

In February 2023, I took 20 headphones to Bondi Beach in Sydney as a fear challenge. Five friends showed up.

Four months later, I was running a silent disco in front of the Sydney Opera House. Within an hour, strangers were lining up and offering to pay me.

By the end of 2023 I'd toured 11 countries, funding my life through sunset beach discos.

I moved to Bali in 2024 and built the island's largest silent disco brand — powering events for Amazon AWS, IBM, EPSON, and some of Bali's most iconic venues.

Along the way, I completed a 400-hour breathwork teacher training and discovered that these headphones don't just power parties — they transform healing experiences. The noise-cancelling creates a private cocoon where people feel safe enough to truly let go.

That's why I started selling direct. The same factory-quality headphones the big brands charge $70-80 for, yours to own from $39.

Whether you're building a rental business, running retreats, or hosting events — owning your own headphones means you never pay per-event rental fees again. Most of our customers break even within 3 events.

Hit reply and tell me what you're planning — I'll point you to the right package.

Nic

---

## Email 3 — Day 3: Social Proof

**Subject:** Why 200+ event organizers chose us over the big brands
**Preview text:** The numbers behind our headphones

---

Hey {{first_name|default:"there"}},

Here's what our customers say after buying:

**Emily, Breathwork Facilitator:**
*"Perfect for our breathwork sessions. The noise cancelling creates an incredible cocoon of sound for each participant. Setup took 5 minutes."*

**Event Organizer, 10+ events:**
*"Absolutely incredible service. Not a single problem across 10 events. The sound quality made a huge difference."*

**How we stack up against competitors:**

| | Us | Party Headphones | Quiet Events |
|---|---|---|---|
| Per headset | **$39** | $79 | $47 |
| Transmitter | **$169** | $259 | $150 |
| 50 headsets + 1 TX | **$2,119** | $4,209 | $2,500 |

Same quality. Direct from our supply chain. No middleman markup.

Every order includes a 1-year warranty — if anything's faulty, we replace it, no questions asked.

Your 10% discount (WELCOME10) is still active for another 48 hours.

[Shop Packages →]

Nic

---

## Email 4 — Day 5: Urgency / Expiry

**Subject:** Your 10% off expires tonight
**Preview text:** Last chance before it's gone

---

Hey {{first_name|default:"there"}},

Quick one — your 10% discount code **WELCOME10** expires at midnight tonight.

If you've been thinking about:

- **Starting a rental business** — buy 50 headphones, rent at $15/headphone per event, break even in 3 events. 325% ROI in year one.
- **Running retreats or workshops** — noise-cancelling + Hi-Fi sound lets participants drop deeper without distractions
- **Hosting events without noise complaints** — beaches, villas, rooftops, parks — dance until sunrise at any volume

Our most popular package — 50 headphones + transmitter — is **$2,119** (competitors charge $4,209 for the same setup).

With your 10% off: **$1,907**.

[Use WELCOME10 Before Midnight →]

Every order includes worldwide shipping, a 1-year warranty, and WhatsApp setup support.

Nic

P.S. Got an event date coming up? Reply with the date and I'll make sure your order arrives in time.

---

## Conditional Logic

- After Email 1: If customer has placed an order → exit flow (don't send remaining emails)
- After Email 3: Same check before sending Email 4
- If they click "Shop Now" in any email but don't purchase within 24 hours → send next email on schedule
- If they purchase at any point → trigger a separate "Order Confirmation" flow (not this one)

## Discount Code Setup

- **WELCOME10**: 10% off entire order, single use per customer, expires 5 days after issue
- Apply to all products (headphones, transmitters, packages)
- Minimum order: none (or $100 if you want to avoid tiny orders)

## Lead Magnet: Silent Disco Event Planning Guide

Create a 5-10 page PDF covering:
1. How to choose the right number of headphones for your event
2. Setup checklist (what you need, how to connect)
3. Playlist tips for different event types (party, breathwork, wedding)
4. Common mistakes to avoid
5. ROI calculator for rental businesses

This costs nothing to create but adds massive perceived value to the pop-up offer.

_Full ads strategy, campaign structure, breakeven KPIs, and confidence assessment are in `freedom-club-applied-to-headset-biz.md` under "Implementation Status & Confidence Assessment"._
