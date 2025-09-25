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

  const columns = [
    {
      title: "Profile Photo",
      key: "profilePhoto",
      width: 120,
      render: (_, record) => {
        const photos = record.media || [];
        if (photos.length > 0) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {photos.map((media, i) => {
                if (
                  media.image_url?.thumbnail?.high_res
                ) {
                  const thumbnailUrl = getImageUrl(
                    media.image_url.thumbnail.low_res || media.image_url.thumbnail.high_res
                  );
                  const fullUrl = getImageUrl(media.image_url.full.high_res);
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
                      <Button
                        type="link"
                        size="small"
                        onClick={() => window.open(fullUrl, "_blank")}
                        style={{ padding: 0, marginTop: 4, fontWeight: 500, fontSize: 12 }}
                      >
                        View
                      </Button>
                    </div>
                  );
                }
                return <span key={i} style={{ color: "#64748b", fontSize: 12 }}>No Photo</span>;
              })}
            </div>
          );
        }
        return <span style={{ color: "#64748b", fontSize: 12 }}>No Photo</span>;
      },
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY"),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (time) => moment(time).tz("Asia/Kolkata").format("hh:mm A"),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (time) => moment(time).tz("Asia/Kolkata").format("hh:mm A"),
    },
    { title: "Price", dataIndex: "price", key: "price", render: (p) => `₹${p}` },
    {
      title: "Instructors",
      key: "instructors",
      onCell: () => ({ style: { whiteSpace: "normal", wordBreak: "break-word", maxWidth: 260 } }),
      render: (_, record) => {
        const instructors = Array.isArray(record.instructor_user_ids)
          ? record.instructor_user_ids
          : [];
        if (instructors.length === 0) return <span style={{ color: "#64748b" }}>N/A</span>;
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {instructors.map((ins) => {
              const key = ins.id || ins._id || `${ins.first_name}-${ins.last_name}`;
              const name = `${ins.first_name || ""} ${ins.last_name || ""}`.trim() || "Unknown";
              return (
                <Tag key={key} color="#adc290" style={{ margin: 0, color: "#1f2937" }}>
                  {name}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
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
              <Tag color="#fdecea" style={{ color: "#b91c1c", borderColor: "#fecaca" }}>Cancelled</Tag>
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
