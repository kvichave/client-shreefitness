"use client";
import ReactDOMServer from "react-dom/server";

import React from "react";
import { FaDumbbell, FaCheckCircle } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";

const GymReceipt = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaDumbbell className="text-3xl text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Gym Membership</h2>
        </div>
        <FaCheckCircle className="text-green-500 text-3xl" title="Paid" />
      </div>

      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BsPersonFill /> Name:
          </span>
          <span className="font-medium text-gray-900">Rahul Sharma</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <IoMdCalendar /> Plan:
          </span>
          <span className="font-medium text-gray-900">Gold – 3 Months</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Order ID:</span>
          <span className="font-mono text-gray-700">#PAY12345678</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Payment ID:</span>
          <span className="font-mono text-gray-700">#PAY12345678</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Date:</span>
          <span>April 21, 2025</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Expiry:</span>
          <span>April 21, 2025</span>
        </div>
        <div className="flex text-green-700 items-center justify-between">
          <span>Coupon discount</span>
          <span>-0</span>
        </div>
        <div className="flex text-green-700 items-center justify-between">
          <span>Discount</span>
          <span>-0</span>
        </div>
        <div className="flex items-center justify-between border-t pt-4 font-semibold text-gray-800">
          <span>Total Paid:</span>
          <span>₹1,499.00</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">Thank you for your purchase! 🏋️‍♂️</p>
      </div>
    </div>
  );
};
// const html = ReactDhttps://127.4.32.5:5000 OMServer.renderToStaticMarkup(<GymReceipt />);
// console.log(html);

export default GymReceipt;
