// This is your test secret API key.
const stripeCheckout = require('./packages/stripe-checkout/create-checkout-session');
const heartBeat = require('./packages/stripe-checkout/heart-beat');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT_NUMBER = process.env.API_PORT || 80;

app.get('/heart-beat', (req, res) => {
  res.status(200).send(heartBeat.heart_beat());
});

app.post('/create-checkout-session', async (req, res) => {

  const payment = req.body;
  const redirectUrl = await stripeCheckout.getStripeCheckoutUrl(payment);

  res.json({ url: redirectUrl });
});

app.listen(PORT_NUMBER, () => console.log(`Running on port ${PORT_NUMBER}`));