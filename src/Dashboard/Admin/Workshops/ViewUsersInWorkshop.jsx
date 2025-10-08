/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../../config";
// 📢 Import update: Added Typography
import { Button, Drawer, message, Table, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { EyeOutlined } from "@ant-design/icons";

// Destructuring for convenience
const { Title } = Typography;

const ViewUsersInWorkshop = () => {
  const user = useSelector((state) => state.user.value);
  const [workshops, setWorkshops] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Bookings");
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const res = await axios.get(`${API_BASE_URL}workshop`, config);
        setWorkshops(res.data.reverse());
      } catch {
        message.error("Failed to load workshops");
      }
    }
    fetchWorkshops();
    // eslint-disable-next-line
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  const isPastDate = (record) => {
    if (!record?.date) return false;
    return moment(record.date).isBefore(moment(), "day");
  };

  const statusTag = (record) => {
    const cancelled = !!record.is_cancelled;
    const past = isPastDate(record);
    
    // 🎨 Styling improvement: Using built-in Antd colors for simplicity and consistency
    if (cancelled)
      return (
        <Tag color="error" bordered={false}>
          Cancelled
        </Tag>
      );
    if (past)
      return (
        <Tag color="default" bordered={false}>
          Expired
        </Tag>
      );
    return (
      <Tag color="processing" bordered={false}>
        Active
      </Tag>
    );
  };

  const handleOpenBookings = async (record) => {
    setSelectedWorkshopId(record.id);
    setDrawerTitle(`Bookings - ${record.title || "Workshop"}`);
    setDrawerOpen(true);
    setBookings([]);
    setBookingsLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}workshop/${record.id}/bookings`,
        config
      );

      const fetchedBookings = Array.isArray(res.data.confirmedBookings)
        ? res.data.confirmedBookings
        : [];

      // Map backend booking fields to frontend expected keys
      const mappedBookings = fetchedBookings.map((booking) => ({
        id: booking._id || booking.id,
        full_name: booking.name || "N/A",
        age: booking.age || "N/A",
        gender: booking.gender || "N/A",
        email: booking.email || "N/A",
        mobile: booking.mobile_number || booking.mobile || "N/A",
        media: booking.media || [],
        bookedAt: booking.bookedAt || "N/A", // Ensure bookedAt is mapped
        paymentStatus: booking.status || "N/A",
      }));

      setBookings(mappedBookings);
    } catch (err) {
      message.error("Failed to load bookings");
    } finally {
      setBookingsLoading(false);
    }
  };

  // 📐 Column definitions for the main Workshop table
  const columns = [
    {
      title: "Profile Photo",
      key: "profilePhoto",
      // Increased width for better image display
      width: 150, 
      render: (_, record) => {
        const photos = record.media || [];
        if (photos.length > 0) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontfamily: "glancyr" }}>
              {photos.map((media, i) => {
                if (media.image_url?.thumbnail?.high_res) {
                  const thumbnailUrl = getImageUrl(
                    media.image_url.thumbnail.low_res ||
                      media.image_url.thumbnail.high_res
                  );
                  const fullUrl = getImageUrl(
                    media.image_url.full?.high_res ||
                      media.image_url.thumbnail.high_res
                  );
                  const altText = media.name?.original || "Profile Photo";
                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        onClick={() => window.open(fullUrl, "_blank")}
                        style={{ cursor: "pointer", display: "inline-block" }}
                        title="Click to view full image"
                      >
                        <img
                          src={thumbnailUrl}
                          alt={altText}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <span key={i} style={{ color: "#64748b", fontSize: 12 }}>
                    No Photo
                  </span>
                );
              })}
            </div>
          );
        }
        return (
          <span style={{ color: "#64748b", fontSize: 12 }}>No Photo</span>
        );
      },
    },
    { title: "Name", dataIndex: "title", key: "title", sorter: (a, b) => a.title.localeCompare(b.title) },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // Sortable by date
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (date) => moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      key: "status",
      // Filterable by status for quick overview
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Expired', value: 'Expired' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => {
        const tagText = statusTag(record).props.children;
        return tagText === value;
      },
      render: (_, record) => statusTag(record),
    },
    {
      title: "Bookings",
      key: "bookings",
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary" // Changed to primary for better visibility
          onClick={() => handleOpenBookings(record)} 
          icon={<EyeOutlined />}
        >
          View
        </Button>
      ),
    },
  ];

  // 📐 Column definitions for the Booking Drawer table
  const bookingColumns = [
    { title: "Name", dataIndex: "full_name", key: "full_name", width: 150 },
    { title: "Age", dataIndex: "age", key: "age", width: 80 },
    { title: "Gender", dataIndex: "gender", key: "gender", width: 100 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
    { title: "Phone", dataIndex: "mobile", key: "mobile", width: 150 },
    { 
      title: "Booked At", 
      dataIndex: "bookedAt", 
      key: "bookedAt", 
      width: 200, 
      // 🌟 Implementation of date/time formatting 🌟
      render: (bookedAt) => {
        if (!bookedAt || bookedAt === "N/A") {
          return "N/A";
        }
        // Format: DD-MM-YYYY hh:mm A (e.g., 26-09-2025 03:47 PM) in Asia/Kolkata timezone
        return moment(bookedAt).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A");
      }
    },
    { 
      title: "Payment Status", 
      dataIndex: "paymentStatus", 
      key: "paymentStatus", 
      width: 150,
      // Optional: Add a Tag for the payment status for better visual appeal
      render: (status) => {
        const lowerStatus = status?.toLowerCase();
        let color = 'default';
        if (lowerStatus === 'confirmed' || lowerStatus === 'paid') {
          color = 'success';
        } else if (lowerStatus === 'pending') {
          color = 'warning';
        } else if (lowerStatus === 'failed' || lowerStatus === 'cancelled') {
          color = 'error';
        }
        return (
          <Tag color={color} bordered={false}>
            {lowerStatus?.toUpperCase() || "N/A"}
          </Tag>
        );
      }
    },
  ];

  return (
    // 🎨 Added padding for a cleaner layout
    <div style={{ padding: '24px' }}> 
      {/* 🌟 Added the main heading */}
      <Title level={3} style={{ marginBottom: '20px' }}>
        Booked Users for Workshops
      </Title>
      
      {/* Workshop Table */}
      <Table 
        columns={columns} 
        dataSource={workshops} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        // 🎨 Added hover effect and border for better visual appeal
        bordered 
      />

      {/* Booking Drawer */}
      <Drawer 
        title={drawerTitle} 
        open={drawerOpen} 
        // 🎨 Increased width for the booking table
        width={900} 
        onClose={() => setDrawerOpen(false)}
        // Added scroll to the drawer and a close button
        extra={
            <Button onClick={() => setDrawerOpen(false)}>Close</Button>
        }
      >
        <Table
          columns={bookingColumns}
          dataSource={bookings}
          rowKey={(r, idx) => r.id || r._id || r.email || idx}
          loading={bookingsLoading}
          pagination={{ pageSize: 10 }}
          // 🎨 Added hover effect and border for better visual appeal
          bordered 
          scroll={{ x: 'max-content' }} // Ensures table scrolls if content overflows
        />
      </Drawer>
    </div>
  );
};

export default ViewUsersInWorkshop;