// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MbyXWAXcHqp4mKL8Kv7HpkftPZJTBafppSgFGwBOEWfmHaFhdjGgwyicikm4xSVXodTKjxB9CMgVJvizu3iwPnB00blSQ4qKF');

async function main(payment) {
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

    const session = await stripe.checkout.sessions.create(stripePayment);

    return session.url;
};

exports.getStripeCheckoutUrl = main;