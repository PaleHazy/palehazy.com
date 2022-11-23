import { getDatabaseUser } from '@/lib-api/db/getUser';
import stripe, { createStripeCustomer } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
export default handler.post(async (req, res) => {
    const token = await getToken({ req, secret: process.env.SECRET });
    if (!token?.email) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = await getDatabaseUser({
            email: token.email,
        });
        const priceId = JSON.parse(req.body).priceId;
        const stripeUserId = user?.stripeId;

        console.log('stripeUserId', stripeUserId);
        console.log('priceId', priceId);
        if (!stripeUserId) {
            try {
                const customer = await createStripeCustomer({
                    email: user?.email,
                    
                })
                const [subscriptionId, clientSecret] = await createSubscription(customer.id, priceId)
                
                console.log(customer)
                return res.send({
                    subscriptionId,
                    clientSecret,
                });
            } catch (e) {
                console.error(e);

                throw new Error("failed creating a stripe customer")
            }

        } else {


            const [subscriptionId, clientSecret] = await createSubscription(stripeUserId, priceId)
            return res.send({
                subscriptionId,
                clientSecret,
            });
        }
    } catch (error) {
        console.log(error);
    }
    res.send('fin');
});


async function createSubscription(stripeUserId: string, priceId: string) {
    const subscription = await stripe.subscriptions.create({
        customer: stripeUserId,
        items: [
            {
                price: priceId,
            },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
    });

    const { latest_invoice } = subscription;

    if (!latest_invoice || typeof latest_invoice === 'string') {
    } else {
        const { payment_intent } = latest_invoice;
        if (!payment_intent || typeof payment_intent === 'string') {
        } else {
            const { client_secret } = payment_intent;

            return [subscription.id, client_secret]
        }
    }

    return [undefined, undefined]
}