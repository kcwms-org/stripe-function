// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MbyXWAXcHqp4mKL8Kv7HpkftPZJTBafppSgFGwBOEWfmHaFhdjGgwyicikm4xSVXodTKjxB9CMgVJvizu3iwPnB00blSQ4qKF');
const express = require('express');
const cors = require('cors');
const app = express();

if ((process.env.MARSHA_API_ALLOWED_ORIGINS || "DEVELOPMENT") === "DEVELOPMENT") {
  app.use(cors());
}
app.use(express.json());

const PORT_NUMBER = process.env.API_PORT || 80;

app.get('/heart-beat', (req, res) => {
  res.status(200).send(new Date().toISOString());
});

app.get('/products', async (req, res) => {
  const active = req.query.activeOnly || true;
  const limit = req.query.limit || 10;

  const prods = await stripe.products.list({ limit: limit, active: active, expand: ['data.default_price'] },);

  res.json(prods);
});

app.post('/create-checkout-session', async (req, res) => {

  const payment = req.body;
  // todo: validation here

  const stripePayment = {
    line_items: [
      {
        price: payment.productId,
        quantity: payment.quantity,
      },
    ],
    mode: 'payment',
    success_url: `${payment.domain}${payment.successRoute}`,
    cancel_url: `${payment.domain}${payment.failRoute}`,
  }
  const redirectUrl = await stripe.checkout.sessions.create(stripePayment);

  res.json({ url: redirectUrl });
});

app.listen(PORT_NUMBER, () => console.log(`Running on port ${PORT_NUMBER}`));