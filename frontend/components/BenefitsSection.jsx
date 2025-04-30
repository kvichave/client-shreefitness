import React from "react";

const BenefitsSection = () => {
  return (
    <section className="py-16 flex flex-col md:flex-row items-center space-y-8 md:space-y-0">
      <div className="w-full md:w-1/2">
        <img
          src="/benefits-image.jpg"
          alt="Fitness Workout"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          Transform your physique with our fitness plan.
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Increase Muscle and Strength</li>
          <li>Be Healthier than before</li>
          <li>Increase Stamina</li>
        </ul>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Join now
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
