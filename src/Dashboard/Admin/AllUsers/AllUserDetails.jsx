/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { Table, Input, Card, Row, Col, Tag, Space, message, Button, Tooltip, Popconfirm, Modal, Form, DatePicker } from "antd";
// import { SearchOutlined, UserOutlined, ReloadOutlined, StopOutlined, EditOutlined } from "@ant-design/icons";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../../../../config";
// import * as XLSX from "xlsx";
// import dayjs from "dayjs";

// const AllUserDetails = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//   const [manualRenewalModal, setManualRenewalModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [form] = Form.useForm();
//   const user = useSelector((state) => state.user.value);
//   const navigate = useNavigate();

//   const config = {
//     headers: { Authorization: user.access_token },
//   };

//   const calculateEndDate = (startDate, interval) => {
//     const start = new Date(startDate);
//     let end = new Date(start);

//     if (interval === "monthly" || interval === "MONTHLY") {
//       end.setMonth(end.getMonth() + 1);
//     } else if (interval === "yearly" || interval === "YEARLY") {
//       end.setFullYear(end.getFullYear() + 1);
//     } else if (interval === "quarterly" || interval === "QUARTERLY") {
//       end.setMonth(end.getMonth() + 3);
//     } else if (interval === "weekly" || interval === "WEEKLY") {
//       end.setDate(end.getDate() + 7);
//     }

//     return end;
//   };

//   const getEndDate = (booking) => {
//     if (booking.end_date) {
//       return new Date(booking.end_date).toLocaleDateString("en-GB");
//     }

//     if (booking.start_date && booking.billing_interval) {
//       return calculateEndDate(booking.start_date, booking.billing_interval).toLocaleDateString("en-GB");
//     }

//     return null;
//   };

//   const isRenewalEnabled = (endDateString) => {
//     if (!endDateString) return false;
    
//     const [day, month, year] = endDateString.split('/');
//     const endDate = new Date(year, month - 1, day);
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);
//     endDate.setHours(0, 0, 0, 0);
//     const diffTime = endDate - currentDate;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= 2;
//   };

//   const handleRenewal = (bookingId, userId) => {
//     navigate(`/dashboard/renewalform/${bookingId}`, { state: { userId } });
//   };

//   const handleManualRenewal = (record) => {
//     setSelectedBooking(record);
//     setManualRenewalModal(true);
//     form.setFieldsValue({
//       startDate: dayjs(),
//       endDate: record.endDate ? dayjs(record.endDate, "DD/MM/YYYY") : null,
//     });
//   };

//   const handleManualRenewalSubmit = async (values) => {
//     try {
//       setLoading(true);
//       const payload = {
//         start_date: values.startDate.toISOString(),
//         end_date: values.endDate.toISOString(),
//       };

//       await axios.post(
//         `${API_BASE_URL}membership-plan/booking/${selectedBooking.id}/manual-renewal`,
//         payload,
//         config
//       );

//       message.success("Membership renewed manually!");
//       setManualRenewalModal(false);
//       form.resetFields();
//       fetchBookings(pagination.current, searchText);
//     } catch (err) {
//       message.error(err.response?.data?.message || "Failed to renew membership manually");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDiscontinue = async (bookingId) => {
//     try {
//       setLoading(true);
//       await axios.patch(
//         `${API_BASE_URL}membership-plan/booking/${bookingId}/discontinued`,
//         {},
//         config
//       );

//       message.success("Membership discontinued successfully!");
//       fetchBookings(pagination.current, searchText);
//     } catch (err) {
//       message.error(err.response?.data?.message || "Failed to discontinue membership");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBookings = async (page = 1, search = "") => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         ...(search && { search }),
//       }).toString();

//       const res = await axios.get(
//         `${API_BASE_URL}membership-plan/bookings/all?${queryParams}`,
//         config
//       );

//       // Filter only bookings where user is not null
//       const filteredBookings = res.data.data.bookings.filter(booking => booking.user !== null);

//       const bookingsData = filteredBookings.map((booking, index) => {
//         const endDate = getEndDate(booking);
        
//         return {
//           key: booking._id,
//           id: booking._id,
//           slNo: (page - 1) * res.data.data.pagination.itemsPerPage + index + 1,
//           name: booking.name,
//           gender: booking.gender,
//           age: booking.age,
//           email: booking.email,
//           mobile: booking.mobile_number,
//           planName: booking.planInfo?.name || booking.plan?.name || "N/A",
//           billingInterval: booking.billing_interval,
//           paymentStatus: booking.paymentResult?.status || "PENDING",
//           startDate: new Date(booking.start_date).toLocaleDateString("en-GB"),
//           endDate: endDate,
//           userId: booking.userInfo?._id || booking.user,
//           discontinued: booking.discontinued === "true" || booking.discontinued === true,
//           rawBooking: booking,
//         };
//       });

//       setData(bookingsData);
//       setPagination({
//         current: res.data.data.pagination.currentPage,
//         pageSize: res.data.data.pagination.itemsPerPage,
//         total: filteredBookings.length,
//       });
//     } catch (err) {
//       message.error("Failed to fetch bookings data");
//       setData([]);
//       setPagination({ current: 1, pageSize: 10, total: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleSearch = (value) => {
//     setSearchText(value);
//     fetchBookings(1, value);
//   };

//   const handleTableChange = (newPagination) => {
//     fetchBookings(newPagination.current, searchText);
//   };

//   const exportToExcel = async () => {
//     setLoading(true);
//     try {
//       const allData = [];
//       let currentPage = 1;
//       const pageSize = 100;
//       let totalItems = 0;

//       do {
//         const res = await axios.get(
//           `${API_BASE_URL}membership-plan/bookings/all?page=${currentPage}&pageSize=${pageSize}`,
//           config
//         );
//         const batchData = res.data.data.bookings.filter(booking => booking.user !== null);
//         totalItems = res.data.data.pagination.totalItems;

//         allData.push(...batchData);
//         currentPage++;
//       } while ((currentPage - 1) * pageSize < totalItems);

//       const exportData = allData.map((booking, index) => {
//         const endDate = getEndDate(booking);
        
//         return {
//           "Sl No": index + 1,
//           Name: booking.name,
//           Gender: booking.gender,
//           Age: booking.age,
//           Email: booking.email,
//           "Mobile Number": booking.mobile_number,
//           "Plan Name": booking.planInfo?.name || booking.plan?.name || "N/A",
//           "Billing Interval": booking.billing_interval,
//           "Payment Status": booking.paymentResult?.status || "PENDING",
//           "Start Date": new Date(booking.start_date).toLocaleDateString("en-GB"),
//           "End Date": endDate || "N/A",
//           Status: booking.planInfo?.discontinued === "true" || booking.planInfo?.discontinued === true ? "Discontinued" : "Active",
//         };
//       });

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
//       XLSX.writeFile(workbook, "AllBookings.xlsx");
//       message.success("Data exported successfully!");
//     } catch (err) {
//       message.error("Failed to export data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Sl No",
//       dataIndex: "slNo",
//       key: "slNo",
//       width: 80,
//       fixed: "left",
//       align: "center",
//       render: (text) => <span style={{ fontWeight: "600", color: "#8c8c8c" }}>{text}</span>,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       width: 180,
//       fixed: "left",
//       render: (text) => <span style={{ fontWeight: "600", color: "#262626" }}>{text}</span>,
//     },
//     {
//       title: "Gender",
//       dataIndex: "gender",
//       key: "gender",
//       width: 100,
//       align: "center",
//       render: (gender) => (
//         <Tag
//           color={gender === "Male" ? "#1890ff" : "#eb2f96"}
//           style={{
//             borderRadius: "6px",
//             padding: "2px 12px",
//             fontWeight: "500",
//             border: "none",
//           }}
//         >
//           {gender}
//         </Tag>
//       ),
//     },
//     {
//       title: "Age",
//       dataIndex: "age",
//       key: "age",
//       width: 80,
//       align: "center",
//       render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       width: 220,
//       ellipsis: true,
//       render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
//     },
//     {
//       title: "Mobile Number",
//       dataIndex: "mobile",
//       key: "mobile",
//       width: 140,
//       render: (text) => <span style={{ color: "#595959", fontFamily: "monospace" }}>{text}</span>,
//     },
//     {
//       title: "Plan Name",
//       dataIndex: "planName",
//       key: "planName",
//       width: 280,
//       ellipsis: true,
//       render: (text) => <span style={{ color: "#262626", fontWeight: "500" }}>{text}</span>,
//     },
//     {
//       title: "Billing Interval",
//       dataIndex: "billingInterval",
//       key: "billingInterval",
//       width: 140,
//       align: "center",
//       render: (interval) => (
//         <Tag
//           color="#722ed1"
//           style={{
//             borderRadius: "6px",
//             padding: "2px 12px",
//             fontWeight: "500",
//             border: "none",
//             textTransform: "capitalize",
//           }}
//         >
//           {interval}
//         </Tag>
//       ),
//     },
//     {
//       title: "Payment Status",
//       dataIndex: "paymentStatus",
//       key: "paymentStatus",
//       width: 140,
//       align: "center",
//       render: (status) => (
//         <Tag
//           color={status === "COMPLETED" ? "#52c41a" : "#ff4d4f"}
//           style={{
//             borderRadius: "6px",
//             padding: "4px 14px",
//             fontWeight: "600",
//             border: "none",
//           }}
//         >
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: "Start Date",
//       dataIndex: "startDate",
//       key: "startDate",
//       width: 120,
//       align: "center",
//       render: (text) => <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>{text}</span>,
//     },
//     {
//       title: "End Date",
//       dataIndex: "endDate",
//       key: "endDate",
//       width: 120,
//       align: "center",
//       render: (text) => (
//         <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>
//           {text || "-"}
//         </span>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "discontinued",
//       key: "discontinued",
//       width: 120,
//       align: "center",
//       render: (discontinued) => (
//         <Tag
//           color={discontinued ? "#ff4d4f" : "#52c41a"}
//           style={{
//             borderRadius: "6px",
//             padding: "4px 14px",
//             fontWeight: "600",
//             border: "none",
//           }}
//         >
//           {discontinued ? "Discontinued" : "Active"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "action",
//       width: 280,
//       align: "center",
//       fixed: "right",
//       render: (_, record) => {
//         if (!record.endDate) {
//           return (
//             <Space size={8}>
//               <Tooltip title="End date not available">
//                 <Button
//                   type="primary"
//                   icon={<ReloadOutlined />}
//                   disabled={true}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Renew
//                 </Button>
//               </Tooltip>
//               <Button
//                 icon={<EditOutlined />}
//                 disabled={true}
//                 size="small"
//                 style={{
//                   borderRadius: "6px",
//                 }}
//               >
//                 Manual
//               </Button>
//             </Space>
//           );
//         }

//         if (record.paymentStatus !== "COMPLETED") {
//           return (
//             <Space size={8}>
//               <Tooltip title="Renew membership">
//                 <Button
//                   type="primary"
//                   icon={<ReloadOutlined />}
//                   onClick={() => handleRenewal(record.id, record.userId)}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     fontWeight: "500",
//                     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     border: "none",
//                   }}
//                 >
//                   Renew
//                 </Button>
//               </Tooltip>
//               <Tooltip title="Manual renewal">
//                 <Button
//                   icon={<EditOutlined />}
//                   onClick={() => handleManualRenewal(record)}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     borderColor: "#667eea",
//                     color: "#667eea",
//                   }}
//                 >
//                   Manual
//                 </Button>
//               </Tooltip>
//               {record.discontinued ? (
//                 <Tag color="#ff4d4f" style={{ borderRadius: "6px", padding: "2px 8px", fontWeight: "500" }}>
//                   Discontinued
//                 </Tag>
//               ) : (
//                 <Popconfirm
//                   title="Discontinue membership?"
//                   description="Are you sure you want to discontinue this membership?"
//                   onConfirm={() => handleDiscontinue(record.id)}
//                   okText="Yes"
//                   cancelText="No"
//                   okButtonProps={{ danger: true }}
//                 >
//                   <Button
//                     danger
//                     icon={<StopOutlined />}
//                     size="small"
//                     style={{
//                       borderRadius: "6px",
//                       fontWeight: "500",
//                     }}
//                   >
//                     Discontinue
//                   </Button>
//                 </Popconfirm>
//               )}
//             </Space>
//           );
//         }

//         const renewalEnabled = isRenewalEnabled(record.endDate);
//         const [day, month, year] = record.endDate.split('/');
//         const endDate = new Date(year, month - 1, day);
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         const diffDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

//         let tooltipText = "";
//         if (diffDays > 2) {
//           tooltipText = `Renewal available ${diffDays - 2} days before end date`;
//         } else if (diffDays < 0) {
//           tooltipText = "Membership expired - Click to renew";
//         } else {
//           tooltipText = "Click to renew membership";
//         }

//         return (
//           <Space size={8}>
//             <Tooltip title={tooltipText}>
//               <Button
//                 type="primary"
//                 icon={<ReloadOutlined />}
//                 disabled={!renewalEnabled}
//                 onClick={() => handleRenewal(record.id, record.userId)}
//                 size="small"
//                 style={{
//                   borderRadius: "6px",
//                   fontWeight: "500",
//                   background: renewalEnabled ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : undefined,
//                   border: "none",
//                 }}
//               >
//                 Renew
//               </Button>
//             </Tooltip>
//             <Tooltip title="Manual renewal">
//               <Button
//                 icon={<EditOutlined />}
//                 onClick={() => handleManualRenewal(record)}
//                 size="small"
//                 style={{
//                   borderRadius: "6px",
//                   borderColor: "#667eea",
//                   color: "#667eea",
//                 }}
//               >
//                 Manual
//               </Button>
//             </Tooltip>
//             {record.discontinued ? (
//               <Tag color="#ff4d4f" style={{ borderRadius: "6px", padding: "4px 10px", fontWeight: "500" }}>
//                 Discontinued
//               </Tag>
//             ) : (
//               <Popconfirm
//                 title="Discontinue membership?"
//                 description="Are you sure you want to discontinue this membership?"
//                 onConfirm={() => handleDiscontinue(record.id)}
//                 okText="Yes"
//                 cancelText="No"
//                 okButtonProps={{ danger: true }}
//               >
//                 <Button
//                   danger
//                   icon={<StopOutlined />}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Discontinue
//                 </Button>
//               </Popconfirm>
//             )}
//           </Space>
//         );
//       },
//     },
//   ];

//   return (
//     <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
//       <div style={{ marginBottom: "32px" }}>
//         <h1
//           style={{
//             fontSize: "28px",
//             fontWeight: "700",
//             margin: 0,
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//           }}
//         >
//           Total Bookings
//         </h1>
//       </div>

//       <Row gutter={[16, 24]} style={{ marginBottom: "32px" }}>
//         <Col xs={24} md={12}>
//           <Card
//             style={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               borderRadius: "16px",
//               boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
//               border: "none",
//             }}
//             bodyStyle={{ padding: "24px" }}
//           >
//             <Space direction="vertical" size={4}>
//               <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", fontWeight: "500" }}>
//                 Total Bookings
//               </div>
//               <div style={{ color: "#fff", fontSize: "36px", fontWeight: "700", letterSpacing: "-1px" }}>
//                 <UserOutlined style={{ marginRight: "12px", fontSize: "32px" }} />
//                 {pagination.total}
//               </div>
//               <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "4px" }}>
//                 Active registrations
//               </div>
//             </Space>
//           </Card>
//         </Col>

//         <Col xs={24} md={12}>
//           <Card
//             style={{
//               borderRadius: "16px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//               border: "1px solid #f0f0f0",
//               background: "#fff",
//             }}
//             bodyStyle={{ padding: "24px" }}
//           >
//             <div style={{ marginBottom: "8px", color: "#8c8c8c", fontSize: "13px", fontWeight: "500" }}>
//               SEARCH BOOKINGS
//             </div>
//             <Input
//               placeholder="Search by name, email, or mobile..."
//               prefix={<SearchOutlined style={{ color: "#bfbfbf", fontSize: "16px" }} />}
//               onChange={(e) => handleSearch(e.target.value)}
//               size="large"
//               style={{
//                 borderRadius: "10px",
//                 border: "2px solid #f0f0f0",
//                 fontSize: "15px",
//               }}
//               allowClear
//             />
//           </Card>
//         </Col>
//       </Row>

//       <Button
//         type="primary"
//         icon={<ReloadOutlined />}
//         style={{ 
//           marginBottom: "16px", 
//           borderRadius: "8px",
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           border: "none",
//           fontWeight: "500",
//         }}
//         loading={loading}
//         onClick={exportToExcel}
//       >
//         Export All to Excel
//       </Button>

//       <Card
//         style={{
//           borderRadius: "16px",
//           boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           border: "1px solid #f0f0f0",
//           background: "#fff",
//         }}
//       >
//         <Table
//           columns={columns}
//           dataSource={data}
//           loading={loading}
//           pagination={{
//             ...pagination,
//             showSizeChanger: false,
//             showTotal: (total, range) => (
//               <span style={{ fontSize: "14px", color: "#595959" }}>
//                 Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> bookings
//               </span>
//             ),
//             position: ["bottomCenter"],
//             style: { marginTop: "24px", marginBottom: "8px" },
//           }}
//           onChange={handleTableChange}
//           scroll={{ x: 2200 }}
//           rowClassName={(record, index) => {
//             if (record.discontinued) {
//               return "table-row-discontinued";
//             }
//             return index % 2 === 0 ? "table-row-light" : "table-row-dark";
//           }}
//           style={{
//             fontSize: "14px",
//           }}
//         />
//       </Card>

// <Modal
//   title={
//     <span style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
//       Manual Membership Renewal
//     </span>
//   }
//   open={manualRenewalModal}
//   onCancel={() => {
//     setManualRenewalModal(false);
//     form.resetFields();
//   }}
//   footer={null}
//   width={500}
// >
//   <Form
//     form={form}
//     layout="vertical"
//     onFinish={handleManualRenewalSubmit}
//     style={{ marginTop: "20px" }}
//   >
//     <Form.Item
//       label="Start Date"
//       name="startDate"
//       rules={[{ required: true, message: "Please select start date" }]}
//     >
//       <DatePicker style={{ width: "100%", borderRadius: "8px" }} size="large" format="DD/MM/YYYY" />
//     </Form.Item>

//     <Form.Item
//       label="End Date"
//       name="endDate"
//       rules={[{ required: true, message: "Please select end date" }]}
//     >
//       <DatePicker style={{ width: "100%", borderRadius: "8px" }} size="large" format="DD/MM/YYYY" />
//     </Form.Item>

//     <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
//       <Space style={{ width: "100%", justifyContent: "flex-end" }}>
//         <Button
//           onClick={() => {
//             setManualRenewalModal(false);
//             form.resetFields();
//           }}
//           style={{ borderRadius: "8px" }}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="primary"
//           htmlType="submit"
//           loading={loading}
//           style={{
//             borderRadius: "8px",
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             border: "none",
//             fontWeight: "500",
//           }}
//         >
//           Renew Membership
//         </Button>
//       </Space>
//     </Form.Item>
//   </Form>
// </Modal>


//       <style jsx>{`
//         .table-row-light {
//           background-color: #ffffff;
//         }
//         .table-row-dark {
//           background-color: #fafafa;
//         }
//         .table-row-discontinued {
//           background-color: #fff1f0 !important;
//         }
//         .table-row-discontinued:hover td {
//           background-color: #ffe7e6 !important;
//         }
//         .ant-table-thead > tr > th {
//           background: #fafafa !important;
//           color: #262626 !important;
//           font-weight: 600 !important;
//           font-size: 13px !important;
//           border-bottom: 2px solid #f0f0f0 !important;
//         }
//         .ant-table-tbody > tr:hover > td {
//           background: #f5f5f5 !important;
//         }
//         .ant-table {
//           border-radius: 12px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AllUserDetails;

// import React, { useEffect, useState } from "react";
// import { Table, Input, Card, Row, Col, Tag, Space, message, Button, Tooltip, Popconfirm, Modal, Form, DatePicker, Select } from "antd";
// import { SearchOutlined, UserOutlined, ReloadOutlined, StopOutlined, EditOutlined } from "@ant-design/icons";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../../../../config";
// import * as XLSX from "xlsx";
// import dayjs from "dayjs";

// const { Option } = Select;

// const AllUserDetails = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//   const [manualRenewalModal, setManualRenewalModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [memberships, setMemberships] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [loadingPlan, setLoadingPlan] = useState(false);
//   const [form] = Form.useForm();
//   const user = useSelector((state) => state.user.value);
//   const navigate = useNavigate();

//   const config = {
//     headers: { Authorization: user.access_token },
//   };

//   const calculateEndDate = (startDate, interval) => {
//     const start = new Date(startDate);
//     let end = new Date(start);

//     if (interval === "monthly" || interval === "MONTHLY") {
//       end.setMonth(end.getMonth() + 1);
//     } else if (interval === "yearly" || interval === "YEARLY") {
//       end.setFullYear(end.getFullYear() + 1);
//     } else if (interval === "quarterly" || interval === "QUARTERLY") {
//       end.setMonth(end.getMonth() + 3);
//     } else if (interval === "weekly" || interval === "WEEKLY") {
//       end.setDate(end.getDate() + 7);
//     } else if (interval === "half_yearly" || interval === "HALF_YEARLY") {
//       end.setMonth(end.getMonth() + 6);
//     }

//     return end;
//   };

//   const getEndDate = (booking) => {
//     if (booking.end_date) {
//       return new Date(booking.end_date).toLocaleDateString("en-GB");
//     }

//     if (booking.start_date && booking.billing_interval) {
//       return calculateEndDate(booking.start_date, booking.billing_interval).toLocaleDateString("en-GB");
//     }

//     return null;
//   };

//   const isRenewalEnabled = (endDateString) => {
//     if (!endDateString) return false;
    
//     const [day, month, year] = endDateString.split('/');
//     const endDate = new Date(year, month - 1, day);
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);
//     endDate.setHours(0, 0, 0, 0);
//     const diffTime = endDate - currentDate;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= 2;
//   };

//   const handleRenewal = (bookingId, userId) => {
//     navigate(`/dashboard/renewalform/${bookingId}`, { state: { userId } });
//   };

//   const fetchMemberships = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}membership-plan`, config);
//       const data = res.data?.items || res.data?.data || res.data || [];
//       setMemberships(data);
//     } catch (e) {
//       message.error("Failed to load membership plans");
//     }
//   };

//   const handleMembershipChange = async (membershipId) => {
//     setLoadingPlan(true);
//     setSelectedPlan(null);
//     setBatches([]);
    
//     form.setFieldsValue({
//       batchId: undefined,
//       billing_interval: undefined,
//       end_date: undefined,
//     });

//     try {
//       const res = await axios.get(`${API_BASE_URL}membership-plan/${membershipId}`, config);
//       const planData = res.data?.data || res.data || {};
      
//       setSelectedPlan(planData);
      
//       if (planData.batches && planData.batches.length > 0) {
//         setBatches(planData.batches);
//       } else {
//         message.info("No batches available for this plan");
//       }
//     } catch (err) {
//       message.error("Failed to load membership plan details");
//     } finally {
//       setLoadingPlan(false);
//     }
//   };

//   const getBillingIntervals = () => {
//     if (!selectedPlan?.prices) return [];
    
//     const intervals = [];
//     const prices = selectedPlan.prices;
    
//     if (prices.monthly) intervals.push({ key: 'monthly', label: 'Monthly', price: prices.monthly });
//     if (prices.quarterly) intervals.push({ key: 'quarterly', label: 'Quarterly', price: prices.quarterly });
//     if (prices.half_yearly) intervals.push({ key: 'half_yearly', label: 'Half Yearly', price: prices.half_yearly });
//     if (prices.yearly) intervals.push({ key: 'yearly', label: 'Yearly', price: prices.yearly });
    
//     return intervals;
//   };

//   const formatBatchSchedule = (batch) => {
//     const days = batch.schedule.map(s => s.day).join(', ');
//     const time = batch.schedule[0] ? `${batch.schedule[0].start_time} - ${batch.schedule[0].end_time}` : '';
//     return `${days} (${time})`;
//   };

//   const handleBillingIntervalChange = (interval) => {
//     const startDate = form.getFieldValue('start_date');
//     if (startDate) {
//       const endDate = calculateEndDate(startDate.toDate(), interval);
//       form.setFieldsValue({
//         end_date: dayjs(endDate)
//       });
//     }
//   };

//   const handleStartDateChange = (date) => {
//     const interval = form.getFieldValue('billing_interval');
//     if (interval && date) {
//       const endDate = calculateEndDate(date.toDate(), interval);
//       form.setFieldsValue({
//         end_date: dayjs(endDate)
//       });
//     }
//   };

//   const handleManualRenewal = async (record) => {
//     setSelectedBooking(record);
//     setManualRenewalModal(true);
    
//     await fetchMemberships();
    
//     form.setFieldsValue({
//       start_date: dayjs(),
//       payment_status: 'completed',
//     });
//   };

//   const handleManualRenewalSubmit = async (values) => {
//     try {
//       setLoading(true);
      
//       const payload = {
//         planId: values.planId,
//         userId: selectedBooking.userId,
//         batchId: values.batchId,
//         billing_interval: values.billing_interval,
//         start_date: values.start_date.toISOString(),
//         end_date: values.end_date.toISOString(),
//         payment_status: values.payment_status,
//       };

//       await axios.post(
//         `${API_BASE_URL}membership-plan/renew-manual/${selectedBooking.id}`,
//         payload,
//         config
//       );

//       message.success("Membership renewed manually successfully!");
//       setManualRenewalModal(false);
//       form.resetFields();
//       setSelectedPlan(null);
//       setBatches([]);
//       fetchBookings(pagination.current, searchText);
//     } catch (err) {
//       message.error(err.response?.data?.message || "Failed to renew membership manually");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDiscontinue = async (bookingId) => {
//     try {
//       setLoading(true);
//       await axios.patch(
//         `${API_BASE_URL}membership-plan/booking/${bookingId}/discontinued`,
//         {},
//         config
//       );

//       message.success("Membership discontinued successfully!");
//       fetchBookings(pagination.current, searchText);
//     } catch (err) {
//       message.error(err.response?.data?.message || "Failed to discontinue membership");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBookings = async (page = 1, search = "") => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: pagination.pageSize.toString(),
//         ...(search && { search }),
//       }).toString();

//       const res = await axios.get(
//         `${API_BASE_URL}membership-plan/bookings/all?${queryParams}`,
//         config
//       );

//       const filteredBookings = res.data.data.bookings.filter(booking => booking.user !== null);
      
//       const actualTotal = res.data.data.pagination.totalItems;
//       const itemsPerPage = res.data.data.pagination.itemsPerPage;

//       const bookingsData = filteredBookings.map((booking, index) => {
//         const endDate = getEndDate(booking);
        
//         return {
//           key: booking._id,
//           id: booking._id,
//           slNo: (page - 1) * itemsPerPage + index + 1,
//           name: booking.name,
//           gender: booking.gender,
//           age: booking.age,
//           email: booking.email,
//           mobile: booking.mobile_number,
//           planName: booking.planInfo?.name || booking.plan?.name || "N/A",
//           billingInterval: booking.billing_interval,
//           paymentStatus: booking.paymentResult?.status || "PENDING",
//           startDate: new Date(booking.start_date).toLocaleDateString("en-GB"),
//           endDate: endDate,
//           userId: booking.userInfo?._id || booking.user,
//           discontinued: booking.discontinued === "true" || booking.discontinued === true,
//           rawBooking: booking,
//         };
//       });

//       setData(bookingsData);
//       setPagination({
//         current: res.data.data.pagination.currentPage,
//         pageSize: itemsPerPage,
//         total: actualTotal,
//       });
//     } catch (err) {
//       message.error("Failed to fetch bookings data");
//       setData([]);
//       setPagination({ current: 1, pageSize: 10, total: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleSearch = (value) => {
//     setSearchText(value);
//     fetchBookings(1, value);
//   };

//   const handleTableChange = (newPagination) => {
//     fetchBookings(newPagination.current, searchText);
//   };

//   const exportToExcel = async () => {
//     setLoading(true);
//     try {
//       const allData = [];
//       let currentPage = 1;
//       const pageSize = 10000000000;
//       let totalItems = 0;

//       do {
//         const res = await axios.get(
//           `${API_BASE_URL}membership-plan/bookings/all?page=${currentPage}&limit=${pageSize}`,
//           config
//         );
//         const batchData = res.data.data.bookings.filter(booking => booking.user !== null);
//         totalItems = res.data.data.pagination.totalItems;

//         allData.push(...batchData);
//         currentPage++;
//       } while ((currentPage - 1) * pageSize < totalItems);

//       const exportData = allData.map((booking, index) => {
//         const endDate = getEndDate(booking);
        
//         return {
//           "Sl No": index + 1,
//           Name: booking.name,
//           Gender: booking.gender,
//           Age: booking.age,
//           Email: booking.email,
//           "Mobile Number": booking.mobile_number,
//           "Plan Name": booking.planInfo?.name || booking.plan?.name || "N/A",
//           "Billing Interval": booking.billing_interval,
//           "Payment Status": booking.paymentResult?.status || "PENDING",
//           "Start Date": new Date(booking.start_date).toLocaleDateString("en-GB"),
//           "End Date": endDate || "N/A",
//           Status: booking.discontinued === "true" || booking.discontinued === true ? "Discontinued" : "Active",
//         };
//       });

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
//       XLSX.writeFile(workbook, "AllBookings.xlsx");
//       message.success("Data exported successfully!");
//     } catch (err) {
//       message.error("Failed to export data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Sl No",
//       dataIndex: "slNo",
//       key: "slNo",
//       width: 80,
//       fixed: "left",
//       align: "center",
//       render: (text) => <span style={{ fontWeight: "600", color: "#8c8c8c" }}>{text}</span>,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       width: 180,
//       fixed: "left",
//       render: (text) => <span style={{ fontWeight: "600", color: "#262626" }}>{text}</span>,
//     },
//     {
//       title: "Gender",
//       dataIndex: "gender",
//       key: "gender",
//       width: 100,
//       align: "center",
//       render: (gender) => (
//         <Tag
//           color={gender === "Male" ? "#1890ff" : "#eb2f96"}
//           style={{
//             borderRadius: "6px",
//             padding: "2px 12px",
//             fontWeight: "500",
//             border: "none",
//           }}
//         >
//           {gender}
//         </Tag>
//       ),
//     },
//     {
//       title: "Age",
//       dataIndex: "age",
//       key: "age",
//       width: 80,
//       align: "center",
//       render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       width: 220,
//       ellipsis: true,
//       render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
//     },
//     {
//       title: "Mobile Number",
//       dataIndex: "mobile",
//       key: "mobile",
//       width: 140,
//       render: (text) => <span style={{ color: "#595959", fontFamily: "monospace" }}>{text}</span>,
//     },
//     {
//       title: "Plan Name",
//       dataIndex: "planName",
//       key: "planName",
//       width: 280,
//       ellipsis: true,
//       render: (text) => <span style={{ color: "#262626", fontWeight: "500" }}>{text}</span>,
//     },
//     {
//       title: "Billing Interval",
//       dataIndex: "billingInterval",
//       key: "billingInterval",
//       width: 140,
//       align: "center",
//       render: (interval) => (
//         <Tag
//           color="#722ed1"
//           style={{
//             borderRadius: "6px",
//             padding: "2px 12px",
//             fontWeight: "500",
//             border: "none",
//             textTransform: "capitalize",
//           }}
//         >
//           {interval}
//         </Tag>
//       ),
//     },
//     {
//       title: "Payment Status",
//       dataIndex: "paymentStatus",
//       key: "paymentStatus",
//       width: 140,
//       align: "center",
//       render: (status) => (
//         <Tag
//           color={status === "COMPLETED" ? "#52c41a" : "#ff4d4f"}
//           style={{
//             borderRadius: "6px",
//             padding: "4px 14px",
//             fontWeight: "600",
//             border: "none",
//           }}
//         >
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: "Start Date",
//       dataIndex: "startDate",
//       key: "startDate",
//       width: 120,
//       align: "center",
//       render: (text) => <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>{text}</span>,
//     },
//     {
//       title: "End Date",
//       dataIndex: "endDate",
//       key: "endDate",
//       width: 120,
//       align: "center",
//       render: (text) => (
//         <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>
//           {text || "-"}
//         </span>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "discontinued",
//       key: "discontinued",
//       width: 120,
//       align: "center",
//       render: (discontinued) => (
//         <Tag
//           color={discontinued ? "#ff4d4f" : "#52c41a"}
//           style={{
//             borderRadius: "6px",
//             padding: "4px 14px",
//             fontWeight: "600",
//             border: "none",
//           }}
//         >
//           {discontinued ? "Discontinued" : "Active"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "action",
//       width: 280,
//       align: "center",
//       fixed: "right",
//       render: (_, record) => {
//         // If discontinued, show only the discontinued tag
//         if (record.discontinued) {
//           return (
//             <Tag color="#ff4d4f" style={{ borderRadius: "6px", padding: "4px 10px", fontWeight: "500" }}>
//               Discontinued
//             </Tag>
//           );
//         }

//         // If no end date, disable both buttons
//         if (!record.endDate) {
//           return (
//             <Space size={8}>
//               <Tooltip title="End date not available">
//                 <Button
//                   type="primary"
//                   icon={<ReloadOutlined />}
//                   disabled={true}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Renew
//                 </Button>
//               </Tooltip>
//               <Tooltip title="End date not available">
//                 <Button
//                   icon={<EditOutlined />}
//                   disabled={true}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                   }}
//                 >
//                   Manual
//                 </Button>
//               </Tooltip>
              
//             </Space>
//           );
//         }

//         // Payment not completed - show all buttons enabled
//         if (record.paymentStatus !== "COMPLETED") {
//           return (
//             <Space size={8}>
//               <Tooltip title="Renew membership">
//                 <Button
//                   type="primary"
//                   icon={<ReloadOutlined />}
//                   onClick={() => handleRenewal(record.id, record.userId)}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     fontWeight: "500",
//                     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     border: "none",
//                   }}
//                 >
//                   Renew
//                 </Button>
//               </Tooltip>
//               <Tooltip title="Manual renewal">
//                 <Button
//                   icon={<EditOutlined />}
//                   onClick={() => handleManualRenewal(record)}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     borderColor: "#667eea",
//                     color: "#667eea",
//                   }}
//                 >
//                   Manual
//                 </Button>
//               </Tooltip>
              
//               <Popconfirm
//                 title="Discontinue membership?"
//                 description="Are you sure you want to discontinue this membership?"
//                 onConfirm={() => handleDiscontinue(record.id)}
//                 okText="Yes"
//                 cancelText="No"
//                 okButtonProps={{ danger: true }}
//               >
//                 <Button
//                   danger
//                   icon={<StopOutlined />}
//                   size="small"
//                   style={{
//                     borderRadius: "6px",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Discontinue
//                 </Button>
//               </Popconfirm>
//             </Space>
//           );
//         }

//         // Payment completed - check renewal eligibility
//         const renewalEnabled = isRenewalEnabled(record.endDate);
//         const [day, month, year] = record.endDate.split('/');
//         const endDate = new Date(year, month - 1, day);
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         const diffDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

//         let tooltipText = "";
//         if (diffDays > 2) {
//           tooltipText = `Renewal available ${diffDays - 2} days before end date`;
//         } else if (diffDays < 0) {
//           tooltipText = "Membership expired - Click to renew";
//         } else {
//           tooltipText = "Click to renew membership";
//         }

//         return (
//           <Space size={8}>
//             <Tooltip title={tooltipText}>
//               <Button
//                 type="primary"
//                 icon={<ReloadOutlined />}
//                 disabled={!renewalEnabled}
//                 onClick={() => handleRenewal(record.id, record.userId)}
//                 size="small"
//                 style={{
//                   borderRadius: "6px",
//                   fontWeight: "500",
//                   background: renewalEnabled ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : undefined,
//                   border: "none",
//                 }}
//               >
//                 Renew
//               </Button>
//             </Tooltip>
//             <Tooltip title={!renewalEnabled ? tooltipText : "Manual renewal"}>
//               <Button
//                 icon={<EditOutlined />}
//                 onClick={() => handleManualRenewal(record)}
//                 disabled={!renewalEnabled}
//                 size="small"
//                 style={{
//                   borderRadius: "6px",
//                   borderColor: renewalEnabled ? "#667eea" : undefined,
//                   color: renewalEnabled ? "#667eea" : undefined,
//                 }}
//               >
//                 Manual
//               </Button>
//             </Tooltip>
//             <Popconfirm
//               title="Discontinue membership?"
//               description="Are you sure you want to discontinue this membership?"
//               onConfirm={() => handleDiscontinue(record.id)}
//               okText="Yes"
//               cancelText="No"
//               okButtonProps={{ danger: true }}
//             >
//               <Button
//                 danger
//                 icon={<StopOutlined />}
//                 size="small"
//                 style={{
//                   borderRadius: "6px",
//                   fontWeight: "500",
//                 }}
//               >
//                 Discontinue
//               </Button>
//             </Popconfirm>
            
//           </Space>
//         );
//       },
//     },
//   ];

//   return (
//     <div style={{ padding: "24px", minHeight: "100vh" }}>
//       <div style={{ marginBottom: "32px" }}>
//         <h1
//           style={{
//             fontSize: "28px",
//             fontWeight: "700",
//             margin: 0,
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//           }}
//         >
//           Total Bookings
//         </h1>
//       </div>

//       <Row gutter={[16, 24]} style={{ marginBottom: "32px" }}>
//         <Col xs={24} md={12}>
//           <Card
//             style={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               borderRadius: "16px",
//               boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
//               border: "none",
//             }}
//             bodyStyle={{ padding: "24px" }}
//           >
//             <Space direction="vertical" size={4}>
//               <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", fontWeight: "500" }}>
//                 Total Bookings
//               </div>
//               <div style={{ color: "#fff", fontSize: "36px", fontWeight: "700", letterSpacing: "-1px" }}>
//                 <UserOutlined style={{ marginRight: "12px", fontSize: "32px" }} />
//                 {pagination.total}
//               </div>
//               <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "4px" }}>
//                 Active registrations
//               </div>
//             </Space>
//           </Card>
//         </Col>

//         <Col xs={24} md={12}>
//           <Card
//             style={{
//               borderRadius: "16px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//               border: "1px solid #f0f0f0",
//               background: "#fff",
//             }}
//             bodyStyle={{ padding: "24px" }}
//           >
//             <div style={{ marginBottom: "8px", color: "#8c8c8c", fontSize: "13px", fontWeight: "500" }}>
//               SEARCH BOOKINGS
//             </div>
//             <Input
//               placeholder="Search by name, email, or mobile..."
//               prefix={<SearchOutlined style={{ color: "#bfbfbf", fontSize: "16px" }} />}
//               onChange={(e) => handleSearch(e.target.value)}
//               size="large"
//               style={{
//                 borderRadius: "10px",
//                 border: "2px solid #f0f0f0",
//                 fontSize: "15px",
//               }}
//               allowClear
//             />
//           </Card>
//         </Col>
//       </Row>

//       <Button
//         type="primary"
//         icon={<ReloadOutlined />}
//         style={{ 
//           marginBottom: "16px", 
//           borderRadius: "8px",
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           border: "none",
//           fontWeight: "500",
//         }}
//         loading={loading}
//         onClick={exportToExcel}
//       >
//         Export All to Excel
//       </Button>

//       <Card
//         style={{
//           borderRadius: "16px",
//           boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//           border: "1px solid #f0f0f0",
//           background: "#fff",
//         }}
//       >
//         <Table
//           columns={columns}
//           dataSource={data}
//           loading={loading}
//           pagination={{
//             ...pagination,
//             showSizeChanger: false,
//             showTotal: (total, range) => (
//               <span style={{ fontSize: "14px", color: "#595959" }}>
//                 Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> bookings
//               </span>
//             ),
//             position: ["bottomCenter"],
//             style: { marginTop: "24px", marginBottom: "8px" },
//           }}
//           onChange={handleTableChange}
//           scroll={{ x: 2200 }}
//           rowClassName={(record, index) => {
//             if (record.discontinued) {
//               return "table-row-discontinued";
//             }
//             return index % 2 === 0 ? "table-row-light" : "table-row-dark";
//           }}
//           style={{
//             fontSize: "14px",
//           }}
//         />
//       </Card>

//       <Modal
//         title={
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <EditOutlined style={{ fontSize: "20px", color: "#667eea" }} />
//             <span style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
//               Manual Membership Renewal
//             </span>
//           </div>
//         }
//         open={manualRenewalModal}
//         onCancel={() => {
//           setManualRenewalModal(false);
//           form.resetFields();
//           setSelectedPlan(null);
//           setBatches([]);
//         }}
//         footer={null}
//         width={650}
//       >
//         {selectedBooking && (
//           <div style={{ marginBottom: 20, padding: '12px', background: '#f0f5ff', borderRadius: '8px', border: '1px solid #d6e4ff' }}>
//             <Space direction="vertical" size={4}>
//               <div><strong>Member:</strong> {selectedBooking.name}</div>
//               <div><strong>Current Plan:</strong> {selectedBooking.planName}</div>
//               <div><strong>User ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{selectedBooking.userId}</span></div>
//             </Space>
//           </div>
//         )}
        
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleManualRenewalSubmit}
//         >
//           <Form.Item
//             name="planId"
//             label="Select Membership Plan"
//             rules={[{ required: true, message: 'Please select a membership plan' }]}
//           >
//             <Select
//               placeholder="Choose a membership plan"
//               onChange={handleMembershipChange}
//               size="large"
//               style={{ borderRadius: "8px" }}
//             >
//               {memberships.map((membership) => (
//                 <Option key={membership._id} value={membership._id}>
//                   {membership.name} - {membership.description}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {batches.length > 0 && (
//             <Form.Item
//               name="batchId"
//               label="Select Batch"
//               rules={[{ required: true, message: 'Please select a batch' }]}
//             >
//               <Select
//                 placeholder="Choose a batch"
//                 loading={loadingPlan}
//                 size="large"
//                 style={{ borderRadius: "8px" }}
//               >
//                 {batches.map((batch, index) => (
//                   <Option key={batch._id} value={batch._id}>
//                     Batch {index + 1}: {formatBatchSchedule(batch)} (Capacity: {batch.capacity})
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}

//           {selectedPlan && getBillingIntervals().length > 0 && (
//             <Form.Item
//               name="billing_interval"
//               label="Billing Interval"
//               rules={[{ required: true, message: 'Please select a billing interval' }]}
//             >
//               <Select 
//                 placeholder="Choose billing interval"
//                 onChange={handleBillingIntervalChange}
//                 size="large"
//                 style={{ borderRadius: "8px" }}
//               >
//                 {getBillingIntervals().map((interval) => (
//                   <Option key={interval.key} value={interval.key}>
//                     {interval.label} - ₹{interval.price}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}

//           <Form.Item
//             label="Start Date"
//             name="start_date"
//             rules={[{ required: true, message: "Please select start date" }]}
//           >
//             <DatePicker 
//               style={{ width: "100%", borderRadius: "8px" }} 
//               size="large" 
//               format="DD/MM/YYYY"
//               onChange={handleStartDateChange}
//             />
//           </Form.Item>

//           <Form.Item
//             label="End Date"
//             name="end_date"
//             rules={[{ required: true, message: "Please select end date" }]}
//           >
//             <DatePicker 
//               style={{ width: "100%", borderRadius: "8px" }} 
//               size="large" 
//               format="DD/MM/YYYY"
//               disabled
//             />
//           </Form.Item>

//           <Form.Item
//             name="payment_status"
//             label="Payment Status"
//             rules={[{ required: true, message: 'Please select payment status' }]}
//           >
//             <Select 
//               placeholder="Choose payment status"
//               size="large"
//               style={{ borderRadius: "8px" }}
//             >
//               <Option value="completed">Completed</Option>
//               <Option value="pending">Pending</Option>
//               <Option value="failed">Failed</Option>
//             </Select>
//           </Form.Item>

//           {selectedPlan?.benefits && selectedPlan.benefits.length > 0 && (
//             <Card 
//               title={<span style={{ fontSize: "14px", fontWeight: "600" }}>Plan Benefits</span>}
//               size="small"
//               style={{ marginBottom: 16, borderRadius: "8px", background: "#fafafa" }}
//             >
//               <ul style={{ margin: 0, paddingLeft: "20px" }}>
//                 {selectedPlan.benefits.map((benefit, index) => (
//                   <li key={index} style={{ marginBottom: "4px", color: "#595959" }}>{benefit}</li>
//                 ))}
//               </ul>
//             </Card>
//           )}

//           <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
//             <Space style={{ width: "100%", justifyContent: "flex-end" }}>
//               <Button
//                 onClick={() => {
//                   setManualRenewalModal(false);
//                   form.resetFields();
//                   setSelectedPlan(null);
//                   setBatches([]);
//                 }}
//                 style={{ borderRadius: "8px" }}
//                 size="large"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 disabled={!selectedPlan || batches.length === 0}
//                 size="large"
//                 style={{
//                   borderRadius: "8px",
//                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   border: "none",
//                   fontWeight: "500",
//                 }}
//               >
//                 {loading ? "Processing..." : "Renew Membership"}
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <style jsx>{`
//         .table-row-light {
//           background-color: #ffffff;
//         }
//         .table-row-dark {
//           background-color: #fafafa;
//         }
//         .table-row-discontinued {
//           background-color: #fff1f0 !important;
//           opacity: 0.6;
//           pointer-events: none;
//         }
//         .table-row-discontinued:hover td {
//           background-color: #fff1f0 !important;
//           cursor: not-allowed;
//         }
//         .ant-table-thead > tr > th {
//           background: #fafafa !important;
//           color: #262626 !important;
//           font-weight: 600 !important;
//           font-size: 13px !important;
//           border-bottom: 2px solid #f0f0f0 !important;
//         }
//         .ant-table-tbody > tr:hover > td {
//           background: #f5f5f5 !important;
//         }
//         .table-row-discontinued:hover > td {
//           background-color: #fff1f0 !important;
//         }
//         .ant-table {
//           border-radius: 12px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AllUserDetails;


import React, { useEffect, useState } from "react";
import { Table, Input, Card, Row, Col, Tag, Space, message, Button, Tooltip, Popconfirm, Modal, Form, DatePicker, Select } from "antd";
import { SearchOutlined, UserOutlined, ReloadOutlined, StopOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const { Option } = Select;

const AllUserDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [manualRenewalModal, setManualRenewalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [editUserModal, setEditUserModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);

  const [manualForm] = Form.useForm(); // for manual renewal form
  const [editUserForm] = Form.useForm(); // for edit user modal form

  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: user.access_token },
  };

  // ----------- Calculate end date based on interval -------------
  const calculateEndDate = (startDate, interval) => {
    const start = new Date(startDate);
    let end = new Date(start);

    if (interval === "monthly" || interval === "MONTHLY") {
      end.setMonth(end.getMonth() + 1);
    } else if (interval === "yearly" || interval === "YEARLY") {
      end.setFullYear(end.getFullYear() + 1);
    } else if (interval === "quarterly" || interval === "QUARTERLY") {
      end.setMonth(end.getMonth() + 3);
    } else if (interval === "weekly" || interval === "WEEKLY") {
      end.setDate(end.getDate() + 7);
    } else if (interval === "half_yearly" || interval === "HALF_YEARLY") {
      end.setMonth(end.getMonth() + 6);
    }

    return end;
  };

  // ----------- Get end date of a booking -------------
  const getEndDate = (booking) => {
    if (booking.end_date) {
      return new Date(booking.end_date).toLocaleDateString("en-GB");
    }
    if (booking.start_date && booking.billing_interval) {
      return calculateEndDate(booking.start_date, booking.billing_interval).toLocaleDateString("en-GB");
    }
    return null;
  };

  // ----------- Renewal enabled check -------------
  const isRenewalEnabled = (endDateString) => {
    if (!endDateString) return false;
    
    const [day, month, year] = endDateString.split('/');
    const endDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  // ------------- Navigations and Modals ------------------
  const handleRenewal = (bookingId, userId) => {
    navigate(`/dashboard/renewalform/${bookingId}`, { state: { userId } });
  };

  const fetchMemberships = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`, config);
      const data = res.data?.items || res.data?.data || res.data || [];
      setMemberships(data);
    } catch (e) {
      message.error("Failed to load membership plans");
    }
  };

  const handleMembershipChange = async (membershipId) => {
    setLoadingPlan(true);
    setSelectedPlan(null);
    setBatches([]);
    
    manualForm.setFieldsValue({
      batchId: undefined,
      billing_interval: undefined,
      end_date: undefined,
    });

    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan/${membershipId}`, config);
      const planData = res.data?.data || res.data || {};
      
      setSelectedPlan(planData);
      
      if (planData.batches && planData.batches.length > 0) {
        setBatches(planData.batches);
      } else {
        message.info("No batches available for this plan");
      }
    } catch (err) {
      message.error("Failed to load membership plan details");
    } finally {
      setLoadingPlan(false);
    }
  };

  const getBillingIntervals = () => {
    if (!selectedPlan?.prices) return [];
    
    const intervals = [];
    const prices = selectedPlan.prices;
    
    if (prices.monthly) intervals.push({ key: 'monthly', label: 'Monthly', price: prices.monthly });
    if (prices.quarterly) intervals.push({ key: 'quarterly', label: 'Quarterly', price: prices.quarterly });
    if (prices.half_yearly) intervals.push({ key: 'half_yearly', label: 'Half Yearly', price: prices.half_yearly });
    if (prices.yearly) intervals.push({ key: 'yearly', label: 'Yearly', price: prices.yearly });
    
    return intervals;
  };

  const formatBatchSchedule = (batch) => {
    const days = batch.schedule.map(s => s.day).join(', ');
    const time = batch.schedule[0] ? `${batch.schedule[0].start_time} - ${batch.schedule[0].end_time}` : '';
    return `${days} (${time})`;
  };

  const handleBillingIntervalChange = (interval) => {
    const startDate = manualForm.getFieldValue('start_date');
    if (startDate) {
      const endDate = calculateEndDate(startDate.toDate(), interval);
      manualForm.setFieldsValue({
        end_date: dayjs(endDate)
      });
    }
  };

  const handleStartDateChange = (date) => {
    const interval = manualForm.getFieldValue('billing_interval');
    if (interval && date) {
      const endDate = calculateEndDate(date.toDate(), interval);
      manualForm.setFieldsValue({
        end_date: dayjs(endDate)
      });
    }
  };

  const handleManualRenewal = async (record) => {
    setSelectedBooking(record);
    setManualRenewalModal(true);
    
    await fetchMemberships();
    
    manualForm.setFieldsValue({
      start_date: dayjs(),
      payment_status: 'completed',
    });
  };

  const handleManualRenewalSubmit = async (values) => {
    try {
      setLoading(true);
      
      const payload = {
        planId: values.planId,
        userId: selectedBooking.userId,
        batchId: values.batchId,
        billing_interval: values.billing_interval,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        payment_status: values.payment_status,
      };

      await axios.post(
        `${API_BASE_URL}membership-plan/renew-manual/${selectedBooking.id}`,
        payload,
        config
      );

      message.success("Membership renewed manually successfully!");
      setManualRenewalModal(false);
      manualForm.resetFields();
      setSelectedPlan(null);
      setBatches([]);
      fetchBookings(pagination.current, searchText);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to renew membership manually");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscontinue = async (bookingId) => {
    try {
      setLoading(true);
      await axios.patch(
        `${API_BASE_URL}membership-plan/booking/${bookingId}/discontinued`,
        {},
        config
      );

      message.success("Membership discontinued successfully!");
      fetchBookings(pagination.current, searchText);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to discontinue membership");
    } finally {
      setLoading(false);
    }
  };

  // ------------ Fetch bookings data ----------------
  const fetchBookings = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(search && { search }),
      }).toString();

      const res = await axios.get(
        `${API_BASE_URL}membership-plan/bookings/all?${queryParams}`,
        config
      );

      const filteredBookings = res.data.data.bookings.filter(booking => booking.user !== null);
      
      const actualTotal = res.data.data.pagination.totalItems;
      const itemsPerPage = res.data.data.pagination.itemsPerPage;

      const bookingsData = filteredBookings.map((booking, index) => {
        const endDate = getEndDate(booking);
        
        return {
          key: booking._id,
          id: booking._id,
          slNo: (page - 1) * itemsPerPage + index + 1,
          name: booking.name,
          gender: booking.gender,
          age: booking.age,
          email: booking.email,
          mobile: booking.mobile_number,
          planName: booking.planInfo?.name || booking.plan?.name || "N/A",
          billingInterval: booking.billing_interval,
          paymentStatus: booking.paymentResult?.status || "PENDING",
          startDate: new Date(booking.start_date).toLocaleDateString("en-GB"),
          endDate: endDate,
          userId: booking.userInfo?._id || booking.user,
          discontinued: booking.discontinued === "true" || booking.discontinued === true,
          rawBooking: booking,
        };
      });

      setData(bookingsData);
      setPagination({
        current: res.data.data.pagination.currentPage,
        pageSize: itemsPerPage,
        total: actualTotal,
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

  // ------------- Export data to Excel ----------------
  const exportToExcel = async () => {
    setLoading(true);
    try {
      const allData = [];
      let currentPage = 1;
      const pageSize = 10000000000;
      let totalItems = 0;

      do {
        const res = await axios.get(
          `${API_BASE_URL}membership-plan/bookings/all?page=${currentPage}&limit=${pageSize}`,
          config
        );
        const batchData = res.data.data.bookings.filter(booking => booking.user !== null);
        totalItems = res.data.data.pagination.totalItems;

        allData.push(...batchData);
        currentPage++;
      } while ((currentPage - 1) * pageSize < totalItems);

      const exportData = allData.map((booking, index) => {
        const endDate = getEndDate(booking);
        
        return {
          "Sl No": index + 1,
          Name: booking.name,
          Gender: booking.gender,
          Age: booking.age,
          Email: booking.email,
          "Mobile Number": booking.mobile_number,
          "Plan Name": booking.planInfo?.name || booking.plan?.name || "N/A",
          "Billing Interval": booking.billing_interval,
          "Payment Status": booking.paymentResult?.status || "PENDING",
          "Start Date": new Date(booking.start_date).toLocaleDateString("en-GB"),
          "End Date": endDate || "N/A",
          Status: booking.discontinued === "true" || booking.discontinued === true ? "Discontinued" : "Active",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
      XLSX.writeFile(workbook, "AllBookings.xlsx");
      message.success("Data exported successfully!");
    } catch (err) {
      message.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  // ------------- Edit User Modal handlers -----------------

  // Open Edit User Modal and fetch booking data
  const openEditUserModal = async (bookingId) => {
    setEditUserLoading(true);
    setEditUserModal(true);
    setEditBookingData(null);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan/bookings/${bookingId}`, config);
      const booking = res.data.data || res.data;

      setEditBookingData(booking);

      // pre-fill form with booking data: adapt fields based on API response
      editUserForm.setFieldsValue({
        name: booking.name,
        gender: booking.gender,
        age: booking.age,
        email: booking.email,
        mobile_number: booking.mobile_number,
        start_date: booking.start_date ? dayjs(booking.start_date) : null,
        end_date: booking.end_date ? dayjs(booking.end_date) : null,
        // Any other fields you want to edit...
      });
    } catch (err) {
      setEditUserModal(false);
      message.error("Failed to load booking details");
    } finally {
      setEditUserLoading(false);
    }
  };

  // Submit updated booking data
  const handleEditUserSubmit = async (values) => {
    try {
      setEditUserLoading(true);

      // Use userId and bookingId from editBookingData for the PUT request
      if (!editBookingData || !editBookingData.userId || !editBookingData._id) {
        message.error("Invalid booking data");
        setEditUserLoading(false);
        return;
      }

      // Prepare payload to update booking
      const payload = {
        ...values,
        start_date: values.start_date ? values.start_date.toISOString() : null,
        end_date: values.end_date ? values.end_date.toISOString() : null,
      };

      await axios.put(
        `${API_BASE_URL}bookings/${editBookingData.userId}/${editBookingData._id}`,
        payload,
        config
      );

      message.success("Booking updated successfully!");
      setEditUserModal(false);
      editUserForm.resetFields();
      fetchBookings(pagination.current, searchText);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update booking");
    } finally {
      setEditUserLoading(false);
    }
  };

  // ------------- Columns ----------------
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
      render: (text) => (
        <span style={{ color: "#595959", fontFamily: "monospace", fontSize: "13px" }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "discontinued",
      key: "discontinued",
      width: 120,
      align: "center",
      render: (discontinued) => (
        <Tag
          color={discontinued ? "#ff4d4f" : "#52c41a"}
          style={{
            borderRadius: "6px",
            padding: "4px 14px",
            fontWeight: "600",
            border: "none",
          }}
        >
          {discontinued ? "Discontinued" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 340, // increased width to fit extra button
      align: "center",
      fixed: "right",
      render: (_, record) => {
        // If discontinued, show only the discontinued tag
        if (record.discontinued) {
          return (
            <Tag color="#ff4d4f" style={{ borderRadius: "6px", padding: "4px 10px", fontWeight: "500" }}>
              Discontinued
            </Tag>
          );
        }

        // If no end date, disable both buttons except Edit User
        if (!record.endDate) {
          return (
            <Space size={8}>
              <Tooltip title="End date not available">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  disabled={true}
                  size="small"
                  style={{
                    borderRadius: "6px",
                    fontWeight: "500",
                  }}
                >
                  Renew
                </Button>
              </Tooltip>
              <Tooltip title="End date not available">
                <Button
                  icon={<EditOutlined />}
                  disabled={true}
                  size="small"
                  style={{
                    borderRadius: "6px",
                  }}
                >
                  Manual
                </Button>
              </Tooltip>
              <Tooltip title="Edit user details">
                <Button
                  icon={<UserOutlined />}
                  size="small"
                  onClick={() => openEditUserModal(record.id)}
                  style={{
                    borderRadius: "6px",
                    borderColor: "#52a5ff",
                    color: "#52a5ff",
                  }}
                >
                  Edit User
                </Button>
              </Tooltip>
            </Space>
          );
        }

        // Payment not completed - show all buttons enabled
        if (record.paymentStatus !== "COMPLETED") {
          return (
            <Space size={8}>
              <Tooltip title="Renew membership">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => handleRenewal(record.id, record.userId)}
                  size="small"
                  style={{
                    borderRadius: "6px",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  Renew
                </Button>
              </Tooltip>
              <Tooltip title="Manual renewal">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleManualRenewal(record)}
                  size="small"
                  style={{
                    borderRadius: "6px",
                    borderColor: "#667eea",
                    color: "#667eea",
                  }}
                >
                  Manual
                </Button>
              </Tooltip>
              <Tooltip title="Edit user details">
                <Button
                  icon={<UserOutlined />}
                  size="small"
                  onClick={() => openEditUserModal(record.id)}
                  style={{
                    borderRadius: "6px",
                    borderColor: "#52a5ff",
                    color: "#52a5ff",
                  }}
                >
                  Edit User
                </Button>
              </Tooltip>

              <Popconfirm
                title="Discontinue membership?"
                description="Are you sure you want to discontinue this membership?"
                onConfirm={() => handleDiscontinue(record.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<StopOutlined />}
                  size="small"
                  style={{
                    borderRadius: "6px",
                    fontWeight: "500",
                  }}
                >
                  Discontinue
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        // Payment completed - check renewal eligibility
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
          tooltipText = "Membership expired - Click to renew";
        } else {
          tooltipText = "Click to renew membership";
        }

        return (
          <Space size={8}>
            <Tooltip title={tooltipText}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                disabled={!renewalEnabled}
                onClick={() => handleRenewal(record.id, record.userId)}
                size="small"
                style={{
                  borderRadius: "6px",
                  fontWeight: "500",
                  background: renewalEnabled ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : undefined,
                  border: "none",
                }}
              >
                Renew
              </Button>
            </Tooltip>
            <Tooltip title={!renewalEnabled ? tooltipText : "Manual renewal"}>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleManualRenewal(record)}
                disabled={!renewalEnabled}
                size="small"
                style={{
                  borderRadius: "6px",
                  borderColor: renewalEnabled ? "#667eea" : undefined,
                  color: renewalEnabled ? "#667eea" : undefined,
                }}
              >
                Manual
              </Button>
            </Tooltip>
            <Tooltip title="Edit user details">
              <Button
                icon={<UserOutlined />}
                size="small"
                onClick={() => openEditUserModal(record.id)}
                style={{
                  borderRadius: "6px",
                  borderColor: "#52a5ff",
                  color: "#52a5ff",
                }}
              >
                Edit User
              </Button>
            </Tooltip>
            <Popconfirm
              title="Discontinue membership?"
              description="Are you sure you want to discontinue this membership?"
              onConfirm={() => handleDiscontinue(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<StopOutlined />}
                size="small"
                style={{
                  borderRadius: "6px",
                  fontWeight: "500",
                }}
              >
                Discontinue
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // --------------- JSX Render ----------------
  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
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
              background: "#fff",
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
        style={{ 
          marginBottom: "16px", 
          borderRadius: "8px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          fontWeight: "500",
        }}
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
          background: "#fff",
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
          scroll={{ x: 2200 }}
          rowClassName={(record, index) => {
            if (record.discontinued) {
              return "table-row-discontinued";
            }
            return index % 2 === 0 ? "table-row-light" : "table-row-dark";
          }}
          style={{
            fontSize: "14px",
          }}
        />
      </Card>

      {/* Manual Renewal Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <EditOutlined style={{ fontSize: "20px", color: "#667eea" }} />
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
              Manual Membership Renewal
            </span>
          </div>
        }
        open={manualRenewalModal}
        onCancel={() => {
          setManualRenewalModal(false);
          manualForm.resetFields();
          setSelectedPlan(null);
          setBatches([]);
        }}
        footer={null}
        width={650}
      >
        {selectedBooking && (
          <div style={{ marginBottom: 20, padding: '12px', background: '#f0f5ff', borderRadius: '8px', border: '1px solid #d6e4ff' }}>
            <Space direction="vertical" size={4}>
              <div><strong>Member:</strong> {selectedBooking.name}</div>
              <div><strong>Current Plan:</strong> {selectedBooking.planName}</div>
              <div><strong>User ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{selectedBooking.userId}</span></div>
            </Space>
          </div>
        )}
        
        <Form
          form={manualForm}
          layout="vertical"
          onFinish={handleManualRenewalSubmit}
        >
          <Form.Item
            name="planId"
            label="Select Membership Plan"
            rules={[{ required: true, message: 'Please select a membership plan' }]}
          >
            <Select
              placeholder="Choose a membership plan"
              onChange={handleMembershipChange}
              size="large"
              style={{ borderRadius: "8px" }}
            >
              {memberships.map((membership) => (
                <Option key={membership._id} value={membership._id}>
                  {membership.name} - {membership.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {batches.length > 0 && (
            <Form.Item
              name="batchId"
              label="Select Batch"
              rules={[{ required: true, message: 'Please select a batch' }]}
            >
              <Select
                placeholder="Choose a batch"
                loading={loadingPlan}
                size="large"
                style={{ borderRadius: "8px" }}
              >
                {batches.map((batch, index) => (
                  <Option key={batch._id} value={batch._id}>
                    Batch {index + 1}: {formatBatchSchedule(batch)} (Capacity: {batch.capacity})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {selectedPlan && getBillingIntervals().length > 0 && (
            <Form.Item
              name="billing_interval"
              label="Billing Interval"
              rules={[{ required: true, message: 'Please select a billing interval' }]}
            >
              <Select 
                placeholder="Choose billing interval"
                onChange={handleBillingIntervalChange}
                size="large"
                style={{ borderRadius: "8px" }}
              >
                {getBillingIntervals().map((interval) => (
                  <Option key={interval.key} value={interval.key}>
                    {interval.label} - ₹{interval.price}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker 
              style={{ width: "100%", borderRadius: "8px" }} 
              size="large" 
              format="DD/MM/YYYY"
              onChange={handleStartDateChange}
            />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker 
              style={{ width: "100%", borderRadius: "8px" }} 
              size="large" 
              format="DD/MM/YYYY"
              disabled
            />
          </Form.Item>

          <Form.Item
            name="payment_status"
            label="Payment Status"
            rules={[{ required: true, message: 'Please select payment status' }]}
          >
            <Select 
              placeholder="Choose payment status"
              size="large"
              style={{ borderRadius: "8px" }}
            >
              <Option value="completed">Completed</Option>
              <Option value="pending">Pending</Option>
              <Option value="failed">Failed</Option>
            </Select>
          </Form.Item>

          {selectedPlan?.benefits && selectedPlan.benefits.length > 0 && (
            <Card 
              title={<span style={{ fontSize: "14px", fontWeight: "600" }}>Plan Benefits</span>}
              size="small"
              style={{ marginBottom: 16, borderRadius: "8px", background: "#fafafa" }}
            >
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {selectedPlan.benefits.map((benefit, index) => (
                  <li key={index} style={{ marginBottom: "4px", color: "#595959" }}>{benefit}</li>
                ))}
              </ul>
            </Card>
          )}

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setManualRenewalModal(false);
                  manualForm.resetFields();
                  setSelectedPlan(null);
                  setBatches([]);
                }}
                style={{ borderRadius: "8px" }}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!selectedPlan || batches.length === 0}
                size="large"
                style={{
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  fontWeight: "500",
                }}
              >
                {loading ? "Processing..." : "Renew Membership"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User Booking"
        open={editUserModal}
        onCancel={() => {
          setEditUserModal(false);
          setEditBookingData(null);
          editUserForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editUserForm}
          layout="vertical"
          onFinish={handleEditUserSubmit}
          initialValues={{}}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select size="large" placeholder="Select Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Please enter age" },
              { type: "number", min: 1, max: 120, transform: (value) => Number(value), message: "Please enter valid age" }
            ]}
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobile_number"
            rules={[
              { required: true, message: "Please enter mobile number" },
              { min: 10, max: 15, message: "Please enter valid mobile number" }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="start_date"
          >
            <DatePicker size="large" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="end_date"
          >
            <DatePicker size="large" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item style={{ marginTop: "16px", textAlign: "right" }}>
            <Space>
              <Button onClick={() => {
                setEditUserModal(false);
                setEditBookingData(null);
                editUserForm.resetFields();
              }} size="large">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={editUserLoading} size="large">
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .table-row-discontinued {
          background-color: #fff1f0 !important;
          opacity: 0.6;
          pointer-events: none;
        }
        .table-row-discontinued:hover td {
          background-color: #fff1f0 !important;
          cursor: not-allowed;
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
        .table-row-discontinued:hover > td {
          background-color: #fff1f0 !important;
        }
        .ant-table {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default AllUserDetails;
