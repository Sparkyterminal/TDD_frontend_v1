/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Divider,
  message,
} from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

const { TextArea } = Input;
const { Option } = Select;

const AddMembership = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

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
        billing_interval: values.duration, // e.g., "MONTHLY", "3_MONTHS", etc.
        benefits: benefitsArray, // send as an array for structure on backend
        plan_for: values.plan_for, // "KIDS" or "ADULT"
      };

      await axios.post(`${API_BASE_URL}membership-plan`, payload, config);
      message.success("Membership plan created successfully!");
      form.resetFields();
    } catch (e) {
      message.error("Failed to create membership plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Add Membership
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Card
            style={{ background: "#fff", border: "none", marginBottom: 24 }}
          >
            <Divider
              style={{
                color: "#26452D",
                borderColor: "#26452D",
                fontWeight: 700,
              }}
              orientation="left"
            >
              Membership Details
            </Divider>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the membership name",
                  },
                ]}
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
                rules={[
                  { required: true, message: "Please select a duration" },
                ]}
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
                rules={[
                  {
                    required: true,
                    message: "Please select who this plan is for",
                  },
                ]}
              >
                <Select placeholder="Select plan for">
                  <Option value="KIDS">KIDS</Option>
                  <Option value="ADULTS">ADULT</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Benefits"
                name="benefits"
                className="sm:col-span-2"
              >
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
              Create Membership
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddMembership;
