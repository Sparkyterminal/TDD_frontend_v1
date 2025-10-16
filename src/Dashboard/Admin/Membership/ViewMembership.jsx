/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, message, Table, Tag, Typography, Popconfirm, Input } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

const ViewMembership = () => {
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState(""); // search state

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}membership-plan/${id}`, config);
      message.success("Membership deleted successfully");
      fetchMemberships(pagination.current, pagination.pageSize, searchQuery);
    } catch (e) {
      message.error("Failed to delete membership");
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  const fetchMemberships = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`, {
        ...config,
        params: { page, limit, search },
      });
      const data = res.data || {};
      const list = Array.isArray(data.items) ? data.items : [];
      setItems(list);
      setPagination({
        current: data.page || page,
        pageSize: data.limit || limit,
        total: data.total || list.length,
      });
    } catch (e) {
      message.error("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships(1, pagination.pageSize, searchQuery);
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: "Image",
      key: "image",
      width: 100,
      render: (_, record) => {
        const imgObj = record.image?.image_url?.thumbnail || null;
        let thumbnailUrl = "";
        let fullUrl = "";
        if (imgObj) {
          thumbnailUrl = getImageUrl(imgObj.low_res || imgObj.high_res);
          fullUrl = getImageUrl(record.image?.image_url?.full?.high_res || "");
        }
        if (!thumbnailUrl) return "-";
        const altText = record.name || "Membership Image";
        return (
          <div style={{ textAlign: "center" }}>
            <div
              onClick={() => {
                fullUrl ? window.open(fullUrl, "_blank") : null;
              }}
              style={{ cursor: fullUrl ? "pointer" : "default", display: "inline-block" }}
              title="Click to view full image"
            >
              <img
                src={thumbnailUrl}
                alt={altText}
                style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }}
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
            {fullUrl && (
              <Button type="link" size="small" onClick={() => window.open(fullUrl, "_blank")} style={{ padding: 0, marginTop: 4, fontWeight: 500, fontSize: 12 }}>
                View
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text) => (
        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Dance Type",
      key: "dance_type",
      width: 150,
      render: (_, record) => {
        const dt = record.dance_type || {};
        return <div>{dt.title || "-"}</div>;
      },
    },
    {
      title: "Batches",
      key: "batches",
      width: 300,
      render: (_, record) => {
        const batches = Array.isArray(record.batches) ? record.batches : [];
        if (batches.length === 0)
          return <span style={{ color: "#64748b" }}>N/A</span>;
        return (
          <div>
            {batches.map((batch) => (
              <div key={batch._id} style={{ marginBottom: 12, borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>
                <div>
                  {batch.schedule.map((sch) => (
                    <div key={sch._id} style={{ whiteSpace: "nowrap" }}>
                      <strong>{sch.day}:</strong> {sch.start_time} - {sch.end_time}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Capacity:</strong> {batch.capacity}
                </div>
                <div style={{ marginTop: 4 }}>
                  {batch.is_active ? (
                    <Tag color="green" bordered={false}>Active</Tag>
                  ) : (
                    <Tag color="red" bordered={false}>Inactive</Tag>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <div style={{ whiteSpace: "nowrap", display: "flex", gap: 8 }}>
          <Button
            type="primary"
            size="middle"
            style={{ borderRadius: 6 }}
            onClick={() => navigate(`/dashboard/editmembership/${record._id || record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this membership?"
            onConfirm={() => handleDelete(record._id || record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger size="middle" style={{ borderRadius: 6 }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange = (pag) => {
    const { current, pageSize } = pag;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchMemberships(current, pageSize, searchQuery);
  };

  const onSearch = (value) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // reset to page 1 on new search
    fetchMemberships(1, pagination.pageSize, value);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        View Membership details
      </Title>
      <Search
        placeholder="Search memberships"
        enterButton
        allowClear
        onSearch={onSearch}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />
      <Table
        columns={columns}
        dataSource={items}
        rowKey={(r) => r._id || r.id}
        loading={loading}
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ViewMembership;
