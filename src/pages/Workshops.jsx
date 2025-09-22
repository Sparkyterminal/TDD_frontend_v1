/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// Workshops data inside this file
const workshops = [
  {
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    workshopName: "Advanced Yoga Flow",
    duration: "2 hours",
    time: "10:00 AM - 12:00 PM",
    date: "October 25, 2025",
    instructor: "Sarah Johnson",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    workshopName: "HIIT Training Bootcamp",
    duration: "1.5 hours",
    time: "6:00 PM - 7:30 PM",
    date: "October 27, 2025",
    instructor: "Mike Chen",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    workshopName: "Mindfulness & Meditation",
    duration: "1 hour",
    time: "7:00 AM - 8:00 AM",
    date: "October 29, 2025",
    instructor: "Emily Davis",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop",
    workshopName: "Strength Training Fundamentals",
    duration: "2.5 hours",
    time: "2:00 PM - 4:30 PM",
    date: "November 1, 2025",
    instructor: "David Wilson",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    workshopName: "Pilates Core Power",
    duration: "1.5 hours",
    time: "9:00 AM - 10:30 AM",
    date: "November 3, 2025",
    instructor: "Jessica Brown",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    workshopName: "Dance Fitness Fusion",
    duration: "1 hour",
    time: "5:00 PM - 6:00 PM",
    date: "November 5, 2025",
    instructor: "Maria Garcia",
  },
];

// Filter only upcoming workshops
function getUpcoming(workshops) {
  const today = new Date();
  return workshops.filter(({ date }) => {
    const workshopDate = new Date(date);
    return workshopDate >= today;
  });
}

const Workshops = () => {
  const upcomingWorkshops = getUpcoming(workshops);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 sm:pt-28 w-full font-[glancyr] max-w-6xl mx-auto mb-16">
        <motion.h1
          className="text-5xl mt-10 font-medium text-black mb-10 text-center font-[glancyr]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Workshops
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {upcomingWorkshops.map((workshop, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={workshop.image}
                alt={workshop.workshopName}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-1">
                {workshop.workshopName}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Duration:</span>{" "}
                {workshop.duration}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Time:</span> {workshop.time}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Date:</span> {workshop.date}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Instructor:</span>{" "}
                {workshop.instructor}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Workshops;
