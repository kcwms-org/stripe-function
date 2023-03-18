// This is your test secret API key.
const prodClass = require('./models/product');
const stripe = require('stripe')('sk_test_51MbyXWAXcHqp4mKL8Kv7HpkftPZJTBafppSgFGwBOEWfmHaFhdjGgwyicikm4xSVXodTKjxB9CMgVJvizu3iwPnB00blSQ4qKF');
const express = require('express');
const cors = require('cors');
const app = express();

if ((process.env.MARSHA_API_ALLOWED_ORIGINS || "DEVELOPMENT") === "DEVELOPMENT") {
  app.use(cors());
}
app.use(express.json());

const PORT_NUMBER = process.env.API_PORT || 8080;

app.get('/', (req, res) => {
  const routes = [
    { method: 'GET', path: '/heart-beat' },
    { method: 'GET', path: '/products/:id?' },
    { method: 'POST', path: '/create-checkout-session', payload: JSON.stringify(), returns: JSON.stringify([new prodClass.Product()]) }

  ]
  res.json(routes);
})
app.get('/heart-beat', (req, res) => {
  res.status(200).send(new Date().toISOString());
});

app.get('/products/:id?', async (req, res) => {
  const active = req.query.activeOnly || true;
  const limit = req.query.limit || 10;
  const prodId = req.params.id || false;

  let _prods = [];
  if (!prodId) {
    _prods = await stripe.products.list(
      { limit: limit, active: active, expand: ['data.default_price'] },);
  }
  else {
    _prods = { data: [await stripe.products.retrieve(prodId)] };
  }
  const products = (_prods.data || [])
    .map((v, idx, ar) =>
      new prodClass.Product(v.id,
        v.name,
        v.default_price?.id,
        v.description,
        (v.default_price.unit_amount || 0) / 100,
        0,
        (v.images || [])[0],
        v.default_price.type,
        v.metadata)
    );

  res.json(products);
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
  const stripeSession = await stripe.checkout.sessions.create(stripePayment);

  res.json({ url: stripeSession.url });
});

app.listen(PORT_NUMBER, () => console.log(`Running on port ${PORT_NUMBER}`));