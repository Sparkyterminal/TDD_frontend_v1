/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { message } from "antd";

const WorkshopUserForm = () => {
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    workshopId: "",
    batchIds: [],
    name: "",
    age: "",
    email: "",
    mobile_number: "",
    gender: "",
    price_charged: "",
  });

  const config = {
    headers: { Authorization: user.access_token },
  };

  // Fetch all workshops on component mount
  useEffect(() => {
    async function fetchWorkshops() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}workshop`, config);
        setWorkshops(res.data.reverse());
        console.log("all workshops", res.data);
      } catch (error) {
        message.error("Failed to load workshops");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
    // eslint-disable-next-line
  }, []);

  // Fetch workshop details and batches when workshop is selected
  useEffect(() => {
    async function fetchWorkshopDetails() {
      if (!selectedWorkshop) {
        setBatches([]);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}workshop/${selectedWorkshop}`,
          config
        );
        console.log("workshop details", res.data);
        const fetchedBatches = res.data.batches || [];
        setBatches(fetchedBatches);
        const defaultBatchId = fetchedBatches.length > 0 ? (fetchedBatches[0]?._id || fetchedBatches[0]?.id || "") : "";
        setFormData((prev) => ({
          ...prev,
          workshopId: selectedWorkshop,
          batchIds: defaultBatchId ? [defaultBatchId] : [],
        }));
      } catch (error) {
        message.error("Failed to load workshop details");
        console.error(error);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshopDetails();
    // eslint-disable-next-line
  }, [selectedWorkshop]);

  const handleWorkshopChange = (e) => {
    setSelectedWorkshop(e.target.value);
  };

  const handleBatchChange = (e) => {
    const selectedBatches = Array.from(e.target.selectedOptions, (option) => option.value).filter(Boolean);
    setFormData((prev) => ({ ...prev, batchIds: selectedBatches }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.workshopId) {
      message.error("Please select a workshop");
      return;
    }
    console.log("formData.batchIds", formData);
    if (formData.batchIds.length === 0) {
      message.error("Please select at least one batch");
      return;
    }
    if (
      !formData.name ||
      !formData.age ||
      !formData.email ||
      !formData.mobile_number ||
      !formData.gender ||
      !formData.price_charged
    ) {
      message.error("Please fill in all fields");
      return;
    }

    const payload = {
      workshopId: formData.workshopId,
      batchIds: formData.batchIds,
      name: formData.name,
      age: parseInt(formData.age),
      email: formData.email,
      mobile_number: formData.mobile_number,
      gender: formData.gender,
      payment_status: "COMPLETED",
      price_charged: parseFloat(formData.price_charged),
    };

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${API_BASE_URL}workshop/manual-booking`,
        payload,
        config
      );
      message.success("Booking created successfully!");
      console.log("Booking response:", res.data);

      // Reset form
      setFormData({
        workshopId: "",
        batchIds: [],
        name: "",
        age: "",
        email: "",
        mobile_number: "",
        gender: "",
        price_charged: "",
      });
      setSelectedWorkshop("");
      setBatches([]);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to create booking"
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Workshop Manual Booking
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Workshop Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Workshop *
          </label>
          <select
            value={selectedWorkshop}
            onChange={handleWorkshopChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">-- Select Workshop --</option>
            {workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.title} -{" "}
                {new Date(workshop.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Batch(es) *
          </label>
          <select
            multiple
            value={formData.batchIds}
            onChange={handleBatchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            disabled={!selectedWorkshop || loading || batches.length === 0}
          >
            {batches.length === 0 && selectedWorkshop && !loading && (
              <option disabled>No batches available</option>
            )}
            {batches.map((batch) => {
              const batchId = batch?._id || batch?.id || "";
              return (
                <option key={batchId} value={batchId}>
                  {batch.name} - {new Date(batch.start_time).toLocaleString()} (₹
                  {batch.pricing?.regular?.price ?? batch.pricing?.price ?? 0})
                </option>
              );
            })}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple batches
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Price Charged */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Charged (₹) *
          </label>
          <input
            type="number"
            name="price_charged"
            value={formData.price_charged}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating Booking..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default WorkshopUserForm;
