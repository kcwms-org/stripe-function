// This is your test secret API key.
const stripeCheckout =require('./packages/stripe-checkout/create-checkout-session');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT_NUMBER = process.env.API_PORT
app.get('/heart-beat', async (req,res)=>{
  res.status(200).send(new Date().toISOString());
});

app.post('/create-checkout-session', async (req, res) => {
  
    const payment = req.body;
    const session = await stripeCheckout.getStripeCheckoutUrl({
    line_items: [
      {      
        price: payment.productId,
        quantity: payment.quantity,
      },
    ],
    mode: 'payment',
    success_url: `${payment.domain}${payment.successRoute}`,
    cancel_url: `${payment.domain}${payment.failRoute}`,
  });

  res.json({url: session.url});
});

app.listen(PORT_NUMBER, () => console.log(`Running on port ${PORT_NUMBER}`));