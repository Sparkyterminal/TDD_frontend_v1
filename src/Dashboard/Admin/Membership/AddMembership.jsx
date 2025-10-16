/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Divider,
  message,
  Space,
  Row,
  Col,
  Upload,
} from "antd";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

const { TextArea } = Input;
const { Option } = Select;

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const kidsCategories = [
  { value: "JUNIOR", label: "Junior" },
  { value: "ADVANCED", label: "Advanced" },
];

const planForOptions = [
  { value: "ADULT", label: "Adults" },
  { value: "KID", label: "Kids" },
];

const AddMembership = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // class types fetched from API (used for Dance Type dropdown)
  const [classTypes, setClassTypes] = useState([]);
  const [loadingClassTypes, setLoadingClassTypes] = useState(false);

  // media upload states
  const [fileList, setFileList] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [imageId, setImageId] = useState(null);

  // plan for: ADULT/KID
  const [planFor, setPlanFor] = useState(undefined);

  // Redux user token for auth header
  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user?.access_token,
    },
  };

  // Fetch class types to populate Dance Type dropdown
  useEffect(() => {
    const fetchClassTypes = async () => {
      setLoadingClassTypes(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}class-type?page=1&limit=100`,
          config
        );
        const arr = Array.isArray(res.data.data?.classTypes)
          ? res.data.data.classTypes
          : [];
        setClassTypes(arr);
      } catch (err) {
        console.error("Failed to fetch class types", err);
        message.error("Failed to load dance types");
        setClassTypes([]);
      } finally {
        setLoadingClassTypes(false);
      }
    };
    fetchClassTypes();
  }, []);

  // Determines if kids_category should show, based on planFor
  const showKidsCategory = planFor === "KID";

  // Media upload handler
  const handleUploadChange = async ({ fileList: newFileList }) => {
    const latest = newFileList.slice(-1);
    setFileList(latest);
    setImageId(null);
    if (latest.length === 0) {
      setImageId(null);
      return;
    }

    const file = latest[0].originFileObj;
    if (!file) return; // existing file preview/remove

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
      setFileList([]);
      setImageId(null);
      return;
    }

    setUploadingMedia(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      const res = await axios.post(`${API_BASE_URL}media`, formData, config);
      if (res.status !== 200 && res.status !== 201)
        throw new Error("Upload failed");
      const returnedId = res.data.data || null;
      setImageId(returnedId);
      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Media upload error:", err);
      message.error("Image upload failed. Please try again.");
      setFileList([]);
      setImageId(null);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteImage = () => {
    setFileList([]);
    setImageId(null);
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const benefitsArray = (values.benefits || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      // Construct prices object with only filled values
      const prices = {
        monthly: Number(values.price_monthly),
        quarterly: values.price_quarterly ? Number(values.price_quarterly) : undefined,
        half_yearly: values.price_half_yearly ? Number(values.price_half_yearly) : undefined,
        yearly: values.price_yearly ? Number(values.price_yearly) : undefined,
      };
      Object.keys(prices).forEach((key) => prices[key] === undefined && delete prices[key]);

      // Transform batches to the required format:
      // each batch has schedule array [{day, start_time, end_time}], capacity, is_active:true
      // values.batches is array from form List
      const batchesPayload = (values.batches || []).map((batch) => ({
        schedule: (batch.schedule || []).map((s) => ({
          day: s.day,
          start_time: s.start_time,
          end_time: s.end_time,
        })),
        capacity: batch.capacity,
        is_active: true,
      }));

      const payload = {
        name: values.name,
        description: values.description || null,
        dance_type: values.dance_type,
        plan_for: values.plan_for,
        kids_category: values.plan_for === "KID" && values.kids_category ? values.kids_category : null,
        prices,
        benefits: benefitsArray,
        batches: batchesPayload,
        image: imageId || undefined,
      };

      await axios.post(`${API_BASE_URL}membership-plan`, payload, config);
      message.success("Membership plan created successfully!");
      form.resetFields();
      setFileList([]);
      setImageId(null);
      setPlanFor(undefined);
    } catch (e) {
      console.error("Create membership error:", e);
      message.error("Failed to create membership plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
          Add Membership
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
          initialValues={{ batches: [] }}
        >
          <Card style={{ background: "#fff", border: "none", marginBottom: 24 }}>
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

            {/* Media upload */}
            <Form.Item label="Upload Image" className="mb-4">
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
              >
                {fileList.length >= 1 ? null : (
                  <div style={{ textAlign: "center", color: "#26452D" }}>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>
                      {uploadingMedia ? "Uploading..." : "Upload"}
                    </div>
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

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter the membership name" }]}
                >
                  <Input placeholder="e.g., Gold Plan" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Dance Type"
                  name="dance_type"
                  rules={[{ required: true, message: "Please select the dance type" }]}
                >
                  <Select
                    placeholder="Select dance type"
                    loading={loadingClassTypes}
                    optionFilterProp="children"
                    showSearch
                    optionLabelProp="children"
                    onChange={(val) => {}}
                  >
                    {classTypes.map((ct) => (
                      <Option key={ct._id} value={ct._id}>
                        {ct.title || ct.name || ct._id}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Plan For"
                  name="plan_for"
                  rules={[{ required: true, message: "Please select Adults or Kids" }]}
                >
                  <Select
                    placeholder="Adults or Kids"
                    onChange={(v) => {
                      setPlanFor(v);
                      // clear kids_category on switch
                      if (v !== "KID") form.setFieldsValue({ kids_category: undefined });
                    }}
                    allowClear
                  >
                    {planForOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {showKidsCategory && (
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Kids Category"
                    name="kids_category"
                    rules={[{ required: true, message: "Please select a kids category" }]}
                  >
                    <Select placeholder="Select category">
                      {kidsCategories.map((opt) => (
                        <Option value={opt.value} key={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Form.Item
              label="Description"
              name="description"
              className="sm:col-span-2"
            >
              <TextArea
                rows={2}
                placeholder={"Add a short description about this plan..."}
              />
            </Form.Item>

            <Divider orientation="left">Billing Intervals</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Monthly Price (₹)"
                  name="price_monthly"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="e.g., 1999"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Quarterly Price (₹)" name="price_quarterly">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Optional"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Half Yearly Price (₹)" name="price_half_yearly">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Optional"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Yearly Price (₹)" name="price_yearly">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Optional"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Benefits"
              name="benefits"
              className="sm:col-span-2"
            >
              <TextArea
                rows={3}
                placeholder={
                  "List each benefit on a new line.\nExample:\n• Unlimited classes\n• Access to all studios\n• Priority workshop booking"
                }
              />
            </Form.Item>

            <Divider orientation="left">Batches</Divider>

            <Form.List name="batches">
              {(batchFields, { add: addBatch, remove: removeBatch }) => (
                <>
                  {batchFields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      className="mb-4"
                      style={{ background: "#f7f7f7" }}
                      title={`Batch ${key + 1}`}
                      extra={
                        <Button type="link" danger onClick={() => removeBatch(name)}>
                          Remove Batch
                        </Button>
                      }
                    >
                      <Form.List name={[name, "schedule"]}>
                        {(scheduleFields, { add: addSchedule, remove: removeSchedule }) => (
                          <>
                            {scheduleFields.map(({ key: schedKey, name: schedName }) => (
                              <Row
                                gutter={8}
                                key={schedKey}
                                align="middle"
                                style={{ marginBottom: 8 }}
                              >
                                <Col xs={8} sm={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[schedName, "day"]}
                                    rules={[{ required: true, message: "Select day" }]}
                                  >
                                    <Select placeholder="Day">
                                      {daysOfWeek.map((day) => (
                                        <Option key={day} value={day}>
                                          {day}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col xs={8} sm={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[schedName, "start_time"]}
                                    rules={[{ required: true, message: "Start time" }]}
                                  >
                                    <Input type="time" />
                                  </Form.Item>
                                </Col>
                                <Col xs={8} sm={6}>
                                  <Form.Item
                                    {...restField}
                                    name={[schedName, "end_time"]}
                                    rules={[{ required: true, message: "End time" }]}
                                  >
                                    <Input type="time" />
                                  </Form.Item>
                                </Col>
                                <Col xs={4} sm={3}>
                                  <MinusCircleOutlined
                                    style={{ color: "red", fontSize: 18 }}
                                    onClick={() => removeSchedule(schedName)}
                                  />
                                </Col>
                              </Row>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addSchedule()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Schedule (Day + Time)
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>

                      <Form.Item
                        label="Capacity"
                        name={[name, "capacity"]}
                        rules={[{ required: true, message: "Enter capacity" }]}
                      >
                        <InputNumber min={1} style={{ width: "100%" }} placeholder="Capacity" />
                      </Form.Item>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() =>
                        addBatch({ schedule: [{ day: null, start_time: null, end_time: null }], capacity: null })
                      }
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Batch
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

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
