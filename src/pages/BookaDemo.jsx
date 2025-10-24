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

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-[scale-in_0.3s_ease-out]">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-[glancyr] text-gray-900 mb-3">
            Thank You for Booking!
          </h3>
          <p className="text-gray-600 mb-6">
            We appreciate your interest. Our team will reach out to you at the earliest to schedule your demo session.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-full bg-[#D2663B] text-white font-medium hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BookaDemo = () => {
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
      };
    }
    return {
      _id: state?._id,
      name: state?.name || "Demo Session",
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    
    setSubmitting(true);
    try {
      const payload = {
        plan: planId || undefined,
        name: form.full_name,
        gender: form.gender,
        age: Number(form.age) || undefined,
        email: form.email,
        mobile_number: form.mobile,
      };
      
      await axios.post(`${API_BASE_URL}demoClass/demo-bookings`, payload);
      
      setShowSuccessModal(true);
      
      // Reset form
      setForm({
        full_name: "",
        gender: "",
        age: "",
        email: "",
        mobile: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book demo. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  return (
    <>
      <section className="min-h-screen max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-12 py-10 text-gray-900">
        <h1 className="text-2xl sm:text-3xl mb-8 font-[glancyr] text-center sm:text-left">
          Book a Demo
        </h1>
        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 mb-6">
            <DisabledField 
              label="Plan Name" 
              value={loadingPlan ? "Loading..." : selectedPlan?.name} 
            />
          </div>

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
              disabled={submitting || loadingPlan}
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#D2663B] text-white font-medium hover:opacity-90 disabled:opacity-60 transition"
            >
              {submitting ? "Submitting..." : "Book Demo"}
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

      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default BookaDemo;