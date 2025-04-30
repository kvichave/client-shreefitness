"use client";
import React, { useState, useEffect } from "react";
import Transactions from "./transactions";
import Plans from "./plans";
import Coupons from "./coupons";
import Clerks from "./users";
import { m } from "framer-motion";
import { useRouter } from "next/navigation";

function Admin() {
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState("plans");
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
    if (data["FLAG"] == "NO") {
      router.push("/");
    } else {
      setIsAdmin(true);
    }
  };
  useEffect(() => {
    fetchadmin();
  }, []);
  const renderComponent = () => {
    switch (activeComponent) {
      case "plans":
        return <Plans />;
      case "coupons":
        return <Coupons />;
      case "users":
        return <Clerks />;
      case "transactions":
        return <Transactions />;
      default:
        return <Plans />;
    }
  };

  return (
    <>
      {isAdmin == true ? (
        <>
          <div className="flex h-screen mp-10 bg-black">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-black">
              <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4 bg-black">
                  <button
                    onClick={() => setActiveComponent("plans")}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-100 hover:text-black hover:bg-[#9acc35]"
                  >
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    Plans
                  </button>

                  <button
                    onClick={() => setActiveComponent("coupons")}
                    className="flex items-center w-full text-left px-4 py-2 mt-2 text-gray-100 hover:text-black hover:bg-[#9acc35]"
                  >
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                      />
                    </svg>{" "}
                    &nbsp; Coupons
                  </button>

                  <button
                    onClick={() => setActiveComponent("users")}
                    className="flex items-center w-full text-left px-4 py-2 mt-2 text-gray-100 hover:text-black hover:bg-[#9acc35]"
                  >
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                    &nbsp; Users
                  </button>

                  <button
                    onClick={() => setActiveComponent("transactions")}
                    className="flex items-center w-full text-left px-4 py-2 mt-2 text-gray-100 hover:text-black hover:bg-[#9acc35]"
                  >
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                      />
                    </svg>
                    &nbsp; Transactions
                  </button>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col mr-10 rounded-2xl flex-1 bg-black overflow-y-auto">
              <div className="p-4">{renderComponent()}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-screen bg-black text-center text-white">
          NOT Authorized
        </div>
      )}
    </>
  );
}

export default Admin;
