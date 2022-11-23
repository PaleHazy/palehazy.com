import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import styles from './SubscribeCard.module.scss';

interface SubscribeCardProps {
    title: string;
    icon?: string;
    items: string[];
    amount: number;
    onSubscribe: () => void;
}

export function SubscribeCard(props: SubscribeCardProps) {
    const router = useRouter();

    return (
        <div className={styles.subscribeCard}>
            <SubscribeCardHeader>{props.title}</SubscribeCardHeader>
            <SubscribeCardIcon icon={props.icon} />
            <SubscribeCardBody items={props.items} />
            <SubscribeCardFooter
                amount={props.amount}
                onSubscribe={props.onSubscribe}
            />
        </div>
    );
}

function SubscribeCardHeader(props: PropsWithChildren<{}>) {
    return <h4>{props.children}</h4>;
}

function SubscribeCardIcon(props: Pick<SubscribeCardProps, 'icon'>) {
    if (props.icon) {
        return <img src={props.icon} alt="icon" />;
    }
    return null;
}

function SubscribeCardBody(props: Pick<SubscribeCardProps, 'items'>) {
    return (
        <ul>
            {props.items.map((item, i) => (
                <li key={"bullet" + i}>{item}</li>
            ))}
        </ul>
    );
}

function SubscribeCardFooter(
    props: Pick<SubscribeCardProps, 'amount'> & {
        onSubscribe: () => void;
    }
) {
    return (
      <div>
        <h2>${props.amount}</h2>
        <button
            onClick={(e) => {
              props.onSubscribe();
            }}
            >
            Subscribe
        </button>
      </div>
    );
}
