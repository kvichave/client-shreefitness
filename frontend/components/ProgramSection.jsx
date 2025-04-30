"use client";

import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full bg-black py-20">
      <h2 className="max-w-7xl text-center pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Explore The Benifits.
      </h2>
      <div className="max-w-[75rem] mx-auto mt-8">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

const DummyContent = ({ category }) => {
  // Define gym-specific content based on the category
  const getContent = () => {
    switch (category) {
      case "Cardio Strength":
        return (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Boost your endurance and stamina with our cardio programs.
              </span>{" "}
              From high-intensity interval training (HIIT) to steady-state runs,
              we’ve got everything you need to elevate your heart health.
            </p>
            <img
              src="https://images.pexels.com/photos/6388530/pexels-photo-6388530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={`${category} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 mt-8 rounded-xl h-full w-full mx-auto object-contain"
            />
          </>
        );
      case "Fat Loss":
        return (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Shed those extra pounds and sculpt your dream physique.
              </span>{" "}
              Our fat loss programs combine strength training, cardio, and
              nutrition guidance to help you achieve your goals faster.
            </p>
            <img
              src="https://images.pexels.com/photos/7991940/pexels-photo-7991940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={`${category} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 mt-8 rounded-xl h-full w-full mx-auto object-contain"
            />
          </>
        );
      case "Muscle Gain":
        return (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Build lean muscle and improve your overall strength.
              </span>{" "}
              With personalized workout plans and expert coaching, we’ll help
              you maximize your gains.
            </p>
            <img
              src="https://images.pexels.com/photos/14623671/pexels-photo-14623671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={`${category} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 mt-8 rounded-xl h-full w-full mx-auto object-contain"
            />
          </>
        );
      case "Nutrition":
        return (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Fuel your body with the right nutrients for peak performance.
              </span>{" "}
              Our nutritionists will guide you through meal planning and
              supplementation tailored to your fitness goals.
            </p>
            <img
              src="https://images.pexels.com/photos/6475113/pexels-photo-6475113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={`${category} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 mt-8 rounded-xl h-full w-full mx-auto object-contain"
            />
          </>
        );
      case "Boxing":
        return (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Unleash your inner fighter with our boxing classes.
              </span>{" "}
              Learn the art of boxing while improving your agility,
              coordination, and mental toughness.
            </p>
            <img
              src="https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={`${category} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 mt-8 rounded-xl h-full w-full mx-auto object-contain"
            />
          </>
        );
      default:
        return (
          <>
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Stay fit and healthy with our expert-guided gym programs.
              </span>{" "}
              Whether you’re a beginner or a seasoned athlete, we have something
              for everyone.
            </p>
            <img
              src="https://images.pexels.com/photos/6388530/pexels-photo-6388530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={`${category} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 mt-8 rounded-xl h-full w-full mx-auto object-contain"
            />
          </>
        );
    }
  };

  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            {getContent()}
          </div>
        );
      })}
    </>
  );
};
const data = [
  {
    category: "Cardio Strength",
    title: "Boost Your Stamina, Power Your Fitness Journey.",
    src: "https://images.pexels.com/photos/6388974/pexels-photo-6388974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: <DummyContent category="Cardio Strength" />,
  },
  {
    category: "Fat Loss",
    title: "Shed the Weight, Sculpt Your Best Self.",
    src: "https://images.pexels.com/photos/6551065/pexels-photo-6551065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: <DummyContent category="Fat Loss" />,
  },
  {
    category: "Muscle Gain",
    title: "Build Strength, Define Your Muscles.",
    src: "https://images.pexels.com/photos/4164849/pexels-photo-4164849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: <DummyContent category="Muscle Gain" />,
  },
  {
    category: "Nutrition",
    title: "Fuel Your Body, Energize Your Goals.",
    src: "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: <DummyContent category="Nutrition" />,
  },
  {
    category: "Boxing",
    title: "Unleash Your Inner Fighter, Master the Art of Boxing.",
    src: "https://images.pexels.com/photos/290416/pexels-photo-290416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    content: <DummyContent category="Boxing" />,
  },
];
// {
//   category: "Hiring",
//   title: "Hiring for a Staff Software Engineer",
//   src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   content: <DummyContent />,
// },
// ];
