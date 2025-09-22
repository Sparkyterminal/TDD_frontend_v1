/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const GetMembership = () => {
  return (
    <>
      <Header />
      <section className="min-h-screen max-w-6xl mx-auto px-6 py-16 text-gray-900 font-[glancyr] flex flex-col justify-center">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-5xl mt-10 font-medium mb-2 font-[glancyr]">
            Get Your Membership Today!
          </h2>
          <p className="text-gray-600 text-lg font-[glancyr]">
            Where every step transforms into rhythm, energy, and art.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {/* 1 Month */}
          <div className="border border-black rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow">
            <div className="mx-auto mb-4 w-28 h-10 flex items-center justify-center rounded-lg bg-[#ADC290] font-[glancyr] text-md font-medium text-black">
              1 Month
            </div>
            <p className="text-center text-4xl font-bold mb-6 font-[glancyr]">
              ₹2,000
            </p>
            <ul className="mb-6 space-y-3 text-gray-700 text-sm flex-1 font-[glancyr]">
              <li>Unlimited classes</li>
              <li>Access to all dance styles</li>
              <li>Free trial class</li>
              <li>Community events</li>
            </ul>
            <button className="mt-auto bg-transparent border border-black text-black rounded-full py-3 text-sm font-medium transition font-[glancyr] hover:bg-[#D2663B] cursor-pointer hover:text-white">
              Join Now
            </button>
          </div>

          {/* 3 Months */}
          <div className="border border-black rounded-xl p-6 flex flex-col shadow-lg">
            <div className="mx-auto mb-4 w-28 h-10 flex items-center justify-center rounded-lg bg-[#ADC290] font-[glancyr] text-md font-medium text-black">
              3 Months
            </div>
            <p className="text-center text-4xl font-bold mb-6 font-[glancyr]">
              ₹5,000
            </p>
            <ul className="mb-6 space-y-3 text-gray-700 text-sm flex-1 font-[glancyr]">
              <li>All 1 Month benefits</li>
              <li>10% discount</li>
              <li>Priority booking</li>
              <li>Exclusive workshops</li>
            </ul>
            <button className="mt-auto bg-transparent border border-black text-black rounded-full py-3 text-sm font-medium transition font-[glancyr] hover:bg-[#D2663B] cursor-pointer hover:text-white">
              Join Now
            </button>
          </div>

          {/* 6 Months */}
          <div className="border border-black rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow">
            <div className="mx-auto mb-4 w-28 h-10 flex items-center justify-center rounded-lg bg-[#ADC290] font-[glancyr] text-md font-medium text-black">
              6 Months
            </div>
            <p className="text-center text-4xl font-bold mb-6 font-[glancyr]">
              ₹10,000
            </p>
            <ul className="mb-6 space-y-3 text-gray-700 text-sm flex-1 font-[glancyr]">
              <li>All 3 Months benefits</li>
              <li>15% discount</li>
              <li>Free merchandise</li>
              <li>Guest passes</li>
            </ul>
            <button className="mt-auto bg-transparent border border-black text-black rounded-full py-3 text-sm font-medium transition font-[glancyr] hover:bg-[#D2663B] cursor-pointer hover:text-white">
              Join Now
            </button>
          </div>

          {/* 12 Months */}
          <div className="border border-black rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow">
            <div className="mx-auto mb-4 w-28 h-10 flex items-center justify-center rounded-lg bg-[#ADC290] font-[glancyr] text-md font-medium text-black">
              12 Months
            </div>
            <p className="text-center text-4xl font-bold mb-6 font-[glancyr]">
              ₹14,000
            </p>
            <ul className="mb-6 space-y-3 text-gray-700 text-sm flex-1 font-[glancyr]">
              <li>All 6 Months benefits</li>
              <li>20% discount</li>
              <li>Exclusive events access</li>
              <li>Personal coaching session</li>
            </ul>
            <button className="mt-auto bg-transparent border border-black text-black rounded-full py-3 text-sm font-medium transition font-[glancyr] hover:bg-[#D2663B] cursor-pointer hover:text-white">
              Join Now
            </button>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
};

export default GetMembership;
