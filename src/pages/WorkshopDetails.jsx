/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../api/client";
import moment from "moment-timezone";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Select, Button } from "antd";
import { API_BASE_URL } from "../config";
import { getImageUrl } from "../lib/media";

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
        const res = await api.get(`${API_BASE_URL}workshop/${id}`);
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
        mobile_number: values.mobile,
        gender: values.gender || "",
        batchIds: selectedBatchIds,
        price: totalPrice, // include service fee here
      };

      const res = await api.post(`${API_BASE_URL}workshop/book`, payload);

      message.success("Booking successful!");
      if (res.data.checkoutPageUrl) {
        window.location.href = res.data.checkoutPageUrl;
      }
    } catch (error) {
      // e.g. 409 when early-bird seats sold out while the page was open (server recalculates the price)
      message.error(error.response?.data?.error || "Failed to submit booking. Please try again.");
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
