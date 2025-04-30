"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [value, setValue] = useState(0);
  const [plans, setPlans] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchCoupons();
    fetchPlans();
  }, []);

  const fetchCoupons = async () => {
    const res = await axios.get(
      "https://shreefitness-backend.onrender.com/admin/coupons"
    );
    setCoupons(res.data);
  };

  const fetchPlans = async () => {
    const res = await axios.get(
      "https://shreefitness-backend.onrender.com/admin/plans"
    );
    setAvailablePlans(res.data);
  };

  const addCoupon = async () => {
    if (!coupon || !value || plans.length === 0) return;
    await axios.post(
      "https://shreefitness-backend.onrender.com/admin/coupons",
      {
        coupon,
        value,
        onplans: plans,
      }
    );
    setCoupon("");
    setValue(0);
    setPlans([]);
    fetchCoupons();
  };

  const deleteCoupon = async (id) => {
    await axios.delete(
      `https://shreefitness-backend.onrender.com/admin/coupons/${id}`
    );
    fetchCoupons();
  };

  const handlePlansChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setPlans(selected);
  };

  const filteredCoupons = coupons.filter((c) =>
    c.coupon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / rowsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <section className="bg-gray-50 dark:bg-black p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          {/* Add Coupon Form */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 p-4 border-b">
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Add Coupon
              </h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  placeholder="Coupon Code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Discount Value (%)"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value))}
                />
                <select
                  multiple
                  value={plans}
                  onChange={handlePlansChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 w-full h-28 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  {availablePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.planName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addCoupon}
                  className="bg-[#9acc35] hover:bg-primary-700 text-black font-bold  rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#9acc35] dark:hover:bg-primary-600"
                >
                  Add Coupon
                </button>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Coupons Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Coupon
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Discount (%)
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Plans
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCoupons.map((c) => (
                  <tr key={c.id} className="border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {c.coupon}
                    </th>
                    <td className="px-4 py-3">{c.value}%</td>
                    <td className="px-4 py-3">{c.onplans}</td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="text-red-600 hover:text-red-800 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing &nbsp;
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(
                  (currentPage - 1) * rowsPerPage + 1,
                  filteredCoupons.length
                )}
                -{Math.min(currentPage * rowsPerPage, filteredCoupons.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredCoupons.length}
              </span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                      currentPage === index + 1
                        ? "text-primary-600 bg-primary-50 border mx-1 border-[#9acc35] hover:bg-primary-100 hover:text-primary-700"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
