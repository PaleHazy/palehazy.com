import type Stripe from 'stripe';
import stripe from '@/lib/stripe';

export async function getStripeCustomer(
    stripeCustomerId: string
): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    const stripe_customer = await stripe.customers.retrieve(stripeCustomerId);

    return stripe_customer;
}

export async function createStripeCustomer(
    createCustomerParams?: Stripe.CustomerCreateParams
) {
    const stripe_customer = await stripe.customers.create(createCustomerParams);

    return stripe_customer;
}

type PaymentIntentParams = Stripe.PaymentIntentCreateParams
export async function createPaymentIntent(params :PaymentIntentParams) {

  const paymentIntent = await stripe.paymentIntents.create(params)
  return paymentIntent;
}