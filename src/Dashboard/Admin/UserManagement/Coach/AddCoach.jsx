/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import { useSelector } from "react-redux";

const AddCoach = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageId, setImageId] = useState(null);

  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  const messageApi = message;

  // Upload and preview image just like in RecruitmentForm
  const handleUploadChange = async ({ fileList: newFileList }) => {
    const latestFileList = newFileList.slice(-1);
    setFileList(latestFileList);
    setImageId(null);

    if (latestFileList.length === 0) {
      setImageId(null);
      return;
    }

    const file = latestFileList[0].originFileObj;
    if (!file) return;

    // File size check (max 2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("File must be smaller than 2MB!");
      setFileList([]);
      setImageId(null);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await axios.post(`${API_BASE_URL}media`, formData,config);

      if (response.status !== 201 && response.status !== 200) throw new Error("Upload failed");

      const imgId = response.data.data || null;
      setImageId(imgId);

      messageApi.success("Image uploaded successfully!");
    } catch (err) {
      messageApi.error("Image upload failed. Please try again.");
      setImageId(null);
      setFileList([]);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    setFileList([]);
    setImageId(null);
    // Optionally, call your API to delete the image from the server here
  };

  const onFinish = async (values) => {
    if (!imageId) {
      message.error("Please upload an image for the instructor.");
      return;
    }

    setUploading(true);
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email_id: values.email_id,
        password: "DaceDistrictCoach@123",
        role: "COACH",
        media: [imageId], // send image id as string
      };

      await axios.post(
        `${API_BASE_URL}user/add-coach`,
        payload,
        config
      );

      message.success("Instructor added successfully!");
      form.resetFields();
      setFileList([]);
      setImageId(null);
    } catch (err) {
      message.error("Failed to add instructor. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Add Instructor
        </h2>
        <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
          <Card style={{ background: "#fff", border: "none", marginBottom: 24 }}>
            <Divider
              style={{
                color: "#26452D",
                borderColor: "#26452D",
                fontWeight: 700,
              }}
              orientation="left"
            >
              Upload
            </Divider>
            <Form.Item
              label="Instructor Image"
              required
              validateStatus={!imageId && fileList.length === 0 ? "error" : ""}
              help={!imageId && fileList.length === 0 ? "Please upload an image" : ""}
              className="mb-0"
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                accept="image/*"
                maxCount={1}
                listType="picture-card"
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                fileList={fileList}
                onRemove={handleDeleteImage}
                className="w-full"
              >
                {fileList.length >= 1 ? null : (
                  <div style={{ textAlign: "center", color: "#26452D" }}>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {fileList.length > 0 && (
                  <Button size="small" danger onClick={handleDeleteImage}>
                    Delete
                  </Button>
                )}
              </div>
              <small style={{ color: "#26452D" }}>Max file size 2MB</small>
            </Form.Item>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
            <Form.Item
              label="Email ID"
              name="email_id"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Role" name="role" initialValue="COACH" className="sm:col-span-1">
              <Input value="COACH" disabled />
            </Form.Item>
            <Form.Item label="Password" name="password" initialValue="DaceDistrictCoach@123" className="sm:col-span-2">
              <Input.Password value="DaceDistrictCoach@123" disabled />
            </Form.Item>
          </div>
          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
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

export default AddCoach;
