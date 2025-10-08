/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config";

const Instructors = () => {
  const user = useSelector((state) => state.user.value);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  // const config = useMemo(
  //   () => ({ headers: { Authorization: user?.access_token } }),
  //   [user?.access_token]
  // );

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  const getThumbnailFromMedia = (mediaDetails) => {
    const first = Array.isArray(mediaDetails) ? mediaDetails[0] : null;
    if (!first || !first.image_url) return "";
    const thumb =
      first.image_url.full?.high_res;
    return getImageUrl(thumb);
  };

  const capitalize = (s) => {
    if (!s) return "";
    return String(s).toLowerCase().replace(/^./, (c) => c.toUpperCase());
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}user/coaches`)
      .then((res) => {
        const list = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (isMounted) setCoaches(list);
      })
      .catch(() => {
        if (isMounted) setCoaches([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  },[]);

  return (
    <>
      <Header />
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center font-[glancyr]"
        style={{ marginTop: "130px" }} // Adjust this value to match your header height
      >
        <motion.h1
          className="text-6xl mt-10 md:text-6xl font-medium text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Instructors
        </motion.h1>
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center text-gray-600">Loading instructors...</div>
          ) : coaches.length === 0 ? (
            <div className="text-center text-gray-600">No instructors found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {coaches.map((coach, idx) => {
                const image = getThumbnailFromMedia(coach.media_details);
                const name = `${capitalize(coach.first_name)} ${capitalize(
                  coach.last_name
                )}`.trim();
                return (
                  <motion.div
                    key={coach._id || idx}
                    className="flex flex-col items-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.3 + idx * 0.15,
                    }}
                  >
                    <div className="overflow-hidden rounded-full">
                      <img
                        src={image || "/assets/placeholder-avatar.png"}
                        alt={name || "Instructor"}
                        className="w-64 h-64 md:w-66 md:h-66 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/placeholder-avatar.png";
                        }}
                      />
                    </div>
                    <p className="mt-4 text-center text-lg font-semibold">{name}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Instructors;
