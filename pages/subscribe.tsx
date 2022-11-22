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

const Donate: NextPage = (props: any) => {
    const { data, status } = useSession();
    const [prices, setPrices] = useState<any[]>([]);

    const [succesful, setSuccesful] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    useEffect(() => {
        const fetchPrices = async () => {
            const { prices } = await fetch('/api/prices').then((r) => r.json());
            setPrices(prices);
        };
        fetchPrices();
    }, []);
    useEffect(() => {
        if (succesful === true) {
            setTimeout(() => {
                setSuccesful(false);
            }, 10000);
        }
    }, [succesful]);
    return (
        <main 
            style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                padding: "0 20vw",
            }}
        >
            {prices.sort((a,b) => a.unit_amount < b.unit_amount ? -1 : 1).map((price) => {
                return (
                    
                        <SubscribeCard
                            key={price.id}
                            items={["by yo shit over here"]}
                            title={price.product.name}
                            amount={price.unit_amount / 100}
                            priceId={price.id}
                        />
                    
                );
            })}
        </main>
    );
};




export async function getServerSideProps(ctx: any) {
    return {
        props: {
            session: await getSession(ctx),
        },
    };
}
export default Donate;
