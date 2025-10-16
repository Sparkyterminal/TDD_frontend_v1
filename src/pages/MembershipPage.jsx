/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { API_BASE_URL } from "../../config";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MembershipCard = ({
  name,
  img,
  ageText = "For ages 9 and above",
  price = "₹2500/- per month",
  regFee = "₹500 (one time)",
  batchesInfo = [],
  requirements = [],
  membershipId, // added
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const formatTimeToIST12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 font-[glancyr] flex flex-col">
      <div className="w-full h-48 overflow-hidden rounded-lg mb-4 shadow">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">{name}</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(`/membershipform/${membershipId}`)}
          className="bg-[#D2663A] hover:bg-[#b15626] text-white px-4 py-2 rounded-full font-semibold transition"
        >
          Get Membership
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[#D2663A] font-medium hover:underline focus:outline-none"
          aria-expanded={showDetails}
          aria-controls={`details-${name.replace(/\s/g, "")}`}
        >
          {showDetails ? "Hide Details" : "View More"}
        </button>
      </div>

      {showDetails && (
        <div
          id={`details-${name.replace(/\s/g, "")}`}
          className="text-gray-700 space-y-4"
        >
          <div className="flex items-center mb-2">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: "#D2663A" }}
            ></span>
            <span className="font-medium text-md">{ageText}</span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Batches</h3>
            <div className="space-y-2 max-w-full text-sm text-gray-700">
              {batchesInfo.map(({ days, start_time, end_time }, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 rounded-lg px-3 py-2 max-w-full"
                  style={{ fontSize: "0.85rem" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="font-medium text-left break-words leading-tight">
                      {Array.isArray(days) ? days.join(", ") : days}
                    </div>
                    <div className="text-gray-600">
                      {formatTimeToIST12Hour(start_time)} -{" "}
                      {formatTimeToIST12Hour(end_time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#D2663A] mb-1">Price</h4>
            <p>₹{price} per month</p>
            <p>Registration fee: {regFee}</p>
          </div>

          {requirements.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Requirements</h4>
              <ul className="list-disc list-inside space-y-1">
                {requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MembershipPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dance_classes");
  const [activeKidsCategory, setActiveKidsCategory] = useState("JUNIOR");

  const fetchMemberships = async (page = 1, limit = 100) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`, {
        params: { page, limit },
      });
      const data = res.data || {};
      const list = Array.isArray(data.items) ? data.items : [];
      setItems(list);
    } catch {
      message.error("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  // helper to resolve image urls (same logic as ViewMembership)
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  const danceClasses = items.filter(
    (item) => item.dance_type?.category === "dance classes" && item.is_active
  );

  const groupClasses = items.filter(
    (item) => item.dance_type?.category === "group classes" && item.is_active
  );

  const kidsJunior = items.filter(
    (item) =>
      item.plan_for === "KID" &&
      item.kids_category === "JUNIOR" &&
      item.is_active
  );

  const kidsAdvanced = items.filter(
    (item) =>
      item.plan_for === "KID" &&
      item.kids_category === "ADVANCED" &&
      item.is_active
  );

  const commonRequirements = [
    "Water bottle",
    "Comfortable clothes",
    "Class-only shoes (outside shoes not allowed)",
  ];

  const renderList = (list) =>
    list.length ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((item) => {
          // prefer thumbnail low_res, fallback to thumbnail high_res, then full high_res
          const thumb =
            item.image?.image_url?.thumbnail?.low_res ||
            item.image?.image_url?.thumbnail?.high_res ||
            item.image?.image_url?.full?.high_res ||
            "";
          const imgUrl = getImageUrl(thumb);
          return (
            <MembershipCard
              key={item._id}
              membershipId={item._id}
              name={item.name}
              img={imgUrl}
              ageText={item.description || "For ages 9 and above"}
              price={item.prices?.monthly || 0}
              regFee={`₹500 (one time)`}
              batchesInfo={item.batches || []}
              requirements={
                item.benefits?.length ? item.benefits : commonRequirements
              }
            />
          );
        })}
      </div>
    ) : (
      <p className="text-center col-span-full">No items available.</p>
    );

  return (
    <>
      <Header />
      <section className="max-w-7xl mt-20 min-h-screen mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <h1 className="text-center text-3xl font-[glancyr] font-semibold mb-12">
          Get Membership
        </h1>

        <div className="flex justify-center mb-8 space-x-6 text-lg font-medium font-[glancyr]">
          <button
            className={`pb-2 border-b-4 ${
              activeTab === "dance_classes"
                ? "border-[#D2663A] text-[#D2663A]"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("dance_classes")}
            aria-selected={activeTab === "dance_classes"}
          >
            Dance Classes
          </button>
          <button
            className={`pb-2 border-b-4 ${
              activeTab === "group_classes"
                ? "border-[#D2663A] text-[#D2663A]"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("group_classes")}
            aria-selected={activeTab === "group_classes"}
          >
            Group Classes
          </button>
          <button
            className={`pb-2 border-b-4 ${
              activeTab === "kids"
                ? "border-[#D2663A] text-[#D2663A]"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("kids")}
            aria-selected={activeTab === "kids"}
          >
            Kids
          </button>
        </div>

        {activeTab === "dance_classes" && renderList(danceClasses)}
        {activeTab === "group_classes" && renderList(groupClasses)}

        {activeTab === "kids" && (
          <>
            <div className="flex justify-center mb-8 space-x-6 text-lg font-medium font-[glancyr]">
              <button
                className={`pb-2 border-b-4 ${
                  activeKidsCategory === "JUNIOR"
                    ? "border-[#D2663A] text-[#D2663A]"
                    : "border-transparent"
                }`}
                onClick={() => setActiveKidsCategory("JUNIOR")}
                aria-selected={activeKidsCategory === "JUNIOR"}
              >
                Junior
              </button>
              <button
                className={`pb-2 border-b-4 ${
                  activeKidsCategory === "ADVANCED"
                    ? "border-[#D2663A] text-[#D2663A]"
                    : "border-transparent"
                }`}
                onClick={() => setActiveKidsCategory("ADVANCED")}
                aria-selected={activeKidsCategory === "ADVANCED"}
              >
                Advanced
              </button>
            </div>

            {activeKidsCategory === "JUNIOR"
              ? renderList(kidsJunior)
              : renderList(kidsAdvanced)}
          </>
        )}
      </section>
      <Footer />
    </>
  );
};

export default MembershipPage;
