"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";

const Header = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const fetchadmin = async () => {
    const res = await fetch(
      "https://shreefitness-backend.onrender.com/api/admin/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    console.log(data["FLAG"]);
    if (data["FLAG"] === "YES") {
      setIsAdmin(true);
    }
  };
  useEffect(() => {
    fetchadmin();
  }, []);

  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      <img src="/LOGO.jpg" alt="Logo" className="h-18 w-18" />

      <div className="flex m-auto items-center space-x-4">
        <ul className="flex font-bold space-x-20">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/program">Program & Pricing</Link>
          </li>
          {/* <li>
            <Link href="/pricing">Pricing</Link>
          </li> */}
          <li>
            <Link href="/about">About</Link>
          </li>
          <SignedIn>
            <li>
              {/* <img
                src="/history.png"
                width="50px"
                height="50px"
                alt="History"
              /> */}
              <Link
                className="bg-[#9acc35] text-black px-4 py-2 rounded"
                href="/userplans"
              >
                History
              </Link>
            </li>
          </SignedIn>
        </ul>
      </div>
      <div>
        <SignedOut>
          <button
            onClick={() => router.forward("/sign-in")}
            className="border border-white text-white px-4 py-2 rounded-xl mr-2"
          >
            Signup
          </button>
          {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-xl">
            Register
          </button> */}
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row ">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="mr-4 font-bold text-lg bg-red-500 px-4 py-2 text-black  rounded"
              >
                Admin
              </button>
            )}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "48px",
                    height: "48px",
                  },
                },
              }}
            />{" "}
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
