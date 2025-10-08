/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Input = ({ label, children }) => (
  <label className="block mb-4">
    <span className="block text-sm text-gray-700 mb-1 font-[glancyr]">{label}</span>
    {children}
  </label>
);

const DisabledField = ({ label, value }) => (
  <Input label={label}>
    <input
      disabled
      value={value ?? "-"}
      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:outline-none"
      readOnly
    />
  </Input>
);

const MembershipForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedPlan = useMemo(
    () => ({
      _id: state?._id,
      name: state?.name,
      price: state?.price,
      billing_interval: state?.billing_interval,
    }),
    [state]
  );

  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    age: "",
    email: "",
    mobile: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const formatInterval = (val) => {
    if (!val) return "-";
    const map = {
      MONTHLY: "Monthly",
      QUARTERLY: "3 months",
      "3_MONTHS": "3 months",
      "6_MONTHS": "6 months",
      NINE_MONTHS: "9 months",
      YEARLY: "12 months",
      "12_MONTHS": "12 months",
    };
    return (
      map[val] ||
      val
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase())
    );
  };

  const onChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan?._id) {
      // If user navigated directly without selecting a plan
      navigate("/get-membership");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        planId: selectedPlan._id,
        name: form.full_name,
        gender: form.gender,
        age: Number(form.age) || undefined,
        email: form.email,
        mobile_number: form.mobile,
      };
      const res = await axios.post(`${API_BASE_URL}membership-plan/booking`, payload);
    //   navigate("/", { state: { success: true } });
    window.location.href=res.data.checkoutPageUrl;
    } catch (err) {
      // You can integrate toast here if available
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen max-w-3xl mx-auto px-6 py-12 text-gray-900">
      <h1 className="text-3xl mb-8 font-[glancyr]">Membership Details</h1>
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <DisabledField label="Plan Name" value={selectedPlan?.name} />
          <DisabledField
            label="Price"
            value={
              selectedPlan?.price || selectedPlan?.price === 0
                ? `₹${Number(selectedPlan.price).toLocaleString("en-IN")}`
                : "-"
            }
          />
          <DisabledField
            label="Billing Interval"
            value={formatInterval(selectedPlan?.billing_interval)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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

          <Input label="Mobile number">
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

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-full bg-[#D2663B] text-white font-medium hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default MembershipForm;
