/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const fadeSlideVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const formatTimeToIST12Hour = (time24) => {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm} IST`;
};

// Match backend URL patterns used elsewhere in the app (see Admin/ViewMembership.jsx)
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}api/${url}`;
};

const MembershipCard = ({ item, onGetMembership, onBookDemo }) => {
  const [open, setOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full">
      {item.image?.image_url?.full?.high_res && (
        <div className="w-full overflow-hidden rounded-md mb-4">
          <img
            src={getImageUrl(item.image.image_url.full.high_res)}
            alt={item.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.name.toUpperCase()}
        </h3>

        {/* Description with Read more / Show less */}
        <p className={`text-sm text-gray-600 mb-3 ${showFullDesc ? "" : "line-clamp-2"}`}>
          {item.description}
        </p>
        {item.description && item.description.length > 180 && (
          <button
            onClick={() => setShowFullDesc((s) => !s)}
            className="text-sm text-[#D2663A] underline mb-2 self-start"
          >
            {showFullDesc ? "Show Less" : "Read more"}
          </button>
        )}

        <button
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          className="text-sm text-[#D2663A] underline mb-2 self-start"
        >
          {open ? "Hide Details" : "Show Details"}
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-700 space-y-4 mb-4"
          >
            <div>
              <strong className="text-gray-800">Price:</strong> ₹
              {item.prices?.monthly ?? "-"} / month
            </div>

            <div>
              <strong className="text-gray-800">One Time Registration Fee:</strong> ₹500/-
            </div>

            {item.batches?.length > 0 && (
              <div>
                <strong className="text-gray-800 block mb-1">Batches:</strong>
                {item.batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="border border-gray-300 rounded-md p-2 mb-2 bg-gray-50"
                  >
                    <ul className="list-disc list-inside">
                      {batch.schedule.map((sch) => (
                        <li key={sch._id}>
                          {sch.day} ({formatTimeToIST12Hour(sch.start_time)} -{" "}
                          {formatTimeToIST12Hour(sch.end_time)})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {item.benefits?.length > 0 && (
              <div>
                <strong className="text-gray-800 block mb-1">Rules:</strong>
                <ul className="list-decimal list-inside space-y-1">
                  {item.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onGetMembership(item._id)}
            className="flex-1 bg-[#D2663A] cursor-pointer text-white px-3 py-2 rounded-full text-sm font-medium hover:opacity-95"
          >
            Get Membership
          </button>
          <button
            onClick={() => onBookDemo(item._id)}
            className="flex-1 bg-gray-900 cursor-pointer text-white px-3 py-2 rounded-full text-sm font-medium hover:opacity-95"
          >
            Book a Demo
          </button>
        </div>
      </div>
    </div>
  );
};

const staticGroupClasses = [
  {
    name: "Stepper Aerobics",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
  },
  {
    name: "HIIT",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
  },
  {
    name: "Pilates",
    image: "https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=800&h=600&fit=crop",
  },
  {
    name: "Yoga",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
  },
  {
    name: "Zumba",
    image: "https://images.unsplash.com/photo-1520483601560-4b63f98239e5?w=800&h=600&fit=crop",
  },
  {
    name: "Bolly Beats",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop",
  },
  {
    name: "Dance Fitness",
    image: "https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800&h=600&fit=crop",
  },
  {
    name: "Mass Hits/Mix Tape",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
  },
  {
    name: "Outdoor & Fun Activities",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
  },
];



const TabSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [danceSubTab, setDanceSubTab] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`, {
        params: { page: 1, limit: 100 },
      });
      const data = res.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(
        (Array.isArray(data.items) ? data.items : [])
          .filter(item => item.is_active && item.dance_type?.category)
          .map(item => item.dance_type.category)
      )];

      // Ensure Yoga ('group') appears last in the tabs if present
      const orderedCategories = (() => {
        if (!uniqueCategories.includes("group")) return uniqueCategories;
        return [
          ...uniqueCategories.filter((c) => c !== "group"),
          "group",
        ];
      })();
      
      setCategories(orderedCategories);
      if (orderedCategories.length > 0) {
        setActiveTab(orderedCategories[0]);
        if (orderedCategories[0] === "dance classes") {
          setDanceSubTab("KIDS");
        }
      }
    } catch (err) {
      console.error("Failed to fetch memberships", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
  // Get items for current tab
  const getCurrentItems = () => {
    if (activeTab === "dance classes") {
      const danceItems = items.filter(
        i => i.dance_type?.category === "dance classes" && i.is_active
      );
      
      if (danceSubTab === "KIDS") {
        return danceItems.filter(i => i.plan_for === "KID");
      } else if (danceSubTab === "ADULTS") {
        return danceItems.filter(i => i.plan_for === "ADULT");
      }
      return danceItems;
    }
    
    return items.filter(
      i => i.dance_type?.category === activeTab && i.is_active
    );
  };

const handleGetMembership = (id) => {
  navigate(`/membershipform/${id}`);
};

const handleBookDemo = (id) => {
  navigate(`/demoform/${id}`);
};
  const renderGroupFitnessCards = () => {
    const groupFitnessItem = items.find(
      i => i.dance_type?.category === "group fitness classes" && i.is_active
    );

    return (
      <>
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => groupFitnessItem && handleGetMembership(groupFitnessItem._id)}
            className="bg-[#D2663A] cursor-pointer text-white px-6 py-3 rounded-full text-lg font-semibold hover:opacity-95"
            disabled={!groupFitnessItem}
          >
            Get Membership
          </button>
          <button
            onClick={() => groupFitnessItem && handleBookDemo(groupFitnessItem._id)}
            className="bg-gray-900 cursor-pointer text-white px-6 py-3 rounded-full text-lg font-semibold hover:opacity-95"
            disabled={!groupFitnessItem}
          >
            Book a Demo
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticGroupClasses.map(({ name, image }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full"
            >
              <div className="w-full overflow-hidden rounded-md mb-4">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{name.toUpperCase()}</h3>
                <p className="text-sm text-gray-600 mb-3">For Ages 12 & Above</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderGrid = (list) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((it) => (
        <MembershipCard 
          key={it._id} 
          item={it}
          onGetMembership={handleGetMembership}
          onBookDemo={handleBookDemo}
        />
      ))}
    </div>
  );

  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === "dance classes") return "Dance Classes";
    if (category === "group fitness classes") return "Group Fitness Classes";
    if (category === "group") return "Yoga";
    return category.split(" ").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const currentItems = getCurrentItems();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-[glancyr]">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6">
        Learn A Variety of Dance Styles
      </h2>

      {/* Main Tabs - dynamically generated from categories */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveTab(category);
              // Reset sub-tab when changing main tab
              if (category === "dance classes") {
                setDanceSubTab("KIDS");
              } else {
                setDanceSubTab("");
              }
            }}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === category
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {formatCategoryName(category)}
          </button>
        ))}
      </div>

      <div>
        <AnimatePresence mode="wait">
          {activeTab === "dance classes" && (
            <motion.div
              key="dance"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {/* Sub Tabs for Dance Classes */}
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={() => setDanceSubTab("KIDS")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    danceSubTab === "KIDS"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Kids
                </button>
                <button
                  onClick={() => setDanceSubTab("ADULTS")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    danceSubTab === "ADULTS"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Adults
                </button>
              </div>

              {loading ? (
                <p className="text-center">Loading...</p>
              ) : currentItems.length > 0 ? (
                renderGrid(currentItems)
              ) : (
                <p className="text-center text-gray-600">
                  No {danceSubTab.toLowerCase()} dance classes available.
                </p>
              )}
            </motion.div>
          )}

          {activeTab === "group fitness classes" && (
            <motion.div
              key="group-fitness"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                renderGroupFitnessCards()
              )}
            </motion.div>
          )}

          {activeTab === "group" && (
            <motion.div
              key="yoga"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : currentItems.length > 0 ? (
                renderGrid(currentItems)
              ) : (
                <p className="text-center text-gray-600">
                  No yoga classes available.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TabSection;