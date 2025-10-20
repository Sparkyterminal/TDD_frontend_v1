/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react"; // Added MessageCircle icon
import axios from "axios";
import { API_BASE_URL } from "../../config";

export default function EnquiryButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Please tell us why you want to enquire";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}enquire`, {
        name: formData.name,
        phone_number: formData.phone,
        email_id: formData.email,
        purpose: formData.reason,
      });
      alert("Thank you! We will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", reason: "" });
      setIsModalOpen(false);
    } catch (err) {
      alert("There was a problem submitting your enquiry.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      {/* Enquire Now Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className=" cursor-pointer fixed bottom-24 right-6 z-50 bg-gradient-to-r from-gray-600 to-indigo-600 hover:from-gray-800 to-indigo-800 text-white rounded-full px-6 py-4 flex items-center gap-2 shadow-2xl transition-all duration-300"
      >
        <MessageCircle size={24} />
        <span className="font-[glancyr] font-medium hidden sm:inline">
          Enquire Now
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="
                  bg-white rounded-2xl shadow-2xl
                  w-full max-w-md
                  max-h-[90vh]
                  flex flex-col
                  overflow-y-auto
                  "
                style={{ scrollbarWidth: "thin" }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-600 to-indigo-600 p-6 relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="font-[glancyr] text-2xl font-bold text-white mb-2">
                    Get in Touch 💬
                  </h2>
                  <p className="text-purple-100 text-sm font-[glancyr]">
                    Fill out the form and we'll reach out to you soon!
                  </p>
                </div>

                {/* Form */}
                <form
                  className="p-6 space-y-4"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  {/* Name Field */}
                  <div className="font-[glancyr]">
                    <label className="block text-gray-700 font-medium mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="font-[glancyr]">
                    <label className="block text-gray-700 font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="font-[glancyr]">
                    <label className="block text-gray-700 font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      maxLength="10"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Reason Field */}
                  <div className="font-[glancyr]">
                    <label className="block text-gray-700 font-medium mb-1">
                      Reason for Enquiry <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Tell us what you're interested in..."
                      rows="2"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.reason ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none`}
                    />
                    {errors.reason && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reason}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`font-[glancyr] cursor-pointer w-full py-3 px-6 text-base font-medium rounded-lg bg-gradient-to-r from-gray-600 to-indigo-600 hover:from-gray-800 to-indigo-800 text-white shadow-lg transition-all duration-200 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Enquiry 🚀"}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
