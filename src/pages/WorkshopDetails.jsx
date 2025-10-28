// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import moment from "moment-timezone";
// import { useParams } from "react-router-dom";
// import { message } from "antd";
// import { API_BASE_URL } from "../../config";

// const WorkshopDetails = () => {
//   const { id } = useParams();

//   const [workshop, setWorkshop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [formValues, setFormValues] = useState({
//     full_name: "",
//     age: "",
//     mobile: "",
//     email: "",
//     gender: "",
//   });

//   // Store ticket count per batchId, max 1 per batch
//   const [tickets, setTickets] = useState({});

//   // Fetch workshop details
//   useEffect(() => {
//     async function fetchWorkshop() {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE_URL}workshop/${id}`);
//         const w = res.data?.data || res.data || {};
//         setWorkshop(w);
//         // init tickets
//         if (w.batches && Array.isArray(w.batches)) {
//           const initTickets = {};
//           w.batches.forEach((batch) => {
//             initTickets[batch._id] = 0;
//           });
//           setTickets(initTickets);
//         }
//       } catch (error) {
//         message.error("Failed to load workshop details");
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (id) fetchWorkshop();
//   }, [id]);

//   // Get image full url util
//   const getImageUrl = (url) => {
//     if (!url) return "";
//     if (url.startsWith("http")) return url;
//     if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
//     return `${API_BASE_URL}api/${url}`;
//   };

//   // Format date/time
//   const formatDate = (dateStr) =>
//     moment(dateStr).tz("Asia/Kolkata").format("DD MMM YYYY");

//   const formatTime = (timeStr) =>
//     moment(timeStr).tz("Asia/Kolkata").format("hh:mm A");

//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle ticket number change: limit max 1 per batch, no total max
//   const handleTicketChange = (batchId, change) => {
//     setTickets((prev) => {
//       const currQty = prev[batchId] || 0;
//       const newQty = Math.min(Math.max(currQty + change, 0), 1);
//       return { ...prev, [batchId]: newQty };
//     });
//   };

//   // Calculate price for batch: early bird if capacity left, else regular
//   const getBatchPrice = (batch) => {
//     const earlyBirdCapacity = batch.pricing?.early_bird?.capacity_limit ?? 0;
//     const earlyBirdPrice = batch.pricing?.early_bird?.price ?? null;
//     const regularPrice = batch.pricing?.regular?.price ?? null;

//     if (earlyBirdPrice !== null && earlyBirdCapacity > 0) {
//       return { price: earlyBirdPrice, label: "Early Bird" };
//     }
//     if (regularPrice !== null) {
//       return { price: regularPrice, label: "Regular" };
//     }
//     return { price: 0, label: "" };
//   };

//   // Calculate if On The Spot price available and seats available
//   const hasOnTheSpot = (batch) => {
//     return (
//       batch.pricing &&
//       batch.pricing.on_the_spot &&
//       batch.pricing.on_the_spot.price != null &&
//       batch.capacity > 0
//     );
//   };

//   // Total price of selected tickets
//   const totalPrice = Object.entries(tickets).reduce((acc, [batchId, qty]) => {
//     if (qty > 0 && workshop) {
//       const batch = workshop.batches.find((b) => b._id === batchId);
//       if (batch) {
//         const { price } = getBatchPrice(batch);
//         return acc + price * qty;
//       }
//     }
//     return acc;
//   }, 0);

//   // Simple validation
//   const validate = () => {
//     if (!formValues.full_name.trim()) {
//       message.error("Please enter full name");
//       return false;
//     }
//     if (!formValues.age.trim() || Number(formValues.age) <= 0) {
//       message.error("Please enter a valid age");
//       return false;
//     }
//     if (!formValues.mobile.trim() || !/^\d{10}$/.test(formValues.mobile)) {
//       message.error("Please enter a valid 10-digit phone number");
//       return false;
//     }
//     if (!formValues.email.trim() || !/\S+@\S+\.\S+/.test(formValues.email)) {
//       message.error("Please enter a valid email");
//       return false;
//     }
//     const ticketsSelected = Object.values(tickets).some((qty) => qty > 0);
//     if (!ticketsSelected) {
//       message.error("Please select at least one ticket");
//       return false;
//     }
//     return true;
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validate()) return;
// //     setSubmitting(true);
// //     console.log("outside try");

// //     try {
// //         console.log("inside try");

// //       const selectedBatchIds = Object.entries(tickets)
// //         .filter(([_, qty]) => qty > 0)
// //         .map(([batchId]) => batchId);

// //       if (selectedBatchIds.length === 0) {
// //         message.error("Please select at least one ticket");
// //         setSubmitting(false);
// //         return;
// //       }

// //       // Submit bookings sequentially to backend, as backend expects one batchId per booking
// //       for (let i = 0; i < selectedBatchIds.length; i++) {
// //         const batchId = selectedBatchIds[i];
// //         const payload = {
// //           workshopId: id,
// //           batchId,
// //           name: formValues.full_name,
// //           age: Number(formValues.age),
// //           email: formValues.email,
// //           mobile_number: formValues.mobile,
// //           gender: formValues.gender || "", // send selected gender
// //         };
// //         const res = await axios.post(`${API_BASE_URL}workshop/book`, payload);

// //         // If last batch, redirect
// //         if (i === selectedBatchIds.length - 1) {
// //           message.success("Booking successful!");
// //           if (res.data.checkoutPageUrl) {
// //             window.location.href = res.data.checkoutPageUrl;
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       message.error("Failed to submit booking. Please try again.");
// //       setSubmitting(false);
// //     }
// //   };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validate()) return;
//   setSubmitting(true);

//   try {
//     const selectedBatchIds = Object.entries(tickets)
//       .filter(([_, qty]) => qty > 0)
//       .map(([batchId]) => batchId);

//     if (selectedBatchIds.length === 0) {
//       message.error("Please select at least one ticket");
//       setSubmitting(false);
//       return;
//     }

//     const payload = {
//       workshopId: id,
//       name: formValues.full_name,
//       age: Number(formValues.age),
//       email: formValues.email,
//       mobile_number: formValues.mobile,
//       gender: formValues.gender || "",
//       batchIds: selectedBatchIds, // send array of batch IDs here
//     };

//     const res = await axios.post(`${API_BASE_URL}workshop/book`, payload);

//     message.success("Booking successful!");
//     if (res.data.checkoutPageUrl) {
//       window.location.href = res.data.checkoutPageUrl;
//     }
//   } catch (error) {
//     message.error("Failed to submit booking. Please try again.");
//   } finally {
//     setSubmitting(false);
//   }
// };

//   if (loading) {
//     return (
//       <div className="font-[glancyr] py-20 text-center text-gray-600 text-xl">
//         Loading workshop details...
//       </div>
//     );
//   }

//   if (!workshop) {
//     return (
//       <div className="font-[glancyr] py-20 text-center text-gray-600 text-xl">
//         No workshop found.
//       </div>
//     );
//   }

//   const firstInstructor =
//     Array.isArray(workshop.instructor_user_ids) &&
//     workshop.instructor_user_ids.length > 0
//       ? workshop.instructor_user_ids[0]
//       : null;

//   let instructorImageUrl = "";
//   if (
//     firstInstructor &&
//     Array.isArray(firstInstructor.media) &&
//     firstInstructor.media.length > 0
//   ) {
//     const media = firstInstructor.media[0];
//     instructorImageUrl = getImageUrl(media.image_url.full?.high_res || "");
//   }

//   return (
//     <div className="font-[glancyr] max-w-6xl mx-auto px-4 py-6 sm:py-10">
//       <h1 className="text-4xl mb-8 text-center text-[#26442C] font-semibold">
//         Workshop Details
//       </h1>

//       <div className="flex flex-col-reverse md:flex-row gap-10">
//         {/* Booking Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="w-full md:w-1/2 flex flex-col gap-6"
//           noValidate
//           autoComplete="off"
//         >
//           <div>
//             <label
//               htmlFor="full_name"
//               className="block mb-1 font-semibold text-[#26442C]"
//             >
//               Full Name
//             </label>
//             <input
//               id="full_name"
//               name="full_name"
//               value={formValues.full_name}
//               onChange={handleInputChange}
//               type="text"
//               required
//               placeholder="Enter your full name"
//               className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#26442C]"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="age"
//               className="block mb-1 font-semibold text-[#26442C]"
//             >
//               Age
//             </label>
//             <input
//               id="age"
//               name="age"
//               value={formValues.age}
//               onChange={handleInputChange}
//               type="number"
//               min="1"
//               max="120"
//               required
//               placeholder="Enter your age"
//               className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#26442C]"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="mobile"
//               className="block mb-1 font-semibold text-[#26442C]"
//             >
//               Phone Number
//             </label>
//             <input
//               id="mobile"
//               name="mobile"
//               value={formValues.mobile}
//               onChange={handleInputChange}
//               type="tel"
//               pattern="[0-9]{10}"
//               required
//               placeholder="Enter your phone number"
//               className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#26442C]"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="email"
//               className="block mb-1 font-semibold text-[#26442C]"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               name="email"
//               value={formValues.email}
//               onChange={handleInputChange}
//               type="email"
//               required
//               placeholder="Enter your email"
//               className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#26442C]"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="gender"
//               className="block mb-1 font-semibold text-[#26442C]"
//             >
//               Gender
//             </label>
//             <select
//               id="gender"
//               name="gender"
//               value={formValues.gender}
//               onChange={handleInputChange}
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#26442C] bg-white"
//             >
//               <option value="">Select gender</option>
//               <option value="Male">MALE</option>
//               <option value="Female">FEMALE</option>
//               <option value="Other">OTHERS</option>
//             </select>
//           </div>

//           <div>
//             <h2 className="text-2xl font-semibold text-[#26442C] mb-4">
//               Select Batch Tickets
//             </h2>
//             {workshop.batches.map((batch) => {
//               const { price, label } = getBatchPrice(batch);
//               const isEarlyBird = label === "Early Bird";

//               return (
//                 <div
//                   key={batch._id}
//                   className="flex flex-col border border-gray-300 rounded p-4 mb-4"
//                 >
//                   <div className="flex flex-wrap justify-between items-center mb-1">
//                     <div className="font-semibold text-[#26442C] text-lg truncate w-full sm:w-auto">
//                       {formatTime(batch.start_time)} -{" "}
//                       {formatTime(batch.end_time)} | Seats Left:{" "}
//                       {batch.capacity}
//                     </div>
//                     <div className="text-[#D16539] font-bold text-lg mt-2 sm:mt-0 w-full sm:w-auto">
//                       ₹{price}{" "}
//                       {isEarlyBird && (
//                         <span className="ml-2 text-sm font-normal text-green-600">
//                           (Early Bird)
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Show On The Spot price if available */}
//                   {/* {hasOnTheSpot(batch) && (
//                     <p className="text-[#D16539] font-semibold text-sm mt-1">
//                       On The Spot Price: ₹{batch.pricing.on_the_spot.price}{" "}
//                       <span className="text-gray-600">(only if seats available)</span>
//                     </p>
//                   )} */}

//                   {/* Show Regular price if available & different from displayed price */}
//                   {!isEarlyBird && batch.pricing?.regular?.price != null && (
//                     <p className="text-[#D16539] font-semibold text-sm mt-1">
//                       Regular Price: ₹{batch.pricing.regular.price}
//                     </p>
//                   )}

//                   {/* Quantity selector */}
//                   <div className="flex items-center justify-start gap-3 mt-3">
//                     <button
//                       type="button"
//                       disabled={(tickets[batch._id] || 0) <= 0 || submitting}
//                       onClick={() => handleTicketChange(batch._id, -1)}
//                       className="border px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//                       aria-label="Decrease quantity"
//                     >
//                       -
//                     </button>
//                     <span className="min-w-[20px] text-center font-semibold text-[#26442C]">
//                       {tickets[batch._id] || 0}
//                     </span>
//                     <button
//                       type="button"
//                       disabled={(tickets[batch._id] || 0) >= 1 || submitting}
//                       onClick={() => handleTicketChange(batch._id, +1)}
//                       className="border px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//                       aria-label="Increase quantity"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <button
//             type="submit"
//             disabled={
//               Object.values(tickets).reduce((a, b) => a + b, 0) === 0 ||
//               submitting
//             }
//             className={`w-full py-3 font-semibold rounded ${
//               Object.values(tickets).reduce((a, b) => a + b, 0) === 0 ||
//               submitting
//                 ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                 : "bg-[#26442C] text-white hover:bg-[#1E791E] active:scale-[0.98] transition-transform"
//             }`}
//           >
//             {submitting ? "Processing..." : `Pay Now ₹${totalPrice}`}
//           </button>
//         </form>

//         {/* Workshop Details */}
//         <section className="w-full md:w-1/2 flex flex-col gap-6">
//           {/* Instructor Image */}
//           <div className="w-full max-w-xs mx-auto md:mx-0">
//             {instructorImageUrl ? (
//               <img
//                 src={instructorImageUrl}
//                 alt={`Instructor ${firstInstructor.first_name} ${firstInstructor.last_name}`}
//                 className="rounded-md w-full h-auto object-cover shadow"
//                 loading="lazy"
//               />
//             ) : (
//               <div className="w-full h-64 bg-gray-100 rounded-md flex justify-center items-center text-gray-400">
//                 No Image
//               </div>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="text-3xl font-bold text-[#26442C]">
//             {workshop.title}
//           </h2>

//           {/* Date */}
//           <p className="text-[#D16539] font-semibold text-lg mb-4">
//             Date: {formatDate(workshop.date)}
//           </p>

//           {/* Batch Details */}
//           <div>
//             <h3 className="font-semibold text-[#26442C] text-xl mb-3">
//               Batch Details
//             </h3>
//             {workshop.batches.map((batch) => (
//               <div
//                 key={batch._id}
//                 className="border border-gray-300 p-3 rounded mb-3"
//               >
//                 <p className="font-semibold text-[#26442C]">
//                   Time: {formatTime(batch.start_time)} -{" "}
//                   {formatTime(batch.end_time)}
//                 </p>
//                 <p>
//                   Seats Left:{" "}
//                   <span className="font-bold text-[#D16539]">
//                     {batch.capacity}
//                   </span>
//                 </p>
//                 <p>
//                   {batch.pricing?.early_bird?.price != null && (
//                     <>
//                       Early Bird: ₹{batch.pricing.early_bird.price}{" "}
//                       {batch.pricing.early_bird.capacity_limit
//                         ? `(Limit: ${batch.pricing.early_bird.capacity_limit})`
//                         : ""}
//                       <br />
//                     </>
//                   )}

//                   {batch.pricing?.regular?.price != null && (
//                     <>
//                       Regular: ₹{batch.pricing.regular.price}
//                       <br />
//                     </>
//                   )}

//                   {batch.pricing?.on_the_spot?.price != null &&
//                     batch.capacity > 0 && (
//                       <span>
//                         On The Spot: ₹{batch.pricing.on_the_spot.price} (only if
//                         seats available)
//                       </span>
//                     )}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Terms and Conditions */}
//           <div>
//             <h3 className="font-semibold text-[#26442C] text-xl mb-3">
//               Terms and Conditions
//             </h3>
//             <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-gray-700 font-normal">
//               <li>
//                 No cancellation / refund / transmission after payment is
//                 completed. Interchange of sessions is not permitted.
//               </li>
//               <li>
//                 If you like to wear dance shoes during the session, you must
//                 change into clean shoes after you arrive at the studio.
//               </li>
//               <li>
//                 Admission is only for the registered person during the booking.
//                 No swap to any other person is allowed.
//               </li>
//               <li>
//                 Please bring your photo ID for verification (Soft or hard copy)
//                 for admission.
//               </li>
//               <li>
//                 Your booking is not confirmed unless until you receive the email
//                 receipt for your payment. So please ensure you enter a valid
//                 email ID properly without any spelling mistakes. You would
//                 receive an email receipt once your payment is successfully
//                 credited to our account and that would serve as entry pass.
//               </li>
//               <li>
//                 Your booking is not confirmed even though money is deducted from
//                 your bank. We can confirm your booking and send a receipt only
//                 when the fund is credited to our bank account. In such rare
//                 occurrences, the fund gets credited back to your bank account
//                 within 24-48 hours.
//               </li>
//               <li>
//                 Your act of booking the tickets by making the payment means that
//                 you are in complete agreement with these terms and conditions
//                 along with other terms and policies listed in the bottom of this
//                 page.
//               </li>
//             </ol>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default WorkshopDetails;
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Select, Button } from "antd";
import { API_BASE_URL } from "../../config";

const { Option } = Select;

const SERVICE_FEE = 50;

const WorkshopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  // Tickets selected per batchId, max 1 per batch
  const [tickets, setTickets] = useState({});

  // Fetch workshop details
  useEffect(() => {
    async function fetchWorkshop() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}workshop/${id}`);
        const w = res.data?.data || res.data || {};
        setWorkshop(w);

        if (w.batches && Array.isArray(w.batches)) {
          const initTickets = {};
          w.batches.forEach((batch) => {
            initTickets[batch._id] = 0;
          });
          setTickets(initTickets);
        }
      } catch (error) {
        message.error("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchWorkshop();
  }, [id]);

  // Get full image url util
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  // Date/time formatting
  const formatDate = (dateStr) =>
    moment(dateStr).tz("Asia/Kolkata").format("DD MMM YYYY");

  const formatTime = (timeStr) =>
    moment(timeStr).tz("Asia/Kolkata").format("hh:mm A");

  // Handle ticket quantity change per batch, max 1
  const handleTicketChange = (batchId, change) => {
    setTickets((prev) => {
      const currQty = prev[batchId] || 0;
      const newQty = Math.min(Math.max(currQty + change, 0), 1);
      return { ...prev, [batchId]: newQty };
    });
  };

  // Calculate price & label based on capacity
  const getBatchPrice = (batch) => {
    const earlyBirdCapacity = batch.pricing?.early_bird?.capacity_limit ?? 0;
    const earlyBirdPrice = batch.pricing?.early_bird?.price ?? null;
    const regularPrice = batch.pricing?.regular?.price ?? null;

    if (earlyBirdCapacity > 0 && earlyBirdPrice !== null) {
      return { price: earlyBirdPrice, label: "Early Bird" };
    }
    if (regularPrice !== null) {
      return { price: regularPrice, label: "Regular" };
    }
    return { price: 0, label: "" };
  };

  // Check if on the spot pricing and seats available
  const hasOnTheSpot = (batch) => {
    return (
      batch.pricing &&
      batch.pricing.on_the_spot &&
      batch.pricing.on_the_spot.price != null &&
      batch.capacity > 0
    );
  };

  // Sum total seats left across batches
  const totalSeatsLeft = workshop
    ? workshop.batches.reduce((acc, b) => acc + b.capacity, 0)
    : 0;

  // Check if seats are fully booked (no capacity left)
  const seatsFull = totalSeatsLeft === 0;

  // Total price + service fee (only if tickets selected)
  const totalTicketsPrice = Object.entries(tickets).reduce(
    (acc, [batchId, qty]) => {
      if (qty > 0 && workshop) {
        const batch = workshop.batches.find((b) => b._id === batchId);
        if (batch) {
          const { price } = getBatchPrice(batch);
          return acc + price * qty;
        }
      }
      return acc;
    },
    0
  );
  const totalPrice = totalTicketsPrice; //+ SERVICE_FEE : 0
  console.log("total price", totalPrice);

  // Validation before submit
  const validate = () => {
    const values = form.getFieldsValue();
    if (!values.full_name || !values.full_name.trim()) {
      message.error("Please enter full name");
      return false;
    }
    if (!values.age || Number(values.age) <= 0) {
      message.error("Please enter a valid age");
      return false;
    }
    if (!values.mobile || !/^\d{10}$/.test(values.mobile)) {
      message.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
      message.error("Please enter a valid email");
      return false;
    }
    const ticketsSelected = Object.values(tickets).some((qty) => qty > 0);
    if (!ticketsSelected) {
      message.error("Please select at least one ticket");
      return false;
    }
    if (seatsFull) {
      message.error("Seats are full, booking is not available.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const selectedBatchIds = Object.entries(tickets)
        .filter(([_, qty]) => qty > 0)
        .map(([batchId]) => batchId);

      if (selectedBatchIds.length === 0) {
        message.error("Please select at least one ticket");
        setSubmitting(false);
        return;
      }

      const values = form.getFieldsValue();

      const payload = {
        workshopId: id,
        name: values.full_name,
        age: Number(values.age),
        email: values.email,
        mobile_number: values.mobile,
        gender: values.gender || "",
        batchIds: selectedBatchIds,
        price: totalPrice, // include service fee here
      };

      const res = await axios.post(`${API_BASE_URL}workshop/book`, payload);

      message.success("Booking successful!");
      if (res.data.checkoutPageUrl) {
        window.location.href = res.data.checkoutPageUrl;
      }
    } catch (error) {
      message.error("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="font-[glancyr] py-20 text-center text-gray-600 text-xl">
        Loading workshop details...
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="font-[glancyr] py-20 text-center text-gray-600 text-xl">
        No workshop found.
      </div>
    );
  }

  const workshopImageUrl =
    workshop.media && workshop.media.length > 0
      ? getImageUrl(workshop.media[0].image_url.full?.high_res || "")
      : "";

  return (
    <div className="font-[glancyr] max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#26442C] font-semibold hover:underline cursor-pointer"
        aria-label="Go back"
      >
        &larr; Back
      </button>
      <h1 className="text-4xl mb-8 text-center text-[#26442C] font-semibold">
        Workshop Details
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left side: image, title, batch details */}
        <section className="w-full md:w-1/2 flex flex-col gap-6">
          {workshopImageUrl ? (
            <img
              src={workshopImageUrl}
              alt={workshop.title}
              className="w-[70%] h-full rounded shadow object-cover mx-auto"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-md flex justify-center items-center text-gray-400">
              No Image
            </div>
          )}

          {/* Title below image */}
          <h1 className="text-4xl font-bold text-center text-[#26442C]">
            {workshop.title}
          </h1>

          {/* Batch Details Header */}
          

          {/* Batch details list */}
          {/* <div className="space-y-4">
            {workshop.batches.map((batch) => {
              const { price, label } = getBatchPrice(batch);
              const seatsLeft = batch.capacity > 0;
              return (
                <div
                  key={batch._id}
                  className={`border rounded p-4 flex justify-between items-center ${
                    seatsLeft ? "border-gray-300" : "border-red-400 bg-red-50"
                  }`}
                >
                  <div className="flex flex-col max-w-[60%] text-[#26442C] font-semibold">
                    <span className="truncate">{batch.name || "Batch"}</span>
                    <span className="text-sm font-normal">
                      {formatTime(batch.start_time)} - {formatTime(batch.end_time)}
                    </span>
                  </div>
                  <div className="text-[#D16539] font-bold flex flex-col items-end min-w-[100px]">
                    <span>
                      ₹{price} {label && <span className="text-xs font-normal">({label})</span>}
                    </span>
                    {hasOnTheSpot(batch) && (
                      <span className="text-xs font-normal text-gray-600">
                        On Spot Price: ₹{batch.pricing.on_the_spot.price}
                      </span>
                    )}
                    {!seatsLeft && (
                      <span className="text-xs text-red-600 font-semibold">Seats Full</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div> */}
          {/* Batch details list */}
          <div className="space-y-4">
            {workshop.batches.map((batch) => {
              const seatsLeft = batch.capacity > 0;
              const earlyBirdCapacity =
                batch.pricing?.early_bird?.capacity_limit ?? 0;
              const earlyBirdPrice = batch.pricing?.early_bird?.price ?? null;
              const regularPrice = batch.pricing?.regular?.price ?? null;
              const showBothPrices =
                earlyBirdCapacity > 0 &&
                earlyBirdPrice !== null &&
                regularPrice !== null;

              return (
                <div
                  key={batch._id}
                  className={`border rounded p-4 flex justify-between items-center ${
                    seatsLeft ? "border-gray-300" : "border-red-400 bg-red-50"
                  }`}
                >
                  <div className="flex flex-col max-w-[60%] text-[#26442C] font-semibold">
                    <span className="truncate">{batch.name || "Batch"}</span>
                    <span className="text-sm font-normal">
                      {formatTime(batch.start_time)} -{" "}
                      {formatTime(batch.end_time)}
                    </span>
                  </div>
                  <div className="text-[#D16539] font-bold flex flex-col items-end min-w-[100px]">
                    {showBothPrices ? (
                      <>
                        <span className="text-sm">
                          ₹{earlyBirdPrice}{" "}
                          <span className="text-xs font-normal">
                            (Early Bird)
                          </span>
                        </span>
                        <span className="text-sm">
                          ₹{regularPrice}{" "}
                          <span className="text-xs font-normal">(Regular)</span>
                        </span>
                      </>
                    ) : earlyBirdCapacity === 0 && regularPrice !== null ? (
                      <span>
                        ₹{regularPrice}{" "}
                        <span className="text-xs font-normal">(Regular)</span>
                      </span>
                    ) : earlyBirdPrice !== null ? (
                      <span>
                        ₹{earlyBirdPrice}{" "}
                        <span className="text-xs font-normal">
                          (Early Bird)
                        </span>
                      </span>
                    ) : regularPrice !== null ? (
                      <span>₹{regularPrice}</span>
                    ) : (
                      <span>₹0</span>
                    )}
                    {hasOnTheSpot(batch) && (
                      <span className="text-xs font-normal text-gray-600 mt-1">
                        On Spot: ₹{batch.pricing.on_the_spot.price}
                      </span>
                    )}
                    {!seatsLeft && (
                      <span className="text-xs text-red-600 font-semibold mt-1">
                        Seats Full
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terms and Conditions */}
          <div className="mt-6">
            <h3 className="font-semibold text-[#26442C] text-xl mb-3">
              Terms and Conditions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-gray-700 font-normal">
              <li>
                No cancellation / refund / transmission after payment is
                completed. Interchange of sessions is not permitted.
              </li>
              <li>
                If you like to wear dance shoes during the session, you must
                change into clean shoes after you arrive at the studio.
              </li>
              <li>
                Admission is only for the registered person during the booking.
                No swap to any other person is allowed.
              </li>
              <li>
                Please bring your photo ID for verification (Soft or hard copy)
                for admission.
              </li>
              <li>
                Your booking is not confirmed unless until you receive the email
                receipt for your payment. So please ensure you enter a valid
                email ID properly without any spelling mistakes.
              </li>
              <li>
                Your booking is not confirmed even though money is deducted from
                your bank. We can confirm your booking only when the fund is
                credited to our bank account.
              </li>
              <li>
                Your act of booking the tickets by making the payment means that
                you agree with all terms and conditions.
              </li>
            </ol>
          </div>
        </section>

        {/* Right side: form in a white rounded card */}
        <section className="w-full md:w-1/2">
          <div className="bg-white shadow rounded-lg p-6 font-[glancyr]">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item
                label="Full Name"
                name="full_name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  placeholder="Enter your full name"
                  disabled={submitting}
                />
              </Form.Item>

              <Form.Item
                label="Age"
                name="age"
                rules={[
                  { required: true, message: "Please enter your age" },
                  {
                    type: "number",
                    min: 1,
                    max: 120,
                    transform: (value) => Number(value),
                    message: "Age must be between 1 and 120",
                  },
                ]}
              >
                <Input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Enter your age"
                  disabled={submitting}
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="mobile"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^\d{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                ]}
              >
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  disabled={submitting}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Enter a valid email",
                  },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={submitting}
                />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select placeholder="Select gender" disabled={submitting}>
                  <Option value="Male">MALE</Option>
                  <Option value="Female">FEMALE</Option>
                  <Option value="Other">OTHERS</Option>
                </Select>
              </Form.Item>

              {/* Select Batch Tickets */}
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-[#26442C] mb-4">
                  Select Batch Tickets
                </h2>
                {workshop.batches.map((batch) => {
                  const { price, label } = getBatchPrice(batch);
                  const seatsLeft = batch.capacity > 0;
                  const currQty = tickets[batch._id] || 0;
                  return (
                    <div
                      key={batch._id}
                      className={`flex justify-between items-center border rounded p-4 mb-4 ${
                        seatsLeft
                          ? "border-gray-300"
                          : "border-red-400 bg-red-50"
                      }`}
                    >
                      <div className="flex flex-col text-[#26442C] font-semibold max-w-[60%]">
                        <span>{batch.name || "Batch"}</span>
                        <span className="text-sm font-normal">
                          {formatTime(batch.start_time)} -{" "}
                          {formatTime(batch.end_time)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[#D16539] font-bold min-w-[150px] justify-end">
                        <span>
                          ₹{price}{" "}
                          {label && (
                            <span className="text-xs font-normal">
                              ({label})
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          disabled={currQty <= 0 || submitting || !seatsLeft}
                          onClick={() => handleTicketChange(batch._id, -1)}
                          aria-label={`Decrease ticket quantity for ${batch.name}`}
                          className="border px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 select-none"
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-center font-semibold text-[#26442C]">
                          {currQty}
                        </span>
                        <button
                          type="button"
                          disabled={currQty >= 1 || submitting || !seatsLeft}
                          onClick={() => handleTicketChange(batch._id, +1)}
                          aria-label={`Increase ticket quantity for ${batch.name}`}
                          className="border px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Service fee info */}
              {totalTicketsPrice > 0 && (
                <p className="text-sm mb-4 text-[#26442C] font-semibold flex justify-between">
                  <span>Service Fee</span>
                  <span>₹{SERVICE_FEE}</span>
                </p>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    seatsFull ||
                    Object.values(tickets).reduce((a, b) => a + b, 0) === 0 ||
                    submitting
                  }
                  block
                  size="large"
                  className="font-semibold text-lg"
                >
                  {seatsFull
                    ? "Seats are full"
                    : submitting
                    ? "Processing..."
                    : `Pay Now ₹${totalPrice}`}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkshopDetails;
