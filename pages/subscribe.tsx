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
        <>
            {prices.map((price) => {
                return (
                    <div className={styles.container}>
                        <SubBox
                            body="by yo shit over here"
                            title={price.product.name}
                            amount={price.unit_amount / 100}
                            priceId={price.id}
                        />
                    </div>
                );
            })}
        </>
    );
};

interface SubBoxProps {
    title: string;
    icon?: string;
    body: string;
    amount: number;
    priceId: string;
}

function SubBox(props: SubBoxProps) {
    const router = useRouter();

    return (
        <div className={styles.subBox}>
            <SubBoxHeader>{props.title}</SubBoxHeader>

            <SubBoxIcon />

            <SubBoxBody>{props.body}</SubBoxBody>
            <h2>Price: {props.amount}</h2>
            <SubBoxFooter
                onSubscribe={async () => {
                    console.log('priceId', props.priceId);
                    const res = await fetch('/api/create-subscription', {
                        method: 'POST',
                        body: JSON.stringify({
                            priceId: props.priceId,
                        }),
                    });
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
        </div>
    );
}

function SubBoxHeader(props: PropsWithChildren<{}>) {
    return <h4>{props.children}</h4>;
}
function SubBoxIcon() {
    return <div></div>;
}
function SubBoxBody(props: PropsWithChildren<{}>) {
    return (
        <div>
            <p>{props.children}</p>
        </div>
    );
}

function SubBoxFooter(props: { onSubscribe: () => void }) {
    return (
        <div>
            <button onClick={props.onSubscribe}>Subscribe</button>
        </div>
    );
}
export async function getServerSideProps(ctx: any) {
    return {
        props: {
            session: await getSession(ctx),
        },
    };
}
export default Donate;
