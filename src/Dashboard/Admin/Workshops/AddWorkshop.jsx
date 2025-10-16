/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Card,
  Divider,
  Space,
  InputNumber,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

const AddWorkshop = () => {
  const [form] = Form.useForm();
  const [batches, setBatches] = useState([
    {
      name: null,
      start_time: null,
      end_time: null,
      capacity: null,
      pricing: {
        early_bird: { price: null, capacity_limit: null },
        regular: { price: null },
        on_the_spot: { price: null },
      },
    },
  ]);
  const user = useSelector((state) => state.user.value);

  // media upload state (same logic as AddCoach)
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageId, setImageId] = useState(null);

  const config = {
    headers: {
      Authorization: user?.access_token,
    },
  };

  const addBatch = () => {
    setBatches([
      ...batches,
      {
        name: null,
        start_time: null,
        end_time: null,
        capacity: null,
        pricing: {
          early_bird: { price: null, capacity_limit: null },
          regular: { price: null },
          on_the_spot: { price: null },
        },
      },
    ]);
  };

  const removeBatch = (index) => {
    if (batches.length === 1) {
      message.warning("At least one batch is required.");
      return;
    }
    const newBatches = [...batches];
    newBatches.splice(index, 1);
    setBatches(newBatches);
  };

  const handleBatchChange = (index, field, value) => {
    const newBatches = [...batches];
    if (
      field === "start_time" ||
      field === "end_time" ||
      field === "capacity" ||
      field === "name"
    ) {
      newBatches[index][field] = value;
    } else if (field === "early_bird_price") {
      newBatches[index].pricing.early_bird.price = value;
    } else if (field === "early_bird_capacity") {
      newBatches[index].pricing.early_bird.capacity_limit = value;
    } else if (field === "regular_price") {
      newBatches[index].pricing.regular.price = value;
    } else if (field === "on_the_spot_price") {
      newBatches[index].pricing.on_the_spot.price = value;
    }
    setBatches(newBatches);
  };

  const validateBatches = () => {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      if (!batch.start_time || !batch.end_time) {
        message.error(`Batch ${i + 1}: Start and End time are required.`);
        return false;
      }
    }
    return true;
  };

  const formatPricing = (pricing) => {
    const obj = {};
    if (pricing.early_bird.price !== null) {
      obj.early_bird = {
        price: pricing.early_bird.price,
      };
      if (pricing.early_bird.capacity_limit !== null) {
        obj.early_bird.capacity_limit = pricing.early_bird.capacity_limit;
      }
    }
    if (pricing.regular.price !== null) {
      obj.regular = { price: pricing.regular.price };
    }
    if (pricing.on_the_spot.price !== null) {
      obj.on_the_spot = { price: pricing.on_the_spot.price };
    }
    return obj;
  };

  // Upload handlers (mirrors AddCoach)
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

    // File size check (max 2MB) - same as AddCoach
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
      setFileList([]);
      setImageId(null);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await axios.post(`${API_BASE_URL}media`, formData, config);
      if (response.status !== 201 && response.status !== 200) throw new Error("Upload failed");

      const returnedId = response.data.data || null;
      setImageId(returnedId);
      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Media upload error:", err);
      message.error("Image upload failed. Please try again.");
      setImageId(null);
      setFileList([]);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    setFileList([]);
    setImageId(null);
    // Optionally call API to delete media if needed
  };

  const onFinish = async (values) => {
    if (!validateBatches()) {
      return;
    }

    const formattedBatches = batches.map((batch) => {
      const pricing = formatPricing(batch.pricing);

      const obj = {
        ...(batch.name ? { name: batch.name } : {}),
        start_time: batch.start_time.toISOString(),
        end_time: batch.end_time.toISOString(),
      };

      if (batch.capacity !== null) obj.capacity = batch.capacity;
      if (Object.keys(pricing).length > 0) obj.pricing = pricing;

      return obj;
    });

    const payload = {
      title: values.title,
      date: values.date.format("YYYY-MM-DD"),
      batches: formattedBatches,
      ...(imageId ? { media: [imageId] } : {}),
    };

    try {
      await axios.post(`${API_BASE_URL}workshop`, payload, config);
      message.success("Workshop added successfully!");
      form.resetFields();
      setBatches([
        {
          name: null,
          start_time: null,
          end_time: null,
          capacity: null,
          pricing: {
            early_bird: { price: null, capacity_limit: null },
            regular: { price: null },
            on_the_spot: { price: null },
          },
        },
      ]);
      setFileList([]);
      setImageId(null);
    } catch (err) {
      message.error("Failed to add workshop. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Add Workshop
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
              label="Workshop Image"
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
                fileList={fileList}
                onRemove={handleDeleteImage}
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

          <Form.Item
            label="Workshop Title"
            name="title"
            rules={[{ required: true, message: "Please enter the workshop title" }]}
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

          <Divider orientation="left">Batches</Divider>

          {batches.map((batch, index) => (
            <Card
              key={index}
              className="mb-4"
              extra={
                <Button danger onClick={() => removeBatch(index)} disabled={batches.length === 1}>
                  Remove
                </Button>
              }
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Form.Item label="Batch Name">
                  <Input
                    value={batch.name}
                    onChange={(e) => handleBatchChange(index, "name", e.target.value)}
                    placeholder="e.g., Morning Batch / Weekend Batch"
                  />
                </Form.Item>

                <Form.Item label="Start Time" required>
                  <TimePicker
                    style={{ width: "100%" }}
                    value={batch.start_time}
                    onChange={(v) => handleBatchChange(index, "start_time", v)}
                    format="h:mm a"
                    use12Hours
                  />
                </Form.Item>
                <Form.Item label="End Time" required>
                  <TimePicker
                    style={{ width: "100%" }}
                    value={batch.end_time}
                    onChange={(v) => handleBatchChange(index, "end_time", v)}
                    format="h:mm a"
                    use12Hours
                  />
                </Form.Item>
                <Form.Item label="Capacity" required>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1}
                    value={batch.capacity}
                    onChange={(v) => handleBatchChange(index, "capacity", v)}
                  />
                </Form.Item>
                <h4 className="font-semibold">Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label>Early Bird Price</label>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      value={batch.pricing.early_bird.price}
                      onChange={(v) => handleBatchChange(index, "early_bird_price", v)}
                    />
                  </div>
                  <div>
                    <label>Early Bird Capacity Limit</label>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      value={batch.pricing.early_bird.capacity_limit}
                      onChange={(v) => handleBatchChange(index, "early_bird_capacity", v)}
                    />
                  </div>
                  <div>
                    <label>Regular Price</label>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      value={batch.pricing.regular.price}
                      onChange={(v) => handleBatchChange(index, "regular_price", v)}
                    />
                  </div>
                  <div>
                    <label>On the Spot Price</label>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      value={batch.pricing.on_the_spot.price}
                      onChange={(v) => handleBatchChange(index, "on_the_spot_price", v)}
                    />
                  </div>
                </div>
              </Space>
            </Card>
          ))}

          <Button type="dashed" block onClick={addBatch} className="mb-4">
            + Add Batch
          </Button>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                background: "#26452D",
                borderColor: "#26452D",
                fontFamily: "glancyr",
                fontWeight: 600,
                fontSize: 16,
              }}
              loading={uploading}
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
