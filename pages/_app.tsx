import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const stripePromise = loadStripe(
        process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_PRODUCTION_KEY!
            : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
    return (
        <SessionProvider session={session}>
            <Elements stripe={stripePromise}>
                <Component {...pageProps} />
            </Elements>
        </SessionProvider>
    );
}

export default MyApp;
