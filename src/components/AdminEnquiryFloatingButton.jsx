import React, { useState } from "react";
import { Button, Modal, Form, Input, Space, message, Tooltip } from "antd";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useSelector } from "react-redux";

const AdminEnquiryFloatingButton = () => {
  const user = useSelector((state) => state.user.value);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const config = {
    headers: {
      Authorization: user?.access_token,
    },
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      await axios.post(
        `${API_BASE_URL}enquire/admin`,
        {
          name: values.name,
          phone_number: values.phone_number,
          email_id: values.email_id,
          purpose: values.purpose,
        },
        config
      );
      window.dispatchEvent(new CustomEvent("admin-enquiry-added"));
      message.success("Admin enquiry saved");
      closeModal();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save admin enquiry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Tooltip title="Add admin enquiry">
        <Button
          type="primary"
          shape="round"
          icon={<MessageCircle size={18} />}
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 1200,
            height: 52,
            border: "none",
            fontFamily: "glancyr, sans-serif",
            fontWeight: 600,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 10px 24px rgba(102, 126, 234, 0.35)",
          }}
        >
          Enquiry
        </Button>
      </Tooltip>

      <Modal
        title="Add Admin Enquiry"
        open={open}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter phone number" },
              { pattern: /^\d{10,15}$/, message: "Enter a valid phone number" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="email_id"
            label="Email"
            rules={[{ type: "email", message: "Please enter valid email" }]}
          >
            <Input placeholder="Enter email (optional)" />
          </Form.Item>
          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[{ required: true, message: "Please enter purpose" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter purpose/details" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEnquiryFloatingButton;
