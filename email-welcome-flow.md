# Email Welcome Flow  - Buy Silent Disco Headphones

_For buysilentdiscoheadphones.com (sales site, not rental)_
_Platform: Klaviyo or Mailchimp_
_Trigger: Email pop-up sign-up (added to list)_
_Discount code: WELCOME10 (10% off, expires 72 hours)_

---

## Pop-Up Design

**Trigger:** Exit intent + 15-second delay + 50% scroll
**Frequency:** Show once per day, don't show again after submitted

**Headline:** Get 10% Off Your First Order
**Subheading:** Plus the 5 principles behind 200+ immersive sessions
**Input field:** Email address
**Button:** Send My Discount
**Fine print:** Join 200+ facilitators worldwide. Unsubscribe anytime.

**Success state:** "Check your inbox - your 10% discount and 5 principles are on the way."

---

## Email 1 - Immediate: Deliver the Discount + 5 Principles

**Subject:** Your 10% off + the 5 principles behind 200+ sessions
**Preview text:** How we build every breathwork, dance, and guided session

---

Hey,

Welcome - here's your 10% discount code:

**WELCOME10**

[Shop Now - 10% Off →]

After 200+ sessions and 400 hours of breathwork certification, these are the 5 principles I build every session off - whether it's breathwork, ecstatic dance, or a guided experience:

**1. Safety is key** - participants can only go as deep or feel as high as they feel safe

**2. They leave feeling great** - every session ends with movement

**3. Clear on the peaks** - design the peak highs and peak lows intentionally

**4. Never have attendees sitting still passively consuming for more than 5 minutes** - keep the energy and session fresh and moving

**5. Connect them to the mission** - they need to feel why they're here

Noise-cancelling headphones are how I deliver on principle #1. The moment external distractions disappear, participants feel safe enough to actually let go. It changed everything for my sessions.

This code is valid for 72 hours.

Talk soon,
Nic
Founder, Buy Silent Disco Headphones
400-hour certified breathwork facilitator

---

## Email 2  - Day 1: The Founder Story

**Subject:** I started with 20 headphones on Bondi Beach
**Preview text:** How a fear challenge became 200+ wellness sessions

---

Hey,

In February 2023, I took 20 headphones to Bondi Beach in Sydney as a fear challenge. Five friends showed up.

Four months later, I was running a silent disco in front of the Sydney Opera House. Within an hour, strangers were lining up and offering to pay me.

I spent the rest of 2023 travelling through Southeast Asia, starting sunset sessions on beaches and funding my travels through donations.

I moved to Bali in 2024 and built the island's largest silent disco brand  - powering sessions for Amazon, IBM, and some of Bali's most iconic wellness venues.

Along the way, I completed a 400-hour breathwork teacher training and discovered that these headphones don't just power parties  - they transform healing experiences. The noise-cancelling creates a private cocoon where people feel safe enough to truly let go.

That's why I started selling direct. The same headphones the big brands charge $70-80 for, yours to own from $35.

Whether you're running breathwork, ecstatic dance, retreats, or guided experiences  - owning your own headphones means deeper sessions, anywhere you want, without fighting venue acoustics or noise restrictions.

Hit reply and tell me what you facilitate  - I'll point you to the right setup.

Nic

---

## Email 3  - Day 3: Social Proof

**Subject:** Why 200+ facilitators chose us over the big brands
**Preview text:** What changes when participants can't hear anything but you

---

Hey,

Here's what facilitators say after switching to headphones:

**Emily, Breathwork Facilitator:**
*"Perfect for our breathwork sessions. The noise cancelling creates an incredible cocoon of sound for each participant. Setup took 5 minutes."*

**Event Host, 10+ sessions:**
*"Absolutely incredible service. Not a single problem across 10 events. The sound quality made a huge difference."*

**How we compare:**

| | Us | Party Headphones | Quiet Events |
|---|---|---|---|
| Per headset | **$35** | $79 | $47 |
| Transmitter | **$169** | $259 | $150 |
| 30 headsets + 1 TX | **$1,219** | $2,539 | $1,560 |

Same quality. Direct from our supply chain. No middleman.

Every order includes a 1-year warranty  - if anything's faulty, we replace it, no questions asked.

Your 10% discount (WELCOME10) is still active for another 48 hours.

[Shop Packages →]

Nic

---

## Email 4  - Day 5: Urgency / Expiry

**Subject:** Your 10% off expires tonight
**Preview text:** Last chance before it's gone

---

Hey,

Quick one  - your 10% discount code **WELCOME10** expires at midnight tonight.

If you've been thinking about:

- **Deeper breathwork sessions**  - noise-cancelling lets participants block out the world and actually let go
- **Running sessions anywhere**  - beaches, parks, rooftops, retreat centres  - no speakers, no noise permits needed
- **Charging premium prices**  - headphone sessions feel like a completely different tier of experience. Participants pay more and talk about it for weeks

Our most popular package  - 30 headphones + transmitter  - is **$1,219**.

With your 10% off: **$1,097**.

[Use WELCOME10 Before Midnight →]

Every order includes worldwide shipping, a 1-year warranty, and WhatsApp setup support.

Nic

P.S. Got a retreat or event coming up? Reply with the date and I'll make sure your order arrives in time.

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

## Lead Magnet

**The 5 Principles** - delivered directly in Email 1 body. No PDF, no attachment. Simple and readable.

For playlist gate entries (breathwork or dance), the same email is sent with the Spotify link added after the principles.

_Full ads strategy and confidence assessment in `freedom-club-applied-to-headset-biz.md`._
