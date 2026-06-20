---
name: CSS Sizing Overhaul Round 2
description: Second round of landing page sizing fixes — reduced spacing vars, section padding, image heights, component sizes, and fixed mobile breakpoint heading bug
type: project
---

Full audit of oversized landing page (2026-06-18). Key changes:

- **Spacing vars tightened**: `--spacing-md` 2rem→1.5rem, `--spacing-lg` 2.5rem→2rem, `--spacing-xl` 3.5rem→3rem
- **Section padding**: `.section` 5rem→3.5rem, `.section-sm` 5rem→2.5rem
- **Image max-heights**: 450px→380px across hero, product, equipment, why-slider
- **Brand logos**: height 150px→110px, padding reduced
- **Founder icons**: 240px→170px (140px on mobile)
- **Testimonial card**: media column 400px→300px
- **Story grid**: image column 400px→340px
- **Why-slider min-height**: 400px→340px
- **Map section**: removed hardcoded 2.5rem h2, uses global clamp; padding 5rem→3.5rem
- **640px breakpoint bug fixed**: h1 was 2.5rem (LARGER than clamp), now 1.75rem; h2 was 2rem, now 1.5rem
- **480px breakpoint**: h2 1.75rem→1.35rem, h3 1.25rem→1.15rem

**Why:** User reported page felt too big. Multiple compounding factors — oversized spacing vars, 80px section padding, generous image/component sizes, and a breakpoint bug where mobile headings were larger than desktop clamp values.

**How to apply:** If sizing feels off again, check spacing vars first — they cascade everywhere. Also verify responsive breakpoints don't accidentally increase sizes.
