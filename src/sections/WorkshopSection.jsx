/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import here
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import moment from "moment-timezone";
import { API_BASE_URL } from "../../config";

// Updated WorkshopCard with navigation
const WorkshopCard = React.memo(({ w, onBook }) => {
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  const instructorImageUrl =
    Array.isArray(w.media) && w.media.length > 0
      ? getImageUrl(w.media[0].image_url.full.high_res)
      : "";

  const dateStr = w.date
    ? moment(w.date).tz("Asia/Kolkata").format("DD MMM YYYY")
    : "";

  return (
    <div className="bg-[#EBE5DB] rounded p-4 flex flex-col gap-4 shadow hover:shadow-lg transition duration-300">
      {instructorImageUrl ? (
        <img
          src={instructorImageUrl}
          alt={`Workshop ${w.title}`}
          className="w-full h-full object-cover rounded"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='gray'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      ) : (
        <div className="w-full h-44 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      <h2 className="text-center text-2xl font-bold text-[#26442C] break-words">
        {w.title}
      </h2>

      <div className="flex justify-between text-[#26442C] font-semibold">
        <span>Date:</span>
        <span>{dateStr}</span>
      </div>

      <div className="text-[#26442C] break-words">
        {Array.isArray(w.batches) &&
          w.batches.map((batch) => {
            const batchStart = moment(batch.start_time)
              .tz("Asia/Kolkata")
              .format("hh:mm A");
            const batchEnd = moment(batch.end_time)
              .tz("Asia/Kolkata")
              .format("hh:mm A");
            return (
              <div key={batch._id} className="mb-1 break-words">
                {batch.name} ({batchStart} - {batchEnd})
              </div>
            );
          })}
      </div>

      <button
        className="mt-auto font-bold py-3 rounded bg-[#26442C] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition duration-300 transform"
        onClick={onBook}
        type="button"
        aria-label="Book Now"
      >
        Book Now
      </button>
    </div>
  );
});

const WorkshopSection = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate(); // useNavigate hook here

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}workshop`);
        const data = res.data?.data || res.data;
        const list = Array.isArray(data) ? data : [];

        const today = moment().tz("Asia/Kolkata").startOf("day");
        const filtered = list.filter(
          (w) =>
            !w.is_cancelled &&
            moment(w.date)
              .tz("Asia/Kolkata")
              .startOf("day")
              .isSameOrAfter(today)
        );

        setWorkshops(filtered.reverse());
      } catch (e) {
        setError("Failed to load workshops. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const getCardsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  useEffect(() => {
    setCardsPerPage(getCardsPerPage());
    const handleResize = () => setCardsPerPage(getCardsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(workshops.length / cardsPerPage);
  const canShowNavigation = workshops.length > cardsPerPage;

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
    return workshops.slice(start, end);
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
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl sm:text-3xl font-medium text-black">
            Upcoming Workshops
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
              {!loading &&
                getCurrentWorkshops().map((w) => (
                  <WorkshopCard
                    key={w.id}
                    w={w}
                    onBook={() => navigate(`/workshopdetails/${w.id}`)}
                  />
                ))}

              {loading &&
                Array.from({ length: cardsPerPage }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 animate-pulse"
                  >
                    <div className="w-full h-44 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/3" />
                    <div className="h-3 bg-gray-200 rounded mb-2 w-2/3" />
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/4" />
                    <div className="h-3 bg-gray-200 rounded mb-4 w-1/2" />
                    <div className="h-10 bg-gray-200 rounded mt-auto" />
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
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
