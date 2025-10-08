/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Tag, Space } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ViewClasses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();
  // Get user and config for headers
  const user = useSelector((state) => state.user.value);
  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch classes with pagination
  const fetchClasses = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}class-session?page=${page}&limit=${pageSize}`,
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
      message.error("Failed to fetch classes");
      setData([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, []);

  // Table pagination change handler
  const handleTableChange = (pag) => {
    fetchClasses(pag.current, pag.pageSize);
  };

  // Cancel class handler
  const handleCancelClass = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}class-session/${id}/cancel`, {}, config);
      message.success("Class cancelled successfully");
      fetchClasses(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Failed to cancel class");
      console.error("Error cancelling class:", error);
    }
  };

  // Format instructors names
  const formatInstructors = (instructors) => {
    if (!Array.isArray(instructors) || instructors.length === 0) {
      return "No instructors";
    }
    return instructors.map(instructor => 
      `${instructor.first_name} ${instructor.last_name}`
    ).join(", ");
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  const formatTime = (dateString) => {
    return dayjs(dateString).format("HH:mm");
  };

  const columns = [
    {
      title: "Sl. No",
      dataIndex: "slno",
      key: "slno",
      render: (_, __, idx) =>
        (pagination.current - 1) * pagination.pageSize + idx + 1,
      width: 80,
      className: "text-center",
    },
    {
      title: "Class Name",
      dataIndex: "class_name",
      key: "class_name",
      width: 150,
      className: "text-wrap",
      render: (text) => (
        <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Class Type",
      dataIndex: "class_type",
      key: "class_type",
      width: 150,
      className: "text-wrap",
      render: (classType) => (
        <div style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
          <span style={{ color: "#1890ff" }}>
            {classType ? classType.title : "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      className: "text-center",
      render: (date) => formatDateTime(date),
    },
    {
      title: "Start Time",
      dataIndex: "start_at",
      key: "start_at",
      width: 120,
      className: "text-center",
      render: (startTime) => formatTime(startTime),
    },
    {
      title: "End Time",
      dataIndex: "end_at",
      key: "end_at",
      width: 120,
      className: "text-center",
      render: (endTime) => formatTime(endTime),
    },
    {
      title: "Instructors",
      dataIndex: "instructors",
      key: "instructors",
      width: 200,
      className: "text-wrap",
      render: (instructors) => (
        <div style={{ fontSize: "12px", color: "#666", wordWrap: "break-word", whiteSpace: "normal" }}>
          {formatInstructors(instructors)}
        </div>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
      className: "text-center",
      render: (capacity) => (
        <Tag color="blue">{capacity}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_cancelled",
      key: "is_cancelled",
      width: 100,
      className: "text-center",
      render: (isCancelled) => (
        <Tag color={isCancelled ? "red" : "green"}>
          {isCancelled ? "Cancelled" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      className: "text-center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => {
              navigate(`/dashboard/editclasses/${record._id}`);
            }}
            style={{ color: "#1890ff" }}
          >
            Edit
          </Button>
          {!record.is_cancelled && (
            <Popconfirm
              title="Are you sure you want to cancel this class?"
              onConfirm={() => handleCancelClass(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="link"
                size="small"
                danger
              >
                Cancel
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#0B3D0B] font-[glancyr]">
          View Classes
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
              `${range[0]}-${range[1]} of ${total} classes`,
          }}
          onChange={handleTableChange}
          bordered
          scroll={{ x: 1200 }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default ViewClasses;
