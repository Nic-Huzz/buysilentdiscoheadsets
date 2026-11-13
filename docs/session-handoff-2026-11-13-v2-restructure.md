# Session Handoff: V2 Page Restructure + Pricing Strategy (2026-11-11 to 2026-11-13)

## What was done

### Strategy & Research
- Researched optimal e-commerce page section order (CXL, Baymard, Unbounce data) - validated 12-section structure
- Built Hormozi value stack (6 deliverables named by problem solved) from `$100M Offers` / `$100M Leads` methodology
- Queried Hormozi Brain MCP for pricing architecture: $49 branded anchor, $39 plain downsell, dashboard as continuity play
- Queried Hormozi Brain MCP for money model expansion: affiliate army, dealer network, value grid, dashboard as expansion engine
- Researched e-commerce color performance (CXL, Mida.so, IEEE studies)
- All strategy saved to `docs/pricing-strategy-v2.md` (the source of truth for next agent)

### Files created (all untracked, on `feature/v2-light-mode` branch)
- `docs/pricing-strategy-v2.md` - full pricing strategy, value stack, section order, Hormozi money model expansion (all TBC items)
- `prototype/index-v2.html` - EXISTS but is the dark-mode version from `feature/huzz-brand-v2`, NOT the light-mode version. **Needs to be rebuilt from index.html.**
- `prototype/css/styles-dark.css` - dark mode CSS (Huzz brand, proper semantic vars)
- `prototype/index-v2-dark.html` - dark mode HTML variant
- `prototype/css/styles-live.css` - copy of main branch CSS (reference)
- `prototype/css/styles-v2.css` - older CSS variant (ignore)

### Branches
- `feature/v2-light-mode` (current) - branched from main, original CSS intact, **v2 HTML NOT YET BUILT**
- `feature/huzz-brand-v2` - dark mode experiment, has stashed changes. Dark CSS refactored with proper semantic vars (`--bg`, `--surface`, `--text` etc). Keep for future A/B test.
- `main` - live site, untouched

### Memory updated
- `project_pricing.md` - updated to $49/$39 pricing
- `project_positioning_v2.md` - updated with full strategy
- `MEMORY.md` index updated

## Decisions made

1. **Pricing: $49 branded / $39 downsell** - $49 includes logo + LED + free shipping over $500. $39 removes branding + shipping. Hormozi feature downsell principle: remove highest-value feature to drive anchor conversions up. **Why:** $39 was old retail, $49 adds value stack making it irresistible, $39 catches price-sensitive buyers.

2. **Section order (12, down from 17)** - Hero > Logos > Videos > Why Headsets > How It Works > Positioning Story (merged Reformer + Founder) > Testimonials > ROI Proof (merged pricing proof + calculator) > Packages + Guarantee > Product Specs > FAQ > Final CTA. **Why:** CXL research shows How It Works before pricing, testimonials near CTA (+50-68% lift), 40-60% avg scroll depth means pricing at section 11/17 was too deep. Removed Story Timeline + Definition (no conversion value).

3. **Value stack (Hormozi offer packaging)** - 6 deliverables: Event Dashboard (6mo free), "Sell Out Your Events" Playbook, Social Media Video Strategy, "From 30 to 100+" Scaling Guide, Custom Branding Kit, 5-Minute Setup + 1-Year Warranty. **Why:** Named by problem solved, each looks standalone, creates FOMO for completeness.

4. **Bundle names** - "First Event Kit" (30), "Fill Every Room" (50), "Build a Business" (100). **Why:** Hormozi says name by problem solved, not generic labels.

5. **Dashboard as continuity** - 6 months free, then $29-49/mo TBD. **Why:** Hormozi "Big Head, Long Tail" - headset sale is cash now, dashboard is recurring forever. Sunk cost + switching costs = low churn.

6. **Dark mode shelved for A/B testing later** - Gold CTA on dark bg is data-supported (+9.3% premium item lift, strong contrast). But needs real traffic to validate vs light mode. **Why:** Research shows dark mode can hurt where product color accuracy matters.

7. **No inline styles rule** added to CLAUDE.md. **Why:** Dark mode refactor proved inline styles make theming impossible.

## In progress / next steps

### THE ONE THING TO DO NEXT:
Build `prototype/index-v2.html` on the `feature/v2-light-mode` branch by:
1. Copy `prototype/index.html` (the live site)
2. Reorder sections per the 12-section structure above
3. Update hero copy, pricing ($49/$39), bundle names/prices, value stack
4. Add new sections: How It Works (3 steps), Value Stack grid, Final CTA - use inline styles for these since the live CSS doesn't have classes for them
5. Update form: add branding toggle, change price calc to HP_BRANDED=49 / HP_PLAIN=39
6. Update meta tags, structured data price, FAQ answers
7. DO NOT TOUCH styles.css - the live CSS works perfectly

The strategy doc at `docs/pricing-strategy-v2.md` has every detail needed.

## Gotchas discovered

1. **Variable inversion doesn't work for dark mode** - renaming `--white` to dark values breaks everything because `--white` is used for both backgrounds AND text in different contexts. The proper approach is semantic variable names (`--bg`, `--surface`, `--text`) which was done in `styles-dark.css`.

2. **The `feature/huzz-brand-v2` branch has stashed changes** - `git stash list` shows one stash. Don't pop it on the wrong branch.

3. **index-v2.html currently on this branch is the dark-mode version** - it references classes that don't exist in the live CSS. Delete it and rebuild from index.html.

4. **styles-v2.css, styles-live.css, styles-dark.css** are all scratch files. Only `styles.css` (the live one) matters for the light-mode v2.

5. **Charging cable ($19)** must be in every bundle. Easy to forget.

6. **On-ear not over-ear.** Every agent gets this wrong at least once.

## Recommendations

1. **Build the light-mode v2 NOW** - it's the blocker. One file, ~30 min of section reordering. Everything else is strategy that's already documented.
2. **Deploy v2 to a preview URL** for visual review before going live
3. **Once v2 is live, reactivate Meta Ads** targeting the new positioning
4. **Build the referral system** (gift card method) - zero cost, highest leverage per Hormozi
5. **Start recruiting 10 dealer partners** - transforms one-time sales into recurring orders
