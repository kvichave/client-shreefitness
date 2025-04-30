"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PricingSection = () => {
  const [plans, setPlans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://shreefitness-backend.onrender.com/api/plans",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data)));
        setPlans(JSON.parse(JSON.stringify(response.data)));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="py-16 bg-black ">
      <div className="pt-5 bg-black" id="pricing">
        <div className="mx-auto pb-20 pt-4 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-base font-semibold leading-7 text-[#9acc35]">
              Pricing
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              "Transparent Pricing, Endless Possibilities. Choose Your Plan,
              Transform Your Future."
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
            Choose the plan that works best
          </p>
          <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* <!-- First Product --> */}

            {plans.map((plan) => {
              let parsedDescription;
              try {
                parsedDescription = JSON.parse(plan.description);
              } catch (error) {
                console.error("Error parsing description:", error);
                parsedDescription = ["Invalid description"];
              }
              return (
                <div className="ring-white/30 hover:bg-white/10 ring-1  hover:ring-2 hover:ring-[#9acc35] rounded-3xl p-8 xl:p-10">
                  <div className="flex items-center justify-between gap-x-4">
                    <h2
                      id="product1"
                      className="text-lg font-semibold leading-8 text-[#9acc35]"
                    >
                      {plan.planName}
                    </h2>
                  </div>

                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {plan.price} / {plan.duration}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-300"></span>
                  </p>
                  <button
                    // onClick={() => router.push(`/order/${plan.id}`)}
                    onClick={() => router.push(`/order/${plan.id}`)}
                    aria-describedby="product1"
                    className="bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Order Now
                  </button>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
                  >
                    {parsedDescription.map((item, index) => (
                      <li className="flex gap-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-6 w-5 flex-none text-white"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        {item}
                      </li>
                    ))}
                    {/* <li className="flex gap-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-white"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Cardio Included
                    </li> */}
                  </ul>
                </div>
              );
            })}

            {/* <!-- Second Product --> */}
            {/* <div className=" ring-white/30 hover:bg-white/10 ring-1  hover:ring-2 hover:ring-indigo-500 rounded-3xl p-8 xl:p-10">
              <div className="flex items-baseline justify-between gap-x-4">
                <h2
                  id="product2"
                  className="text-lg font-semibold leading-8 text-white"
                >
                  Half Yearly Plan
                </h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                The most popular choice. Product details for Product Type 2
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  ₹ 6,000 / 6 months
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-300"></span>
              </p>
              <a
                href="/order"
                aria-describedby="product2"
                className="bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Order Now
              </a>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Crossfit Included
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Cardio Included
                </li>
                {/* <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Fast delivery
                // </li> */}
            {/* </ul> */}
            {/* </div> */}

            {/* <!-- Third Product --> */}
            {/* <div className="ring-white/30 hover:bg-white/10 ring-1  hover:ring-2 hover:ring-indigo-500 rounded-3xl p-8 xl:p-10">
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  id="product3"
                  className="text-lg font-semibold leading-8 text-white"
                >
                  Yearly Plan
                </h2>
                <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                  Most popular
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Product details for Product Type 3
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  ₹ 10,000 / year
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-300"></span>
              </p>
              <a
                href="/order"
                aria-describedby="product3"
                className="bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Order Now
              </a>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Cardio Included
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Crossfit Included
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  1 month personal training
                </li>
              </ul>
            </div> */}
            {/* fourth card */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
