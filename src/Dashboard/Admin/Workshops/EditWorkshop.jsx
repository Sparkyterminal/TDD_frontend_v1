/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
import { useParams, useNavigate } from "react-router-dom";

const { Option } = Select;

const EditWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageId, setImageId] = useState(null);
  const [existingImageId, setExistingImageId] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  const messageApi = message;

  // Fetch instructors for the select options
  useEffect(() => {
    async function fetchInstructors() {
      try {
        const res = await axios.get(`${API_BASE_URL}user/coaches`, config);
        const fetchedInstructors = res.data.data.map((ins) => ({
          _id: ins._id || ins.id,
          name: `${ins.first_name} ${ins.last_name}`,
        }));
        setInstructors(fetchedInstructors);
      } catch (e) {
        message.error("Failed to load instructors");
      }
    }
    fetchInstructors();
    // eslint-disable-next-line
  }, []);

  // Fetch workshop details and prefill
  useEffect(() => {
    async function fetchWorkshop() {
      try {
        const res = await axios.get(`${API_BASE_URL}workshop/${id}`, config);
        const w = res.data?.data || res.data;

        // Prefill media thumbnail if present
        const firstMedia = Array.isArray(w.media) && w.media.length > 0 ? w.media[0] : null;
        const mediaThumb = firstMedia?.image_url?.thumbnail?.low_res || firstMedia?.image_url?.thumbnail?.high_res;
        const mediaId = firstMedia?.id || firstMedia?._id || w.image || null;
        if (mediaThumb) {
          setFileList([
            {
              uid: mediaId || "existing-1",
              name: firstMedia?.name?.original || "existing-image",
              status: "done",
              url: mediaThumb.startsWith("http") ? mediaThumb : `${API_BASE_URL}${mediaThumb}`,
            },
          ]);
        }
        setExistingImageId(mediaId || null);

        // Prefill instructors (ids)
        const instructorIds = Array.isArray(w.instructor_user_ids)
          ? w.instructor_user_ids.map((u) => u.id || u._id).filter(Boolean)
          : Array.isArray(w.instructors)
          ? w.instructors
          : [];

        // Prefill form fields
        form.setFieldsValue({
          title: w.title,
          date: w.date ? dayjs(w.date) : null,
          startTime: w.start_time ? dayjs(w.start_time) : null,
          endTime: w.end_time ? dayjs(w.end_time) : null,
          capacity: w.capacity,
          price: w.price,
          instructors: instructorIds,
        });
      } catch (e) {
        message.error("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshop();
    // eslint-disable-next-line
  }, [id]);

  // Media upload change (optional replacement)
  const handleUploadChange = async ({ fileList: newFileList }) => {
    const latestFileList = newFileList.slice(-1);
    setFileList(latestFileList);
    setImageId(null);
    if (latestFileList.length === 0) {
      setImageId(null);
      return;
    }
    const file = latestFileList[0].originFileObj;
    if (!file) return; // click preview/remove of existing
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
      const response = await axios.post(`${API_BASE_URL}media`, formData, config);
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
    // If user deletes existing preview, keep existingImageId unless they upload new
  };

  const onFinish = async (values) => {
    setUploading(true);
    try {
      // Combine date with startTime and endTime hours/minutes correctly
      const start_time = values.date
        .set("hour", values.startTime.hour())
        .set("minute", values.startTime.minute())
        .set("second", 0)
        .format("YYYY-MM-DDTHH:mm:ssZ");
  
      const end_time = values.date
        .set("hour", values.endTime.hour())
        .set("minute", values.endTime.minute())
        .set("second", 0)
        .format("YYYY-MM-DDTHH:mm:ssZ");
  
      const payload = {
        image: imageId || existingImageId || undefined,
        title: values.title,
        date: values.date.format("YYYY-MM-DD"),
        start_time,
        end_time,
        capacity: values.capacity,
        price: values.price,
        instructor_user_ids: values.instructors,
      };
  
      await axios.put(`${API_BASE_URL}workshop/${id}`, payload, config);
      message.success("Workshop updated successfully!");
      navigate(-1);
    } catch (err) {
      message.error("Failed to update workshop. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Edit Workshop
        </h2>
        <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
          <Card style={{ background: "#fff", border: "none", marginBottom: 24 }}>
            <Divider
              style={{ color: "#26452D", borderColor: "#26452D", fontWeight: 700 }}
              orientation="left"
            >
              Upload
            </Divider>
            <Form.Item label="Workshop Image" className="mb-0">
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                accept="image/*"
                maxCount={1}
                listType="picture-card"
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
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
              label="Workshop Title"
              name="title"
              rules={[{ required: true, message: "Please enter the workshop title" }]}
            >
              <Input placeholder="Enter workshop title" />
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select a date" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please select the start time" }]}
            >
              <TimePicker style={{ width: "100%" }} use12Hours format="h:mm a" />
            </Form.Item>
            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "Please select the end time" }]}
            >
              <TimePicker style={{ width: "100%" }} use12Hours format="h:mm a" />
            </Form.Item>
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
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {instructors.map((ins) => (
                  <Option key={ins._id} value={ins._id}>
                    {ins.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
              <Input type="number" min={0} placeholder="Enter price" />
            </Form.Item>
            <Form.Item
              label="Total Capacity"
              name="capacity"
              rules={[{ required: true, message: "Please enter total capacity" }]}
            >
              <Input type="number" min={1} placeholder="Enter total seats/capacity" />
            </Form.Item>
          </div>

          <Form.Item className="mt-6">
            <div style={{ display: "flex", gap: 12 }}>
              <Button
                onClick={() => navigate(-1)}
                style={{ flex: 1, borderColor: "#26452D", color: "#26452D", fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={uploading || loading}
                style={{ flex: 1, background: "#26452D", borderColor: "#26452D", fontFamily: "glancyr", fontWeight: 600, fontSize: 16 }}
              >
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditWorkshop;
