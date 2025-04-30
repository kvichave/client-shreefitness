"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaDumbbell } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";
import { MdOutlineDiscount } from "react-icons/md";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/clerk-react";

const API_BASE = "https://shreefitness-backend.onrender.com/api";

const Order = () => {
  const { id: planId } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [plan, setPlan] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [noPlan, setNoPlan] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Check if plan is already active
        const activeRes = await fetch(`${API_BASE}/is_active_plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ planid: planId }),
        });
        const activeData = await activeRes.json();
        if (activeData.FLAG === "YES_PLAN") {
          setNoPlan(true);
          setTimeout(() => router.push("/userplans"), 3000);
          return;
        }

        // Fetch plan and user details
        const planRes = await fetch(`${API_BASE}/get_subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ planid: planId }),
        });
        const { subscription, user_details } = await planRes.json();
        setPlan(subscription);
        setUserDetails(user_details);
        setTotal(subscription.price);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();

    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);
  }, [planId, router, user]);

  const handleApplyCoupon = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get_coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ coupon, planid: planId }),
      });
      const data = await res.json();

      switch (data.FLAG) {
        case "NO_COUPON":
          alert("Invalid coupon code");
          break;
        case "NON_APPLICABLE":
          alert("Coupon not applicable for this plan");
          break;
        case "APPLICABLE":
          alert("Coupon applied successfully");
          const discountAmount = (data.coupon / 100) * plan.price;
          setDiscount(discountAmount);
          setTotal(plan.price - discountAmount);
          break;
        default:
          console.warn("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  }, [coupon, plan.price, planId]);

  const handlePayment = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/createRazororder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: planId, totalPrice: total }),
      });
      const { razor_obj } = await res.json();

      const options = {
        key: "rzp_test_0fJFxZHQ0pt557",
        amount: total * 100, // Razorpay expects paise
        currency: razor_obj.currency,
        name: "Your Brand",
        description: "Gym Subscription",
        order_id: razor_obj.id,
        handler: async (response) => {
          const verifyRes = await fetch(
            `${API_BASE}/verify_and_store_payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                plan,
                coupon,
                totalPrice: total,
                discount,
                ...response,
              }),
            }
          );
          const verifyData = await verifyRes.json();

          if (verifyData.status === "success") {
            alert("✅ Payment successful!");
            const receiptUrl = verifyData.link; // Replace with your actual URL
            const link = document.createElement("a");
            link.href = receiptUrl;
            link.download = "receipt.pdf"; // Optional: specify default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            router.push("/userplans");
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  }, [planId, plan, coupon, total, discount, router]);

  if (!user) return <SignIn />;

  if (noPlan) {
    return (
      <SignedIn>
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="/muscle.png"
            alt="Plan already exists"
            className="w-24 h-24 mb-4"
          />
          <h1 className="text-4xl text-white">
            Plan already exists. Redirecting...
          </h1>
        </div>
      </SignedIn>
    );
  }

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
          <div className="mb-8 text-center">
            <FaDumbbell className="text-4xl text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              Gym Subscription Checkout
            </h2>
            <p className="text-gray-500 text-sm">
              Secure your fitness journey today!
            </p>
          </div>

          <div className="space-y-5 text-gray-700 text-sm">
            <InfoRow
              icon={<BsPersonFill />}
              label="Name:"
              value={userDetails.name}
            />
            <InfoRow
              icon={<IoMdCalendar />}
              label="Plan:"
              value={`${plan.planName} - ${plan.duration}`}
            />
            <InfoRow label="Start Date:" value={plan.start_date} />
            <InfoRow label="Expiry Date:" value={plan.end_date} />

            {/* Coupon Section */}
            <div className="flex items-center gap-2 mt-4">
              <MdOutlineDiscount className="text-xl text-green-500" />
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 text-sm mt-4 space-y-2">
              <BreakdownRow label="Plan Price" value={`₹${plan.price}`} />
              <BreakdownRow
                label="Discount"
                value={`-₹${discount}`}
                highlight
              />
              <div className="flex justify-between font-semibold text-gray-900 text-base border-t pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </SignedIn>
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {icon}
      {label}
    </div>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const BreakdownRow = ({ label, value, highlight = false }) => (
  <div className={`flex justify-between ${highlight ? "text-green-700" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default Order;
