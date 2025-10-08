// import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../config";
import { BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const EnrolledClasses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);
  console.log("user", user);

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  const fetchEnrollments = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}class-session/user/${user.id}`, config);
      const items = res.data.items;
      
      const today = new Date();

      const data = items.map((item, index) => {
        const classDate = new Date(item.class_session.date);
        const isExpired = classDate < today;
        let statusLabel;

        if (item.status === "CANCELLED") {
          statusLabel = <Tag color="red">Cancelled</Tag>;
        } else if (isExpired) {
          statusLabel = <Tag color="orange">Expired</Tag>;
        } else {
          statusLabel = <Tag color="green">{item.status === "CONFIRMED" ? "Active" : item.status}</Tag>;
        }

        return {
          key: item.enrollment_id,
          slNo: index + 1 + (page - 1) * pageSize,
          className: item.class_session.class_name,
          date: classDate.toLocaleDateString(),
          startTime: new Date(item.class_session.start_at).toLocaleTimeString(),
          endTime: new Date(item.class_session.end_at).toLocaleTimeString(),
          status: statusLabel,
        };
      });

      setEnrollments({ data, total: res.data.total });
      setPagination({ current: page, pageSize, total: res.data.total });
    } catch (err) {
      console.error("Failed to load enrollments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination) => {
    fetchEnrollments(pagination.current, pagination.pageSize);
  };

  const columns = [
    { 
      title: "Sl. No", 
      dataIndex: "slNo", 
      width: 80,
      align: "center",
    },
    { 
      title: "Class Name", 
      dataIndex: "className",
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>
    },
    { 
      title: "Date", 
      dataIndex: "date",
      align: "center",
    },
    { 
      title: "Start Time", 
      dataIndex: "startTime",
      align: "center",
    },
    { 
      title: "End Time", 
      dataIndex: "endTime",
      align: "center",
    },
    { 
      title: "Status", 
      dataIndex: "status",
      align: "center",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
            Enrolled Classes
          </h1>
          <p className="text-gray-600 text-lg">Track your journey and class schedule</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <style>
            {`
              .ant-table {
                background: transparent;
              }
              .ant-table-thead > tr > th {
                background: linear-gradient(to right, #9333EA, #EC4899);
                color: white;
                font-weight: 700;
                font-size: 15px;
                padding: 16px;
                border: none;
                text-align: center;
              }
              .ant-table-thead > tr > th::before {
                display: none;
              }
              .ant-table-tbody > tr > td {
                padding: 16px;
                font-size: 14px;
                border-bottom: 1px solid #f0f0f0;
              }
              .ant-table-tbody > tr:hover > td {
                background: linear-gradient(to right, rgba(147, 51, 234, 0.05), rgba(236, 72, 153, 0.05)) !important;
              }
              .ant-table-tbody > tr:last-child > td {
                border-bottom: none;
              }
              .ant-pagination {
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .ant-pagination-item {
                border: 2px solid #e9d5ff;
                border-radius: 8px;
                font-weight: 600;
              }
              .ant-pagination-item:hover {
                border-color: #9333EA;
              }
              // .ant-pagination-item-active {
              //   background: linear-gradient(to right, #9333EA, #EC4899);
              //   border-color: #9333EA;
              // }
              .ant-pagination-item-active a {
                color: white;
              }
              .ant-pagination-prev button, 
              .ant-pagination-next button {
                border: 2px solid #e9d5ff;
                border-radius: 8px;
              }
              .ant-pagination-prev:hover button, 
              .ant-pagination-next:hover button {
                border-color: #9333EA;
                color: #9333EA;
              }
              .ant-pagination-options {
                margin-left: 16px;
              }
              .ant-select-selector {
                border: 2px solid #e9d5ff !important;
                border-radius: 8px !important;
                font-weight: 600;
              }
              .ant-select-selector:hover {
                border-color: #9333EA !important;
              }
              .ant-tag {
                border-radius: 12px;
                padding: 4px 12px;
                font-weight: 600;
                font-size: 12px;
                border: none;
              }
              .ant-spin-dot-item {
                background-color: #9333EA;
              }
              .ant-table-placeholder {
                background: white;
                border-radius: 12px;
                padding: 40px;
              }
              .ant-empty-description {
                color: #6b7280;
                font-size: 16px;
              }
            `}
          </style>
          
          <Table
            columns={columns}
            dataSource={enrollments.data}
            pagination={{
              current: pagination.current,
              total: enrollments.total,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
            }}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnrolledClasses;