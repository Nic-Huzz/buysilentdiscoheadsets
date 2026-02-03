# Silent Disco Headsets - Design Prototype

This is a static HTML/CSS/JS prototype of your redesigned Silent Disco Headsets store.

## How to View

### Option 1: Double-click to open
Simply double-click `index.html` to open it in your default browser.

### Option 2: Using a local server (recommended)
For the best experience, use a local server:

```bash
# Navigate to the prototype directory
cd /Users/nichurrell/silent-disco-shopify/prototype

# If you have Python installed (Mac/Linux usually do):
python3 -m http.server 8000

# Then open in your browser:
# http://localhost:8000
```

## Design Features

### Color Scheme
- **Purple Gradient**: #5e17eb → #8b5cf6 (Primary brand color)
- **Gold Accent**: #ffdd27 (CTAs and highlights)
- **Clean Neutrals**: Whites and grays for balance

### Sections Included

All sections from your current site, redesigned:

1. **Header** - Sticky navigation with purple gradient logo
2. **Hero Banner** - Full-width with purple gradient background
3. **Brand Trust** - Companies who trust your headsets
4. **Product Overview** - Feature highlights with imagery
5. **Story Section** - Your journey from Bali rental to worldwide
6. **Package Showcase** - 4 packages (Starter, Small Events, Pro, Custom)
7. **Testimonials** - Auto-rotating carousel with 5 testimonials
8. **FAQ** - Accordion-style with smooth animations
9. **Footer** - Newsletter signup + links

### Interactive Elements

- ✓ FAQ accordion (click to expand/collapse)
- ✓ Testimonials auto-rotate every 5 seconds
- ✓ Smooth scroll navigation
- ✓ Hover effects on all interactive elements
- ✓ Mobile responsive design
- ✓ Animated sections on scroll

### Typography
- **Headings**: Poppins (Google Font)
- **Body**: System font stack for performance

## Testing Responsive Design

### Desktop
Open normally - optimized for 1200px+ screens

### Tablet View
1. Open in browser
2. Right-click → Inspect
3. Click the device toolbar icon (or Cmd+Shift+M on Mac)
4. Select iPad or set width to 768px

### Mobile View
1. Same as above
2. Select iPhone or set width to 375px

## File Structure

```
prototype/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles with design system
├── js/
│   └── script.js       # Interactive functionality
├── images/             # Placeholder for your product images
└── README.md           # This file
```

## Next Steps

Once you're happy with the design:

1. Review all sections and provide feedback
2. Replace placeholder images with your actual product photos
3. Update text content as needed
4. We can then apply this design to your Shopify theme

## Customization Notes

All design variables are defined at the top of `styles.css`:
- Colors
- Spacing
- Typography
- Shadows
- Border radius

Easy to adjust if you want to tweak the design!

---

Built with Claude Code 🤖
