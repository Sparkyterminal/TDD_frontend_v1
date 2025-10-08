/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WorkshopCard from "../components/WorkshopCard";
import { motion, AnimatePresence } from "framer-motion";

// Define workshops data inside this file
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

const WorkshopSection = () => {
  const upcomingWorkshops = getUpcoming(workshops);

  const getCardsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  useEffect(() => {
    const handleResize = () => setCardsPerPage(getCardsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(upcomingWorkshops.length / cardsPerPage);
  const canShowNavigation = upcomingWorkshops.length > cardsPerPage;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getCurrentWorkshops = () => {
    const start = currentIndex * cardsPerPage;
    const end = start + cardsPerPage;
    return upcomingWorkshops.slice(start, end);
  };

  const slideVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      scale: 0.98,
      transition: { duration: 0.4, ease: "easeIn" },
    }),
  };

  return (
    <section className="py-14 px-2 sm:py-18 w-full font-[glancyr]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl sm:text-3xl font-medium text-black">
            Workshops
          </h2>
          {canShowNavigation && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-2 bg-[#ebe5db] border border-[#26442C]/20 rounded-full shadow hover:bg-[#26442C]/10 transition"
              >
                <ChevronLeft className="w-5 h-5 text-[#26442C]" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex === totalPages - 1}
                className="p-2 bg-[#ebe5db] border border-[#26442C]/20 rounded-full shadow hover:bg-[#26442C]/10 transition"
              >
                <ChevronRight className="w-5 h-5 text-[#26442C]" />
              </button>
            </div>
          )}
        </div>
        {/* Cards with animation */}
        <div className="relative min-h-[340px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {getCurrentWorkshops().map((workshop, idx) => (
                <WorkshopCard key={idx} {...workshop} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Dots */}
        {canShowNavigation && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-[#D16539] w-6"
                    : "bg-[#26442C]/20 hover:bg-[#D16539]/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkshopSection;
