"use client";
import React, { useState, useEffect } from "react";
import { env } from "next-runtime-env";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const API_BASE = env("NEXT_PUBLIC_API_URL");

const ContactForm = () => {
  const [show, setShow] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchFlag = async () => {
      console.log("runnnnnniiingg::::::::::: ");
      try {
        const res = await fetch(`${API_BASE}/api/getcontact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          // body: JSON.stringify({ planid: planId }),
        });

        const flagData = await res.json();
        console.log("Flag data:", flagData);
        if (flagData.FLAG === "YES") {
          setShow(false);
        }
      } catch (error) {
        console.error("Error fetching contact flag:", error);
      }
    };

    fetchFlag();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);

    const sendContactData = async () => {
      const res = await fetch(`${API_BASE}/api/savecontact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Response from server:", data);
      if (data.FLAG == "YES") {
        setShow(false);
      } else {
        alert("Something went wrong");
      }
    };
    sendContactData();
  };

  if (!show) return null;

  return (
    <SignedIn>
      <div className="fixed z-50 bg-white/20 h-full w-full flex items-center justify-center">
        <div className="bg-white p-10 md:w-2/3 lg:w-1/2 mx-auto rounded">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-5">
              <label
                htmlFor="phone"
                className="w-20 inline-block text-right mr-4 text-gray-500"
              >
                Contact:
              </label>
              <input
                name="phone"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 text-black outline-none focus:border-green-400"
                required
              />
            </div>

            <div className="flex items-center mb-10">
              <label
                htmlFor="address"
                className="w-20 inline-block text-right mr-4 text-gray-500"
              >
                Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your Address"
                className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 text-black outline-none focus:border-green-400"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="py-3 px-8 bg-green-500 text-green-100 font-bold rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </SignedIn>
  );
};

export default ContactForm;
