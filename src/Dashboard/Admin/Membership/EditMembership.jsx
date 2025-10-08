/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Divider, message, Spin } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const EditMembership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  useEffect(() => {
    async function fetchPlan() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}membership-plan/${id}`, config);
        const data = res.data?.data || res.data || {};
        form.setFieldsValue({
  name: data.name || "",
  price: data.price ?? undefined,
  duration: data.billing_interval || data.duration || undefined,
  plan_for: data.plan_for || undefined,
  benefits: Array.isArray(data.benefits) ? data.benefits.join("\n") : (data.benefits || ""),
});
;
      } catch (e) {
        message.error("Failed to load membership plan details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPlan();
    // eslint-disable-next-line
  }, [id]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const benefitsArray = (values.benefits || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
  name: values.name,
  price: Number(values.price),
  billing_interval: values.duration,
  plan_for: values.plan_for,
  benefits: benefitsArray,
};


      await axios.put(`${API_BASE_URL}membership-plan/${id}`, payload, config);
      message.success("Membership plan updated successfully!");
      navigate(-1);
    } catch (e) {
      message.error("Failed to update membership plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ebe5db]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Edit Membership
        </h2>
        <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
          <Card style={{ background: "#fff", border: "none", marginBottom: 24 }}>
            <Divider
              style={{ color: "#26452D", borderColor: "#26452D", fontWeight: 700 }}
              orientation="left"
            >
              Membership Details
            </Divider>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter the membership name" }]}
              >
                <Input placeholder="e.g., Gold Plan" />
              </Form.Item>

              <Form.Item
                label="Price (₹)"
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={100}
                  placeholder="e.g., 1999"
                />
              </Form.Item>

              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: "Please select a duration" }]}
              >
                <Select placeholder="Select duration">
                  <Option value="MONTHLY">Monthly</Option>
                  <Option value="3_MONTHS">3 months</Option>
                  <Option value="6_MONTHS">6 months</Option>
                  <Option value="YEARLY">12 months</Option>
                </Select>
              </Form.Item>
              <Form.Item
  label="Plan For"
  name="plan_for"
  rules={[{ required: true, message: "Please select who this plan is for" }]}
>
  <Select placeholder="Select plan for">
    <Option value="KIDS">KIDS</Option>
    <Option value="ADULTS">ADULT</Option>
  </Select>
</Form.Item>


              <Form.Item label="Benefits" name="benefits" className="sm:col-span-2">
                <TextArea
                  rows={5}
                  placeholder={
                    "List each benefit on a new line.\n" +
                    "Example:\n• Unlimited classes\n• Access to all studios\n• Priority workshop booking"
                  }
                />
              </Form.Item>
            </div>
          </Card>

          <Form.Item className="mt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{
                width: "100%",
                background: "#26452D",
                borderColor: "#26452D",
                fontFamily: "glancyr",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditMembership;
