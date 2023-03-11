# proxy service for calling Stripe checkout
## Expectations
1. Environment Variables
    1. (OPTIONAL) API_PORT = the port number the internal website runs on. i.e.: the value passed to EXPOSE

## Docker
1. docker build . -t kevcoder/marsha-stripe-node-api
1. docker run -it --rm -p 7196:80 -d --name marsha-stripe-node-api kevcoder/marsha-stripe-node-api