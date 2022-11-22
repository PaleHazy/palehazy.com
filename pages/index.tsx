import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Canvas from '@/components/Canvas/Canvas';
import BGRain from '@/components/BGRain/BGRain';
import { ColorProvider, useColorProvider } from 'contexts/Color';
import { Project, ProjectsContainer } from '@/components/Projects/Project';
import { TechIcon, TechStack } from '@/components/Techs/Techs';
const Home: NextPage = (props: any) => {
    const { data, status } = useSession();
    const router = useRouter();
    const canvasRef = useRef();

    useEffect(() => {}, []);
    return (
        <div className={styles.container}>
            <Head>
                <title>palehazy</title>
                <meta
                    name="description"
                    content="Javascript React Professional"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <section className={styles.hero} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }} id="hero">
                    
                    <div style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",

                    }}>     
                    <BGRain />               
                    <Canvas/>
                    </div>
                </section>
                <section id="oldprojects">
                    <h2>Past Projects</h2>
                    <ProjectsContainer>
                        <Project
                            name="ChainGuard Presale"
                            url="CGPresale/index.html"
                            description="A presale webpage, simple and mobile friendly."
                        />
                        <Project
                            name="EagleEye Landing"
                            url="EELanding/index.html"
                            description="A landing page for a startup."
                        />
                        <Project
                            name="EagleEye Dapp"
                            url="EEDapp/index.html"
                            description="A dapp (decentralized application)"
                        />

                        <Project
                            name="ChainGuard Dapp"
                            url="https://chainguard.online"
                            description="A home page with also a dapp (decentralized application), with interactable 3d coin"
                        />
                    </ProjectsContainer>
                </section>
                <section id="tech stack">
                    <h2>Tech stack</h2>
                    <TechStack>
                        <TechIcon
                            icon="/images/file_type_html.svg"
                            name="HTML"
                        />
                        <TechIcon
                            icon="/images/file_type_js.svg"
                            name="JavaScript"
                        />
                        <TechIcon icon="/images/file_type_css.svg" name="CSS" />
                        <TechIcon
                            icon="/images/file_type_scss.svg"
                            name="SCSS"
                        />
                        <TechIcon
                            icon="/images/file_type_node.svg"
                            name="NodeJs"
                        />
                        <TechIcon
                            icon="/images/file_type_reactts.svg"
                            name="React"
                        />
                        <TechIcon
                            icon="/images/file_type_next.svg"
                            name="NextJs"
                        />
                    </TechStack>
                </section>
                <section className={styles.canvas} id="canvas">
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
                    <h3>Take a look at some websites I made for some people</h3>
                    <h3>ALL sites here are mobile responsive</h3>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>Footer Yee Haw</p>
            </footer>
        </div>
    );
};
const ColorChoose = () => {
    const [s, d] = useColorProvider();
    return (
        <div className={styles.colorPicker}>
            <button
                onClick={() => {
                    d({ type: 'SET_FILTER', payload: 'blue' });
                }}
            >
                Change Color
            </button>
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
