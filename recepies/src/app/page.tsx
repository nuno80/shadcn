import type { NextPage } from "next";
import Head from "next/head";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/NavigationComponent";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Your Landing Page Title</title>
        <meta name="description" content="Your landing page description" />
        <meta property="og:title" content="Your Landing Page Title" />
        <meta
          property="og:description"
          content="Your landing page description"
        />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <Hero />
        <Benefits />
        <Testimonials />
        <HowItWorks />
      </main>
    </>
  );
};

export default Home;