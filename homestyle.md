# Kindard Kids — UI/UX Design Prompt System

> **How to use**: Copy any prompt below and paste it into your preferred AI image/design tool (Midjourney, Figma AI, v0.dev, Cursor, etc.) to generate on-brand UI screens, components, or page layouts for the Kindard Kids storefront.

---

## 🎨 Brand Design System Reference

Before using prompts, internalize the Kindard design language:

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0a` | Primary text, borders, dark backgrounds |
| `--white` | `#f5f4f0` | Primary background, light surfaces |
| `--accent` | `#e8ff00` | CTA highlights, hover states, badges |
| `--mid` | `#b0aeaa` | Muted labels, secondary text |
| `--border` | `#d0cec9` | Subtle dividers |
| `--red` | `#ff2b2b` | Sale labels, destructive actions |
| **Font** | Barlow Condensed (headings), Barlow (body) | All-caps tracking |
| **Style** | Stark brutalist grid — thick black borders, no drop shadows | Like Supreme × Celine editorial |

---

## 📄 Page Prompts

### 1. Privacy Policy Page
```
Design a minimalist legal content page for Kindard Kids (premium kids streetwear brand).
Style: brutalist editorial — off-white (#f5f4f0) background, #0a0a0a text, 1.5px solid black borders.
Font: Barlow Condensed (headings, ALL CAPS, tight tracking) + Barlow (body, lightweight 300).
Layout:
  - Full-width sticky header bar with "PRIVACY POLICY" in caps + last updated date in --mid grey
  - Left sidebar (200px) with anchor nav: Introduction / Data We Collect / How We Use / Your Rights / Cookies / Contact
  - Main content area: clean paragraphs with h2 section headers in large condensed uppercase
  - Section dividers: full-width 1.5px black border lines
  - Footer: "Questions? Contact privacy@kindard.com" with black button outlined ghost style
Mood: legal but premium, structured like a fashion editorial, not corporate gray
```

---

### 2. Terms of Service Page
```
Design a Terms of Service page for Kindard Kids streetwear e-commerce.
Same design language as Privacy Policy: brutalist, off-white, thick black 1.5px borders.
Layout:
  - Page hero bar (60px tall): "TERMS OF SERVICE" condensed font 900 weight left-aligned, effective date right-aligned in --mid (#b0aeaa)
  - Collapsible accordion sections: each section has a numbered heading (01, 02, 03...) + expand/collapse icon
  - Accordion open state: section background shifts to very light yellow (#fffde8) with left border accent in --accent (#e8ff00)
  - Bold pull-quote boxes: key clauses highlighted in black background with white condensed type
  - Bottom CTA: "I accept the Terms" button — full width, black fill, accent hover (#e8ff00), uppercase tracking
Mobile: single column, accordions stack, sticky "Back to top" button bottom-right
```

---

### 3. Cookie Settings Page
```
UI design for a Cookie Settings / Consent Management page, Kindard Kids brand.
Brutalist minimal aesthetic: off-white background, pure black borders, accent yellow (#e8ff00) for active toggles.
Layout:
  - Page header: "COOKIE SETTINGS" + subtitle "Customize your privacy preferences"
  - Cookie category cards (each 100% width, bordered):
      1. Strictly Necessary — cannot disable, toggle grayed out with "Required" badge
      2. Analytics & Performance — toggle ON by default, description below
      3. Marketing & Personalization — toggle OFF by default
      4. Functional — toggle ON by default
  - Toggle design: pill-shaped, OFF = black fill white thumb, ON = --accent (#e8ff00) fill black thumb
  - Card layout: category name uppercase bold left / toggle right / description paragraph below in Barlow 300 weight
  - Bottom bar: "SAVE SETTINGS" (primary black button) + "ACCEPT ALL" (ghost button) + "REJECT ALL" (text link in --mid)
Reference brands: Supreme CMS minimalism × Stripe dashboard toggles
```

---

### 4. Help & Contact Page
```
Design a Help & Contact page for Kindard Kids premium kids streetwear.
Brand: off-white (#f5f4f0), black (#0a0a0a), accent yellow (#e8ff00), Barlow Condensed typography.
Layout sections:
  1. Hero bar: "GET IN TOUCH" + tagline "We reply within 24 hours — usually much faster." Black background, white + yellow text.
  2. Contact Method Cards (horizontal row of 3, equal width, bordered):
     - 💬 Live Chat: "MON–FRI 9AM–6PM CET" + [START CHAT] black button
     - 📧 Email: "hello@kindard.com" + [SEND EMAIL] ghost button
     - 📱 WhatsApp: "+31 6 00 000 000" + [MESSAGE US] ghost button
  3. FAQ mini-accordion: 5 most common questions, same brutalist accordion style (expand = accent left border)
  4. Order tracking input box: "ENTER ORDER #" with submit arrow
  5. Mailing address block in a bordered box: "Kindard HQ — Amsterdam, Netherlands"
Typography: all section headings Barlow Condensed 900 uppercase, body Barlow 300 weight
```

---

### 5. Shipping Info Page
```
UI design for Shipping Information page, Kindard Kids.
Design system: brutalist e-commerce, off-white bg, 1.5px solid black borders, accent #e8ff00.
Sections:
  1. Full-width banner strip (black bg, white text): "FREE SHIPPING ON ORDERS OVER €75" — ticker/marquee style
  2. Shipping method comparison table:
     | Method | Delivery | Cost |
     | Standard | 3-5 days | €4.95 |
     | Express | 1-2 days | €9.95 |
     | Same Day (NL) | Today | €14.95 |
     Table style: thick black header row with --accent text, alternating row backgrounds (#f5f4f0 / #ebe9e4)
  3. Country selector: dropdown + estimated delivery time update (interactive component)
  4. Shipping process timeline: horizontal 4-step flow (Order → Processing → Shipped → Delivered), steps connected by dotted black line
  5. Info boxes: "Sustainable packaging" + "Track your order in real time" — icon + text, bordered cards
```

---

### 6. Returns & Exchanges Page
```
Design a Returns & Exchanges page for Kindard Kids premium streetwear.
On-brand aesthetic: stark white, black borders, yellow accents, Barlow Condensed.
Layout:
  1. Policy summary bar: "30-DAY FREE RETURNS" in massive Barlow Condensed 900 italic, full-width, black bg
  2. Step-by-step return process (numbered cards, horizontal scroll on mobile):
     Step 1: Initiate Return (fill form) → Step 2: Print Label → Step 3: Drop Off → Step 4: Refund in 5 days
     Each step: large number (200px, black, 10% opacity background), title, short description
  3. Eligibility checklist (two columns):
     ✓ Unworn & unwashed items     ✗ Customized items
     ✓ Original tags attached       ✗ Underwear / swimwear
     ✓ Within 30 days               ✗ Items marked FINAL SALE
  4. Start Return CTA: full-width black button "START YOUR RETURN →" with accent hover
  5. Exchange note: bordered info box "Prefer an exchange? We'll reserve the new item while processing your return."
```

---

### 7. Size Guide Page
```
Design a Size Guide page for Kindard Kids children's streetwear (ages 2-14).
Brand: off-white, black, --accent yellow, condensed athletic typography.
Sections:
  1. Page header: "SIZE GUIDE" + "Fits designed for real kids — oversized drop-shoulder silhouettes"
  2. Size chart tabs: TOPS / BOTTOMS / SHOES (tab bar, active = black fill + white text)
  3. Size chart table:
     | Size | Age | Height | Chest | Waist |
     Styled: sticky first column, alternating rows, header row black + accent text
  4. How to measure section: illustrated diagram (clean line-art, Scandinavian illustration style) with measurement points labeled
  5. Fit philosophy callout box (black bg, accent text): "Kindard cuts run true-to-size with generous room for movement. Still unsure? Size up — our silhouettes are designed oversized."
  6. Need help chip: "CHAT WITH US" pill button + WhatsApp icon
```

---

### 8. Track My Order Page
```
Design an Order Tracking page for Kindard Kids.
Style: functional yet on-brand — black, off-white, accent yellow, Barlow Condensed.
Sections:
  1. Search bar: large centered input "ENTER ORDER # OR EMAIL" + Submit arrow button, surrounded by thick black border
  2. Tracking result (after submit) — order status timeline:
     [●] Order Placed Jan 12
     [●] Processing Jan 12
     [●] Shipped Jan 13 — DHL Express
     [○] Out for Delivery (grayed)
     [○] Delivered (grayed)
     Connected by vertical line, active nodes filled black, future nodes hollow circle
  3. Package details card (bordered): Order #12345 / 2 items / Amsterdam → New York / Tracking: 1Z999AA1012345678
  4. Map placeholder: a bordered box showing route line from origin to destination city with minimal dot markers
  5. Notification opt-in bar: "Get SMS updates" + phone number input + Subscribe button
```

---

### 9. About Kindard Page
```
Design a premium brand story / About page for Kindard Kids streetwear.
Aesthetic: editorial magazine meets Supreme store — stark, confident, no fluff.
Layout (scroll sections):

Section 1 — Hero manifesto:
  Full-bleed black background. Giant italic Barlow Condensed 900 text: "WE DON'T MAKE CLOTHES FOR CHILDREN. WE MAKE STREETWEAR THEY HAPPEN TO FIT."
  Small accent yellow label top-left: "FOUNDED 2024 · AMSTERDAM"

Section 2 — Story in 3 editorial columns:
  Column 1: photo (editorial kids photo, dark tone)
  Columns 2-3: brand story text in Barlow 300, interspersed with pull-quotes in Barlow Condensed 900

Section 3 — Stats bar (full-width, black bg):
  [10K+ FAMILIES] [4.9★ RATING] [12 COUNTRIES] [100% ORGANIC]
  Large numbers in --accent yellow, labels in --mid white

Section 4 — Values grid (2x2 bordered cards):
  Indestructible Quality / Unrestricted Movement / Guilt-Free Materials / Youth Culture

Section 5 — Team/founder section:
  Full-width editorial grid, minimal bio cards, black & white photo aesthetic
```

---

### 10. Careers Page
```
Design a Careers / Jobs page for Kindard Kids.
Tone: cool streetwear brand meets startup energy — aspirational, minimal, confident.
Brand: off-white, black, --accent yellow, Barlow Condensed.
Sections:
  1. Hero: "BUILD THE FUTURE OF KIDS FASHION" — large condensed type, black bg, accent highlight on "KIDS FASHION"
  2. Culture callout row (3 bordered cards):
     🏀 Move fast   /   🎨 Stay creative   /   🌍 Think global
  3. Open positions list (job board style):
     Each listing: [DEPARTMENT TAG] | JOB TITLE (condensed 900) | LOCATION | [APPLY →]
     Hover: row background shifts to --accent, text inverts to black
     Listings: Creative Director / Growth Marketer / Brand Manager / Full-Stack Dev / Customer Lead
  4. Perks grid: 6 perks in bordered chips layout:
     Remote first / Amsterdam HQ access / Brand wardrobe allowance / Equity / Learning budget / Team retreats
  5. CTA section: "DON'T SEE YOUR ROLE? SEND US A SIGNAL." + open application email button
```

---

### 11. Sustainability Page
```
Design a Sustainability / Impact page for Kindard Kids premium kids streetwear.
Visual direction: editorial and honest — no greenwashing aesthetics, confident data-driven.
Brand palette: off-white, black, --accent yellow, Barlow Condensed.
Sections:
  1. Statement banner: "FASHION WITHOUT GUILT" — full-width, black background, massive condensed italic type
  2. Three pillars (3-column grid, equal bordered cards):
     🌱 Materials | ♻️ Packaging | 🤝 Manufacturing
     Each: icon + bold stat + short paragraph (e.g. "100% GOTS-certified organic cotton")
  3. Progress tracker (horizontal bar chart style):
     "Carbon neutral by 2026" — 72% progress bar in --accent
     "Zero plastic packaging" — 100% (completed badge in black + accent)
     "Fair wage certified" — 85%
  4. Supply chain map: world map outline (minimal vector) with factory pins in Amsterdam, Portugal, India
  5. Certifications row: GOTS / B-Corp / 1% for the Planet logos — bordered badge style
  6. Pledge box: "EVERY PURCHASE PLANTS A TREE" — bordered callout, tree icon in accent
```

---

### 12. Store Location Pages (SoHo / Fairfax / Carnaby / Harajuku / Amsterdam)
```
Design a flagship store location page for Kindard Kids — [CITY] store.
Brand: off-white, black, --accent yellow, Barlow Condensed editorial style.
Replace [CITY] with: New York SoHo / Los Angeles Fairfax / London Carnaby St / Tokyo Harajuku / Amsterdam 9 Straatjes

Sections:
  1. Store hero: Full-bleed store interior photo (dark, editorial, architectural) with store name overlay:
     "KINDARD [CITY]" — giant white condensed type. Address + hours below in --mid.
  2. Store details row (3 columns):
     📍 Address + Google Maps link
     🕒 Opening hours (table: Mon–Fri / Sat–Sun)
     📞 Phone + Email contact
  3. In-store experience cards (3 bordered cards):
     Exclusive drops / Styling sessions / Kids play area
  4. Map embed placeholder: bordered box showing neighborhood map, store pin in --accent
  5. Events ticker (thin strip): "UPCOMING: [Event name] — [Date] → [Date] — RSVP →"
  6. "Visit us" CTA: "PLAN YOUR VISIT" button + Apple Maps / Google Maps dual buttons
Layout: feels like a premium flagship store landing page. Reference: Supreme store pages, Aimé Leon Dore NYC.
```

---

## 🧩 Component-Level Prompts

### Newsletter Subscribe Component
```
Design a newsletter subscribe section for Kindard Kids footer/homepage.
Style: stark brutalist — full-width black background section.
Layout:
  Left: "JOIN THE TRIBE" (condensed 900, 48px, white) + "EXCLUSIVE DROPS. EARLY ACCESS. NOTHING ELSE." (--mid color, small)
  Right: Email input field + "SUBSCRIBE →" button
  Input style: white background, black border, Barlow Condensed uppercase placeholder
  Button: --accent (#e8ff00) fill, black text, black border, hover = black fill white text
  Fine print below input: "No spam. Unsubscribe anytime. Privacy Policy"
Mobile: stack vertically, input + button full width
```

---

### FAQ Accordion Component
```
Design a FAQ accordion component for Kindard Kids.
Closed state: full-width row, thick 1.5px black bottom border, question in Barlow Condensed 700 uppercase, "+" icon right-aligned in black
Open state: left border becomes 3px --accent (#e8ff00), background shifts to #fffde8 (barely-there yellow), answer text Barlow 300 weight slides down, icon becomes "−"
Hover state: very subtle background shift (#ede9e4)
No rounded corners. No shadows. Pure sharp brutalist geometry.
Animation: smooth 0.2s ease-in-out height transition
```

---

### Product Card — Collection Grid
```
Design a product card component for Kindard Kids streetwear collection grid.
Dimensions: 3-column grid on desktop, 2-column on mobile, 1:1.33 aspect ratio card
Product image area: fills top 75% of card, --black (#0a0a0a) background, product centered
Badges (absolute positioned):
  - "NEW" top-right: black fill, --accent yellow text
  - "SALE" top-right: --red fill, white text
  - Wishlist heart: top-left white bordered circle button
Product info (bottom 25%): 
  Brand: 10px uppercase --mid tracking
  Name: Barlow Condensed 600 15px uppercase
  Price row: 16px bold + strikethrough original + "−30%" discount tag (black + accent)
  Sizes row: tiny bordered size chips, available = black border, unavailable = --border grey
Hover: card background shifts to #f0ede8, image subtly scales 1.02x
```

---

### Mobile Bottom Navigation
```
Design a mobile bottom navigation bar for Kindard Kids storefront app.
Height: 58px, full-width, white background (#f5f4f0), thick 1.5px top border black
5 items: HOME / SHOP / SEARCH / WISHLIST / BAG
Each: icon centered above 9px uppercase label, Barlow Condensed
Active state: --accent (#e8ff00) background pill behind icon + label, black icon/text
Badge on BAG: black circle with white count number, 9px font
No shadows, no rounded corners, sharp surgical geometry
iOS safe area: bottom padding for home indicator
```

---

## 🛠 SDK / Developer Notes for Implementation

When building these pages in the Kindard Next.js + Payload CMS stack:

### Design Tokens (CSS Variables — already in `globals.css`)
```css
:root {
  --black:  #0a0a0a;
  --white:  #f5f4f0;
  --accent: #e8ff00;
  --mid:    #b0aeaa;
  --border: #d0cec9;
  --red:    #ff2b2b;
}
```

### Typography Classes (use Barlow Condensed via Google Fonts)
```css
/* Heading style */
font-family: 'Barlow Condensed', sans-serif;
font-weight: 900;
text-transform: uppercase;
letter-spacing: .04em;

/* Body style */
font-family: 'Barlow', sans-serif;
font-weight: 300;
```

### Standard Border Style
```css
border: 1.5px solid var(--black);
```

### Page Layout Pattern (all static pages)
```tsx
// Standard page shell used by [category]/page.tsx
<main>
  <div className="page-header-bar">   {/* full-width, 60px, border-bottom */}
    <h1>{page.title}</h1>
  </div>
  <div className="page-body">         {/* max-width 900px, centered, padding 48px */}
    <RenderBlocks blocks={page.layout} />
  </div>
</main>
```

### Payload CMS Blocks Available for Pages
- **Content Block**: Rich text (headings, paragraphs, lists) via Lexical editor
- **Media Block**: Full-width or inset image from CDN
- **Call to Action Block**: Headline + body + button → renders as black CTA section

### Adding a New Page (developer workflow)
1. Go to **Payload Admin → Pages → Create New**
2. Set `slug` (e.g. `size-guide`) and `title`
3. Under **Layout**, click **Add Block** → choose Content / Media / CTA
4. Set **Status** to `Published`
5. Page is live at `/{slug}` on the storefront automatically

---

*Last updated: June 2026 — Kindard Design System v1.4*
