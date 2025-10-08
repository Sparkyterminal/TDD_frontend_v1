/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { useParams } from "react-router-dom";

const GetMembership = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  const billingOrder = {
    MONTHLY: 1,
    "3_MONTHS": 2,
    QUARTERLY: 2,
    "6_MONTHS": 3,
    NINE_MONTHS: 4,
    YEARLY: 5,
    "12_MONTHS": 5,
  };

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

  const getBadgeText = (billingInterval) => {
    const text = formatInterval(billingInterval);
    if (text === "Monthly") return "1 Month";
    return text;
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`);
      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];
      // Filter active plans
      const activePlans = list.filter((p) => p?.is_active !== false);

      // Sort plans: Adults first, Kids last; Ascending by billing interval
      const sorted = activePlans.sort((a, b) => {
        if (a.plan_for === "KIDS" && b.plan_for !== "KIDS") return 1;
        if (a.plan_for !== "KIDS" && b.plan_for === "KIDS") return -1;
        return (
          (billingOrder[a.billing_interval] || 99) -
          (billingOrder[b.billing_interval] || 99)
        );
      });

      setPlans(sorted);
    } catch (e) {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen max-w-6xl mx-auto px-6 py-16 text-gray-900 font-[glancyr] flex flex-col justify-center">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-5xl mt-10 font-medium mb-2 font-[glancyr]">
            Get Your Membership Today!
          </h2>
          <p className="text-gray-600 text-lg font-[glancyr]">
            Where every step transforms into rhythm, energy, and art.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {loading && (
            <div className="col-span-full text-center text-gray-600">
              Loading plans...
            </div>
          )}
          {!loading && plans.length === 0 && (
            <div className="col-span-full text-center text-gray-600">
              No plans available
            </div>
          )}
          {!loading &&
            plans.map((plan) => (
              <div
                key={plan._id || plan.id}
                className="relative border border-black rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow"
              >
                <div
                  className="mx-auto mb-4 w-28 h-10 flex items-center justify-center rounded-lg font-[glancyr] text-md font-medium text-black"
                  style={{
                    backgroundColor:
                      plan.plan_for === "KIDS" ? "#ADC290" : "#ADC290",
                  }}
                >
                  {getBadgeText(plan.billing_interval)}
                </div>

                {plan.plan_for === "KIDS" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10b981] text-white text-xs px-3 py-1 rounded-full shadow">
                    Kids
                  </div>
                )}

                <p className="text-center text-4xl font-bold mb-6 font-[glancyr]">
                  {plan.price || plan.price === 0
                    ? `₹${Number(plan.price).toLocaleString("en-IN")}`
                    : "-"}
                </p>

                <ul className="mb-6 space-y-3 text-gray-700 text-sm flex-1 font-[glancyr]">
                  {(Array.isArray(plan.benefits) ? plan.benefits : []).map(
                    (b, idx) => (
                      <li key={`${plan._id || plan.id}-b-${idx}`}>{b}</li>
                    )
                  )}
                </ul>
                <motion.button
                  onClick={() =>
                    navigate(`/membershipform/${plan._id}`, {
                      state: {
                        _id: plan._id || plan.id,
                        name: plan.name,
                        price: plan.price,
                        billing_interval: plan.billing_interval,
                      },
                    })
                  }
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#B3531E",
                    color: "#fff",
                    boxShadow: "0px 4px 15px rgba(210, 102, 59, 0.6)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mt-auto bg-[#D2663B] border border-[#D2663B] text-black rounded-full py-3 text-sm font-medium font-[glancyr] cursor-pointer"
                >
                  Join Now
                </motion.button>
              </div>
            ))}
        </motion.div>
      </section>
      <Footer />
    </>
  );
};

export default GetMembership;
