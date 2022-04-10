import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/donate.module.scss';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import LoaderSVG from '../assets/fluid.svg';
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
    const [donationAmount, setDonationAmount] = useState(0);
    const [animation, animationToggle] = useState(true);
    const [succesful, setSuccesful] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    async function checkoutHandler() {
        setPaymentProcessing(true);
        if (elements && stripe) {
            const cardElement = elements.getElement(CardNumberElement);
            if (cardElement) {
                const { error, paymentMethod } =
                    await stripe.createPaymentMethod({
                        type: 'card',

                        // billing_details: {
                        //     email: '',
                        //     address: {
                        //         city: '',
                        //         country: '',
                        //         line1: '',
                        //         line2: '',
                        //         postal_code: '',
                        //         state: '',
                        //     },
                        //     name: '',
                        //     phone: '',
                        // },
                        card: cardElement,
                    });
                error && console.error(error);
                const response = await (
                    await fetch('/api/checkout_sessions', {
                        body: JSON.stringify({
                            amount: donationAmount,
                            paymentMethod,
                        }),
                        method: 'POST',
                    })
                ).json();
                const confirmResult = await stripe?.confirmCardPayment(
                    response.sec,
                    {
                        setup_future_usage: 'off_session',
                        receipt_email: data?.user?.email ?? '',
                        save_payment_method: true,
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                email: data?.user?.email ?? '',
                            },
                        },
                    },
                    {}
                );
                console.log(confirmResult);
                if (confirmResult.paymentIntent?.status === 'succeeded') {
                    //success caching!
                    setSuccesful(true);
                    console.log('SUCCESS');
                }
            }
        }
        setPaymentProcessing(false);
    }
    useEffect(() => {
        if (succesful === true) {
            setTimeout(() => {
                setSuccesful(false);
            }, 10000);
        }
    }, [succesful]);
    return (
        <div className={styles.container}>
            <Head>
                <title>Raffl</title>
                <meta name="description" content="Win Rare Cards in a Raffle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.card}>
                    <motion.div
                        className={styles.motionsCard}
                        animate={{
                            width: animation ? '100%' : '10%',
                        }}
                    >
                        <label>
                            Card Number:
                            <CardNumberElement
                                className={styles.sCard}
                                options={{
                                    showIcon: true,

                                    style: {
                                        base: {
                                            backgroundColor: 'white',
                                            fontSize: '25px',
                                            ':-webkit-autofill': {},
                                        },
                                    },
                                }}
                            />
                        </label>
                    </motion.div>
                    <motion.div
                        className={styles.motionexp}
                        animate={{
                            width: animation ? '100%' : '10%',
                        }}
                    >
                        <label>
                            Expiry:
                            <CardExpiryElement
                                className={styles.exp}
                                options={{
                                    style: {
                                        base: {
                                            backgroundColor: 'white',
                                            fontSize: '25px',
                                        },
                                    },
                                }}
                            />
                        </label>
                    </motion.div>
                    <motion.div
                        className={styles.motionsec}
                        animate={{
                            width: animation ? '100%' : '10%',
                        }}
                    >
                        <label>
                            CVC:
                            <CardCvcElement
                                className={styles.sec + ' base-input'}
                                options={{
                                    style: {
                                        base: {
                                            backgroundColor: 'white',
                                            fontSize: '25px',
                                        },
                                    },
                                }}
                            />
                        </label>
                    </motion.div>
                    <button onClick={checkoutHandler}>Donate</button>
                    <input
                    placeholder="donation amount "
                        pattern="[0-9]*"
                        type="number"
                        value={donationAmount}
                        onChange={(change) => {
                            console.log(change);
                            const amount = change.currentTarget.value
                            if(+amount >= 0) {
                                setDonationAmount(+amount)
                            }
                        }}
                    />
                    <button onClick={() => animationToggle(!animation)}>
                        Animate
                    </button>
                    {succesful && (
                        <h1 style={{ color: 'green' }}>PAYMENT SUCCESS</h1>
                    )}
                    {paymentProcessing && (
                        <h1 style={{ color: 'yellow' }}>PAYMENT PROCESSING</h1>
                    )}
                </div>
                <div></div>
                <div></div>
                {paymentProcessing && (
                    <LoaderSVG className={styles.processingSvg} />
                )}
            </main>
        </div>
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
