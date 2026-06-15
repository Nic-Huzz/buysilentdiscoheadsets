# Email Pop-Up + Welcome Flow — Buy Silent Disco Headphones

---

## 1. Pop-Up Design

### Trigger Rules
- **Exit intent** on desktop (mouse moves toward browser bar)
- **15 seconds** on page
- **50% scroll depth**
- Show **once per day** per visitor
- Don't show to anyone who already subscribed

### Pop-Up Copy

**Headline:** Planning a Silent Disco?

**Subheadline:** Get 10% off your first order + our free Silent Disco Event Planning Guide

**Body:** Join 200+ event hosts in 6 countries. We'll send you:
- Your 10% discount code (valid 7 days)
- Our step-by-step event planning checklist
- Tips for choosing the right package size

**Email field placeholder:** Your email address

**Button text:** Send My Discount & Guide

**Small print:** No spam. Unsubscribe anytime.

### Success State

**Headline:** Check your inbox!

**Body:** Your 10% code and planning guide are on the way. Use code **WELCOME10** at checkout.

---

## 2. Welcome Flow (4 Emails)

### Settings
- **List:** Welcome Flow subscribers
- **Conditional split:** If customer places an order → exit flow (stop sending)
- **Suppress:** Existing customers

---

### Email 1: Deliver the Goods (Sends immediately)

**Subject:** Your 10% off + Silent Disco Planning Guide
**Preview text:** Plus how to pick the right package for your event

**Body:**

Hey {{first_name}},

Welcome! Here's what you asked for:

**Your discount code: WELCOME10**
(10% off any package — valid for 7 days)

[BUTTON: Shop Packages →]

**Your Free Event Planning Guide:**
[BUTTON: Download the Checklist (PDF)]

Quick question — what kind of event are you planning? Hit reply and tell me. I personally read every response and can recommend the perfect setup.

Talk soon,
Nic
Founder, Buy Silent Disco Headphones
200+ events hosted since 2022

---

### Email 2: The Origin Story (Sends Day 1, 24 hours later)

**Subject:** From Bondi Beach to the Sydney Opera House
**Preview text:** How a beach party turned into Bali's largest silent disco brand

**Body:**

Hey {{first_name}},

I want to tell you how all this started.

In February 2023, I took a bag of headsets down to Bondi Beach on a Saturday morning and danced with 5 friends. No speakers, no venue, no permission needed — just headphones and a playlist. And something magical happened. Strangers started stopping to watch, then asking to join in.

That one morning changed everything.

Four months later, I was running events at the Sydney Opera House.

By 2024, I'd moved to Bali and started a rental company. Today we're Bali's largest silent disco brand with 750+ headphones, powering events for companies like Amazon and IBM.

**The headphones I sell are the exact same ones I use at every event.** I wouldn't sell anything I don't stake my own reputation on.

That's why every order comes with a 1-year warranty + event guarantee. If they don't deliver the experience you expected, send them back for a full refund.

Still have your 10% off: **WELCOME10** (expires in 6 days)

[BUTTON: Browse Packages →]

Nic

P.S. Here's a 15-second clip from one of our recent Bali events. This is what your event could look like: [link to Instagram reel or video]

---

### Email 3: Social Proof (Sends Day 3)

**Subject:** What 200+ events taught us
**Preview text:** Real results from event hosts, wedding planners, and retreat facilitators

**Body:**

Hey {{first_name}},

Before you buy headphones from anyone, you probably want to know: do they actually work?

Here's what our customers say:

---

⭐⭐⭐⭐⭐ **"Absolutely incredible"**
"Absolutely incredible team and service! I already worked with them at least for 10 events that I hosted. Not a single problem! The sound quality was top-notch which made a huge difference for our event."
— Event Host, Bali

⭐⭐⭐⭐⭐ **"One of my best nights in Bali"**
"Super sound quality headsets, one of my best nights in Bali. There's nothing better than these sweet silent discos — straight up vibes from your ears to your feet."
— Party Enthusiast, Bali

⭐⭐⭐⭐⭐ **"I found myself dancing more than I ever have"**
"I'm not a big dancer, but using these headsets at a party I found myself dancing more than I ever have. It's like the headsets puts you in your own little world. The sound quality is amazing!"
— Silent Disco Attendee

---

**Why event professionals choose us over competitors:**

| | Us | Party Headphones (US) | Silent Disco Direct (UK) |
|---|---|---|---|
| Per headphone | **$39** | $79 | $46 |
| Transmitter | **$169** | $259 | $190 |
| 50-pack + TX | **$2,119** | $4,209 | $2,490 |

Same quality. Direct from our supply chain. No middleman markup.

Your 10% code is still active: **WELCOME10** (4 days left)

[BUTTON: Get Your Package →]

Nic

---

### Email 4: Urgency (Sends Day 6)

**Subject:** Your 10% off expires tomorrow
**Preview text:** Last chance — WELCOME10 expires at midnight

**Body:**

Hey {{first_name}},

Quick heads up — your 10% discount code **WELCOME10** expires tomorrow at midnight.

Here's what that saves you:

| Package | Normal Price | With WELCOME10 | You Save |
|---------|-------------|----------------|----------|
| **Starter** (30 headphones + TX) | $1,339 | **$1,205** | $134 |
| **Professional** (50 headphones + TX) | $2,119 | **$1,907** | $212 |
| **Scale** (100 headphones + TX) | $4,069 | **$3,662** | $407 |

Every order includes:
- All cables & adapters
- Setup guide & support
- 1-year warranty
- **1-year warranty + event guarantee** — full refund if you're not satisfied

[BUTTON: Use WELCOME10 Before It Expires →]

If you have any questions about which package is right for your event, just reply to this email. I personally respond to every message.

Nic
Founder, Buy Silent Disco Headphones

P.S. Most event hosts choose the Professional package (50 headphones). It breaks even in just 3 rental events, and after that every event is pure profit.

---

## 3. Klaviyo Setup Checklist

- [ ] Create Klaviyo account and connect to your website
- [ ] Design pop-up form matching brand colors (purple gradient + gold CTA)
- [ ] Create WELCOME10 discount code (10% off, single use, 7-day expiry, auto-generate unique codes)
- [ ] Create "Event Planning Guide" PDF lead magnet
- [ ] Build the 4-email welcome flow with conditional splits
- [ ] Set exit condition: exits flow if customer places an order
- [ ] Test the full flow with your own email
- [ ] Enable pop-up on buysilentdiscoheadphones.com
