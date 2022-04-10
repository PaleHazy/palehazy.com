import nc from 'next-connect';
import { all } from 'lib-api/middlewares';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { formatAmountForStripe } from '@/lib/stripe/helpers';
import { PaymentMethod } from '@stripe/stripe-js';
import { createStripeCustomer } from '@/lib/stripe';
import { createPaymentIntent } from '@/lib/stripe/customer';
import log from '@logger'
const CURRENCY = 'usd';
const handler = nc<NextApiRequest, NextApiResponse>();
export default handler.use(all).post(async (req, res) => {
    try {
        const session = await getSession({ req });
        if (!session) {
            res.send(
                'super mega unauthorized bromigo, try me see what happens'
            );
        } else {
            const body = JSON.parse(req.body);
            const amount: number = formatAmountForStripe(body.amount, CURRENCY);
            log(amount);
            log(formatAmountForStripe(amount, CURRENCY));
            const EMAIL = session.user?.email!;
            // const mongo_user = //await getDatabaseUser({ email: EMAIL });
            // if (mongo_user?.stripeId) {
            if ("") {
                // create a payment intent with the id of the customer
            } else {
                // create a new stripe customer and then set up a new payment intent with the id that was just generated
                const stripeCustomer = await createStripeCustomer();
                const paymentMethod: PaymentMethod = body.paymentMethod;
                const paymentIntent = await createPaymentIntent({
                    amount,
                    currency: 'usd',
                    
                    customer: stripeCustomer.id,
                    // payment_method: paymentMethod.id,
                    receipt_email: EMAIL,
                });
                return res.json({sec: paymentIntent.client_secret, id: paymentIntent.id})
                // const intent = await stripe.paymentIntents.create({
                //     amount,
                //     currency: CURRENCY,
                //     payment_method: paymentMethod.id,
                //     receipt_email: EMAIL,
                //     customer: stripeCustomer.id,
                // });
            }
            //   const params: Stripe.Checkout.SessionCreateParams = {
            //     submit_type: 'donate',
            //     payment_method_types: ['card'],
            //     customer: stripe_customer?.id,
            //     line_items: [
            //       {
            //         name: 'Custom amount donation',
            //         amount,
            //         currency: CURRENCY,
            //         quantity: 1,
            //       },
            //     ],

            //     success_url: 'http://localhost:3000/payment_session',
            //     cancel_url: 'http://localhost:3000',
            //   };
            //   const checkoutSession: Stripe.Checkout.Session =
            //     await stripe.checkout.sessions.create(params);

            //       // when to check if customer or not ?
            //       // create customer ?

            //   res.json(checkoutSession);
            res.status(505).send('Something failed')
        }
    } catch (error) {
        log(error);
        res.status(401).send((error as Error).message);
    }
});
