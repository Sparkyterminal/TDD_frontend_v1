/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Button,
  message,
  Drawer,
  Table,
  Tag,
  Typography,
  Input,
  Space,
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

const MembershipUsers = () => {
  const user = useSelector((state) => state.user.value);

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

  // Drawer and batch users state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [batchUsers, setBatchUsers] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Search state for drawer
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [currentBatchName, setCurrentBatchName] = useState("");

  // Fetch memberships
  const fetchMemberships = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`, {
        ...config,
        params: { page, limit },
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
    fetchMemberships(1, pagination.pageSize);
    // eslint-disable-next-line
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}api/${url}`;
  };

  // Debounce helper
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch batch users with search query
  const handleViewUsers = useCallback(
    debounce(async (planId, batchId, search = "") => {
      setDrawerLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}membership-plan/${planId}/${batchId}/bookings`,
          {
            ...config,
            params: { search },
          }
        );
        const bookings = Array.isArray(res.data.confirmedMembershipBookings)
          ? res.data.confirmedMembershipBookings
          : [];
        setBatchUsers(bookings);
        setDrawerVisible(true);
      } catch (e) {
        message.error("Failed to fetch batch users");
      } finally {
        setDrawerLoading(false);
      }
    }, 500),
    [config]
  );

  // Opens drawer and fetches users, sets current plan and batch IDs
  const openDrawerWithUsers = async (
    planId,
    batchId,
    batchName,
    search = ""
  ) => {
    setCurrentPlanId(planId);
    setCurrentBatchId(batchId);
    setCurrentBatchName(batchName);
    await handleViewUsers(planId, batchId, search);
  };

  // On search input change
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (drawerVisible) {
      openDrawerWithUsers(
        currentPlanId,
        currentBatchId,
        currentBatchName,
        value
      );
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setBatchUsers([]);
    setSearchTerm("");
    setCurrentPlanId(null);
    setCurrentBatchId(null);
    setCurrentBatchName("");
  };

  // Calculate end date based on billing interval
  const calculateEndDate = (startDate, billingInterval) => {
    if (!startDate || !billingInterval) return "-";
    const start = dayjs(startDate);
    switch (billingInterval) {
      case "monthly":
        return start.add(1, "month").format("YYYY-MM-DD");
      case "quarterly":
        return start.add(3, "month").format("YYYY-MM-DD");
      case "half_yearly":
        return start.add(6, "month").format("YYYY-MM-DD");
      case "yearly":
        return start.add(1, "year").format("YYYY-MM-DD");
      default:
        return "-";
    }
  };

  // Renew button handler
  const handleRenew = (record) => {
    message.info(
      `Renew functionality not implemented yet for user ${record.name}`
    );
  };

  // Columns for drawer table showing user details
  const batchUserColumns = [
    {
      title: "Sl No",
      key: "slno",
      render: (_, __, idx) => idx + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Mobile",
      dataIndex: "mobile_number",
      key: "mobile_number",
      width: 130,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 70,
      align: "center",
      render: (age) => <Tag color="blue">{age}</Tag>,
    },
    {
      title: "Payment Status",
      dataIndex: ["paymentResult", "status"],
      key: "paymentResult",
      width: 140,
      align: "center",
      render: (status) => {
        const color =
          status?.toLowerCase() === "completed"
            ? "green"
            : status?.toLowerCase() === "initiated"
            ? "orange"
            : status?.toLowerCase() === "failed"
            ? "red"
            : status?.toLowerCase() === "pending"
            ? "blue"
            : "default";
        return <Tag color={color}>{status?.toUpperCase() || "N/A"}</Tag>;
      },
    },
    {
      title: "Billing Interval",
      dataIndex: "billing_interval",
      key: "billing_interval",
      width: 120,
      align: "center",
      render: (interval) => {
        if (!interval) return "-";
        // Capitalize and replace underscores for readability
        return interval
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      },
    },

    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: 120,
      render: (date) => (date ? dayjs(date).format("DD MMM YYYY") : "-"),
    },
    {
      title: "End Date",
      key: "end_date",
      width: 120,
      render: (_, record) => {
        const endDate = calculateEndDate(
          record.start_date,
          record.billing_interval
        );
        return endDate !== "-" ? dayjs(endDate).format("DD MMM YYYY") : "-";
      },
    },
    {
      title: "Action",
      key: "renew",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleRenew(record)}>
          Renew
        </Button>
      ),
    },
  ];

  // Columns for the main table (Memberships and batches)
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
              style={{
                cursor: fullUrl ? "pointer" : "default",
                display: "inline-block",
              }}
              title="Click to view full image"
            >
              <img
                src={thumbnailUrl}
                alt={altText}
                style={{
                  width: 60,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
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
              <Button
                type="link"
                size="small"
                onClick={() => window.open(fullUrl, "_blank")}
                style={{
                  padding: 0,
                  marginTop: 4,
                  fontWeight: 500,
                  fontSize: 12,
                }}
              >
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
      ellipsis: true,
    },
    {
      title: "Batches",
      key: "batches",
      width: 350,
      render: (_, record) => {
        const batches = Array.isArray(record.batches) ? record.batches : [];
        if (batches.length === 0)
          return <span style={{ color: "#64748b" }}>N/A</span>;
        return (
          <div>
            {batches.map((batch) => (
              <div
                key={batch._id}
                style={{
                  marginBottom: 12,
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: 8,
                }}
              >
                <div>
                  {batch.schedule.map((sch) => (
                    <div key={sch._id} style={{ whiteSpace: "nowrap" }}>
                      <strong>{sch.day}:</strong> {sch.start_time} -{" "}
                      {sch.end_time}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Capacity:</strong> {batch.capacity}
                </div>
                <div style={{ marginTop: 4 }}>
                  {batch.is_active ? (
                    <Tag color="green" bordered={false}>
                      Active
                    </Tag>
                  ) : (
                    <Tag color="red" bordered={false}>
                      Inactive
                    </Tag>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Users",
      key: "users",
      width: 150,
      render: (_, record) => {
        const batches = Array.isArray(record.batches) ? record.batches : [];
        if (batches.length === 0) return "-";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {batches.map((batch) => {
              const batchName = batch.schedule.map((s) => s.day).join(", ");
              return (
                <Button
                  key={batch._id}
                  type="primary"
                  size="small"
                  onClick={() =>
                    openDrawerWithUsers(
                      record._id || record.id,
                      batch._id,
                      batchName
                    )
                  }
                  style={{ fontWeight: 500 }}
                >
                  View {batchName}
                </Button>
              );
            })}
          </div>
        );
      },
    },
  ];

  // Handle main table pagination changes
  const handleTableChange = (pag) => {
    const { current, pageSize } = pag;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchMemberships(current, pageSize);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Membership Users
      </Title>
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

      <Drawer
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {currentBatchName} - User Details
            </span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={closeDrawer}
              style={{ marginRight: -8 }}
            />
          </Space>
        }
        placement="left"
        open={drawerVisible}
        onClose={closeDrawer}
        width="50vw"
        closable={false}
        destroyOnClose
        styles={{
          body: { padding: 0 },
          header: {
            borderBottom: "1px solid #f0f0f0",
            padding: "16px 24px",
          },
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            background: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Input
            placeholder="Search by name, email, or mobile"
            value={searchTerm}
            onChange={onSearchChange}
            allowClear
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            size="large"
          />
        </div>
        <div
          style={{
            padding: "16px 24px",
            height: "calc(100vh - 140px)",
            overflowY: "auto",
          }}
        >
          <Table
            columns={batchUserColumns}
            dataSource={batchUsers}
            rowKey={(record) => record.id || record._id}
            loading={drawerLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            size="middle"
            scroll={{ x: 1200 }}
            bordered
            style={{
              background: "#fff",
              borderRadius: 8,
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default MembershipUsers;
