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
    const router = useRouter();
    const q = router.query;

    const { data, status } = useSession();
    const [prices, setPrices] = useState<any[]>([]);
    const [name, setName] = useState('Jenny Rosen');
    const [succesful, setSuccesful] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const elements = useElements();
    const stripe = useStripe();

    useEffect(() => {
        console.log('subscriptionId', router.query.subscriptionId);
    }, [router.query.subscriptionId]);

    useEffect(() => {
        if (succesful === true) {
            setTimeout(() => {
                setSuccesful(false);
            }, 10000);
        }
    }, [succesful]);

     // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if(!cardElement) {
      return;
    }
    // Use card Element to tokenize payment details
    let { error, paymentIntent } = await stripe.confirmCardPayment(q.clientSecret as string, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name,
        }
      }
    });

    if(error) {
      // show error and collect new card details.
      // setMessage(error.message);
      return;
    }

    if(paymentIntent && paymentIntent.status === 'succeeded') {
      router.push({
        pathname: '/',
      })
    }
  }


    return <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <CardElement />

        <button>
          Subscribe
        </button>

        {/* <div>{messages}</div> */}
      </form>
    </div>;
};

export async function getServerSideProps(ctx: any) {
    console.log('checkout gssp', ctx.query);
    return {
        props: {
            session: await getSession(ctx),
        },
    };
}
export default Donate;
