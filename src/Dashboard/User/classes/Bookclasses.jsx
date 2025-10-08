/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Award,
  Clock3,
  Users as UsersIcon,
  XCircle,
} from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import { message, Spin, Tooltip } from "antd";
import { API_BASE_URL } from "../../../../config";

const formatDateDisplay = (date) => {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
};

const Bookclasses = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(false);
  const [classTypes, setClassTypes] = useState([]);
  const [activeTypeId, setActiveTypeId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    sessionId: null,
  });
  const [userEnrollments, setUserEnrollments] = useState({});

  const user = useSelector((state) => state.user.value);

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  const dateToInputValue = (date) => dayjs(date).format("YYYY-MM-DD");

  // Handle date change from single date picker only
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (
      dayjs(newDate).isSame(dayjs(), "day") ||
      dayjs(newDate).isAfter(dayjs(), "day")
    ) {
      setSelectedDate(newDate);
    }
    setShowCalendar(false);
  };

  // Fetch class types
  const fetchClassTypes = async () => {
    setTypesLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}class-type?page=1&limit=200`,
        config
      );
      const items = Array.isArray(res.data.data?.classTypes)
        ? res.data.data.classTypes
        : [];
      setClassTypes(items);
    } catch (err) {
      message.error("Failed to load class types");
    } finally {
      setTypesLoading(false);
    }
  };

  // Fetch class sessions with filters
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "50");
      params.set("date", dateToInputValue(selectedDate));
      if (activeTypeId) params.set("class_type_id", activeTypeId);

      const res = await axios.get(
        `${API_BASE_URL}class-session?${params.toString()}`,
        config
      );
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setSessions(items);
    } catch (err) {
      message.error("Failed to load classes");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user enrollments
  const fetchUserEnrollments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}class-session/user/${user.id}`,
        config
      );
      if (Array.isArray(res.data.items)) {
        const enrollMap = {};
        res.data.items.forEach((enr) => {
          enrollMap[enr.class_session.id] = {
            ...enr,
            _id: enr.enrollment_id,
            status: enr.status,
          };
        });
        setUserEnrollments(enrollMap);
      }
    } catch (err) {
      message.error("Failed to load user enrollments");
    }
  };

  useEffect(() => {
    fetchClassTypes();
    fetchUserEnrollments();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line
  }, [selectedDate, activeTypeId]);

  const openConfirmDialog = (sessionId) =>
    setConfirmDialog({ isOpen: true, sessionId });
  const closeConfirmDialog = () =>
    setConfirmDialog({ isOpen: false, sessionId: null });

  const enrollInSession = async () => {
    const { sessionId } = confirmDialog;
    if (!sessionId) return;
    try {
      const payload = {
        classSessionId: sessionId,
        user_id: user.id,
      };
      await axios.post(
        `${API_BASE_URL}class-session/${sessionId}/enroll`,
        payload,
        config
      );
      message.success("Enrolled successfully");
      fetchUserEnrollments();
      fetchSessions();
    } catch (err) {
      message.error("Failed to enroll");
    } finally {
      closeConfirmDialog();
    }
  };

  const cancelEnrollment = async (enrollmentId) => {
    try {
      await axios.put(
        `${API_BASE_URL}class-session/enrollment/${enrollmentId}/cancel`,
        { enrollmentId, user_id: user.id },
        config
      );
      message.success("Enrollment cancelled");
      fetchUserEnrollments();
      fetchSessions();
    } catch (err) {
      message.error("Failed to cancel enrollment");
    }
  };

  const isWithinCancelWindow = (startAt) => {
    const sixHoursBefore = dayjs(startAt).subtract(6, "hour");
    return dayjs().isBefore(sixHoursBefore);
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      case "ALL":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Book Your Classes
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and reserve your perfect class today
          </p>
        </div>

        {/* Filters and Date Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center w-full">
              <span className="font-semibold text-gray-700 flex items-center gap-2 whitespace-nowrap">
                <Award className="w-5 h-5" />
                Filters:
              </span>
              <div className="flex-1 flex flex-wrap gap-3">
                {typesLoading ? (
                  <Spin size="small" />
                ) : (
                  [
                    <button
                      key="all"
                      onClick={() => setActiveTypeId(null)}
                      className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                        activeTypeId === null
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      }`}
                    >
                      All
                    </button>,
                    ...classTypes.map((type) => (
                      <button
                        key={type._id}
                        onClick={() => setActiveTypeId(type._id)}
                        className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                          activeTypeId === type._id
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        {type.title}
                      </button>
                    )),
                  ]
                )}
              </div>
            </div>

            {/* Date Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar((prev) => !prev)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 font-medium"
                aria-label="Select date"
                type="button"
              >
                <Calendar className="w-5 h-5" />
                {formatDateDisplay(selectedDate)}
              </button>

              {showCalendar && (
                <input
                  type="date"
                  min={dateToInputValue(new Date())}
                  value={dateToInputValue(selectedDate)}
                  onChange={handleDateChange}
                  onBlur={() => setShowCalendar(false)}
                  autoFocus
                  className="absolute right-0 mt-2 border-2 border-purple-300 rounded-lg shadow-lg p-2 bg-white z-10"
                  aria-label="Select a date from calendar"
                />
              )}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-2 flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center text-gray-600 py-12">
              No classes found for the selected filters.
            </div>
          ) : (
            sessions.map((s) => {
              const id = s._id;
              const className = s.class_name;
              const classType = s.class_type || s.class_type_id;
              const level = classType?.level || "ALL";
              const instructors = (
                s.instructors ||
                s.instructor_user_ids ||
                []
              ).map((i) => `${i.first_name || ""} ${i.last_name || ""}`.trim());
              const startAt = s.start_at;
              const endAt = s.end_at;
              const startTime = dayjs(startAt).format("HH:mm");
              const endTime = dayjs(endAt).format("HH:mm");

              const enrollment = userEnrollments[id];
              const isConfirmed = enrollment?.status === "CONFIRMED";
              const enrollmentId = enrollment?._id;

              const canCancel = isConfirmed && isWithinCancelWindow(startAt);

              return (
                <div
                  key={id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Gradient Header */}
                  <div
                    className={`h-2 bg-gradient-to-r from-purple-400 to-pink-500`}
                  ></div>

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    {/* Content arranged in column on mobile */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          {className}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadge(
                            level
                          )}`}
                        >
                          {level}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 text-sm text-right">
                        <div className="flex items-center gap-1">
                          <Clock3 className="w-4 h-4" />
                          {startTime} – {endTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <UsersIcon className="w-4 h-4" />
                          {instructors.join(", ") || "TBA"}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Capacity: {s.capacity}
                    </div>

                    <div className="text-xs text-gray-500">
                      {dayjs(s.date).format("DD MMM YYYY")}
                    </div>

                    {/* Buttons row at bottom on mobile */}
                    <div className="mt-auto flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
                      {!isConfirmed ? (
                        <button
                          onClick={() => openConfirmDialog(id)}
                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                          aria-label={`Book class ${className}`}
                          type="button"
                        >
                          Book Now
                        </button>
                      ) : (
                        <>
                          <div className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 justify-center">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Booked
                          </div>
                          <Tooltip
                            title={
                              canCancel
                                ? "Cancel enrollment"
                                : "Cancellation closed (within 6 hours)"
                            }
                          >
                            <button
                              onClick={() =>
                                canCancel && cancelEnrollment(enrollmentId)
                              }
                              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold shadow-md flex items-center gap-2 border justify-center ${
                                canCancel
                                  ? "text-red-600 border-red-300 hover:bg-red-50"
                                  : "text-gray-400 border-gray-200 cursor-not-allowed"
                              }`}
                              aria-label="Cancel enrollment"
                              type="button"
                              disabled={!canCancel}
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Confirmation Dialog */}
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100 animate-in">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm Booking
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to book this class?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={closeConfirmDialog}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={enrollInSession}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  type="button"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookclasses;
