# Instructions for Claude Code

## What this project is

The **GagRx Labs** marketing + commerce site. A static HTML page with a single serverless function for Stripe Checkout.

- `index.html` — entire site (HTML, CSS, JS all inline)
- `images/` — product photos + logo
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
3. **When adding/editing a product, update BOTH places**:
   - `index.html` — the product card markup (name, displayed price, image, `data-*` attrs)
   - `api/checkout.js` — the `CATALOG` object (price in cents, description)
4. **Don't refactor the site to a framework.** It's intentionally a single HTML file. The only "build" step is `npm install` which Vercel handles automatically.

## Common tasks

### Add a new product
1. In `index.html`, copy a `.product-card` block in the carousel section. Update name, price, description, image path, and `data-name`/`data-price`/`data-img` on the `+` button.
2. In `api/checkout.js`, add an entry to `CATALOG` with the price in cents.
3. Commit & push. Vercel auto-deploys.

### Change a price
1. Update the displayed price in `index.html` (`.product-price` and the `data-price` attribute on the button).
2. Update the corresponding entry in `CATALOG` in `api/checkout.js` (price in cents — $14 = `1400`).

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
