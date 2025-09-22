import React from "react";

const LoadingPage = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#ebe5db]"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <img
        src="/assets/tdd-logo.png" // Update with your logo path
        alt="Logo"
        className="w-32 h-32 object-contain"
      />
    </div>
  );
};

export default LoadingPage;
