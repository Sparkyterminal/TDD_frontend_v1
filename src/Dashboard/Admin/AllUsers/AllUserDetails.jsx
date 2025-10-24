/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, Input, Card, Row, Col, Tag, Space, message, Button, Tooltip } from "antd";
import { SearchOutlined, UserOutlined, ReloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import * as XLSX from "xlsx";

const AllUserDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: user.access_token },
  };

  const calculateEndDate = (startDate, interval) => {
    const start = new Date(startDate);
    let end = new Date(start);

    if (interval === "monthly") {
      end.setMonth(end.getMonth() + 1);
    } else if (interval === "yearly") {
      end.setFullYear(end.getFullYear() + 1);
    } else if (interval === "quarterly") {
      end.setMonth(end.getMonth() + 3);
    } else if (interval === "weekly") {
      end.setDate(end.getDate() + 7);
    }

    return end;
  };

  const isRenewalEnabled = (endDateString) => {
    const [day, month, year] = endDateString.split('/');
    const endDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  const handleRenewal = (bookingId) => {
    navigate(`/dashboard/renewalform/${bookingId}`);
  };

  const fetchBookings = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
      }).toString();

      const res = await axios.get(
        `${API_BASE_URL}membership-plan/bookings/all?${queryParams}`,
        config
      );

      const bookingsData = res.data.data.bookings.map((booking, index) => ({
        key: booking._id,
        id: booking._id,
        slNo: (page - 1) * res.data.data.pagination.itemsPerPage + index + 1,
        name: booking.name,
        gender: booking.gender,
        age: booking.age,
        email: booking.email,
        mobile: booking.mobile_number,
        planName: booking.plan.name,
        billingInterval: booking.billing_interval,
        paymentStatus: booking.paymentResult.status,
        startDate: new Date(booking.start_date).toLocaleDateString("en-GB"),
        endDate: calculateEndDate(booking.start_date, booking.billing_interval).toLocaleDateString("en-GB"),
      }));

      setData(bookingsData);
      setPagination({
        current: res.data.data.pagination.currentPage,
        pageSize: res.data.data.pagination.itemsPerPage,
        total: res.data.data.pagination.totalItems,
      });
    } catch (err) {
      message.error("Failed to fetch bookings data");
      setData([]);
      setPagination({ current: 1, pageSize: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    fetchBookings(1, value);
  };

  const handleTableChange = (newPagination) => {
    fetchBookings(newPagination.current, searchText);
  };

const exportToExcel = async () => {
  setLoading(true);
  try {
    const allData = [];
    let currentPage = 1;
    const pageSize = 100;  // fetch 100 records per batch
    let totalItems = 0;

    do {
      const res = await axios.get(
        `${API_BASE_URL}membership-plan/bookings/all?page=${currentPage}&pageSize=${pageSize}`,
        config
      );
      const batchData = res.data.data.bookings;
      totalItems = res.data.data.pagination.totalItems;

      allData.push(...batchData);
      currentPage++;
    } while ((currentPage - 1) * pageSize < totalItems);

    // Map and export to Excel as before
    const exportData = allData.map((booking, index) => ({
      "Sl No": index + 1,
      Name: booking.name,
      Gender: booking.gender,
      Age: booking.age,
      Email: booking.email,
      "Mobile Number": booking.mobile_number,
      "Plan Name": booking.plan.name,
      "Billing Interval": booking.billing_interval,
      "Payment Status": booking.paymentResult.status,
      "Start Date": new Date(booking.start_date).toLocaleDateString("en-GB"),
      "End Date": calculateEndDate(booking.start_date, booking.billing_interval).toLocaleDateString("en-GB"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "AllBookings.xlsx");

  } catch (err) {
    message.error("Failed to export data");
  } finally {
    setLoading(false);
  }
};


  const columns = [
    {
      title: "Sl No",
      dataIndex: "slNo",
      key: "slNo",
      width: 80,
      fixed: "left",
      align: "center",
      render: (text) => <span style={{ fontWeight: "600", color: "#8c8c8c" }}>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      fixed: "left",
      render: (text) => <span style={{ fontWeight: "600", color: "#262626" }}>{text}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      render: (gender) => (
        <Tag
          color={gender === "Male" ? "#1890ff" : "#eb2f96"}
          style={{
            borderRadius: "6px",
            padding: "2px 12px",
            fontWeight: "500",
            border: "none",
          }}
        >
          {gender}
        </Tag>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
      align: "center",
      render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      ellipsis: true,
      render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile",
      key: "mobile",
      width: 140,
      render: (text) => <span style={{ color: "#595959", fontFamily: "monospace" }}>{text}</span>,
    },
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
      width: 280,
      ellipsis: true,
      render: (text) => <span style={{ color: "#262626", fontWeight: "500" }}>{text}</span>,
    },
    {
      title: "Billing Interval",
      dataIndex: "billingInterval",
      key: "billingInterval",
      width: 140,
      align: "center",
      render: (interval) => (
        <Tag
          color="#722ed1"
          style={{
            borderRadius: "6px",
            padding: "2px 12px",
            fontWeight: "500",
            border: "none",
            textTransform: "capitalize",
          }}
        >
          {interval}
        </Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 140,
      align: "center",
      render: (status) => (
        <Tag
          color={status === "COMPLETED" ? "#52c41a" : "#ff4d4f"}
          style={{
            borderRadius: "6px",
            padding: "4px 14px",
            fontWeight: "600",
            border: "none",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      align: "center",
      render: (text) => <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>{text}</span>,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      align: "center",
      render: (text) => <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const renewalEnabled = isRenewalEnabled(record.endDate);
        const [day, month, year] = record.endDate.split('/');
        const endDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

        let tooltipText = "";
        if (diffDays > 2) {
          tooltipText = `Renewal available ${diffDays - 2} days before end date`;
        } else if (diffDays < 0) {
          tooltipText = "Membership expired";
        } else {
          tooltipText = "Click to renew membership";
        }

        return (
          <Tooltip title={tooltipText}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              disabled={!renewalEnabled}
              onClick={() => handleRenewal(record.id)}
              style={{
                borderRadius: "8px",
                fontWeight: "500",
                background: renewalEnabled ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : undefined,
                border: "none",
              }}
            >
              Renew
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#ffffff", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Total Bookings
        </h1>
      </div>

      <Row gutter={[16, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} md={12}>
          <Card
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
              border: "none",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Space direction="vertical" size={4}>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", fontWeight: "500" }}>
                Total Bookings
              </div>
              <div style={{ color: "#fff", fontSize: "36px", fontWeight: "700", letterSpacing: "-1px" }}>
                <UserOutlined style={{ marginRight: "12px", fontSize: "32px" }} />
                {pagination.total}
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "4px" }}>
                Active registrations
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div style={{ marginBottom: "8px", color: "#8c8c8c", fontSize: "13px", fontWeight: "500" }}>
              SEARCH BOOKINGS
            </div>
            <Input
              placeholder="Search by name, email, or mobile..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf", fontSize: "16px" }} />}
              onChange={(e) => handleSearch(e.target.value)}
              size="large"
              style={{
                borderRadius: "10px",
                border: "2px solid #f0f0f0",
                fontSize: "15px",
              }}
              allowClear
            />
          </Card>
        </Col>
      </Row>

      <Button
        type="primary"
        icon={<ReloadOutlined />}
        style={{ marginBottom: "16px" }}
        loading={loading}
        onClick={exportToExcel}
      >
        Export All to Excel
      </Button>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span style={{ fontSize: "14px", color: "#595959" }}>
                Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> bookings
              </span>
            ),
            position: ["bottomCenter"],
            style: { marginTop: "24px", marginBottom: "8px" },
          }}
          onChange={handleTableChange}
          scroll={{ x: 2000 }}
          rowClassName={(record, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
          style={{
            fontSize: "14px",
          }}
        />
      </Card>

      <style jsx>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          color: #262626 !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          border-bottom: 2px solid #f0f0f0 !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: #f5f5f5 !important;
        }
        .ant-table {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default AllUserDetails;
