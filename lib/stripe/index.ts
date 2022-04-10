import Stripe from 'stripe';

const stripe = new Stripe(
    process.env.NODE_ENV === 'production'
        ? process.env.STRIPE_SECRET_PRODUCTION_KEY!
        : process.env.STRIPE_SECRET_KEY!,
    {
        apiVersion: '2020-08-27',
    }
);

export default stripe;
export { getStripeCustomer, createStripeCustomer } from './customer';
