// /* eslint-disable no-unused-vars */
// import React, { useMemo, useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";

// const Input = ({ label, children }) => (
//   <label className="block mb-4">
//     <span className="block text-sm text-gray-700 mb-1 font-[glancyr]">{label}</span>
//     {children}
//   </label>
// );

// // replaced DisabledField to allow text-wrap and sizing so full plan name is visible
// const DisabledField = ({ label, value }) => (
//   <Input label={label}>
//     <div
//       className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 break-words whitespace-pre-wrap min-h-[56px] max-h-[240px] overflow-auto"
//       title={value}
//       aria-readonly="true"
//     >
//       {value ?? "-"}
//     </div>
//   </Input>
// );

// const MembershipForm = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { id: routeId } = useParams();
//   const user = useSelector((s) => s.user?.value);

//   const [fetchedPlan, setFetchedPlan] = useState(null);
//   const [loadingPlan, setLoadingPlan] = useState(false);

//   const selectedPlan = useMemo(() => {
//     if (fetchedPlan) {
//       return {
//         _id: fetchedPlan._id,
//         name: fetchedPlan.name,
//         price: fetchedPlan.prices?.monthly ?? fetchedPlan.price,
//         billing_interval: fetchedPlan.billing_interval,
//       };
//     }
//     return {
//       _id: state?._id,
//       name: state?.name,
//       price: state?.price,
//       billing_interval: state?.billing_interval,
//     };
//   }, [state, fetchedPlan]);

//   const [form, setForm] = useState({
//     full_name: "",
//     gender: "",
//     age: "",
//     email: "",
//     mobile: "",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const [billingOption, setBillingOption] = useState(null);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);

//   const priceLabelForKey = (key) => {
//     const map = {
//       monthly: "Monthly",
//       quarterly: "Quarterly",
//       half_yearly: "Half Yearly",
//       yearly: "Yearly",
//     };
//     return map[key] || key;
//   };

//   const formatInterval = (val) => {
//     if (!val) return "-";
//     const key = String(val).toUpperCase().replace(/-/g, "_");
//     const map = {
//       MONTHLY: "Monthly",
//       QUARTERLY: "3 months",
//       "3_MONTHS": "3 months",
//       HALF_YEARLY: "6 months",
//       "6_MONTHS": "6 months",
//       YEARLY: "12 months",
//       "12_MONTHS": "12 months",
//     };
//     if (map[key]) return map[key];
//     return String(val)
//       .replaceAll("_", " ")
//       .toLowerCase()
//       .replace(/^./, (c) => c.toUpperCase());
//   };

//   const formatTimeTo12Hour = (time24) => {
//     if (!time24) return "";
//     const [hStr, mStr] = time24.split(":");
//     let h = parseInt(hStr || "0", 10);
//     const m = mStr || "00";
//     const ampm = h >= 12 ? "PM" : "AM";
//     h = h % 12;
//     if (h === 0) h = 12;
//     return `${h}:${m} ${ampm} IST`;
//   };

//   useEffect(() => {
//     if (!fetchedPlan) return;
//     const prices = fetchedPlan.prices || {};
//     const keys = Object.keys(prices);
//     if (keys.length) {
//       const defaultKey = keys.includes("monthly") ? "monthly" : keys[0];
//       setBillingOption(defaultKey);
//     } else {
//       setBillingOption(null);
//     }

//     // Filter batches with capacity > 0
//     const batches = Array.isArray(fetchedPlan.batches)
//       ? fetchedPlan.batches.filter((batch) => batch.capacity > 0)
//       : [];

//     if (batches.length) {
//       setSelectedBatchId(batches[0]._id);
//     } else {
//       setSelectedBatchId(null);
//     }
//   }, [fetchedPlan]);

//   useEffect(() => {
//     if (!routeId) return;
//     const config = user ? { headers: { Authorization: user.access_token } } : {};
//     let cancelled = false;
//     const fetchById = async () => {
//       setLoadingPlan(true);
//       try {
//         const res = await axios.get(`${API_BASE_URL}membership-plan/${routeId}`, config);
//         const data = res.data?.data || res.data || null;
//         console.log("Fetched membership by id:", data);
//         if (!cancelled) {
//           setFetchedPlan(data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch membership plan:", err);
//       } finally {
//         if (!cancelled) setLoadingPlan(false);
//       }
//     };
//     fetchById();
//     return () => {
//       cancelled = true;
//     };
//   }, [routeId, user]);

//   const onChange = (key) => (e) => {
//     const value = e?.target ? e.target.value : e;
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const planId = selectedPlan?._id;
//     if (!planId) {
//       navigate("/get-membership");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const payload = {
//         planId,
//         name: form.full_name,
//         gender: form.gender,
//         age: Number(form.age) || undefined,
//         email: form.email,
//         mobile_number: form.mobile,
//         billing_interval: billingOption || undefined,
//         batch_id: selectedBatchId || undefined,
//       };
//       const res = await axios.post(`${API_BASE_URL}membership-plan/booking`, payload);
//       window.location.href = res.data.checkoutPageUrl;
//     } catch (err) {
//       console.error("Booking error:", err);
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="min-h-screen max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-12 py-10 text-gray-900">
//       <h1 className="text-2xl sm:text-3xl mb-8 font-[glancyr] text-center sm:text-left">Membership Details</h1>
//       <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <DisabledField label="Plan Name" value={selectedPlan?.name} />
//           {/* Price and Billing Interval fields left commented as before */}
//         </div>

//         {fetchedPlan && (
//           <>
//             <div className="mb-6">
//               <label className="block text-sm text-gray-700 mb-1 font-[glancyr]">Choose Price / Interval</label>
//               <select
//                 value={billingOption || ""}
//                 onChange={(e) => setBillingOption(e.target.value || null)}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
//               >
//                 {Object.keys(fetchedPlan.prices || {}).length === 0 && (
//                   <option value="">No price options</option>
//                 )}
//                 {Object.entries(fetchedPlan.prices || {}).map(([key, amount]) => (
//                   <option key={key} value={key}>
//                     {priceLabelForKey(key)} — ₹{Number(amount).toLocaleString("en-IN")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm text-gray-700 mb-2 font-[glancyr]">Choose Batch</label>
//               <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-white max-w-md mx-auto">
//                 {Array.isArray(fetchedPlan.batches) && fetchedPlan.batches.length ? (
//                   // Filter the batches displayed to only those with capacity > 0
//                   fetchedPlan.batches.filter(batch => batch.capacity > 0).length > 0 ? (
//                     fetchedPlan.batches
//                       .filter((batch) => batch.capacity > 0)
//                       .map((batch) => {
//                         const scheduleStr = batch.schedule
//                           .map(
//                             (s) =>
//                               `${s.day}(${formatTimeTo12Hour(s.start_time)} - ${formatTimeTo12Hour(
//                                 s.end_time
//                               )})`
//                           )
//                           .join(" - ");
//                         return (
//                           <label
//                             key={batch._id}
//                             className="flex items-center gap-3 cursor-pointer text-gray-900 font-medium"
//                           >
//                             <input
//                               type="radio"
//                               name="batch"
//                               value={batch._id}
//                               checked={selectedBatchId === batch._id}
//                               onChange={() => setSelectedBatchId(batch._id)}
//                               className="form-radio rounded border-gray-300 h-5 w-5"
//                             />
//                             <span>
//                               {scheduleStr} (Capacity: {batch.capacity ?? "-"})
//                             </span>
//                           </label>
//                         );
//                       })
//                   ) : (
//                     <p className="text-gray-500">No batches available</p>
//                   )
//                 ) : (
//                   <p className="text-gray-500">No batches available</p>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Input label="Full name">
//             <input
//               required
//               value={form.full_name}
//               onChange={onChange("full_name")}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
//               placeholder="Enter your full name"
//             />
//           </Input>

//           <Input label="Gender">
//             <select
//               required
//               value={form.gender}
//               onChange={onChange("gender")}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
//             >
//               <option value="" disabled>
//                 Select gender
//               </option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Others">Others</option>
//             </select>
//           </Input>

//           <Input label="Age">
//             <input
//               required
//               type="number"
//               min="1"
//               value={form.age}
//               onChange={onChange("age")}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
//               placeholder="Enter your age"
//             />
//           </Input>

//           <Input label="Email">
//             <input
//               required
//               type="email"
//               value={form.email}
//               onChange={onChange("email")}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
//               placeholder="Enter your email"
//             />
//           </Input>

//           <Input label="Mobile number" className="sm:col-span-2">
//             <input
//               required
//               type="tel"
//               value={form.mobile}
//               onChange={onChange("mobile")}
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
//               placeholder="Enter your mobile number"
//             />
//           </Input>
//         </div>

//         <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
//           <button
//             type="submit"
//             disabled={submitting}
//             className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#D2663B] text-white font-medium hover:opacity-90 disabled:opacity-60 transition"
//           >
//             {submitting ? "Submitting..." : "Submit"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="w-full sm:w-auto px-5 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// };

// export default MembershipForm;
/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Input = ({ label, children }) => (
  <label className="block mb-4">
    <span className="block text-sm text-gray-700 mb-1 font-[glancyr]">
      {label}
    </span>
    {children}
  </label>
);

const DisabledField = ({ label, value }) => (
  <Input label={label}>
    <div
      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 break-words whitespace-pre-wrap min-h-[56px] max-h-[240px] overflow-auto"
      title={value}
      aria-readonly="true"
    >
      {value ?? "-"}
    </div>
  </Input>
);

const MembershipForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id: routeId } = useParams();
  const user = useSelector((s) => s.user?.value);

  const [fetchedPlan, setFetchedPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const selectedPlan = useMemo(() => {
    if (fetchedPlan) {
      return {
        _id: fetchedPlan._id,
        name: fetchedPlan.name,
        price: fetchedPlan.prices?.monthly ?? fetchedPlan.price,
        billing_interval: fetchedPlan.billing_interval,
      };
    }
    return {
      _id: state?._id,
      name: state?.name,
      price: state?.price,
      billing_interval: state?.billing_interval,
    };
  }, [state, fetchedPlan]);

  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    age: "",
    email: "",
    mobile: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [billingOption, setBillingOption] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const priceLabelForKey = (key) => {
    const map = {
      monthly: "Monthly",
      quarterly: "Quarterly",
      half_yearly: "Half Yearly",
      yearly: "Yearly",
    };
    return map[key] || key;
  };

  const formatInterval = (val) => {
    if (!val) return "-";
    const key = String(val).toUpperCase().replace(/-/g, "_");
    const map = {
      MONTHLY: "Monthly",
      QUARTERLY: "3 months",
      "3_MONTHS": "3 months",
      HALF_YEARLY: "6 months",
      "6_MONTHS": "6 months",
      YEARLY: "12 months",
      "12_MONTHS": "12 months",
    };
    if (map[key]) return map[key];
    return String(val)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/^./, (c) => c.toUpperCase());
  };

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr || "0", 10);
    const m = mStr || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  };

  const formatDayName = (day) => {
    const dayMap = {
      MONDAY: "MONDAY",
      TUESDAY: "TUESDAY",
      WEDNESDAY: "WEDNESDAY",
      THURSDAY: "THURSDAY",
      FRIDAY: "FRIDAY",
      SATURDAY: "SATURDAY",
      SUNDAY: "SUNDAY",
    };
    return dayMap[day] || day;
  };
  // const formatDayName = (day) => {
  //   return day; // Already uppercase from API
  // };

  // const groupScheduleByTime = (schedule) => {
  //   if (!schedule || !schedule.length) return [];

  //   const groups = [];
  //   let currentGroup = {
  //     days: [schedule[0].day],
  //     start_time: schedule[0].start_time,
  //     end_time: schedule[0].end_time,
  //   };

  //   for (let i = 1; i < schedule.length; i++) {
  //     const current = schedule[i];
  //     if (
  //       current.start_time === currentGroup.start_time &&
  //       current.end_time === currentGroup.end_time
  //     ) {
  //       currentGroup.days.push(current.day);
  //     } else {
  //       groups.push({ ...currentGroup });
  //       currentGroup = {
  //         days: [current.day],
  //         start_time: current.start_time,
  //         end_time: current.end_time,
  //       };
  //     }
  //   }
  //   groups.push(currentGroup);

  //   return groups
  //     .map((group) => {
  //       const formattedDays = group.days.map(formatDayName);
  //       let dayRange;
  //       if (formattedDays.length === 1) {
  //         dayRange = formattedDays[0];
  //       } else if (formattedDays.length === 2) {
  //         dayRange = formattedDays.join(" & ");
  //       } else {
  //         dayRange = `${formattedDays[0]} - ${
  //           formattedDays[formattedDays.length - 1]
  //         }`;
  //       }

  //       return `${dayRange} (${formatTimeTo12Hour(
  //         group.start_time
  //       )} - ${formatTimeTo12Hour(group.end_time)})`;
  //     })
  //     .join(" | ");
  // };
  const groupScheduleByTime = (schedule) => {
  if (!schedule || !schedule.length) return [];

  const groups = [];
  let currentGroup = {
    days: [schedule[0].day],
    start_time: schedule[0].start_time,
    end_time: schedule[0].end_time,
  };

  for (let i = 1; i < schedule.length; i++) {
    const current = schedule[i];
    if (
      current.start_time === currentGroup.start_time &&
      current.end_time === currentGroup.end_time
    ) {
      currentGroup.days.push(current.day);
    } else {
      groups.push({ ...currentGroup });
      currentGroup = {
        days: [current.day],
        start_time: current.start_time,
        end_time: current.end_time,
      };
    }
  }
  groups.push(currentGroup);

  return groups
    .map((group) => {
      const formattedDays = group.days.map(formatDayName);
      let dayRange;
      
      if (formattedDays.length === 1) {
        dayRange = formattedDays[0];
      } else if (formattedDays.length === 2) {
        dayRange = formattedDays.join(" & ");
      } else {
        // For 3 or more days, list them with commas
        dayRange = formattedDays.join(", ");
      }

      return `${dayRange} (${formatTimeTo12Hour(
        group.start_time
      )} - ${formatTimeTo12Hour(group.end_time)})`;
    })
    .join(" | ");
};

  useEffect(() => {
    if (!fetchedPlan) return;
    const prices = fetchedPlan.prices || {};
    const keys = Object.keys(prices);
    if (keys.length) {
      const defaultKey = keys.includes("monthly") ? "monthly" : keys[0];
      setBillingOption(defaultKey);
    } else {
      setBillingOption(null);
    }

    const batches = Array.isArray(fetchedPlan.batches)
      ? fetchedPlan.batches.filter((batch) => batch.capacity > 0)
      : [];

    if (batches.length) {
      setSelectedBatchId(batches[0]._id);
    } else {
      setSelectedBatchId(null);
    }
  }, [fetchedPlan]);

  useEffect(() => {
    if (!routeId) return;
    const config = user
      ? { headers: { Authorization: user.access_token } }
      : {};
    let cancelled = false;
    const fetchById = async () => {
      setLoadingPlan(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}membership-plan/${routeId}`,
          config
        );
        const data = res.data?.data || res.data || null;
        console.log("Fetched membership by id:", data);
        if (!cancelled) {
          setFetchedPlan(data);
        }
      } catch (err) {
        console.error("Failed to fetch membership plan:", err);
      } finally {
        if (!cancelled) setLoadingPlan(false);
      }
    };
    fetchById();
    return () => {
      cancelled = true;
    };
  }, [routeId, user]);

  const onChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const planId = selectedPlan?._id;
    if (!planId) {
      navigate("/get-membership");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        planId,
        name: form.full_name,
        gender: form.gender,
        age: Number(form.age) || undefined,
        email: form.email,
        mobile_number: form.mobile,
        billing_interval: billingOption || undefined,
        batch_id: selectedBatchId || undefined,
      };
      const res = await axios.post(
        `${API_BASE_URL}membership-plan/booking`,
        payload
      );
      window.location.href = res.data.checkoutPageUrl;
    } catch (err) {
      console.error("Booking error:", err);
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-12 py-10 text-gray-900">
      <h1 className="text-2xl sm:text-3xl mb-8 font-[glancyr] text-center sm:text-left">
        Membership Details
      </h1>
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DisabledField label="Plan Name" value={selectedPlan?.name} />
        </div>

        {fetchedPlan && (
          <>
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-1 font-[glancyr]">
                Choose Price / Interval
              </label>
              <select
                value={billingOption || ""}
                onChange={(e) => setBillingOption(e.target.value || null)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
              >
                {Object.keys(fetchedPlan.prices || {}).length === 0 && (
                  <option value="">No price options</option>
                )}
                {Object.entries(fetchedPlan.prices || {}).map(
                  ([key, amount]) => (
                    <option key={key} value={key}>
                      {priceLabelForKey(key)} — ₹
                      {Number(amount).toLocaleString("en-IN")}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2 font-[glancyr]">
                Choose Batch
              </label>
              <div className="space-y-3 border border-gray-300 rounded-lg p-4 bg-white max-w-2xl mx-auto">
                {Array.isArray(fetchedPlan.batches) &&
                fetchedPlan.batches.length ? (
                  fetchedPlan.batches.filter((batch) => batch.capacity > 0)
                    .length > 0 ? (
                    fetchedPlan.batches
                      .filter((batch) => batch.capacity > 0)
                      .map((batch) => {
                        const scheduleStr = groupScheduleByTime(batch.schedule);
                        return (
                          <label
                            key={batch._id}
                            className="flex items-start gap-3 cursor-pointer text-gray-900"
                          >
                            <input
                              type="radio"
                              name="batch"
                              value={batch._id}
                              checked={selectedBatchId === batch._id}
                              onChange={() => setSelectedBatchId(batch._id)}
                              className="form-radio rounded border-gray-300 h-5 w-5 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-sm leading-relaxed">
                              {scheduleStr}{" "}
                              <span className="font-semibold">
                                (Capacity: {batch.capacity})
                              </span>
                            </span>
                          </label>
                        );
                      })
                  ) : (
                    <p className="text-gray-500">No batches available</p>
                  )
                ) : (
                  <p className="text-gray-500">No batches available</p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name">
            <input
              required
              value={form.full_name}
              onChange={onChange("full_name")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
              placeholder="Enter your full name"
            />
          </Input>

          <Input label="Gender">
            <select
              required
              value={form.gender}
              onChange={onChange("gender")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </Input>

          <Input label="Age">
            <input
              required
              type="number"
              min="1"
              value={form.age}
              onChange={onChange("age")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
              placeholder="Enter your age"
            />
          </Input>

          <Input label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={onChange("email")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
              placeholder="Enter your email"
            />
          </Input>

          <Input label="Mobile number" className="sm:col-span-2">
            <input
              required
              type="tel"
              value={form.mobile}
              onChange={onChange("mobile")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2663B]"
              placeholder="Enter your mobile number"
            />
          </Input>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#D2663B] text-white font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default MembershipForm;
