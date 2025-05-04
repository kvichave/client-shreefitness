"use client";
import React from "react";
import Head from "next/head";
import HeroSection from "../components/HeroSection";
import { AppleCardsCarouselDemo } from "../components/ProgramSection";
import BenefitsSection from "../components/BenefitsSection";
import PricingSection from "../components/PricingSection";
import { AnimatedTestimonialsDemo } from "../components/TestimonialsSection";
import Footer from "../components/Footer";
import { env } from 'next-runtime-env';

const Home = () => {
  
  console.log("api :   ",env('NEXT_PUBLIC_API_URL'))
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
