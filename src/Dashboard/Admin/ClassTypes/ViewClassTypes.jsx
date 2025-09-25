/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewClassTypes = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Get user and config for headers
  const user = useSelector((state) => state.user.value);
  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch class types with pagination
  const fetchClassTypes = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}class-type?page=${page}&limit=${pageSize}`,
        config
      );
      const arr = Array.isArray(res.data.data?.classTypes)
        ? res.data.data.classTypes
        : [];
      setData(arr);

      // Set pagination from API response
      const pag = res.data.data?.pagination || {};
      setPagination({
        current: pag.currentPage || page,
        pageSize: pag.itemsPerPage || pageSize,
        total: pag.totalItems || arr.length,
      });
    } catch (err) {
      message.error("Failed to fetch class types");
      setData([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassTypes(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, []);

  // Table pagination change handler
  const handleTableChange = (pag) => {
    fetchClassTypes(pag.current, pag.pageSize);
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}class-type/${id}`, config);
      message.success("Deleted successfully");
      fetchClassTypes(pagination.current, pagination.pageSize);
    } catch {
      message.error("Failed to delete");
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button type="link" style={{ color: "#adc290" }} onClick={() => {
          navigate(`/dashboard/editclasstypes/${record._id}`);
        }}>
          Edit
        </Button>
      ),
      width: 80,
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
      width: 90,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#ebe5db] py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#adc290] font-[glancyr]">
          View Class Types
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
          }}
          onChange={handleTableChange}
          bordered
        />
      </div>
    </div>
  );
};

export default ViewClassTypes;
