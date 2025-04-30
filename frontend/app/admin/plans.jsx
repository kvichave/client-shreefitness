"use client";
import { useEffect, useState } from "react";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await fetch(
      "https://shreefitness-backend.onrender.com/admin/plans"
    );
    const data = await res.json();
    setPlans(data);
  };

  const savePlan = async () => {
    const payload = {
      ...plan,
      description: JSON.stringify(
        plan.description.split(",").map((d) => d.trim())
      ),
    };

    if (plan.id) {
      await fetch("https://shreefitness-backend.onrender.com/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("https://shreefitness-backend.onrender.com/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setPlan({});
    fetchPlans();
  };

  const deletePlan = async (id) => {
    await fetch(`https://shreefitness-backend.onrender.com/admin/plans/${id}`, {
      method: "DELETE",
    });
    fetchPlans();
  };

  const resetForm = () => {
    setPlan({});
  };

  return (
    <section className="bg-gray-50  dark:bg-black p-6">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Plans Management
        </h1>

        {/* Form */}
        <div className="mb-8">
          <input
            placeholder="Plan Name"
            value={plan.planName || ""}
            onChange={(e) => setPlan({ ...plan, planName: e.target.value })}
            className="block w-full p-2 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
          <input
            placeholder="Price"
            type="number"
            value={plan.price || ""}
            onChange={(e) =>
              setPlan({ ...plan, price: parseFloat(e.target.value) })
            }
            className="block w-full p-2 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
          <input
            placeholder="Duration"
            value={plan.duration || ""}
            onChange={(e) => setPlan({ ...plan, duration: e.target.value })}
            className="block w-full p-2 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
          <textarea
            placeholder="Description (comma separated)"
            value={
              Array.isArray(
                plan.description ? JSON.parse(plan.description) : ""
              )
                ? JSON.parse(plan.description).join(", ")
                : plan.description || ""
            }
            onChange={(e) => setPlan({ ...plan, description: e.target.value })}
            rows={4}
            className="block w-full p-2 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
          <input
            placeholder="Months"
            type="number"
            value={plan.months || ""}
            onChange={(e) =>
              setPlan({ ...plan, months: parseInt(e.target.value) })
            }
            className="block w-full p-2 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
          <div className="flex space-x-4">
            <button
              onClick={savePlan}
              className="text-black bg-[#9acc35] hover:bg-[#4e6e0e] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {plan.id ? "Update Plan" : "Add Plan"}
            </button>
            <button
              onClick={resetForm}
              className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  ID
                </th>
                <th scope="col" className="py-3 px-6">
                  Plan Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Price
                </th>
                <th scope="col" className="py-3 px-6">
                  Duration
                </th>
                <th scope="col" className="py-3 px-6">
                  Months
                </th>
                <th scope="col" className="py-3 px-6">
                  Description
                </th>
                <th scope="col" className="py-3 px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="py-4 px-6">{p.id}</td>
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {p.planName}
                  </td>
                  <td className="py-4 px-6">₹{p.price}</td>
                  <td className="py-4 px-6">{p.duration}</td>
                  <td className="py-4 px-6">{p.months}</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside">
                      {Array.isArray(p.description)
                        ? p.description.map((d, idx) => <li key={idx}>{d}</li>)
                        : p.description}
                    </ul>
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    <button
                      onClick={() =>
                        setPlan({
                          ...p,
                          description: Array.isArray(p.description)
                            ? p.description.join(", ") // Convert array to comma-separated string
                            : p.description,
                        })
                      }
                      className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePlan(p.id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
