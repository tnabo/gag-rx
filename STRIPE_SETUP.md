# Stripe + Vercel Setup Guide

Step-by-step to get the cart taking real money. Allow ~20 minutes total.

## What we're doing

Your site needs to move from GitHub Pages (static hosting) to **Vercel** (also free, but supports server code). Vercel will host both the static site AND the small serverless function that talks to Stripe.

You'll keep using GitHub for the code — Vercel just connects to it and auto-deploys whenever you push.

---

## Part 1 — Create Stripe Account

1. Go to https://stripe.com and sign up
2. After signup, you'll land in the Stripe Dashboard
3. **Stay in Test Mode** for now (toggle in the top-right corner — should say "Test mode")
4. Go to **Developers → API keys**
5. Copy these two values somewhere safe:
   - **Publishable key** (starts with `pk_test_...`) — you don't need this yet, but save it
   - **Secret key** (starts with `sk_test_...`) — click "Reveal test key" to see it

⚠️ Never paste the secret key into your code or commit it to GitHub. It only goes in Vercel as an environment variable (next steps).

---

## Part 2 — Deploy to Vercel

1. Go to https://vercel.com and sign up — use the **"Continue with GitHub"** option
2. Once in, click **"Add New… → Project"**
3. Find your `gag-rx` repo in the list, click **Import**
4. On the configuration screen:
   - **Framework Preset**: Other (or "None")
   - **Root Directory**: leave as `./`
   - **Build Command**: leave blank
   - **Output Directory**: leave blank
   - Expand **Environment Variables** and add one:
     - **Name**: `STRIPE_SECRET_KEY`
     - **Value**: paste the `sk_test_...` key from Stripe
5. Click **Deploy**

Wait ~30 seconds. Vercel will give you a URL like `gag-rx-tnabo.vercel.app`. Open it — your site should load exactly as before, but now the checkout button works.

---

## Part 3 — Test the Checkout

1. Open your new Vercel URL
2. Add a product to cart → click cart icon → click "Checkout"
3. You'll be redirected to Stripe's hosted checkout page
4. Use Stripe's test card: **`4242 4242 4242 4242`**
   - Expiration: any future date (e.g. `12/29`)
   - CVC: any 3 digits (e.g. `123`)
   - ZIP: any 5 digits (e.g. `12345`)
   - Address: anything
5. Complete the purchase
6. You'll be sent back to your site with a "Order placed!" toast
7. Check your Stripe Dashboard → **Payments** — you'll see the test payment

Other test cards to try:
- `4000 0000 0000 0002` — card declined
- `4000 0000 0000 9995` — insufficient funds

---

## Part 4 — Point Your Domain at Vercel

(Do this once you've bought your domain from Squarespace.)

1. In Vercel: open your project → **Settings → Domains**
2. Add your domain (e.g. `gagrxlabs.com`)
3. Vercel will show you DNS records to add
4. In Squarespace DNS settings:
   - Delete the GitHub Pages A records you set up earlier
   - Add the records Vercel shows you (typically one A record pointing to `76.76.21.21`, and a CNAME for www)
5. Wait 10 min to a few hours for DNS to propagate
6. Vercel auto-generates an SSL certificate — you're live on HTTPS

⚠️ Once Vercel is serving the domain, you can **disable GitHub Pages** in your repo settings to avoid confusion.

---

## Part 5 — Go Live (When You're Ready)

When you want to take real money:

1. In Stripe Dashboard, complete account activation (business info, bank account for payouts)
2. Toggle from **Test mode** → **Live mode** in the top-right
3. Go to **Developers → API keys** and copy the LIVE secret key (`sk_live_...`)
4. In Vercel: **Settings → Environment Variables**
5. Update `STRIPE_SECRET_KEY` to the live key
6. Redeploy (Vercel does this automatically when you save the env var)

You're now accepting real payments.

---

## What You're Paying For

- **Vercel**: Free for this traffic level. They start charging if you hit ~100 GB bandwidth/month or huge function usage. You won't.
- **Stripe**: No monthly fee. They take **2.9% + 30¢** per successful card transaction. A $14 product = $0.71 to Stripe, you keep $13.29.
- **GitHub**: Free, even for the private repo.
- **Domain**: Whatever Squarespace charges, typically $12–25/year.

---

## To Add or Update Products

Two places:

1. **In `index.html`**: edit the product card HTML (name, price displayed, description)
2. **In `api/checkout.js`**: update the `CATALOG` object (price in cents, description)

The catalog in `checkout.js` is the source of truth — Stripe uses that price, not the price the browser sends. This prevents anyone from editing the HTML to pay $1 for a $14 product.

---

## Troubleshooting

**"Stripe error: Invalid API key"** → The `STRIPE_SECRET_KEY` env var is missing or wrong in Vercel. Settings → Environment Variables → check it. Redeploy after fixing.

**Checkout button does nothing** → Open browser dev tools (F12) → Console tab → click checkout → look for errors. Usually a typo in the API key or the function failed to deploy.

**"Order placed" but no payment in Stripe** → You're in test mode (Stripe Dashboard top-right toggle). Test payments only show under test mode.

**Vercel says "build failed"** → Check the deploy logs. Most common cause: `package.json` missing or `stripe` package not listed as a dependency.
