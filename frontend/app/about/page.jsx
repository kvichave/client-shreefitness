"use client";
import React from "react";
import { Carousel } from "../../components/ui/carousel";
import { BackgroundGradient } from "../../components/ui/background-gradient";

function page() {
  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Explore Component",
      src: "/videos/v1.mp4",
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: "/videos/v2.mp4",
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: "/videos/v3.mp4",
    },
    // {
    //   title: "Desert Whispers",
    //   button: "Explore Component",
    //   src: "/videos/v4.mp4",
    // },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: "/videos/v5.mp4",
    },
    // {
    //   title: "Desert Whispers",
    //   button: "Explore Component",
    //   src: "/videos/v6.mp4",
    // },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: "/videos/v7.mp4",
    },
  ];
  const team = [
    {
      name: "John Doe",
      role: "Head Trainer",
      image:
        "https://img.freepik.com/premium-photo/fitness-clipboard-portrait-personal-trainer-gym-working-training-schedule-confidence-happy-male-athlete-writing-workout-exercise-plan-wellness-sports-center_590464-183414.jpg?w=900",
    },
    {
      name: "Jane Smith",
      role: "Nutritionist",
      image:
        "https://img.freepik.com/premium-photo/fitness-clipboard-portrait-personal-trainer-gym-working-training-schedule-confidence-happy-male-athlete-writing-workout-exercise-plan-wellness-sports-center_590464-183414.jpg?w=900",
    },
    {
      name: "Mike Johnson",
      role: "Yoga Instructor",
      image:
        "https://img.freepik.com/premium-photo/fitness-clipboard-portrait-personal-trainer-gym-working-training-schedule-confidence-happy-male-athlete-writing-workout-exercise-plan-wellness-sports-center_590464-183414.jpg?w=900",
    },
  ];
  return (
    <>
      <div className="relative my-12 flex w-full flex-col items-center sm:mt-24">
        <h1 className="mt-8 max-w-sm bg-gradient-to-br from-gray-500 via-white to-gray-500 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:max-w-4xl sm:text-6xl">
          Welcome to Shree Fitness Where Fitness Meets Passion
        </h1>
        <span className="mt-8 max-w-lg text-center text-xl leading-relaxed text-gray-300">
          At ShreeFitness, we’re more than just a gym – we’re a community
          dedicated to helping you become your strongest, healthiest, and
          happiest self. Whether you're a beginner or a seasoned athlete, our
          state-of-the-art facility, expert trainers, and supportive environment
          are here to guide you every step of the way.
        </span>
      </div>
      <div className="relative overflow-hidden w-full  h-full py-20">
        <Carousel slides={slideData} />
      </div>

      <div className="flex flex-col mb-20 items-center justify-center mt-12">
        <h1 className="mt-20 mb-10 max-w-sm bg-gradient-to-br from-gray-500 via-white to-gray-500 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:max-w-4xl sm:text-6xl">
          Our Team
        </h1>
        <span className="mt-8 mb-16 max-w-lg text-center text-xl leading-relaxed text-gray-300">
          Our expert team of trainers and coaches is dedicated to helping you
          unlock your full potential. Together, we inspire, push, and transform
          every step of your fitness journey.
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {team.map((member, index) => (
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
              <img
                src={member.image}
                alt="jordans"
                height="400"
                width="400"
                className="object-contain"
              />
              <p className="text-base text-center sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                {member.name}
              </p>

              {/* <p className="text-sm text-neutral-600 dark:text-neutral-400">
                The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
                February 17, 2024. Your best opportunity to get these right now
                is by entering raffles and waiting for the official releases.
              </p> */}
              <p className="text-sm bg-gray-200 dark:bg-zinc-800 rounded-full px-4 py-2 text-center text-neutral-600 dark:text-neutral-400">
                {member.role}
              </p>
            </BackgroundGradient>
          ))}
        </div>
      </div>
    </>
  );
}

export default page;
