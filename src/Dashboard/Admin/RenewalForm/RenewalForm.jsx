/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../config";
import { message, Select, Form, Button, Card, Space, Typography } from "antd";
import { useParams, useLocation } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const RenewalForm = () => {
  const user = useSelector((state) => state.user.value);
  const [form] = Form.useForm();
  const location = useLocation();
  
  const [memberships, setMemberships] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { id: membershipBookingId } = useParams();
  
  // Get userId from location state
  const renewalUserId = location.state?.userId;

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
      console.log("membership", res.data);
      
      // Handle both array and object with items property
      const data = res.data?.items || res.data?.data || res.data || [];
      setMemberships(data);
    } catch (e) {
      message.error("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
    
    // Check if userId is passed
    if (!renewalUserId) {
      console.warn("No userId found in navigation state");
      message.warning("User information not found. Please go back and try again.");
    } else {
      console.log("Renewal for user ID:", renewalUserId);
    }
    // eslint-disable-next-line
  }, []);

  // Fetch specific plan details when membership is selected
  const handleMembershipChange = async (membershipId) => {
    setLoadingPlan(true);
    setSelectedPlan(null);
    setBatches([]);
    
    // Reset dependent fields
    form.setFieldsValue({
      batch: undefined,
      billingInterval: undefined,
    });

    try {
      const res = await axios.get(`${API_BASE_URL}membership-plan/${membershipId}`, config);
      const planData = res.data?.data || res.data || {};
      
      console.log("plan details", planData);
      setSelectedPlan(planData);
      
      // Extract batches
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

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    console.log("Selected price:", getSelectedPrice());
    
    // Validate userId is available
    if (!renewalUserId) {
      message.error("User information is missing. Please go back and try again.");
      return;
    }
    
    setSubmitting(true);

    try {
      const payload = {
        membershipBookingId: membershipBookingId,
        planId: values.membershipPlan,
        userId: renewalUserId, // Use the userId from location state
        batchId: values.batch,
        billing_interval: values.billingInterval,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${API_BASE_URL}membership-plan/${membershipBookingId}/renew`,
        payload,
        config
      );
      
      console.log("Renewal response:", response.data);
      
      // Redirect to checkout page
      if (response.data.checkoutPageUrl) {
        window.location.href = response.data.checkoutPageUrl;
      } else {
        message.success("Membership renewed successfully!");
      }
      
    } catch (error) {
      console.error("Renewal error:", error);
      const errorMessage = error.response?.data?.message || "Failed to process renewal. Please try again.";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Membership Renewal" style={{ maxWidth: 600, margin: '0 auto' }}>
      {renewalUserId && (
        <div style={{ marginBottom: 16, padding: '12px', background: '#f0f2f5', borderRadius: '8px' }}>
          <Text strong>Renewing for User ID: </Text>
          <Text code>{renewalUserId}</Text>
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Membership Plan Dropdown */}
        <Form.Item
          name="membershipPlan"
          label="Select Membership Plan"
          rules={[{ required: true, message: 'Please select a membership plan' }]}
        >
          <Select
            placeholder="Choose a membership plan"
            onChange={handleMembershipChange}
            loading={loading}
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
            name="batch"
            label="Select Batch"
            rules={[{ required: true, message: 'Please select a batch' }]}
          >
            <Select
              placeholder="Choose a batch"
              loading={loadingPlan}
            >
              {batches.map((batch, index) => (
                <Option key={batch._id} value={batch._id}>
                  Batch {index + 1}: {formatBatchSchedule(batch)} (Capacity: {batch.capacity})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Billing Interval Dropdown */}
        {selectedPlan && getBillingIntervals().length > 0 && (
          <Form.Item
            name="billingInterval"
            label="Billing Interval"
            rules={[{ required: true, message: 'Please select a billing interval' }]}
          >
            <Select placeholder="Choose billing interval">
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
          <Card style={{ marginBottom: 16, backgroundColor: '#f0f2f5' }}>
            <Space direction="vertical">
              <Text strong>Total Amount:</Text>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                ₹{getSelectedPrice()}
              </Title>
            </Space>
          </Card>
        )}

        {/* Plan Benefits */}
        {selectedPlan?.benefits && selectedPlan.benefits.length > 0 && (
          <Card title="Benefits" style={{ marginBottom: 16 }}>
            <ul>
              {selectedPlan.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            disabled={!selectedPlan || batches.length === 0 || !renewalUserId}
            loading={submitting}
          >
            {submitting ? "Processing..." : "Proceed to Payment"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RenewalForm;