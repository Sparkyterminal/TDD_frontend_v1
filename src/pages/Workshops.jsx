/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

// Define custom colors for consistency
const COLORS = {
  forestGreen: "#26442C",
  darkForestGreen: "#1E791E", // Slightly darker for hover
  orange: "#D16539",
  yellow: "#FFD700", // Gold-like yellow for Hurry Up
};

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}api/${url}`;
};

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        setLoading(true);
        // Using a more robust fetch approach for better error handling
        const res = await axios.get(`${API_BASE_URL}workshop`);
        const data = res.data?.data || res.data;
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter((w) => !w.is_cancelled);

        // Sort by date/time to ensure recent/upcoming workshops are shown first,
        // then reverse as done previously (though sorting by date desc is usually better)
        // I will keep the previous reverse() logic to maintain the original order intent
        setWorkshops(filtered.reverse());
      } catch (e) {
        console.error("Workshop fetch error:", e);
        setError("Failed to load workshops. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, []);

  // Function to determine the status of the workshop
  const getWorkshopStatus = (workshop) => {
    const today = moment().tz("Asia/Kolkata").startOf("day");
    const workshopDate = moment(workshop.date)
      .tz("Asia/Kolkata")
      .startOf("day");

    const isExpired = workshopDate.isBefore(today);
    const isBookedOut = workshop.capacity <= 0;
    const isHurryUp = !isBookedOut && workshop.capacity < 5;

    if (isExpired)
      return {
        tag: "Expired",
        buttonText: "Expired",
        isDisabled: true,
        tagColor: "bg-gray-700 text-white",
      };
    if (isBookedOut)
      return {
        tag: "All Slots Booked",
        buttonText: "All Slots Booked",
        isDisabled: true,
        tagColor: `bg-[#1E791E] text-white`,
      };
    if (isHurryUp)
      return {
        tag: "Hurry Up!",
        buttonText: "Book Now",
        isDisabled: false,
        tagColor: `bg-[#FFD700] text-black`,
      };

    return {
      tag: null,
      buttonText: "Book Now",
      isDisabled: false,
      tagColor: "",
    };
  };

  const MemoizedWorkshopCard = React.memo(({ w }) => {
    const firstMedia =
      Array.isArray(w.media) && w.media.length > 0 ? w.media[0] : null;
    const thumbnail =
      firstMedia.image_url.full?.high_res;
    const imageSrc = thumbnail ? getImageUrl(thumbnail) : "";
    const instructors = Array.isArray(w.instructor_user_ids)
      ? w.instructor_user_ids
      : [];
    const instructorNames = instructors
      .map((i) => `${i.first_name || ""} ${i.last_name || ""}`.trim())
      .filter(Boolean)
      .join(", ");

    const dateStr = w.date
      ? moment(w.date).tz("Asia/Kolkata").format("DD MMM YYYY")
      : "";
    const timeStr = `${moment(w.start_time)
      .tz("Asia/Kolkata")
      .format("hh:mm A")} - ${moment(w.end_time)
      .tz("Asia/Kolkata")
      .format("hh:mm A")}`;

    const status = getWorkshopStatus(w);

    const DetailItem = ({ label, value, wrapValue = false }) => (
      <div className="flex justify-between items-start">
        {/* Label (Always left-aligned) */}
        <span
          style={{ color: COLORS.forestGreen }}
          className="font-semibold mr-2 flex-shrink-0" // flex-shrink-0 prevents label from shrinking
        >
          {label}:
        </span>

        {/* Value (Allows wrapping, right-aligned, and takes up space) */}
        <span
          style={{ color: COLORS.orange }}
          className={`text-right flex-grow ${
            wrapValue ? "break-words" : "whitespace-nowrap"
          }`}
          // Added break-words to ensure long single words don't overflow, though less likely with names
        >
          {value}
        </span>
      </div>
    );

    return (
      <div
        key={w.id}
        className="relative border rounded-lg shadow hover:shadow-xl transition duration-300 p-4 flex flex-col"
      >
        {status.tag && (
          <div
            className={`absolute top-0 right-0 m-4 px-3 py-1 text-xs font-bold rounded-full shadow-md ${status.tagColor}`}
          >
            {status.tag}
          </div>
        )}

        {imageSrc ? (
          <img
            src={imageSrc}
            alt={w.title}
            className="w-full h-44 object-cover rounded-md mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='gray'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-full h-44 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl text-[#26442C] font-bold mb-3">{w.title}</h2>

        {/* Details Container with justified spacing */}
        <div className="flex flex-col space-y-2 mb-4 flex-grow">
          {/* Default items use the non-wrapping DetailItem behavior */}
          <DetailItem label="Date" value={dateStr} />
          <DetailItem label="Time" value={timeStr} />

          {/* Instructors uses the new 'wrapValue' prop */}
          <DetailItem
            label="Instructor(s)"
            value={instructorNames || "N/A"}
            wrapValue={true}
          />

          <DetailItem label="Price" value={`₹${w.price}`} />
          <DetailItem label="Seats Left" value={w.capacity} />
        </div>

        {/* Book Now Button */}
        {/* ... (Button rendering remains the same) */}
        <button
          className={`mt-auto font-bold py-3 rounded transition duration-300 transform ${
            status.isDisabled
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : `bg-[#26442C] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer`
          }`}
          onClick={() => navigate(`/book-workshop/${w.id}`)}
          disabled={status.isDisabled}
        >
          {status.buttonText}
        </button>
      </div>
    );
  });

  // Workshops List Render
  const workshopList = workshops.map((w) => (
    <MemoizedWorkshopCard key={w.id} w={w} />
  ));

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

        {error && (
          <div className="text-center text-[#D16539] mb-6 font-semibold">
            {error}
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {!loading && workshops.length > 0 && workshopList}

          {!loading && workshops.length === 0 && !error && (
            <div className="col-span-full text-center py-10 text-gray-600 text-xl">
              No workshops currently available. Check back soon!
            </div>
          )}

          {/* Loading Skeleton */}
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="border rounded-lg p-4 animate-pulse">
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
      </main>
      <Footer />
    </>
  );
};

export default Workshops;
