/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

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

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}api/${url}`;
};

const MembershipCard = ({ item }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const thumb =
    item.image?.image_url?.full?.high_res ||
    item.image?.image_url?.full?.high_res ||
    item.image?.image_url?.full?.high_res ||
    "";

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full">
      {/* Bigger image on top */}
      <div className="w-full overflow-hidden rounded-md mb-4">
        <img
          src={getImageUrl(thumb)}
          alt={item.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Content side below the image */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.name.toUpperCase()}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

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
            className="text-sm text-gray-700 space-y-4"
          >
            <div>
              <strong className="text-gray-800">Price:</strong> ₹
              {item.prices?.monthly ?? "-"} / month
            </div>

            <div>
              <strong className="text-gray-800">One Time Registration Fee:</strong>{" "}
              ₹500/-
            </div>

            <div>
              <strong className="text-gray-800 block mb-1">Batches:</strong>
              {item.batches?.length > 0 ? (
                item.batches.map((batch) => (
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
                ))
              ) : (
                <p>No batches available.</p>
              )}
            </div>

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

        <div className="mt-auto">
          <button
            onClick={() => navigate(`/membershipform/${item._id}`)}
            className="bg-[#D2663A] text-white px-3 py-2 rounded-full text-sm font-medium hover:opacity-95 mt-4"
          >
            Get Membership
          </button>
        </div>
      </div>
    </div>
  );
};

const staticGroupClasses = [
  {
    name: "Stepper Aerobics",
    image: {
      image_url: { full: { high_res: "assets/dance/aerobic.webp" } },
    },
  },
  {
    name: "HIIT",
    image: {
      image_url: { full: { high_res: "assets/dance/hiit.webp" } },
    },
  },
  {
    name: "Pilates",
    image: { image_url: { full: { high_res: "assets/dance/pilates.webp" } } },
  },
  {
    name: "yoga",
    image: {
      image_url: { full: { high_res: "assets/dance/yoga.webp" } },
    },
  },
  {
    name: "Zumba",
    image: {
      image_url: { full: { high_res: "assets/dance/zumba.webp" } },
    },
  },
  {
    name: "Bolly Beats",
    image: { image_url: { full: { high_res: "assets/dance/bollybeats.webp" } } },
  },
  {
    name: "Dance Fitness",
    image: {
      image_url: { full: { high_res: "assets/dance/dance-workshop.webp" } },
    },
  },
  {
    name: "Mass Hits/Mix Tape",
    image: {
      image_url: { full: { high_res: "assets/dance/mix.webp" } },
    },
  },
  {
    name: "Outdooor & Fun Activities",
    image: { image_url: { full: { high_res: "assets/dance/outdoor.webp" } } },
  },
];

const TabSection = () => {
  const [activeTab, setActiveTab] = useState("dance_classes");
  const [kidsTab, setKidsTab] = useState("JUNIOR");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const fontClass = "font-[glancyr]";
  const navigate = useNavigate();

  const [groupClassId, setGroupClassId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}membership-plan`, {
          params: { page: 1, limit: 100 },
        });
        const data = res.data || {};
        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
          // Extract first group class ID for static group cards' Get Membership button
          const firstGroupClass = (Array.isArray(data.items) ? data.items : []).find(
            (item) => item.dance_type?.category === "group classes" && item.is_active
          );
          if (firstGroupClass) setGroupClassId(firstGroupClass._id);
        }
      } catch (err) {
        console.error("Failed to fetch memberships", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  const danceClasses = items.filter(
    (i) => i.dance_type?.category === "dance classes" && i.is_active
  );
  const groupClassesDynamic = items.filter(
    (i) => i.dance_type?.category === "group classes" && i.is_active
  );
  const kidsJunior = items.filter(
    (i) => i.plan_for === "KID" && i.kids_category === "JUNIOR" && i.is_active
  );
  const kidsAdvanced = items.filter(
    (i) => i.plan_for === "KID" && i.kids_category === "ADVANCED" && i.is_active
  );
const adultsItems = items.filter(
  (i) => i.dance_type?.title?.toLowerCase() === "adults" && i.is_active
);


  const renderStaticGroupCards = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticGroupClasses.map(({ name, image }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full"
          >
            <div className="w-full overflow-hidden rounded-md mb-4">
              <img
                src={image.image_url.full.high_res}
                alt={name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{name.toUpperCase()}</h3>
              <p className="text-sm text-gray-600 mb-3">For Ages 12 & Above</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            if (groupClassId) {
              navigate(`/membershipform/${groupClassId}`);
            }
          }}
          className="bg-[#D2663A] text-white px-6 py-3 rounded-full text-lg font-semibold hover:opacity-95"
          disabled={!groupClassId}
        >
          Get Membership
        </button>
      </div>
    </>
  );

  const renderGrid = (list) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((it) => (
        <MembershipCard key={it._id} item={it} />
      ))}
    </div>
  );

  return (
    <section
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${fontClass}`}
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6">
        Learn A Variety of Dance Styles
      </h2>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab("dance_classes")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "dance_classes"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Dance Classes
        </button>
        <button
          onClick={() => setActiveTab("group_classes")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "group_classes"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Group Classes
        </button>
        <button
          onClick={() => setActiveTab("kids")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "kids"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Kids
        </button>
        <button
          onClick={() => setActiveTab("adults")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "adults"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Adults
        </button>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {activeTab === "dance_classes" && (
            <motion.div
              key="dance"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                renderGrid(danceClasses)
              )}
            </motion.div>
          )}

          {activeTab === "group_classes" && (
            <motion.div
              key="group"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                renderStaticGroupCards()
              )}
            </motion.div>
          )}

          {activeTab === "kids" && (
            <motion.div
              key="kids"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={() => setKidsTab("JUNIOR")}
                  className={`px-3 py-2 rounded-full ${
                    kidsTab === "JUNIOR"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Junior
                </button>
                <button
                  onClick={() => setKidsTab("ADVANCED")}
                  className={`px-3 py-2 rounded-full ${
                    kidsTab === "ADVANCED"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Advanced
                </button>
              </div>

              {loading ? (
                <p className="text-center">Loading...</p>
              ) : kidsTab === "JUNIOR" ? (
                renderGrid(kidsJunior)
              ) : (
                renderGrid(kidsAdvanced)
              )}
            </motion.div>
          )}

          {activeTab === "adults" && (
            <motion.div
              key="adults"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : adultsItems.length > 0 ? (
                renderGrid(adultsItems)
              ) : (
                <p className="text-center">No adult classes available.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TabSection;
