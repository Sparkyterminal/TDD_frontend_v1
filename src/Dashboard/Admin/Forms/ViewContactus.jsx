/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Pagination,
  message,
  Input,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  Button,
} from "antd";
import {
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewContactus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;

  const user = useSelector((state) => state.user.value);
  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  const fetchcontactdata = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}rental-contact`, config);
      let contacts = res.data.contacts || [];
      contacts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setData(contacts);
    } catch (err) {
      message.error("Failed to fetch contact data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcontactdata();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email_id?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone_number?.toString().includes(searchText) ||
      item.purpose?.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const today = new Date().setHours(0, 0, 0, 0);
  const todayContacts = data.filter(
    (item) => new Date(item.createdAt).setHours(0, 0, 0, 0) === today
  ).length;

  const exportToExcel = () => {
    // Prepare data as displayed in the table, map each object as shown in UI
    const exportData = data.map((item) => {
      const d = new Date(item.createdAt);
      return {
        Name: item.name,
        "Phone Number": item.phone_number,
        Email: item.email_id,
        Purpose: item.purpose,
        "Created At": d.toLocaleDateString() + " " + d.toLocaleTimeString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Contact_Submissions.xlsx");
  };

  const columns = [
    {
      title: (
        <Space>
          <UserOutlined /> Name
        </Space>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: (
        <Space>
          <PhoneOutlined /> Phone Number
        </Space>
      ),
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => (
        <span style={{ fontFamily: "monospace" }}>{text.toString()}</span>
      ),
    },
    {
      title: (
        <Space>
          <MailOutlined /> Email
        </Space>
      ),
      dataIndex: "email_id",
      key: "email_id",
      render: (text) => <span style={{ color: "#52c41a" }}>{text}</span>,
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: (
        <Space>
          <ClockCircleOutlined /> Created At
        </Space>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        const d = new Date(date);
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{d.toLocaleDateString()}</div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {d.toLocaleTimeString()}
            </div>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <div
      style={{
        padding: "32px",
        minHeight: "100vh",
        fontFamily: "glancyr, sans-serif", // Apply Glancyr font here
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          fontFamily: "glancyr, sans-serif",
        }}
      >
        <div
          style={{
            borderRadius: "16px",
            padding: "32px",
            fontFamily: "glancyr, sans-serif", // Also here for nested container
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "glancyr, sans-serif", // Heading font
            }}
          >
            Contact Submissions
          </h1>
          <p
            style={{
              color: "#8c8c8c",
              marginBottom: "32px",
              fontSize: "16px",
              fontFamily: "glancyr, sans-serif",
            }}
          >
            Manage and track all contact form submissions
          </p>

          {/* The rest of your component remains unchanged */}

          <Row gutter={24} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  fontFamily: "glancyr, sans-serif",
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>
                      Total Contacts
                    </span>
                  }
                  value={data.length}
                  valueStyle={{ color: "#fff", fontWeight: 700 }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  border: "none",
                  fontFamily: "glancyr, sans-serif",
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>
                      Today's Contacts
                    </span>
                  }
                  value={todayContacts}
                  valueStyle={{ color: "#fff", fontWeight: 700 }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  border: "none",
                  fontFamily: "glancyr, sans-serif",
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>
                      Filtered Results
                    </span>
                  }
                  value={filteredData.length}
                  valueStyle={{ color: "#fff", fontWeight: 700 }}
                  prefix={<SearchOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Input
            placeholder="Search by name, email, phone, or purpose..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              marginBottom: 24,
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "16px",
              border: "2px solid #f0f0f0",
              fontFamily: "glancyr, sans-serif",
            }}
            size="large"
            allowClear
          />
          <Button
 type="primary"
 style={{
 marginBottom: 16,
 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 border: 'none',
 fontFamily: 'glancyr, sans-serif'
 }}
 onClick={exportToExcel}
>
 Export to Excel
</Button>


          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey="id"
            loading={loading}
            pagination={false}
            bordered={false}
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              fontFamily: "glancyr, sans-serif",
            }}
            className="custom-table"
          />

          <Pagination
            style={{ marginTop: 24, textAlign: "right" }}
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total) => `Total ${total} contacts`}
          />
        </div>
      </div>
      <style>{`
         .table-row-light {
              background-color: #fafafa;
            }
            .table-row-dark {
              background-color: #ffffff;
            }
            .ant-table-thead > tr > th {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
              color: white !important;
              font-weight: 600 !important;
              border: none !important;
              font-family: glancyr, sans-serif !important;
            }
            .ant-table-tbody > tr:hover > td {
              background-color: #f0f5ff !important;
            }
            .ant-pagination-item-active {
              border-color: #667eea !important;
            }
            .ant-pagination-item-active a {
              color: #667eea !important;
            }
      `}</style>
    </div>
  );
};

export default ViewContactus;
