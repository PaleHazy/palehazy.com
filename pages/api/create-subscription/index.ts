import { getDatabaseUser } from '@/lib-api/db/getUser';
import stripe from '@/lib/stripe';
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
            // TODO: create a new stripe customer and assign the id in the database to the user
            throw new Error('No Stripe customer found');
        }

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

                res.send({
                    subscriptionId: subscription.id,
                    clientSecret: client_secret,
                });
            }
        }
        res.send('fin');
    } catch (error) {
        console.log(error);
    }
});
