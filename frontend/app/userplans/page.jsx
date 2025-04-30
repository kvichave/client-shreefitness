"use client";
import React, { useEffect, useState } from "react";

function page() {
  const [activePlans, setActivePlans] = useState([]);
  const [plansHistory, setPlansHistory] = useState([]);
  const [plandetails, setPlanDetails] = useState([]);
  function downloadreceipt(id) {
    const receiptUrl =
      "https://shreefitness-backend.onrender.com/download/receipt_" +
      id +
      ".pdf"; // Replace with your actual URL
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.download = "receipt.pdf"; // Optional: specify default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://shreefitness-backend.onrender.com/api/get_user_details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setActivePlans(data.active_plan);
      setPlanDetails(data.plandetails);
      setPlansHistory(data.history);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="bg-gray-800 my-20  rounded-3xl mx-8 py-10 ">
        <h1 className="text-3xl text-center mb-8 font-bold underline text-[#9acc35] pl-6">
          ACTIVE SUBSCRIPTIONS
        </h1>
        <div className="grid max-w-screen-xl grid-cols-1 gap-10 text-white pl-6 pr-4 sm:px-20 lg:grid-cols-2">
          {activePlans.map((plan, index) => {
            const description = JSON.parse(plan.description);

            return (
              <div
                key={index}
                className="w-full ml-10 grid grid-cols-1 gap-6 mt-10 rounded-2xl bg-gray-600 p-5 sm:p-10 lg:mt-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-lg text-[#9acc35] sm:relative md:bg-transparent md:text-4xl">
                  {index + 1}
                </div>

                <div className="col-span-2 grid grid-cols-1 gap-6 rounded-2xl md:grid-cols-2">
                  <div className="flex flex-row">
                    <h3 className="text-xl font-semibold">Name:</h3>
                    <p className="text-white mt-1 ml-2">{plan.planName}</p>
                    {/* <p className="text-gray-400 mt-1 ml-2">{plan.order_id}</p> */}
                  </div>

                  <div className="flex flex-row">
                    <h3 className="text-xl font-semibold">Duration:</h3>
                    <p className="text-white mt-1 ml-2">{plan.duration}</p>
                  </div>

                  <div className="flex flex-row">
                    <h3 className="text-xl font-semibold">Price Paid:</h3>
                    <p className="text-white mt-1 ml-2">{plan.price}</p>
                  </div>

                  <div className="flex flex-row">
                    <h3 className="text-xl font-semibold">Expiry Date:</h3>
                    <p className="text-white mt-1 ml-2">{plan.end}</p>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold">Description:</h3>
                    <div className="flex flex-col">
                      {description.map((desc, i) => (
                        <p key={i} className="text-white mt-1 ml-2">
                          • {desc}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex  py-6 flex-row">
                    <button
                      onClick={() => downloadreceipt(plan.order_id)}
                      className="text-xl px-2 rounded-lg bg-blue-600 font-semibold"
                    >
                      Receipt
                    </button>
                  </div>

                  {/* <div className="flex flex-row">
                    <h3 className="text-xl font-semibold">Order ID:</h3>
                    <p className="text-gray-400 mt-1 ml-2">{plan.order_id}</p>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table starts */}
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-700">
              <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
                Plan Name
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
                Duration
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
                Start
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
                End
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
                Status
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-white font-bold uppercase">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800">
            {plansHistory.map((plan, index) => {
              if (plan.status !== "ACTIVE") {
                return (
                  <tr key={index}>
                    <td className="py-4 px-6 border-t border-gray-700">
                      {plan.planName}
                    </td>
                    <td className="py-4 px-6 border-t border-gray-700 truncate">
                      {plan.duration}
                    </td>
                    <td className="py-4 px-6 border-t border-gray-700">
                      {plan.start}
                    </td>
                    <td className="py-4 px-6 border-t border-gray-700">
                      {plan.end}
                    </td>
                    <td className="py-4 px-6 border-t border-gray-700">
                      <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-t border-gray-700">
                      <button
                        onClick={() => downloadreceipt(plan.order_id)}
                        className="bg-blue-600 text-white py-1 px-2 rounded-full text-xs"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                );
              }
              return null;
            })}

            {/* <tr>
              <td className="py-4 px-6 border-b border-gray-200">Jane Doe</td>
              <td className="py-4 px-6 border-b border-gray-200 truncate">
                janedoe@gmail.com
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                555-555-5555
              </td><td className="py-4 px-6 border-b border-gray-200">
                555-555-5555
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                  Inactive
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b border-gray-200">Jane Doe</td>
              <td className="py-4 px-6 border-b border-gray-200 truncate">
                janedoe@gmail.com
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                555-555-5555
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                  Inactive
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-6 border-b border-gray-200">Jane Doe</td>
              <td className="py-4 px-6 border-b border-gray-200 truncate">
                janedoe@gmail.com
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                555-555-5555
              </td>
              <td className="py-4 px-6 border-b border-gray-200">
                <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                  Inactive
                </span>
              </td>
            </tr> */}
            {/* <!-- Add more rows here --> */}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default page;
