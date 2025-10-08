/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";

const { Option } = Select;

const AddClassType = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        level: values.level,
        category: values.category || "",
        description: values.description,
      };

      await axios.post(`${API_BASE_URL}class-type`, payload, config);
      message.success("Class type added successfully!");
      form.resetFields();
    } catch (err) {
      message.error("Failed to add class type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Add Class Type
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter class type title" />
            </Form.Item>
            <Form.Item
              label="Level"
              name="level"
              rules={[{ required: true, message: "Please select the level" }]}
            >
              <Select placeholder="Select level">
                <Option value="BEGINNER">BEGINNER</Option>
                <Option value="INTERMEDIATE">INTERMEDIATE</Option>
                <Option value="ADVANCED">ADVANCED</Option>
                <Option value="ALL">ALL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[]}
            >
              <Input placeholder="Enter category (optional)" />
            </Form.Item>
          </div>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter the description" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                background: "#26452D",
                borderColor: "#26452D",
                fontFamily: "glancyr",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddClassType;
