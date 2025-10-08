import React, { useEffect, useState, useMemo } from "react";
import { Table, Tag, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../config";
import dayjs from "dayjs";

const MembershipUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const user = useSelector((state) => state.user.value);

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  // Fetch membership users with pagination
  const fetchMembershipUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}membership-plan/bookings?page=${page}&limit=${pageSize}`,
        config
      );
      
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setData(items);

      // Set pagination from API response
      setPagination({
        current: res.data.page || page,
        pageSize: res.data.limit || pageSize,
        total: res.data.total || 0,
      });
    } catch (err) {
      message.error("Failed to fetch membership users");
      setData([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipUsers(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, []);

  // Table pagination change handler
  const handleTableChange = (pag) => {
    fetchMembershipUsers(pag.current, pag.pageSize);
  };

  // Format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD-MM-YYYY");
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "initiated":
        return "orange";
      case "failed":
        return "red";
      case "pending":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Sl. No",
      dataIndex: "slno",
      key: "slno",
      render: (_, __, idx) =>
        (pagination.current - 1) * pagination.pageSize + idx + 1,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
      render: (age) => (
        <Tag color="blue">{age}</Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender) => (
        <Tag color={gender === "Male" ? "blue" : "pink"}>
          {gender}
        </Tag>
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
      width: 140,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: "Plan Details",
      dataIndex: "plan",
      key: "plan",
      width: 200,
      render: (plan) => (
        <div style={{ fontSize: "12px" }}>
          <div style={{ fontWeight: "bold", color: "#1890ff", marginBottom: "4px" }}>
            {plan?.name}
          </div>
          <div style={{ color: "#666", marginBottom: "2px" }}>
            ₹{plan?.price?.toLocaleString()}
          </div>
          <div style={{ color: "#666", marginBottom: "2px" }}>
            {plan?.billing_interval?.replace("_", " ")}
          </div>
          <div style={{ color: "#666" }}>
            {plan?.plan_for}
          </div>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentResult",
      key: "paymentResult",
      width: 140,
      render: (paymentResult) => (
        <Tag color={getPaymentStatusColor(paymentResult?.status)}>
          {paymentResult?.status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-8xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#0B3D0B] font-[glancyr]">
          Membership Users
        </h2>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} members`,
          }}
          onChange={handleTableChange}
          bordered
          scroll={{ x: 1400 }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default MembershipUsers;
