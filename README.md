# Hook & Cook Bar and Restaurant | Nairobi

A luxury-feeling, mobile-first website and digital QR menu with WhatsApp ordering and Safaricom Daraja M-Pesa STK push for **Hook and Cook Bar and Restaurant**, Nairobi, Kenya.

---

## 1. Overview of What Was Built

- **Cinematic Homepage (`/`)**: Full-bleed Ken Burns hero with warm atmospheric lounge imagery, framed gold oval brand seal, live hours indicator (11:00 AM – 1:00 AM across midnight in Africa/Nairobi timezone), floating dish showcase, live canvas kitchen flame and ember particle simulation with optional synthesized sizzle audio, cocktails teaser, championship pool & sports section, and interactive location map card.
- **Floating-Dish Digital Menu (`/menu`)**: Unboxed dishes floating on a charcoal surface with soft elliptical ground shadows and warm amber back-glow (no boxed cards!). Responsive grid (strictly 2 items per row on 360px & 390px mobile screens, 3 on desktop), refined editorial menu rows with dotted gold leader lines, vegetarian gold leaf markers, instant live search, category horizontal scroller, and dining mode selector.
- **Dish Detail Sheet**: Responsive bottom sheet on mobile / dialog on desktop with image preview, preparation notes field, and a pinned bottom action bar with quantity stepper and price total (44px+ touch targets).
- **Ordering Flow (`/order`)**: Full support for Dine-in (with table number or label), Pickup (ASAP or scheduled), and Delivery. Customer phone input starts completely blank (`07XX XXX XXX`). Authoritative quote recalculation that strictly excludes unpriced ('Ask staff') items from numerical totals.
- **M-Pesa Sandbox & Honest Demo Flow**: Integrated STK push with Safaricom Daraja credentials support, timeout protection (`AbortSignal.timeout(8000)`), status polling, and an honest demo mode that clearly states *"SANDBOX DEMO MODE"* and never fakes a real "PAID" receipt.
- **Order Confirmation & WhatsApp Dispatch (`/order/confirmed`)**: Receipt summary stored in `sessionStorage` before navigation, with a dedicated "Send to Kitchen on WhatsApp" button and automatic arrival attempt.
- **Printable A5 Table Tents (`/qr`)**: Instant QR generation for Tables 1 to 30 plus lounge areas (`Pool-1`, `Lounge-A`, etc.). Includes a production URL guard to prevent accidental printing of `localhost` or dev preview URLs, PNG download, and an A5 print stylesheet (`window.print()`).
- **Our Story (`/about`)**: Narrative layout with factual brand details and clearly marked TODO placeholders for owner history.
- **Hours & Location (`/info`)**: Operating hours, directions, parking details, embedded Google Maps preview, and a WhatsApp table inquiry module.
- **Sports & Events (`/events`)**: Highlights Premier League match screenings, championship pool table, sunset happy hour, and Karoga group sessions.
- **Branded 404 (`*`)**: Luxury recovery page.

---

## 2. Route Inventory

| Route | Purpose |
| :--- | :--- |
| `/` | Cinematic home page with live flame simulation and signatures |
| `/menu` | Digital floating-dish menu with instant search and category navigation |
| `/order` | Cart review, dining mode logic (dine-in / pickup / delivery), M-Pesa STK push |
| `/order/confirmed` | Order receipt and WhatsApp kitchen dispatch trigger |
| `/about` | Story layout and culinary philosophy |
| `/info` | Operating hours, address, Google Maps preview, and table inquiries |
| `/events` | Sports screenings, pool table games, happy hours, and Karoga |
| `/qr` | Printable A5 table tents with production URL guard and PNG download |
| `*` | Branded 404 recovery page |

---

## 3. How to Edit Configuration & Menu Prices

All client values live in two clean configuration files. **No phone numbers, hours, prices, or names are hardcoded in components.**

### Site Information: `/src/config/site.config.ts`
- **Phone & WhatsApp**: Change `phoneDisplay`, `phoneTel`, and `whatsappNumber`. (During testing or pitching, set `VITE_WHATSAPP_NUMBER` in your environment to redirect test orders to your own phone).
- **Hours**: Adjust `hours`, `hoursDetail.openHour24` (11), and `hoursDetail.closeHour24` (1).
- **Address & Maps**: Update `address`, `mapUrl`, and `mapEmbedUrl`.
- **Delivery & Tables**: Configure `delivery.defaultFee` and `tableCount`.

### Menu Items & Prices: `/src/config/menu.ts`
- **Editing Existing Prices**:
  ```ts
  {
    id: "masala-chips",
    name: "Masala Chips",
    category: "veg_starters",
    price: 500, // Price in KES
    ...
  }
  ```
- **Handling Unknown / TBC Prices**:
  Set `price: null`. The interface automatically displays **"Ask staff"** in gold small caps and excludes the item from the numerical checkout total, notifying the kitchen to confirm the price upon receipt.
- **Adding Dishes**: Add an object to `MENU_ITEMS` with `id`, `name`, `category`, `price`, and optional `description`, `isVegetarian`, `isFeatured`, and `image`.

---

## 4. How to Replace the Logo

1. Photograph or export the golden oval pot-and-flame logo from the physical menu cover.
2. Save the file into `/public/brand/` (e.g. `/public/brand/hook-cook-logo.png` or `.svg`).
3. Open `/src/config/site.config.ts` and update the `logo` object:
   ```ts
   logo: {
     src: "/brand/hook-cook-logo.png",
     alt: "Hook & Cook Bar and Restaurant Logo"
   }
   ```
This updates the logo across the header, hero seal, footer, QR table tents, favicon, and OpenGraph metadata simultaneously.

---

## 5. Image Prompts for Manual Generation

All dish imagery was generated on a pure black background to enable unboxed floating presentation with soft ground shadows. If you wish to regenerate or expand the photo gallery:

- **Style Template**:
  > Photorealistic [DISH], Nairobi restaurant plating, three-quarter view, plain pure black background, single warm amber rim light from the left, shallow depth of field, steam and glisten, rich charcoal, gold and copper tones, appetizing, no text, no watermark.

1. **Masala Chips**: *Photorealistic Kenyan masala chips dish, Nairobi restaurant plating, three-quarter view, plain pure black background, single warm amber rim light from the left, shallow depth of field, steam and glisten, rich charcoal, gold and copper tones, appetizing, no text, no watermark*
2. **Chili Paneer**: *Photorealistic chili paneer cubes tossed with peppers and scallions, Nairobi restaurant plating, three-quarter view, plain pure black background, single warm amber rim light from the left, shallow depth of field, steam and glisten, rich charcoal, gold and copper tones, appetizing, no text, no watermark*
3. **Paneer Pakoda**: *Photorealistic golden crispy paneer pakoda fritters arranged with fresh mint sprigs, Nairobi restaurant plating, three-quarter view, plain pure black background, single warm amber rim light from the left, shallow depth of field, steam and glisten, rich charcoal, gold and copper tones, appetizing, no text, no watermark*
4. **Hara Bhara Kabab**: *Photorealistic hara bhara spinach and green pea kabab patties with cashew nuts on top, Nairobi restaurant plating, three-quarter view, plain pure black background, single warm amber rim light from the left, shallow depth of field, steam and glisten, rich charcoal, gold and copper tones, appetizing, no text, no watermark*
5. **Chicken Curry**: *Photorealistic rich aromatic chicken curry in a traditional copper handi bowl, Nairobi restaurant plating, three-quarter view, plain pure black background, single warm amber rim light from the left, shallow depth of field, steam rising, rich charcoal, gold and copper tones, appetizing, no text, no watermark*
6. **Whiskey Sour Cocktail**: *Photorealistic luxury whiskey sour cocktail with foamy egg white top, dried orange slice and bitters garnish, heavy crystal rocks glass with cold condensation droplets and ice cubes, plain pure black background, warm amber side lighting, shallow depth of field, appetizing, no text, no watermark*
7. **Pool Table Lounge**: *Warm luxury sports lounge in Nairobi with green felt pool table, billiard balls, brass overhead pendant lamp glowing over the table, dark charcoal wood interior, friends enjoying drinks in background, moody atmospheric lighting*
8. **Hero Lounge Scene**: *Cinematic luxury dark lounge bar scene in Nairobi, warm amber and brass lighting, glowing backlit liquor shelves, rich charcoal and copper tones, dimly lit dining table with elegant cocktail glasses, soft candlelight, appetizing warm atmosphere, shallow depth of field, high-end photography*

---

## 6. Environment Variables (`.env.example`)

Place these variables in your deployment settings (e.g. Vercel Project Settings > Environment Variables). **Never commit real keys or secrets to the Git repository.**

```bash
# App Deployment URL (used for QR code encoding and self-referential links)
VITE_SITE_URL="https://hook-and-cook.vercel.app"

# WhatsApp Order Dispatch Number (international format without +)
# Set to your own phone number to receive test orders during pitches
VITE_WHATSAPP_NUMBER="254727098606"

# Safaricom Daraja M-Pesa STK Push Credentials
MPESA_ENV="sandbox"
MPESA_CONSUMER_KEY=""
MPESA_CONSUMER_SECRET=""
MPESA_SHORTCODE="174379"
MPESA_PASSKEY=""
MPESA_CALLBACK_URL="https://hook-and-cook.vercel.app/api/mpesa/callback"

# Optional Gemini API key if AI assistance features are enabled
GEMINI_API_KEY=""
```

---

## 7. Git & Vercel Deployment Commands

Follow these exact commands to push to GitHub and deploy to Vercel:

```bash
# 1. Initialize git and commit changes
git init
git add .
git commit -m "feat: Hook & Cook Bar & Restaurant website, QR digital menu, and M-Pesa STK push"

# 2. Add your GitHub repository remote and push
git branch -M main
git remote add origin https://github.com/<your-username>/hook-and-cook.git
git push -u origin main

# 3. Deploy with Vercel CLI (or link repository via Vercel Dashboard)
vercel --prod
```

`vercel.json` is already configured in the root directory to route `/api/*` to serverless Node.js functions and rewrite all page paths (`/menu`, `/order`, `/qr`, `/info`, etc.) to `/index.html` for single-page client routing.

---

## 8. Final List of TODOs and Placeholders for the Owner

The following items are transparently marked with `TODO` in the codebase for the owner to finalize prior to official public launch:

1. **Logo File**: Photograph or export the high-resolution logo from the physical menu cover and replace `/public/brand/logo-placeholder.svg` (or update `siteConfig.logo.src`).
2. **Tagline**: Working line is `"Good food. Cold drinks. Late nights."` Confirm or provide preferred brand tagline.
3. **Street Address & Map Pin**: Confirm physical street address and exact Google Maps coordinate pin to replace the general P.O. Box `33951` reference.
4. **WhatsApp Dispatch Phone**: Confirm whether `+254 727 098606` directly receives WhatsApp incoming orders, or provide the dedicated kitchen tablet number.
5. **Karoga Experience**: Confirm the exact spelling, meaning, pricing packages, and booking terms for the Karoga social cooking lounge.
6. **Soups Prices**: Captured menu notes show soups between KES 420 and 520. Individual prices for Veg Hot & Sour, Veg Noodles, and Veg Mushroom soup are marked "Ask staff" until exact prices are supplied.
7. **Mains & Platters**: Captured notes indicate non-veg mains range from KES 1,400 to 2,200. Supply full list of chicken curries, paneer mains, seafood fillets, and platters with exact prices.
8. **Bar & Drink List**: Supply complete bottle list, beers, hard liquors, wines, and pricing to populate the bar array.
9. **Desserts**: Supply daily dessert menu names and prices.
10. **Delivery Fee & Zones**: Confirm flat or zone-based delivery fee (default is set to KES 0 with notice to confirm via WhatsApp).
11. **Payment Methods**: Confirm table payment facilities (e.g. PDQ card machines, cash, M-Pesa Till number).
12. **Production Vercel URL**: Replace `https://hook-and-cook.vercel.app` with the verified production custom domain once DNS is connected.
