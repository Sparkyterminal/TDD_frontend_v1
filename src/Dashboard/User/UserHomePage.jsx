// import React, { useEffect, useMemo, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Flame, Calendar, TrendingUp, Award } from "lucide-react";
// import axios from "axios";
// import { API_BASE_URL } from "../../../config";
// import { useSelector } from "react-redux";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const expiryDate = new Date("2026-10-06T00:00:00");

// const UserHomePage = () => {
//   const [confirmedCount, setConfirmedCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: "00",
//     minutes: "00",
//     seconds: "00",
//   });
//   const [canRenew, setCanRenew] = useState(false);

//   const user = useSelector((state) => state.user.value);
//   console.log("user", user);

//   const config = useMemo(
//     () => ({
//       headers: { Authorization: user.access_token },
//     }),
//     [user.access_token]
//   );

//   useEffect(() => {
//     const fetchConfirmedCount = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}class-session/user/${user.id}/confirmed-count`,
//           config
//         );
//         setConfirmedCount(response.data.confirmedClassesCount);
//       } catch (error) {
//         console.error("Error fetching confirmed classes count:", error);
//       }
//     };

//     fetchConfirmedCount();

//     const updateTimer = () => {
//       const now = new Date();
//       const diff = expiryDate - now;

//       if (diff <= 0) {
//         setTimeLeft({ days: 0, hours: "00", minutes: "00", seconds: "00" });
//         setCanRenew(false); // Disable renewal after expiry
//         return;
//       }

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
//         .toString()
//         .padStart(2, "0");
//       const minutes = Math.floor((diff / (1000 * 60)) % 60)
//         .toString()
//         .padStart(2, "0");
//       const seconds = Math.floor((diff / 1000) % 60)
//         .toString()
//         .padStart(2, "0");

//       setTimeLeft({ days, hours, minutes, seconds });

//       // Enable renewal within 2 days before expiry
//       const renewalEnableDate = new Date(expiryDate);
//       renewalEnableDate.setDate(expiryDate.getDate() - 2);

//       if (now >= renewalEnableDate) {
//         setCanRenew(true);
//       } else {
//         setCanRenew(false);
//       }
//     };

//     updateTimer();
//     const timerId = setInterval(updateTimer, 1000);
//     return () => clearInterval(timerId);
//   }, [config, user.id]);

//   const barData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Classes Count",
//         data: [3, 4, 2, 5, 3, 4, 6],
//         backgroundColor: (context) => {
//           const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
//           gradient.addColorStop(0, "rgba(168, 85, 247, 0.8)");
//           gradient.addColorStop(1, "rgba(236, 72, 153, 0.8)");
//           return gradient;
//         },
//         borderRadius: 12,
//         borderWidth: 0,
//       },
//     ],
//   };

//   const barOptions = {
//     responsive: true,
//     maintainAspectRatio: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: false,
//       },
//       tooltip: {
//         backgroundColor: "rgba(0, 0, 0, 0.8)",
//         padding: 12,
//         cornerRadius: 8,
//         titleColor: "#fff",
//         bodyColor: "#fff",
//         displayColors: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: "rgba(0, 0, 0, 0.05)",
//           drawBorder: false,
//         },
//         ticks: {
//           stepSize: 1,
//           color: "#6b7280",
//           font: {
//             size: 12,
//           },
//         },
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: "#6b7280",
//           font: {
//             size: 12,
//             weight: "500",
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Welcome Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//             Welcome Back!
//           </h1>
//           <p className="text-gray-600 text-lg">Here's your fitness journey overview</p>
//         </div>

//         {/* Cards Container */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//           {/* Streaks Card */}
//           <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
//             <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                   <Flame className="w-6 h-6 text-orange-500" />
//                   Streaks
//                 </h3>
//                 <div className="text-4xl animate-pulse">🔥</div>
//               </div>

//               <div className="flex justify-center items-center mb-2">
//                 <div className="relative">
//                   <img
//                     src="/assets/dance.png"
//                     alt="Dance Illustration"
//                     className="h-42 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-between items-end">
//                 <div className="text-gray-700 font-medium">
//                   <div className="text-sm text-gray-500 mb-1">Current Streak</div>
//                   <div className="text-lg">Total Classes</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
//                     {confirmedCount}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Membership Card */}
//           <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
//             <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600"></div>
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
//                     <Calendar className="w-6 h-6 text-purple-600" />
//                     Membership
//                   </h3>
//                   <p className="text-gray-600 text-sm">Active until</p>
//                 </div>
//                 <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
//                   <span className="text-purple-700 font-bold text-sm">06/10/2026</span>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-4">
//                 <p className="text-gray-700 text-sm mb-4 font-medium">Your membership expires in</p>
//                 <div className="flex justify-center items-center gap-2 font-mono">
//                   <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[70px]">
//                     <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       {timeLeft.days}
//                     </span>
//                     <span className="text-xs text-gray-500 font-medium mt-1">DAYS</span>
//                   </div>
//                   <span className="text-2xl text-gray-400 font-bold">:</span>
//                   <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[70px]">
//                     <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       {timeLeft.hours}
//                     </span>
//                     <span className="text-xs text-gray-500 font-medium mt-1">HOURS</span>
//                   </div>
//                   <span className="text-2xl text-gray-400 font-bold">:</span>
//                   <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[70px]">
//                     <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       {timeLeft.minutes}
//                     </span>
//                     <span className="text-xs text-gray-500 font-medium mt-1">MINS</span>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 disabled={!canRenew}
//                 className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105 ${
//                   canRenew
//                     ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100 hover:shadow-none"
//                 }`}
//               >
//                 Renew Membership
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Chart Section */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//           <div className="flex items-center justify-center gap-3 mb-6">
//             <TrendingUp className="w-7 h-7 text-purple-600" />
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Weekly User Report
//             </h2>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
//             <Bar data={barData} options={barOptions} />
//           </div>

//           <div className="mt-6 flex flex-wrap justify-center gap-4">
//             <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
//               <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
//               <span className="text-sm font-medium text-gray-700">Total Classes: 27</span>
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
//               <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               <span className="text-sm font-medium text-gray-700">Most Active: Sunday</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserHomePage;
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Flame, Calendar, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "../../../config";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserHomePage = () => {
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [canRenew, setCanRenew] = useState(false);

  // Store membership dates dynamically
  const [membershipDates, setMembershipDates] = useState({
    startDate: null,
    endDate: null,
  });

  const user = useSelector((state) => state.user.value);

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  useEffect(() => {
    // Fetch confirmed classes count
    const fetchConfirmedCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}class-session/user/${user.id}/confirmed-count`,
          config
        );
        setConfirmedCount(response.data.confirmedClassesCount);
      } catch (error) {
        console.error("Error fetching confirmed classes count:", error);
      }
    };

    // Fetch membership data
    const fetchMembershipData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}membership-plan/user/${user.id}`,
          config
        );
        const items = res.data.items;
        if (items && items.length > 0) {
          const membership = items[0];
          setMembershipDates({
            startDate: new Date(membership.start_date),
            endDate: new Date(membership.end_date),
          });
        }
      } catch (err) {
        console.error("Error fetching membership data:", err);
      }
    };

    fetchConfirmedCount();
    fetchMembershipData();
  }, [config, user.id]);

  useEffect(() => {
    if (!membershipDates.endDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = membershipDates.endDate - now;

      if (diff <= 0) {
        // Membership expired: show zeroed timer but keep the button visible
        setTimeLeft({ days: 0, hours: "00", minutes: "00", seconds: "00" });
      } else {
        // Membership active: compute remaining time
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, "0");

        setTimeLeft({ days, hours, minutes, seconds });
      }

      // Option A: always allow renew (enabled even after expiry)
      setCanRenew(true);

      // Option B: enable while before or exactly on expiry
      // setCanRenew(now <= membershipDates.endDate);

      // Option C: enable only when before expiry (current behavior)
      // setCanRenew(now < membershipDates.endDate);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [membershipDates]);

  // Format membership end date as DD/MM/YYYY for display
  const formattedEndDate = membershipDates.endDate
    ? membershipDates.endDate.toLocaleDateString("en-GB")
    : "";

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Classes Count",
        data: [3, 4, 2, 5, 3, 4, 6],
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.8)");
          gradient.addColorStop(1, "rgba(236, 72, 153, 0.8)");
          return gradient;
        },
        borderRadius: 12,
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
        ticks: { stepSize: 1, color: "#6b7280", font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12, weight: "500" } },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-lg">Here's your fitness journey overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Streaks
                </h3>
                <div className="text-4xl animate-pulse">🔥</div>
              </div>

              <div className="flex justify-center items-center mb-2">
                <div className="relative">
                  <img
                    src="/assets/dance.png"
                    alt="Dance Illustration"
                    className="h-42 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-gray-700 font-medium">
                  <div className="text-sm text-gray-500 mb-1">Current Streak</div>
                  <div className="text-lg">Total Classes</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {confirmedCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    Membership
                  </h3>
                  <p className="text-gray-600 text-sm">Active until</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <span className="text-purple-700 font-bold text-sm">{formattedEndDate}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-4">
                <p className="text-gray-700 text-sm mb-4 font-medium">Your membership expires in</p>
                <div className="flex justify-center items-center gap-2 font-mono">
                  <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[70px]">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {timeLeft.days}
                    </span>
                    <span className="text-xs text-gray-500 font-medium mt-1">DAYS</span>
                  </div>
                  <span className="text-2xl text-gray-400 font-bold">:</span>
                  <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[70px]">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {timeLeft.hours}
                    </span>
                    <span className="text-xs text-gray-500 font-medium mt-1">HOURS</span>
                  </div>
                  <span className="text-2xl text-gray-400 font-bold">:</span>
                  <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm min-w-[70px]">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-xs text-gray-500 font-medium mt-1">MINS</span>
                  </div>
                </div>
              </div>

              <button
                disabled={!canRenew}
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105 ${
                  canRenew
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100 hover:shadow-none"
                }`}
              >
                Renew Membership
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-purple-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weekly User Report
            </h2>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <Bar data={barData} options={barOptions} />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <span className="text-sm font-medium text-gray-700">Total Classes: 27</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">Most Active: Sunday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
