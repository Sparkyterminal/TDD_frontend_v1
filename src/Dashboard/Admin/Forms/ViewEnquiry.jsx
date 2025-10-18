/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, message, Card, Tag, Space, Tooltip } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, FileTextOutlined, ClockCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";

const ViewEnquiry = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.value);
  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  const fetchEnquiryData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}enquire?page=${page}&limit=${pageSize}`,
        config
      );
      
      const arr = Array.isArray(res.data) ? res.data : [];
      setData(arr);

      const pag = res.data.data?.pagination || {};
      setPagination({
        current: pag.currentPage || page,
        pageSize: pag.itemsPerPage || pageSize,
        total: pag.totalItems || arr.length,
      });
    } catch (err) {
      message.error("Failed to fetch enquiries");
      setData([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiryData(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag) => {
    fetchEnquiryData(pag.current, pag.pageSize);
  };

  const columns = [
    {
      title: <Space><UserOutlined /> Name</Space>,
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#1a1a1a" }}>{text}</span>
      ),
    },
    {
      title: <Space><PhoneOutlined /> Phone</Space>,
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => (
        <Tag color="blue" style={{ fontSize: "13px" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: <Space><MailOutlined /> Email</Space>,
      dataIndex: "email_id",
      key: "email_id",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ color: "#4096ff", cursor: "pointer" }}>
            {text?.length > 25 ? `${text.substring(0, 25)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <Space><FileTextOutlined /> Purpose</Space>,
      dataIndex: "purpose",
      key: "purpose",
      render: (text) => (
        <Tag color="green" style={{ fontSize: "13px", maxWidth: "200px" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: <Space><ClockCircleOutlined /> Created At</Space>,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <span style={{ fontSize: "12px", color: "#666" }}>
          {new Date(text).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div
    className="font-[glancyr]"
      style={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: "16px",
            // boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: "none",
          }}
          bodyStyle={{ padding: "40px" }}
        >
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              Enquiry Management
            </h1>
            <p style={{ color: "#666", fontSize: "16px" }}>
              View and manage all customer enquiries
            </p>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} enquiries`,
              style: { marginTop: "24px" },
            }}
            loading={loading}
            onChange={handleTableChange}
            style={{
              borderRadius: "8px",
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />

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
        </Card>
      </div>
    </div>
  );
};

export default ViewEnquiry;