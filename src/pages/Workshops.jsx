// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
// import moment from "moment-timezone";
// import { useNavigate } from "react-router-dom";

// const getImageUrl = (url) => {
//   if (!url) return "";
//   if (url.startsWith("http")) return url;
//   if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
//   return `${API_BASE_URL}api/${url}`;
// };

// const Workshops = () => {
//   const [workshops, setWorkshops] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchWorkshops() {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE_URL}workshop`);
//         const data = res.data?.data || res.data;
//         const list = Array.isArray(data) ? data : [];

//         const today = moment().tz("Asia/Kolkata").startOf("day");
//         const filtered = list.filter(
//           (w) => !w.is_cancelled && moment(w.date).tz("Asia/Kolkata").startOf("day").isSameOrAfter(today)
//         );

//         setWorkshops(filtered.reverse());
//       } catch (e) {
//         console.error("Workshop fetch error:", e);
//         setError("Failed to load workshops. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchWorkshops();
//   }, []);

//   const WorkshopCard = React.memo(({ w }) => {
//     const instructorImageUrl =
//       Array.isArray(w.media) && w.media.length > 0
//         ? getImageUrl(w.media[0].image_url.full.high_res)
//         : "";

//     const dateStr = w.date
//       ? moment(w.date).tz("Asia/Kolkata").format("DD MMM YYYY")
//       : "";

//     return (
//       <div className="border rounded p-4 flex flex-col gap-4 shadow hover:shadow-lg transition duration-300">
//         {instructorImageUrl ? (
//           <img
//             src={instructorImageUrl}
//             alt={`Workshop ${w.title}`}
//             className="w-full h-full object-cover rounded"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src =
//                 "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='gray'%3ENo Image%3C/text%3E%3C/svg%3E";
//             }}
//           />
//         ) : (
//           <div className="w-full h-44 bg-gray-100 rounded flex items-center justify-center text-gray-400">
//             No Image
//           </div>
//         )}

//         {/* Title centered */}
//         <h2 className="text-center text-2xl font-bold text-[#26442C] break-words">
//           {w.title}
//         </h2>

//         {/* Date row with label left and date right */}
//         <div className="flex justify-between text-[#26442C] font-semibold">
//           <span>Date:</span>
//           <span>{dateStr}</span>
//         </div>

//         {/* Batches row with each batch in single line, text wrapped */}
//         <div className="text-[#26442C] break-words">
//           {Array.isArray(w.batches) &&
//             w.batches.map((batch) => {
//               const batchStart = moment(batch.start_time)
//                 .tz("Asia/Kolkata")
//                 .format("hh:mm A");
//               const batchEnd = moment(batch.end_time)
//                 .tz("Asia/Kolkata")
//                 .format("hh:mm A");
//               return (
//                 <div key={batch._id} className="mb-1 break-words">
//                   {batch.name} ({batchStart} - {batchEnd})
//                 </div>
//               );
//             })}
//         </div>

//         {/* Book Now button */}
//         <button
//           className="mt-auto font-bold py-3 rounded bg-[#26442C] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition duration-300 transform"
//           onClick={() => navigate(`/workshopdetails/${w.id}`)}
//           type="button"
//           aria-label="Book Now"
//         >
//           Book Now
//         </button>
//       </div>
//     );
//   });

//   return (
//     <>
//       <Header />
//       <main className="min-h-screen pt-24 px-4 sm:pt-28 w-full font-[glancyr] max-w-6xl mx-auto mb-16">
//         <motion.h1
//           className="text-4xl sm:text-5xl mt-10 font-medium text-black mb-10 text-center font-[glancyr]"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//         >
//           Workshops
//         </motion.h1>

//         {error && <div className="text-center text-[#D16539] mb-6 font-semibold">{error}</div>}

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
//         >
//           {!loading && workshops.length > 0 && workshops.map((w) => <WorkshopCard key={w.id} w={w} />)}

//           {!loading && workshops.length === 0 && !error && (
//             <div className="col-span-full text-center py-10 text-gray-600 text-xl">
//               No workshops currently available. Check back soon!
//             </div>
//           )}

//           {loading &&
//             Array.from({ length: 6 }).map((_, idx) => (
//               <div key={idx} className="border rounded-lg p-4 animate-pulse">
//                 <div className="w-full h-44 bg-gray-200 rounded mb-4" />
//                 <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
//                 <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
//                 <div className="h-3 bg-gray-200 rounded mb-2 w-1/3" />
//                 <div className="h-3 bg-gray-200 rounded mb-2 w-2/3" />
//                 <div className="h-3 bg-gray-200 rounded mb-2 w-1/4" />
//                 <div className="h-3 bg-gray-200 rounded mb-4 w-1/2" />
//                 <div className="h-10 bg-gray-200 rounded mt-auto" />
//               </div>
//             ))}
//         </motion.div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default Workshops;
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

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
        const res = await axios.get(`${API_BASE_URL}workshop`);
        const data = res.data?.data || res.data;
        const list = Array.isArray(data) ? data : [];

        const today = moment().tz("Asia/Kolkata").startOf("day");

        // Split into upcoming & completed
        const upcoming = [];
        const completed = [];

        list.forEach((w) => {
          const workshopDate = moment(w.date).tz("Asia/Kolkata").startOf("day");
          if (!w.is_cancelled && workshopDate.isSameOrAfter(today)) {
            upcoming.push(w);
          } else {
            completed.push(w);
          }
        });

        // Sort both
        upcoming.sort((a, b) => moment(a.date).diff(moment(b.date)));
        completed.sort((a, b) => moment(b.date).diff(moment(a.date))); // recent completed first

        setWorkshops({
          upcoming,
          completed,
        });
      } catch (e) {
        console.error("Workshop fetch error:", e);
        setError("Failed to load workshops. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchWorkshops();
  }, []);

  const WorkshopCard = React.memo(({ w, expired }) => {
    const instructorImageUrl =
      Array.isArray(w.media) && w.media.length > 0
        ? getImageUrl(w.media[0].image_url.full.high_res)
        : "";

    const dateStr = w.date
      ? moment(w.date).tz("Asia/Kolkata").format("DD MMM YYYY")
      : "";

    return (
      <div className="border rounded p-4 flex flex-col gap-4 shadow hover:shadow-lg transition duration-300">
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
        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-[#26442C] break-words">
          {w.title}
        </h2>
        {/* Date */}
        <div className="flex justify-between text-[#26442C] font-semibold">
          <span>Date:</span>
          <span>{dateStr}</span>
        </div>
        {/* Batches */}
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
        {/* Book now or Expired */}
        <button
          className={`mt-auto font-bold py-3 rounded ${
            expired
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#26442C] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          } text-white transition duration-300 transform`}
          onClick={() => !expired && navigate(`/workshopdetails/${w.id}`)}
          type="button"
          aria-label="Book Now"
          disabled={expired}
        >
          {expired ? "Completed" : "Book Now"}
        </button>
      </div>
    );
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 sm:pt-28 w-full font-[glancyr] max-w-6xl mx-auto mb-16">
        <motion.h1
          className="text-4xl sm:text-5xl mt-10 font-medium text-black mb-10 text-center font-[glancyr]"
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

        {/* Upcoming Workshops Section */}
        <h2 className="text-2xl text-[#26442C] font-bold mb-5 text-center">
          Upcoming Workshops
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {!loading &&
            workshops.upcoming &&
            workshops.upcoming.length > 0 &&
            workshops.upcoming.map((w) => (
              <WorkshopCard key={w.id} w={w} expired={false} />
            ))}
          {!loading &&
            workshops.upcoming &&
            workshops.upcoming.length === 0 && !error && (
              <div className="col-span-full text-center py-10 text-gray-600 text-xl">
                No upcoming workshops. Check back soon!
              </div>
            )}
          {loading &&
            Array.from({ length: 3 }).map((_, idx) => (
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

        {/* Completed Workshops Section */}
        <h2 className="text-2xl text-[#26442C] font-bold mb-5 text-center">
          Past Workshops
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {!loading &&
            workshops.completed &&
            workshops.completed.length > 0 &&
            workshops.completed.map((w) => (
              <WorkshopCard key={w.id} w={w} expired={true} />
            ))}
          {!loading &&
            workshops.completed &&
            workshops.completed.length === 0 && !error && (
              <div className="col-span-full text-center py-10 text-gray-600 text-xl">
                No completed workshops found.
              </div>
            )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Workshops;
