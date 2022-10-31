import stripe from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
export default handler.get(async (req, res) => {
    try {
        const prices = await stripe.prices.list({

            product: 'prod_MhtVMbrMFBGCnO',
        });
        console.log('prices', prices)
        res.send({
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            prices: prices.data,
        });
    } catch (error) {
        console.log(error);
    }
});
