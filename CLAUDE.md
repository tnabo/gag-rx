# Instructions for Claude Code

## What this project is

The **GagRx Labs** marketing + commerce site. Static HTML pages with a single serverless function for Stripe Checkout.

- `index.html` — homepage (HTML, CSS, JS all inline)
- `product.html` — single product-detail template; populated client-side from a slug
- `vercel.json` — rewrites `/products/<slug>` → `/product.html` so each product gets a clean URL
- `images/` — product photos + logo. Each product has `{slug}.png` (front shot) and `{slug}-detail.png` (full layout)
- `api/checkout.js` — Vercel serverless function that creates Stripe Checkout sessions
- `package.json` — declares the `stripe` npm dependency for the serverless function
- `STRIPE_SETUP.md` — human-facing guide for setting up Stripe + Vercel

## Architecture

- **Hosting**: Vercel (free tier). Auto-deploys on push to `main`.
- **Payments**: Stripe Checkout (hosted page, redirect flow). No card data ever touches our code.
- **Cart**: client-side JS, persisted to `localStorage`. Server validates prices against `CATALOG` in `api/checkout.js` so client can't tamper.

## Critical rules

1. **Never commit secrets.** `STRIPE_SECRET_KEY` lives in Vercel environment variables, never in code or git.
2. **Server is the source of truth for prices.** The `CATALOG` object in `api/checkout.js` defines real prices. The HTML shows display prices but Stripe charges what `CATALOG` says.
3. **When adding/editing a product, update THREE places**:
   - `index.html` — the homepage product card markup (name, displayed price, image, `data-*` attrs, link `href="/products/<slug>"`)
   - `product.html` — the `PRODUCTS` JS object at the top of the script block (name, brand, tag, cat, price, tone, img, detail, desc, features)
   - `api/checkout.js` — the `CATALOG` object (price in cents, description) — server is source of truth for prices
4. **Don't refactor the site to a framework.** It's intentionally a couple of static HTML files. The only "build" step is `npm install` which Vercel handles automatically.

## Common tasks

### Add a new product
1. Add two images to `images/`: `{slug}.png` (front bottle shot) and `{slug}-detail.png` (packaging/layout shot).
2. In `index.html`, copy an `<article class="product-card">` block in the carousel section. Update tone class, slug in `href`, badge, image, category, name, description, price, and the `data-name`/`data-price`/`data-img` on the `+` button.
3. In `product.html`, add an entry to the `PRODUCTS` object using the slug as the key.
4. In `api/checkout.js`, add an entry to `CATALOG` keyed by the product `name` with price in cents.
5. Commit & push. Vercel auto-deploys.

### Change a price
1. Update the displayed price in `index.html` (`.product-price` and `data-price` on the `+` button).
2. Update `price` in the `product.html` `PRODUCTS` entry.
3. Update the corresponding entry in `CATALOG` in `api/checkout.js` (price in cents — $14 = `1400`).

### Update shipping rates
Edit the `shipping_options` array in `api/checkout.js`. Each rate has `display_name`, `fixed_amount.amount` (cents), and `delivery_estimate`.

### Switch from test mode to live
In Vercel dashboard → project settings → environment variables → update `STRIPE_SECRET_KEY` from the `sk_test_...` key to the `sk_live_...` key. Redeploy.

### Local development
```bash
npm install
npx vercel dev
```
Opens a local server with the API function working. Requires `STRIPE_SECRET_KEY` in `.env.local` (gitignored).

## What NOT to do

- Don't introduce a JS framework, build step, or bundler.
- Don't move CSS or JS out of `index.html` unless explicitly asked.
- Don't add `.env` files to git — `.gitignore` already excludes them.
- Don't change `api/checkout.js` to read prices from the request body. Always look them up from `CATALOG`.
- Don't add an analytics or marketing snippet without asking the user first.

## Deployment

The user already deployed to Vercel and connected it to this GitHub repo. Pushes to `main` deploy automatically. No manual deploy steps needed.

If the user hasn't deployed yet, walk them through `STRIPE_SETUP.md`.
