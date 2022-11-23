import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/subscribe.module.scss';
import { PropsWithChildren, useEffect, useState } from 'react';
import LoaderSVG from '../assets/fluid.svg';
import { useRouter } from 'next/router';
import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { SubscribeCard } from '@/components/SubscribeCard/SubscribeCard';
import { server } from '../constants';

const Donate: NextPage<{ prices: any[] }> = (props) => {
    const { data, status } = useSession();
    const [succesful, setSuccesful] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const router = useRouter();

    useEffect(() => {
        if (succesful === true) {
            setTimeout(() => {
                setSuccesful(false);
            }, 25000);
        }
    }, [succesful]);
    return (
        <main
            className={styles.page}
        >

            <h1>Subscribe to a plan that best fits your use case</h1>
            <div className={styles.cardContainer}>


                {props.prices.sort((a, b) => a.unit_amount < b.unit_amount ? -1 : 1).map((price) => {
                    console.log(price)
                    const items = (price?.metadata?.bullets ?? "").split(',')
                    const title = price?.metadata?.title

                    return (
                        <SubscribeCard
                            key={price.id}
                            items={items}
                            title={title}
                            amount={price.unit_amount / 100}
                            onSubscribe={
                                async () => {
                                    console.log('priceId', price.id);
                                    const res = await fetch('/api/create-subscription', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            priceId: price.id,
                                        }),
                                    });
                                    console.log("res", res)
                                    const { subscriptionId, clientSecret } = await res.json();
                                    console.log(subscriptionId, clientSecret);
                                    router.push({
                                        query: {
                                            subscriptionId,
                                            clientSecret,
                                        },
                                        pathname: '/checkout',
                                    });
                                }}
                        />

                    );
                })}
            </div>
        </main>
    );
};




export async function getServerSideProps(ctx: any) {
    const { prices } = await fetch(server + '/api/prices').then((r) => r.json());
    return {
        props: {
            prices,
        },
    };
}
export default Donate;
