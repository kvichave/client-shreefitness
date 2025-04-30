"use client";
import React from "react";
import Link from "next/link";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="py-16 h-[30rem] flex flex-col md:flex-row items-center space-y-8 md:space-y-0 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url('/bg.jpg')` }}
      ></div>

      {/* Content Overlay */}
      <div className="w-full  justify-center m-auto z-10 md:w-1/2">
        <h1 className="text-6xl  text-center font-bold mb-4">
          Helps for your ideal body fitness
        </h1>
        <p className="mb-6 text-center text-lg">
          Motivate users with benefits and positive reinforcement, and offer
          modifications and progress tracking.
        </p>
        <SignedOut>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/program")}
              className="bg-transparent border border-white text-white px-4 py-2 rounded"
            >
              Start Training
            </button>
          </div>
        </SignedOut>
        {/* <SignedIn>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-transparent border border-white text-white px-4 py-2 rounded"
            >
              
            </button>
          </div>
        </SignedIn> */}
      </div>
    </section>
  );
};

export default HeroSection;
