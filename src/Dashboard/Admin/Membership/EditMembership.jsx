/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
  Spin,
} from "antd";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useNavigate, useParams } from "react-router-dom";

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

const EditMembership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form helpers
  const [classTypes, setClassTypes] = useState([]);
  const [loadingClassTypes, setLoadingClassTypes] = useState(false);
  const [planFor, setPlanFor] = useState(undefined);

  // media upload states (same behavior as AddMembership)
  const [fileList, setFileList] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [imageId, setImageId] = useState(null);

  const user = useSelector((state) => state.user.value);
  const config = { headers: { Authorization: user?.access_token } };

  const getImageUrl = (thumb) => {
    if (!thumb) return "";
    if (thumb.startsWith("http")) return thumb;
    return `${API_BASE_URL}${thumb}`;
  };

  useEffect(() => {
    const fetchClassTypes = async () => {
      setLoadingClassTypes(true);
      try {
        const res = await axios.get(`${API_BASE_URL}class-type?page=1&limit=100`, config);
        const arr = Array.isArray(res.data.data?.classTypes) ? res.data.data.classTypes : [];
        setClassTypes(arr);
      } catch (e) {
        // silent
      } finally {
        setLoadingClassTypes(false);
      }
    };
    fetchClassTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch membership to prefill form
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}membership-plan/${id}`, config);
        const data = res.data?.data || res.data || {};
        if (cancelled) return;

        // build form values
        const values = {
          name: data.name || "",
          description: data.description || "",
          dance_type: data.dance_type?._id || undefined,
          plan_for: data.plan_for || undefined,
          kids_category: data.kids_category || undefined,
          price_monthly: data.prices?.monthly ?? undefined,
          price_quarterly: data.prices?.quarterly ?? undefined,
          price_half_yearly: data.prices?.half_yearly ?? undefined,
          price_yearly: data.prices?.yearly ?? undefined,
          benefits: Array.isArray(data.benefits) ? data.benefits.join("\n") : (data.benefits || ""),
        };

        // prepare batches for Form.List (each batch -> { schedule: [{day,start_time,end_time}], capacity })
        const batches = Array.isArray(data.batches)
          ? data.batches.map((b) => ({
              schedule: Array.isArray(b.schedule)
                ? b.schedule.map((s) => ({
                    day: s.day || null,
                    start_time: s.start_time || "",
                    end_time: s.end_time || "",
                  }))
                : [],
              capacity: b.capacity ?? undefined,
            }))
          : [];

        // prefill image if exists
        if (data.image && data.image.image_url) {
          const thumb =
            data.image.image_url.thumbnail?.low_res ||
            data.image.image_url.thumbnail?.high_res ||
            data.image.image_url.full?.low_res ||
            data.image.image_url.full?.high_res ||
            "";
          const url = getImageUrl(thumb);
          setFileList([
            {
              uid: data.image._id || data.image.id || "-existing-1",
              name: data.image.name?.original || "image",
              status: "done",
              url,
              thumbUrl: url,
            },
          ]);
          setImageId(data.image._id || data.image.id || null);
        } else {
          setFileList([]);
          setImageId(null);
        }

        setPlanFor(data.plan_for || undefined);

        // set form values and batches
        // ensure Form.List initial values:
        form.setFieldsValue({ ...values, batches });
      } catch (err) {
        message.error("Failed to load membership plan");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPlan();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // media upload handler (mirrors AddMembership)
  const handleUploadChange = async ({ fileList: newFileList }) => {
    const latest = newFileList.slice(-1);
    setFileList(latest);
    setImageId(null);
    if (latest.length === 0) {
      setImageId(null);
      return;
    }

    const file = latest[0].originFileObj;
    if (!file) return; // preview/remove existing file

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
      if (![200, 201].includes(res.status)) throw new Error("Upload failed");
      const returnedId = res.data.data || res.data?.id || null;
      setImageId(returnedId);
      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Image upload failed. Please try again.");
      setImageId(null);
      setFileList([]);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteImage = () => {
    setFileList([]);
    setImageId(null);
  };

  const validateBatches = (batches) => {
    if (!Array.isArray(batches) || batches.length === 0) {
      message.error("At least one batch is required");
      return false;
    }
    for (let i = 0; i < batches.length; i++) {
      const b = batches[i];
      if (!Array.isArray(b.schedule) || b.schedule.length === 0) {
        message.error(`Batch ${i + 1}: add at least one schedule`);
        return false;
      }
      for (let j = 0; j < b.schedule.length; j++) {
        const s = b.schedule[j];
        if (!s.day || !s.start_time || !s.end_time) {
          message.error(`Batch ${i + 1} schedule ${j + 1}: fill day and times`);
          return false;
        }
      }
      if (!b.capacity || Number(b.capacity) <= 0) {
        message.error(`Batch ${i + 1}: enter valid capacity`);
        return false;
      }
    }
    return true;
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const benefitsArray = (values.benefits || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const prices = {
        monthly: Number(values.price_monthly),
        quarterly: values.price_quarterly ? Number(values.price_quarterly) : undefined,
        half_yearly: values.price_half_yearly ? Number(values.price_half_yearly) : undefined,
        yearly: values.price_yearly ? Number(values.price_yearly) : undefined,
      };
      Object.keys(prices).forEach((k) => prices[k] === undefined && delete prices[k]);

      const batchesPayload = (values.batches || []).map((b) => ({
        schedule: (b.schedule || []).map((s) => ({
          day: s.day,
          start_time: s.start_time,
          end_time: s.end_time,
        })),
        capacity: Number(b.capacity),
        is_active: true,
      }));

      if (!validateBatches(batchesPayload)) {
        setSubmitting(false);
        return;
      }

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

      await axios.put(`${API_BASE_URL}membership-plan/${id}`, payload, config);
      message.success("Membership plan updated");
      navigate(-1);
    } catch (err) {
      console.error(err);
      message.error("Failed to update membership plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const showKidsCategory = form.getFieldValue("plan_for") === "KID" || planFor === "KID";

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D]">
          Edit Membership
        </h2>

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ batches: [] }}>
          <Card style={{ background: "#fff", border: "none", marginBottom: 24 }}>
            <Divider style={{ color: "#26452D", borderColor: "#26452D", fontWeight: 700 }} orientation="left">
              Membership Details
            </Divider>

            <Form.Item label="Upload Image" className="mb-4">
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                accept="image/*"
                maxCount={1}
                listType="picture-card"
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                fileList={fileList}
                onRemove={handleDeleteImage}
              >
                {fileList.length >= 1 ? null : (
                  <div style={{ textAlign: "center", color: "#26452D" }}>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>{uploadingMedia ? "Uploading..." : "Upload"}</div>
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
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the membership name" }]}>
                  <Input placeholder="e.g., Gold Plan" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Dance Type" name="dance_type" rules={[{ required: true, message: "Please select the dance type" }]}>
                  <Select placeholder="Select dance type" loading={loadingClassTypes} showSearch>
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
                <Form.Item label="Plan For" name="plan_for" rules={[{ required: true, message: "Please select Adults or Kids" }]}>
                  <Select
                    placeholder="Adults or Kids"
                    onChange={(v) => {
                      setPlanFor(v);
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
                  <Form.Item label="Kids Category" name="kids_category" rules={[{ required: true, message: "Please select a kids category" }]}>
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

            <Form.Item label="Description" name="description" className="sm:col-span-2">
              <TextArea rows={2} placeholder={"Add a short description about this plan..."} />
            </Form.Item>

            <Divider orientation="left">Billing Intervals</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Monthly Price (₹)" name="price_monthly" rules={[{ required: true, message: "Required" }]}>
                  <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g., 1999" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Quarterly Price (₹)" name="price_quarterly">
                  <InputNumber style={{ width: "100%" }} min={0} placeholder="Optional" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Half Yearly Price (₹)" name="price_half_yearly">
                  <InputNumber style={{ width: "100%" }} min={0} placeholder="Optional" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Yearly Price (₹)" name="price_yearly">
                  <InputNumber style={{ width: "100%" }} min={0} placeholder="Optional" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Benefits" name="benefits" className="sm:col-span-2">
              <TextArea rows={3} placeholder={"List each benefit on a new line."} />
            </Form.Item>

            <Divider orientation="left">Batches</Divider>

            <Form.List name="batches">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, idx) => (
                    <Card key={key} size="small" className="mb-4" title={`Batch ${idx + 1}`} extra={<Button type="link" danger onClick={() => remove(name)}>Remove</Button>}>
                      <Form.List name={[name, "schedule"]}>
                        {(schedFields, { add: addSched, remove: removeSched }) => (
                          <>
                            {schedFields.map(({ key: sk, name: sn }) => (
                              <Row gutter={8} key={sk} align="middle" style={{ marginBottom: 8 }}>
                                <Col xs={8} sm={6}>
                                  <Form.Item {...restField} name={[sn, "day"]} rules={[{ required: true, message: "Select day" }]}>
                                    <Select placeholder="Day">
                                      {daysOfWeek.map((d) => <Option key={d} value={d}>{d}</Option>)}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col xs={8} sm={6}>
                                  <Form.Item {...restField} name={[sn, "start_time"]} rules={[{ required: true, message: "Start time" }]}>
                                    <Input type="time" />
                                  </Form.Item>
                                </Col>
                                <Col xs={8} sm={6}>
                                  <Form.Item {...restField} name={[sn, "end_time"]} rules={[{ required: true, message: "End time" }]}>
                                    <Input type="time" />
                                  </Form.Item>
                                </Col>
                                <Col xs={4} sm={3}>
                                  <MinusCircleOutlined style={{ color: "red", fontSize: 18 }} onClick={() => removeSched(sn)} />
                                </Col>
                              </Row>
                            ))}

                            <Form.Item>
                              <Button type="dashed" onClick={() => addSched()} block icon={<PlusOutlined />}>Add Schedule (Day + Time)</Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>

                      <Form.Item {...restField} label="Capacity" name={[name, "capacity"]} rules={[{ required: true, message: "Enter capacity" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} placeholder="Capacity" />
                      </Form.Item>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add({ schedule: [{ day: null, start_time: "", end_time: "" }], capacity: undefined })} block icon={<PlusOutlined />}>Add Batch</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          <Form.Item className="mt-2">
            <Button type="primary" htmlType="submit" loading={submitting || uploadingMedia} style={{ width: "100%", background: "#26452D", borderColor: "#26452D", fontFamily: "glancyr", fontWeight: 600, fontSize: 16 }}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditMembership;
