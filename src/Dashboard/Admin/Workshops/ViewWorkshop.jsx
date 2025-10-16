/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config";
import { message, Table, Button, Popconfirm, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment-timezone";

const ViewWorkshop = () => {
  const user = useSelector((state) => state.user.value);
  const [workshops, setWorkshops] = useState([]);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: user.access_token },
  };

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}workshop/${id}`, config);
      message.success("Workshop cancelled successfully");
      setWorkshops((prev) => prev.filter((w) => w.id !== id));
    } catch {
      message.error("Failed to cancel workshop");
    }
  };

  const isPastDate = (record) => {
    if (!record?.date) return false;
    return moment(record.date).isBefore(moment(), "day");
  };

  // Render batches with their timings and pricing
  const renderBatches = (batches) => {
    if (!batches || batches.length === 0) return <span style={{ color: "#64748b" }}>N/A</span>;

    return batches.map((batch) => {
      const start = moment(batch.start_time).tz("Asia/Kolkata").format("hh:mm A");
      const end = moment(batch.end_time).tz("Asia/Kolkata").format("hh:mm A");
      const pricing = batch.pricing || {};
      const earlyBird = pricing.early_bird ? `₹${pricing.early_bird.price} (Early Bird)` : "";
      const regular = pricing.regular ? `₹${pricing.regular.price} (Regular)` : "";
      const onTheSpot = pricing.on_the_spot ? `₹${pricing.on_the_spot.price} (On The Spot)` : "";
      return (
        <div key={batch._id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <b>Time:</b> {start} - {end}
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>
            {earlyBird && <div>{earlyBird}</div>}
            {regular && <div>{regular}</div>}
            {onTheSpot && <div>{onTheSpot}</div>}
            <div>Capacity: {batch.capacity}</div>
          </div>
        </div>
      );
    });
  };

const columns = [
  {
    title: "Image",
    key: "image",
    width: 120,
    render: (_, record) => {
      const media = record.media && record.media.length > 0 ? record.media[0] : null;
      if (media && media.image_url && media.image_url.thumbnail) {
        const thumbnailUrl = getImageUrl(
          media.image_url.thumbnail.low_res || media.image_url.thumbnail.high_res
        );
        const fullUrl = getImageUrl(media.image_url.full.high_res);
        return (
          <div style={{ textAlign: "center" }}>
            <div
              onClick={() => window.open(fullUrl, "_blank")}
              style={{ cursor: "pointer", display: "inline-block" }}
              title="Click to view full image"
            >
              <img
                src={thumbnailUrl}
                alt={record.title}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        );
      }
      return <span style={{ color: "#64748b", fontSize: 12 }}>No Image</span>;
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text) => <b style={{ fontSize: 16 }}>{text}</b>,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY"),
    width: 120,
  },
  {
    title: "Batches",
    key: "batches",
    onCell: () => ({ style: { whiteSpace: "normal", wordBreak: "break-word", maxWidth: 350 } }),
    render: (_, record) => renderBatches(record.batches),
  },
  {
    title: "Actions",
    key: "actions",
    width: 130,
    render: (_, record) => {
      const cancelled = !!record.is_cancelled;
      const past = isPastDate(record);
      const disableActions = cancelled || past;
      return (
        <div>
          <Button
            type="link"
            onClick={() => navigate(`/dashboard/editworkshop/${record.id}`)}
            style={{ marginRight: 8, cursor: disableActions ? "not-allowed" : "pointer" }}
            disabled={disableActions}
          >
            Edit
          </Button>
          {cancelled ? (
            <Tag color="#fdecea" style={{ color: "#b91c1c", borderColor: "#fecaca" }}>
              Cancelled
            </Tag>
          ) : past ? (
            <Button type="link" danger disabled style={{ cursor: "not-allowed" }}>
              Cancel
            </Button>
          ) : (
            <Popconfirm
              title="Are you sure you want to cancel this workshop?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Cancel
              </Button>
            </Popconfirm>
          )}
        </div>
      );
    },
  },
];


  return (
    <Table
      columns={columns}
      dataSource={workshops}
      rowKey="id"
      onRow={(record) => {
        const cancelled = !!record.is_cancelled;
        const past = isPastDate(record);
        let backgroundColor = undefined;
        if (cancelled) backgroundColor = "#fdecea"; // light red
        else if (past) backgroundColor = "#e8f5e9"; // light green
        const frozen = cancelled || past;
        return {
          style: {
            backgroundColor,
            ...(frozen ? { pointerEvents: "none", opacity: 0.85 } : {}),
          },
        };
      }}
    />
  );
};

export default ViewWorkshop;
