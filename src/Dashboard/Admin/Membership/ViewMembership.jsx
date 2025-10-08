/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, message, Table, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Popconfirm } from "antd";

const { Title } = Typography;

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}membership-plan/${id}`, config);
      message.success("Membership deleted successfully");
      // Refresh data after delete
      fetchMemberships(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error("Failed to delete membership");
    }
  };

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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (p) =>
        p || p === 0 ? `₹${Number(p).toLocaleString("en-IN")}` : "-",
      sorter: (a, b) => Number(a.price || 0) - Number(b.price || 0),
    },
    {
      title: "Billing Interval",
      dataIndex: "billing_interval",
      key: "billing_interval",
      width: 160,
      render: (v) => (
        <Tag color="processing" bordered={false}>
          {formatInterval(v)}
        </Tag>
      ),
      filters: [
        { text: "Monthly", value: "MONTHLY" },
        { text: "3 months", value: "3_MONTHS" },
        { text: "6 months", value: "6_MONTHS" },
        { text: "12 months", value: "YEARLY" },
      ],
      onFilter: (value, record) => record.billing_interval === value,
    },
    {
      title: "Plan For",
      dataIndex: "plan_for",
      key: "plan_for",
      width: 120,
      filters: [
        { text: "Kids", value: "KIDS" },
        { text: "Adult", value: "ADULTS" },
      ],
      onFilter: (value, record) => record.plan_for === value,
      render: (val) =>
        val === "KIDS" ? (
          <Tag color="green" bordered={false}>
            Kids
          </Tag>
        ) : val === "ADULTS" ? (
          <Tag color="orange" bordered={false}>
            Adult
          </Tag>
        ) : (
          <Tag color="default" bordered={false}>
            Unknown
          </Tag>
        ),
    },
    {
      title: "Benefits",
      dataIndex: "benefits",
      key: "benefits",
      render: (arr) => {
        const list = Array.isArray(arr) ? arr : [];
        if (list.length === 0)
          return <span style={{ color: "#64748b" }}>N/A</span>;
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {list.map((b, i) => (
              <Tag
                key={`${b}-${i}`}
                color="#dbeafe"
                style={{ color: "#1e40af", borderColor: "#bfdbfe", margin: 0 }}
              >
                {b}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            size="middle"
            style={{ borderRadius: 6 }}
            onClick={() =>
              navigate(`/dashboard/editmembership/${record._id || record.id}`)
            }
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
    fetchMemberships(current, pageSize);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        View Membership details
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
      />
    </div>
  );
};

export default ViewMembership;
