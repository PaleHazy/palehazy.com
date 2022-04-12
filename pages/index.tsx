import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Canvas from '@/components/Canvas/Canvas';
import { ColorProvider } from 'contexts/Color';
const Home: NextPage = (props: any) => {
    const { data, status } = useSession();
    const router = useRouter();
    const canvasRef = useRef();
    useEffect(() => {}, []);
    return (
        <div className={styles.container}>
            <Head>
                <title>palehazy</title>
                <meta name="description" content="Javascript React Professional" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <section className={styles.left}>
                    <ColorProvider>
                    <Canvas />
                    <div className={styles.colorPicker}></div>
                    </ColorProvider>
                </section>

                <section className={styles.right}>
                    <div className={styles.grid}>
                        <button
                            className={styles.buttonPrimary}
                            onClick={(e) => {
                                e.preventDefault();
                                signIn();
                            }}
                        >
                            Sign in
                        </button>
                        {data ? (
                            <h1>Welcome {data.user?.email}</h1>
                        ) : (
                            <h1>Welcome Stranger</h1>
                        )}
                        {data && (
                            <button onClick={() => signOut()}>Sign Out</button>
                        )}
                        <button
                            onClick={() => {
                                router.push('/donate');
                            }}
                        >
                            Donate
                        </button>
                        <h3>Too soon ? sorry..</h3>
                        <h3>I am Austin Palazzesi, I like to go by palehazy</h3>
                        <h3>
                            Take a look at some websites I made for some people
                        </h3>
                        
                        <a href='CGPresale/index.html' target="_blank">ChainGuard Presale</a>
                        <a href='EELanding/index.html' target="_blank">EagleEye Landing</a>
                        <a href='EEDapp/index.html' target="_blank">EagleEye Dapp</a>
                        <a href='https://chainguard.online' target="_blank" rel="noreferrer">ChainGuard Dapp</a>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>Footer Yee Haw</p>
            </footer>
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
export default Home;
