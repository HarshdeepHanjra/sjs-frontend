import React from 'react';

const TailwindTest = () => {
  return (
    <div className="p-8 m-4 bg-blue-500 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Tailwind CSS Test</h1>
      <p className="text-white/90">If you see blue background with white text, Tailwind is working!</p>
      <button className="mt-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition">
        Test Button
      </button>
    </div>
  );
};

export default TailwindTest;