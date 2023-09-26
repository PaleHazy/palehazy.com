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
const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative min-h-screen">
                <div className="absolute w-full h-full overflow-hidden blur-[1px]">
                    <Image
                        src="/images/palehazy_beautiful_sand_dunes_with_a_BLANK_background._the_sand_7e070fd8-d861-420c-ad70-7473dd865549.png"
                        alt="Hero"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                    />
                </div>
                <nav className="absolute top-0 right-0 m-4">
                    <ul className="flex space-x-4 text-white">
                        <li>
                            <a href="#home">Home</a>
                        </li>
                        <li>
                            <a href="#about">About</a>
                        </li>
                        <li>
                            <a href="#contact">Contact</a>
                        </li>
                    </ul>
                </nav>
                <div className="absolute flex flex-col items-center justify-center h-full w-full text-shadow">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl text-[#cbd3fa] font-bold">
                        PaleHazy Portfolio Tour
                    </h1>
                    <p className="text-xl sm:text-2xl md:text-3xl text-white mt-4">
                        Your Hero Subtitle
                    </p>
                </div>
            </div>
            <section className="bg-[#ec7d7d] py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <ProfileCard
                        imageUrl="https://source.unsplash.com/random"
                        name="Austin P is PaleHazy"
                        description={`I was originally born in Italy, I lived there for 13 years before moving to Texas. I am a full stack developer, devops and infrastructure admin. I have been seriosuly coding for 4 years straight. I have a passion for learning new things and I am always looking for new opportunities to grow. this site will showcase some of the skill sets I have acquired over the years. I am self taught but I do have a certification from a University of Texas bootcamp. I accredit it with giving me the contacts to understand the programmer workforce and how to navigate it. However the learning and my current skill level is due to my diligence studying day in and day out`}
                    />
                </div>
            </section>
            <section className="bg-gray-100 py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="">Frontend</h1>
                    <p>
                        My primary expertise lies in Frontend Development, where
                        I excel as an expert in both JavaScript and CSS. My
                        focus is on achieving pixel-perfect designs, while
                        ensuring optimal user experience and functionality. I
                        remain committed to following the best practices and
                        continuously strive to stay updated with the latest
                        open-source trends. Although being an entrepreneur and
                        having three children limits my availability to
                        contribute to open-source projects, I possess the
                        capability to do so, having re-written entire libraries
                        to cater to my clients' and my own requirements.
                    </p>

                    <h1>These are some frontend tecnologies I am an expert with, (everything typescript)</h1>
                    <ul>
                        <li>React</li>
                        <li>Next.js</li>

                        <li>React Three Fiber</li>
                    </ul>
                </div>
            </section>
            <section className="bg-gray-100 py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="">Backend</h1>
                </div>
            </section>
        </div>
    );
};

const ProfileCard = ({ imageUrl, name, description }: any) => {
    return (
        <div className="bg-white shadow-md rounded-md p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                    src={imageUrl}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                />
            </div>
            <h2 className="font-semibold text-2xl mb-2">{name}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const Card = ({ title, content }: any) => (
    <div className="bg-white shadow-md rounded-md p-4">
        <h3 className="font-semibold text-xl mb-4">{title}</h3>
        <p>{content}</p>
    </div>
);

export default LandingPage;
export async function getServerSideProps(ctx: any) {
    return {
        props: {
            session: await getSession(ctx),
        },
    };
}
