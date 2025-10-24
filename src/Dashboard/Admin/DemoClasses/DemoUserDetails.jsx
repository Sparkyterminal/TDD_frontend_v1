/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../config";
import { message, Modal, Input, Button, Table, Card, Statistic, Space } from "antd";
import { SearchOutlined, DownloadOutlined, CheckCircleOutlined, UserOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Search } = Input;

const DemoUserDetails = () => {
  const user = useSelector((state) => state.user.value);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ visible: false, record: null });
  const itemsPerPage = 10;

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch all demo users
  const fetchDemousers = async (search = '') => {
    setLoading(true);
    try {
      const url = search 
        ? `${API_BASE_URL}demoClass/demo-bookings?search=${search}`
        : `${API_BASE_URL}demoClass/demo-bookings`;
      
      const res = await axios.get(url, config);
      console.log("demo users", res.data);
      
      // Add attended field if not present
      const dataWithAttendance = res.data.map(item => ({
        ...item,
        attended: item.attended || false
      }));
      
      setData(dataWithAttendance);
    } catch (e) {
      console.error("Error fetching demo users:", e);
      message.error("Failed to load demo users");
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance
  const markAttendance = async (id) => {
    try {
      // Uncomment and modify this when you have the API endpoint
      // await axios.patch(`${API_BASE_URL}enquire/demo-bookings/${id}/attendance`, {}, config);
      
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, attended: true } : item
      ));
      message.success("Attendance marked successfully!");
    } catch (e) {
      message.error("Failed to mark attendance");
    }
  };

  // Handle attendance button click
  const handleAttendance = (record) => {
    setConfirmModal({ visible: true, record });
  };

  // Confirm attendance
  const confirmAttendance = () => {
    if (confirmModal.record) {
      markAttendance(confirmModal.record.id);
    }
    setConfirmModal({ visible: false, record: null });
  };

  // Search handler
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    // Uncomment to search via API
    // fetchDemousers(value);
  };

  // Filter data based on search (client-side)
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile_number?.includes(searchQuery) ||
      item.plan?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Stats - Calculate from actual data
  const stats = useMemo(() => {
    const total = data.length || 0;
    const attended = data.filter(d => d.attended === true).length || 0;
    const pending = total - attended;
    
    return {
      totalEnquiries: total,
      totalAttended: attended,
      pendingAttendees: pending
    };
  }, [data]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      'Sl. No': index + 1,
      'Plan Name': item.plan?.name || 'N/A',
      'Name': item.name || 'N/A',
      'Age': item.age || 'N/A',
      'Gender': item.gender || 'N/A',
      'Mobile': item.mobile_number || 'N/A',
      'Email': item.email || 'N/A',
      'Status': item.attended ? 'Attended' : 'Not Attended'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Demo Attendance');
    
    // Auto-size columns
    const maxWidth = exportData.reduce((w, r) => Math.max(w, r['Plan Name']?.length || 0), 10);
    ws['!cols'] = [
      { wch: 8 }, { wch: maxWidth }, { wch: 20 }, { wch: 8 }, 
      { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 15 }
    ];
    
    XLSX.writeFile(wb, `demo_attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
    message.success("Data exported successfully!");
  };

  // Table columns
  const columns = [
    {
      title: 'Sl. No',
      key: 'slno',
      width: 80,
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: 'Plan Name',
      dataIndex: ['plan', 'name'],
      key: 'planName',
      render: (text) => <span className="font-medium text-purple-600">{text || 'N/A'}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text || 'N/A'}</span>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile_number',
      key: 'mobile',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type={record.attended ? "default" : "primary"}
          icon={record.attended ? <CheckCircleOutlined /> : null}
          disabled={record.attended}
          onClick={() => handleAttendance(record)}
          className={record.attended ? "bg-green-50 border-green-300 text-green-600" : ""}
        >
          {record.attended ? 'Attended' : 'Mark Attended'}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchDemousers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Demo Class Attendance</h1>
          <p className="text-gray-600">Manage and track demo class attendances</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            className="border-0 shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>Total Enquiries</span>}
              value={stats.totalEnquiries}
              prefix={<TeamOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '32px' }}
            />
          </Card>
          
          <Card 
            className="border-0 shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>Total Attended</span>}
              value={stats.totalAttended}
              prefix={<CheckCircleOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '32px' }}
            />
          </Card>
          
          <Card 
            className="border-0 shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>Pending Attendees</span>}
              value={stats.pendingAttendees}
              prefix={<ClockCircleOutlined style={{ color: 'white', fontSize: '24px' }} />}
              valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '32px' }}
            />
          </Card>
        </div>

        {/* Search and Export */}
        <Card className="mb-6 shadow-md">
          <Space className="w-full justify-between" wrap>
            <Search
              placeholder="Search by name, email, mobile or plan..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && setSearchQuery('')}
              style={{ width: 400 }}
            />
            
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={exportToExcel}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              Export to Excel
            </Button>
          </Space>
        </Card>

        {/* Table */}
        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: itemsPerPage,
              total: filteredData.length,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
            }}
            scroll={{ x: 1200 }}
            rowClassName={(record) => record.attended ? 'bg-green-50' : ''}
          />
        </Card>

        {/* Confirmation Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <CheckCircleOutlined className="text-blue-600" />
              <span>Confirm Attendance</span>
            </div>
          }
          open={confirmModal.visible}
          onOk={confirmAttendance}
          onCancel={() => setConfirmModal({ visible: false, record: null })}
          okText="Yes, Mark Attended"
          cancelText="Cancel"
          okButtonProps={{ 
            style: { 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }
          }}
        >
          <p className="text-lg">
            Are you sure you want to mark attendance for{' '}
            <strong className="text-purple-600">{confirmModal.record?.name}</strong>?
          </p>
          <p className="text-gray-500 mt-2">This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  );
};

export default DemoUserDetails;