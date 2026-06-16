// Vercel serverless function: POST /api/checkout
// Receives cart items, creates a Stripe Checkout Session, returns the URL to redirect to.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Server-side product catalog — never trust prices from the client.
// Prices are in cents. Keep these in sync with the HTML.
const CATALOG = {
  'Shartismol':     { price: 1400, description: 'Maximum clench strength · 50 cinnamon beans' },
  'Forgotitol':     { price: 1400, description: 'Extra memory · 50 beans (if you can find the bottle)' },
  'MeetingAvoidil': { price: 1400, description: 'Schedule-declining concentrate · 50 coated pieces' },
  'MondayQuil':     { price: 1400, description: 'Max strength Monday fatigue · 50 lemon beans' },
  'NewParentavil':  { price: 1400, description: 'For exhausted new parents · 50 beans' },
  'OldFartadryl':   { price: 1400, description: 'Acute Old Fart Syndrome relief · 50 beans' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Build line items from the catalog. Ignore any price the client sent.
    const line_items = items.map((item) => {
      const product = CATALOG[item.name];
      if (!product) throw new Error(`Unknown product: ${item.name}`);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: product.description,
            images: item.img ? [`${getOrigin(req)}/${item.img}`] : [],
          },
          unit_amount: product.price,
        },
        quantity: Math.max(1, Math.min(99, parseInt(item.qty) || 1)),
      };
    });

    const origin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      // Let Stripe collect shipping address and calculate shipping rates
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 599, currency: 'usd' },
            display_name: 'Standard shipping (2–5 business days)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1299, currency: 'usd' },
            display_name: 'Express shipping (1–2 business days)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      // Automatic tax calculation (requires Stripe Tax to be enabled)
      // automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      phone_number_collection: { enabled: false },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}
