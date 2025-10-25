/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Card, Alert, Row, Col, DatePicker, Divider, Typography, Space, Spin } from "antd";
import { CalendarOutlined, UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../config";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const AddUserMember = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user.value);
  
  const [memberships, setMemberships] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch all memberships on component mount
  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan`, config);
      const data = res.data?.items || res.data?.data || res.data || [];
      setMemberships(data);
    } catch (e) {
      setMessage({ type: "error", text: "Failed to load membership plans" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  // Handle membership plan selection
  const handleMembershipChange = async (membershipId) => {
    setLoadingPlan(true);
    setSelectedPlan(null);
    setBatches([]);
    
    form.setFieldsValue({
      batchId: undefined,
      billingInterval: undefined
    });

    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan/${membershipId}`, config);
      const planData = res.data?.data || res.data || {};
      
      setSelectedPlan(planData);
      
      if (planData.batches && planData.batches.length > 0) {
        setBatches(planData.batches);
      } else {
        setMessage({ type: "info", text: "No batches available for this plan" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load membership plan details" });
    } finally {
      setLoadingPlan(false);
    }
  };

  // Get billing intervals from selected plan
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

  // Format batch schedule for display
  const formatBatchSchedule = (batch) => {
    const days = batch.schedule.map(s => s.day).join(', ');
    const time = batch.schedule[0] ? `${batch.schedule[0].start_time} - ${batch.schedule[0].end_time}` : '';
    return `${days} (${time})`;
  };

  // Get selected billing price
  const getSelectedPrice = () => {
    const billingInterval = form.getFieldValue('billingInterval');
    if (!billingInterval || !selectedPlan?.prices) return null;
    return selectedPlan.prices[billingInterval];
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    // Prepare payload
    const payload = {
      planId: values.membershipPlan,
      name: values.name,
      age: parseInt(values.age),
      email: values.email,
      mobile_number: values.mobile_number,
      gender: values.gender,
      billing_interval: values.billingInterval.toUpperCase(),
      payment_status: "COMPLETED",
      start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
    };

    // Add optional batch if selected
    if (values.batchId) payload.batchId = values.batchId;

    try {
      const response = await axios.post(
        `${API_BASE_URL}membership-plan/manual-booking`,
        payload,
        config
      );

      setMessage({ type: "success", text: "Member added successfully!" });
      
      // Reset form
      form.resetFields();
      setSelectedPlan(null);
      setBatches([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add member";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <Title level={2}>Add New Member</Title>
          <Paragraph type="secondary">Fill in the details to create a new membership</Paragraph>

          {message.text && (
            <Alert
              message={message.text}
              type={message.type === "success" ? "success" : message.type === "error" ? "error" : "info"}
              showIcon
              closable
              onClose={() => setMessage({ type: "", text: "" })}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              start_date: dayjs()
            }}
          >
            {/* Membership Plan */}
            <Form.Item
              label="Membership Plan"
              name="membershipPlan"
              rules={[{ required: true, message: 'Please select a membership plan' }]}
            >
              <Select
                placeholder="Select Membership Plan"
                onChange={handleMembershipChange}
                loading={loading}
                size="large"
              >
                {memberships.map((membership) => (
                  <Option key={membership._id} value={membership._id}>
                    {membership.name} - {membership.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Batch Dropdown */}
            {batches.length > 0 && (
              <Form.Item
                label="Batch"
                name="batchId"
                rules={[{ required: true, message: 'Please select a batch' }]}
              >
                <Select
                  placeholder="Select Batch"
                  loading={loadingPlan}
                  size="large"
                >
                  {batches.map((batch, index) => (
                    <Option key={batch._id} value={batch._id}>
                      Batch {index + 1}: {formatBatchSchedule(batch)} (Capacity: {batch.capacity})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {/* Billing Interval */}
            {selectedPlan && getBillingIntervals().length > 0 && (
              <Form.Item
                label="Billing Interval"
                name="billingInterval"
                rules={[{ required: true, message: 'Please select a billing interval' }]}
              >
                <Select placeholder="Select Billing Interval" size="large">
                  {getBillingIntervals().map((interval) => (
                    <Option key={interval.key} value={interval.key}>
                      {interval.label} - ₹{interval.price}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {/* Price Display */}
            {getSelectedPrice() && (
              <Card style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff', marginBottom: 24 }}>
                <Text strong>Total Amount:</Text>
                <Title level={2} style={{ color: '#1890ff', margin: '8px 0 0 0' }}>
                  ₹{getSelectedPrice()}
                </Title>
              </Card>
            )}

            {/* Plan Benefits */}
            {selectedPlan?.benefits && selectedPlan.benefits.length > 0 && (
              <Card 
                title="Benefits" 
                style={{ backgroundColor: '#fafafa', marginBottom: 24 }}
                size="small"
              >
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {selectedPlan.benefits.map((benefit, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>{benefit}</li>
                  ))}
                </ul>
              </Card>
            )}

            <Divider>Member Information</Divider>

            {/* Name */}
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter the name' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter full name" 
                size="large"
              />
            </Form.Item>

            {/* Age and Gender Row */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Age"
                  name="age"
                  rules={[
                    { required: true, message: 'Please enter age' },
                    { type: 'number', min: 1, max: 120, message: 'Age must be between 1 and 120', transform: (value) => Number(value) }
                  ]}
                >
                  <Input 
                    type="number" 
                    placeholder="Enter age" 
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Select placeholder="Select Gender" size="large">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Enter email address" 
                size="large"
              />
            </Form.Item>

            {/* Mobile Number */}
            <Form.Item
              label="Mobile Number"
              name="mobile_number"
              rules={[
                { required: true, message: 'Please enter mobile number' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Enter 10-digit mobile number" 
                size="large"
                maxLength={10}
              />
            </Form.Item>

            {/* Start Date */}
            <Form.Item
              label={<span>Start Date <Text type="secondary">(Optional)</Text></span>}
              name="start_date"
            >
              <DatePicker 
                style={{ width: '100%' }} 
                size="large"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={!selectedPlan}
                size="large"
                block
              >
                {submitting ? "Adding Member..." : "Add Member"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddUserMember;