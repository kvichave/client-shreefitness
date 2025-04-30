import React from "react";
import Head from "next/head";
import HeroSection from "../components/HeroSection";
import { AppleCardsCarouselDemo } from "../components/ProgramSection";
import BenefitsSection from "../components/BenefitsSection";
import PricingSection from "../components/PricingSection";
import { AnimatedTestimonialsDemo } from "../components/TestimonialsSection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Head>
        <title>Shree Fitness</title>
      </Head>
      <HeroSection />
      <AppleCardsCarouselDemo />
      {/* <BenefitsSection /> */}
      <PricingSection />
      <AnimatedTestimonialsDemo />
      {/* <Footer /> */}
    </>
  );
};

export default Home;
