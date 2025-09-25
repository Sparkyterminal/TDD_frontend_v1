
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { API_BASE_URL } from "../../config";

const UserInfoWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    full_name: "",
    age: "",
    email: "",
    mobile: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { full_name, age, email, mobile, gender } = formValues;
    if (!full_name || !age || !email || !mobile || !gender) {
      message.error("Please fill in all fields");
      return false;
    }
    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum <= 0) {
      message.error("Please enter a valid age");
      return false;
    }
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      message.error("Please enter a valid email address");
      return false;
    }
    const mobileOk = /^[0-9]{7,15}$/.test(mobile);
    if (!mobileOk) {
      message.error("Please enter a valid mobile number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        workshopId: id,
        name: formValues.full_name,
        age: Number(formValues.age),
        email: formValues.email,
        mobile_number: formValues.mobile,
        gender: formValues.gender,
      };
      const res = await axios.post(`${API_BASE_URL}workshop/book`, payload);
      message.success("Booking successful!");
      window.location.href=res.data.checkoutPageUrl;
      
    } catch (err) {
      message.error("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebe5db] py-8 px-4 flex items-center justify-center font-[glancyr]">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl text-center mb-6 text-[#26442C] font-medium">Workshop Booking</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block mb-1 text-[#26442C] font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formValues.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#adc290]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-[#26442C] font-medium">Age</label>
            <input
              type="number"
              name="age"
              min={1}
              value={formValues.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#adc290]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-[#26442C] font-medium">Gender</label>
            <select
              name="gender"
              value={formValues.gender}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#adc290]"
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">MALE</option>
              <option value="Female">FEMALE</option>
              <option value="Other">OTHERS</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-[#26442C] font-medium">Email Id</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#adc290]"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-[#26442C] font-medium">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formValues.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#adc290]"
              required
            />
          </div>

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-md text-white font-medium transition ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#adc290] hover:bg-[#9ab07f]"
              }`}
            >
              {submitting ? "Submitting..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoWorkshop;
