import { getStripeCustomer, createStripeCustomer } from "@/lib/stripe/customer";
import { getDatabaseUser } from "../db/getUser";

export async function userStripeCustomerInit(userEmail: string) {
    try {

        const user = await getDatabaseUser({email: userEmail});
        if(user) {
            const stripeCustomerId = user.stripeId
            if(stripeCustomerId) {
                const stripeCustomer = await getStripeCustomer(stripeCustomerId);
                if(stripeCustomer) {
                    return stripeCustomer;
                } else throw new Error('No Stripe customer found')

            } else {
                // create a new customer and assign the id in the database to the user 
                const stripeCustomer = await createStripeCustomer({
                    email: userEmail,
                })
                if(stripeCustomer) {
                    
                }
            }
        } else {
            //TODO maybr ask to create a user ? 
            // can someone even reach this route if they are not signed in ? 
            //
            throw new Error('no database user found')
        }
    } catch(e) {
        console.error(e)
    }

}