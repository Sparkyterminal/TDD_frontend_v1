/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Upload,
  message,
  Card,
  Divider,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
// If you use moment, you can replace with `import moment from 'moment';`

const { Option } = Select;

const AddWorkshop = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  const messageApi = message;

  // ------------- Fetch Instructors on Mount -------------
  useEffect(() => {
    async function fetchInstructors() {
      try {
        const res = await axios.get(`${API_BASE_URL}user/coaches`, config);
        // Map the fetched data to include `name` field for display
        const fetchedInstructors = res.data.data.map((ins) => ({
          _id: ins._id,
          name: `${ins.first_name} ${ins.last_name}`, // Combine first and last names
        }));
        setInstructors(fetchedInstructors);
      } catch (e) {
        message.error("Failed to load instructors");
      }
    }
    fetchInstructors();
    // eslint-disable-next-line
  }, []);

  // ------------- Media upload logic (unchanged) -------------
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
      const response = await axios.post(
        `${API_BASE_URL}media`,
        formData,
        config
      );
      if (response.status !== 201 && response.status !== 200)
        throw new Error("Upload failed");
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
  };

  // ------------- Handle final submit -------------
  const onFinish = async (values) => {
    if (!imageId) {
      message.error("Please upload an image for the workshop.");
      return;
    }
    setUploading(true);
    try {
      const start_time = values.date
        .clone()
        .hour(values.startTime.hour())
        .minute(values.startTime.minute())
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ssZ");
      const end_time = values.date
        .clone()
        .hour(values.endTime.hour())
        .minute(values.endTime.minute())
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ssZ");

      const payload = {
        image: imageId,
        title: values.title,
        date: values.date.format("YYYY-MM-DD"),
        start_time,
        end_time,
        capacity: values.capacity,
        price: values.price,
        instructor_user_ids: values.instructors, // multiple instructors
      };

      await axios.post(`${API_BASE_URL}workshop`, payload, config);
      message.success("Workshop added successfully!");
      form.resetFields();
      setFileList([]);
      setImageId(null);
    } catch (err) {
      message.error("Failed to add workshop. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Add Workshop
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
              Upload
            </Divider>
            <Form.Item
              label="Workshop Image"
              required
              validateStatus={!imageId && fileList.length === 0 ? "error" : ""}
              help={
                !imageId && fileList.length === 0
                  ? "Please upload an image"
                  : ""
              }
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
          {/* 2 inputs per row on desktop, 1 per row on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <Form.Item
              label="Workshop Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the workshop title" },
              ]}
            >
              <Input placeholder="Enter workshop title" />
            </Form.Item>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[
                { required: true, message: "Please select the start time" },
              ]}
            >
              <TimePicker
                style={{ width: "100%" }}
                use12Hours
                format="h:mm a"
              />
            </Form.Item>
            <Form.Item
              label="End Time"
              name="endTime"
              rules={[
                { required: true, message: "Please select the end time" },
              ]}
            >
              <TimePicker
                style={{ width: "100%" }}
                use12Hours
                format="h:mm a"
              />
            </Form.Item>
            {/* Dropdown for instructors (multiple) */}
            <Form.Item
              label="Instructors"
              name="instructors"
              className="sm:col-span-2"
              rules={[{ required: true, message: "Please select at least one instructor" }]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder="Select instructor(s)"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {instructors.map((ins) => (
                  <Option key={ins._id} value={ins._id}>
                    {ins.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <Input type="number" min={0} placeholder="Enter price" />
            </Form.Item>
            <Form.Item
              label="Total Capacity"
              name="capacity"
              rules={[
                { required: true, message: "Please enter total capacity" },
              ]}
            >
              <Input
                type="number"
                min={1}
                placeholder="Enter total seats/capacity"
              />
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

export default AddWorkshop;
