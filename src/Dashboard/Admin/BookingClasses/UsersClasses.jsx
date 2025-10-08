/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Space, Tag } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const UsersClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [paginationClasses, setPaginationClasses] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [bookedUsers, setBookedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [paginationUsers, setPaginationUsers] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedClassId, setSelectedClassId] = useState(null);

  const user = useSelector((state) => state.user.value);
  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch classes with pagination
  const fetchClasses = async (page = 1, pageSize = 10) => {
    setLoadingClasses(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}class-session?page=${page}&limit=${pageSize}`,
        config
      );
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setClasses(items);
      setPaginationClasses({
        current: res.data.page || page,
        pageSize: res.data.limit || pageSize,
        total: res.data.total || 0,
      });
    } catch (err) {
      message.error("Failed to fetch classes");
      setClasses([]);
      setPaginationClasses((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoadingClasses(false);
    }
  };

  // Fetch users booked for a selected class with pagination
  const fetchBookedUsers = async (classId, page = 1, pageSize = 10) => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}class-session/${classId}/bookings?page=${page}&limit=${pageSize}`,
        config
      );
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setBookedUsers(items);
      setPaginationUsers({
        current: res.data.page || page,
        pageSize: res.data.limit || pageSize,
        total: res.data.total || 0,
      });
    } catch (err) {
      message.error("Failed to fetch booked users");
      setBookedUsers([]);
      setPaginationUsers((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchClasses(paginationClasses.current, paginationClasses.pageSize);
    // eslint-disable-next-line
  }, []);

  // Handle page change for classes table
  const handleClassesTableChange = (pag) => {
    fetchClasses(pag.current, pag.pageSize);
  };

  // Handle page change for booked users table inside modal
  const handleUsersTableChange = (pag) => {
    if (selectedClassId) {
      fetchBookedUsers(selectedClassId, pag.current, pag.pageSize);
    }
  };

  // Show modal and fetch booked users on eye icon click
  const handleViewUsersClick = (classId) => {
    setSelectedClassId(classId);
    setModalVisible(true);
    fetchBookedUsers(classId, 1, paginationUsers.pageSize);
  };

  // Format date
  const formatDateTime = (dateString) =>
    dayjs(dateString).format("YYYY-MM-DD");

  // Format time
  const formatTime = (dateString) =>
    dayjs(dateString).format("HH:mm");

  // Format instructor names (if instructor objects are available)
  const formatInstructors = (instructors) => {
    if (!Array.isArray(instructors) || instructors.length === 0) {
      return "No instructors";
    }
    return instructors
      .map((inst) => `${inst.first_name} ${inst.last_name}`)
      .join(", ");
  };

  // Columns for classes table (copy from ViewClasses with last column replaced)
  const classColumns = [
    {
      title: "Sl. No",
      dataIndex: "slno",
      key: "slno",
      render: (_, __, idx) =>
        (paginationClasses.current - 1) * paginationClasses.pageSize + idx + 1,
      width: 80,
      className: "text-center",
    },
    {
      title: "Class Name",
      dataIndex: "class_name",
      key: "class_name",
      width: 150,
      className: "text-wrap",
    },
    {
      title: "Class Type",
      dataIndex: "class_type",
      key: "class_type",
      width: 150,
      className: "text-wrap",
      render: (classType) => (
        <span style={{ color: "#1890ff" }}>
          {classType ? classType.title : "N/A"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      className: "text-center",
      render: formatDateTime,
    },
    {
      title: "Start Time",
      dataIndex: "start_at",
      key: "start_at",
      width: 120,
      className: "text-center",
      render: formatTime,
    },
    {
      title: "End Time",
      dataIndex: "end_at",
      key: "end_at",
      width: 120,
      className: "text-center",
      render: formatTime,
    },
    {
      title: "Instructors",
      dataIndex: "instructors",
      key: "instructors",
      width: 200,
      className: "text-wrap",
      render: formatInstructors,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
      className: "text-center",
      render: (capacity) => <Tag color="blue">{capacity}</Tag>,
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
      title: "View Users",
      key: "view_users",
      width: 100,
      className: "text-center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined style={{ fontSize: '18px' }} />}
          onClick={() => handleViewUsersClick(record._id)}
          title="View Users Booked"
        />
      ),
    },
  ];

  // Columns for booked users inside modal
  const bookedUsersColumns = [
    {
      title: "Sl. No",
      dataIndex: "slno",
      key: "slno",
      render: (_, __, idx) =>
        (paginationUsers.current - 1) * paginationUsers.pageSize + idx + 1,
      width: 70,
      className: "text-center",
    },
    {
      title: "First Name",
      dataIndex: ["user_id", "first_name"],
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: ["user_id", "last_name"],
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: ["user_id", "email_data", "temp_email_id"],
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: ["user_id", "phone_data", "phone_number"],
      key: "phone_number",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "CONFIRMED" ? "green" : "orange"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#0B3D0B] font-[glancyr]">
          User Classes
        </h2>
        <Table
          columns={classColumns}
          dataSource={classes}
          rowKey="_id"
          loading={loadingClasses}
          pagination={{
            current: paginationClasses.current,
            pageSize: paginationClasses.pageSize,
            total: paginationClasses.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} classes`,
          }}
          onChange={handleClassesTableChange}
          bordered
          scroll={{ x: 1200 }}
          size="middle"
        />
      </div>

      <Modal
        title="Users Booked for Class"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Table
          columns={bookedUsersColumns}
          dataSource={bookedUsers}
          rowKey={(record) => record._id}
          loading={loadingUsers}
          pagination={{
            current: paginationUsers.current,
            pageSize: paginationUsers.pageSize,
            total: paginationUsers.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          onChange={handleUsersTableChange}
          size="middle"
          scroll={{ x: 800 }}
        />
      </Modal>
    </div>
  );
};

export default UsersClasses;
