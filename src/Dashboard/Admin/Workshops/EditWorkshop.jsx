// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   DatePicker,
//   TimePicker,
//   Button,
//   message,
//   Card,
//   Divider,
//   Select,
//   Space,
//   InputNumber,
// } from "antd";
// import axios from "axios";
// import { API_BASE_URL } from "../../../../config";
// import { useSelector } from "react-redux";
// import dayjs from "dayjs";
// import { useParams, useNavigate } from "react-router-dom";

// const { Option } = Select;

// const EditWorkshop = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [instructors, setInstructors] = useState([]);
//   const [batches, setBatches] = useState([
//     {
//       start_time: null,
//       end_time: null,
//       capacity: null,
//       pricing: {
//         early_bird: { price: null, capacity_limit: null },
//         regular: { price: null },
//         on_the_spot: { price: null },
//       },
//     },
//   ]);

//   const user = useSelector((state) => state.user.value);

//   const config = {
//     headers: {
//       Authorization: user.access_token,
//     },
//   };

//   const messageApi = message;

//   // Fetch instructors list
//   useEffect(() => {
//     async function fetchInstructors() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}user/coaches`, config);
//         const fetchedInstructors = (res.data.data || []).map((ins) => ({
//           _id: ins._id || ins.id,
//           name: `${ins.first_name || ""} ${ins.last_name || ""}`.trim(),
//         }));
//         setInstructors(fetchedInstructors);
//       } catch (e) {
//         message.error("Failed to load instructors");
//       }
//     }
//     fetchInstructors();
//     // eslint-disable-next-line
//   }, []);

//   // Fetch existing workshop and prefill form + batches
//   useEffect(() => {
//     async function fetchWorkshop() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}workshop/${id}`, config);
//         const w = res.data?.data || res.data || {};
//         console.log("userrrrrrrrrr",w);
        

//         // Prefill simple fields
//        form.setFieldsValue({
//   title: w.title,
//   date: w.date ? dayjs(w.date) : null,
//   instructors: Array.isArray(w.instructor_user_ids)
//     ? w.instructor_user_ids.map(ins => ins.id || ins._id) // map full objects to their IDs
//     : Array.isArray(w.instructors)
//     ? w.instructors.map(ins => ins.id || ins._id)
//     : [],
// });


//         // Prefill batches: if API returns batches use them, otherwise try to convert single start/end_time
//         if (Array.isArray(w.batches) && w.batches.length > 0) {
//           const prefilled = w.batches.map((b) => ({
//             start_time: b.start_time ? dayjs(b.start_time) : null,
//             end_time: b.end_time ? dayjs(b.end_time) : null,
//             capacity: b.capacity ?? null,
//             pricing: {
//               early_bird: { price: b.pricing?.early_bird?.price ?? null, capacity_limit: b.pricing?.early_bird?.capacity_limit ?? null },
//               regular: { price: b.pricing?.regular?.price ?? null },
//               on_the_spot: { price: b.pricing?.on_the_spot?.price ?? null },
//             },
//           }));
//           setBatches(prefilled);
//         } else {
//           // fallback single batch using start_time / end_time fields if present
//           const start = w.start_time ? dayjs(w.start_time) : null;
//           const end = w.end_time ? dayjs(w.end_time) : null;
//           setBatches([
//             {
//               start_time: start,
//               end_time: end,
//               capacity: w.capacity ?? null,
//               pricing: {
//                 early_bird: { price: w.price ?? null, capacity_limit: null },
//                 regular: { price: null },
//                 on_the_spot: { price: null },
//               },
//             },
//           ]);
//         }
//       } catch (e) {
//         message.error("Failed to load workshop details");
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (id) fetchWorkshop();
//     // eslint-disable-next-line
//   }, [id]);

//   // media upload removed per request

//   // Batch handlers
//   const addBatch = () => {
//     setBatches((s) => [
//       ...s,
//       {
//         start_time: null,
//         end_time: null,
//         capacity: null,
//         pricing: {
//           early_bird: { price: null, capacity_limit: null },
//           regular: { price: null },
//           on_the_spot: { price: null },
//         },
//       },
//     ]);
//   };

//   const removeBatch = (index) => {
//     if (batches.length === 1) {
//       message.warning("At least one batch is required.");
//       return;
//     }
//     const newBatches = [...batches];
//     newBatches.splice(index, 1);
//     setBatches(newBatches);
//   };

//   const handleBatchChange = (index, field, value) => {
//     const newBatches = [...batches];
//     if (field === "start_time" || field === "end_time" || field === "capacity") {
//       newBatches[index][field] = value;
//     } else if (field === "early_bird_price") {
//       newBatches[index].pricing.early_bird.price = value;
//     } else if (field === "early_bird_capacity") {
//       newBatches[index].pricing.early_bird.capacity_limit = value;
//     } else if (field === "regular_price") {
//       newBatches[index].pricing.regular.price = value;
//     } else if (field === "on_the_spot_price") {
//       newBatches[index].pricing.on_the_spot.price = value;
//     }
//     setBatches(newBatches);
//   };

//   const validateBatches = () => {
//     for (let i = 0; i < batches.length; i++) {
//       const batch = batches[i];
//       if (!batch.start_time || !batch.end_time) {
//         message.error(`Batch ${i + 1}: Start and End time are required.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const formatPricing = (pricing) => {
//     const obj = {};
//     if (pricing.early_bird.price !== null) {
//       obj.early_bird = { price: pricing.early_bird.price };
//       if (pricing.early_bird.capacity_limit !== null) obj.early_bird.capacity_limit = pricing.early_bird.capacity_limit;
//     }
//     if (pricing.regular.price !== null) obj.regular = { price: pricing.regular.price };
//     if (pricing.on_the_spot.price !== null) obj.on_the_spot = { price: pricing.on_the_spot.price };
//     return obj;
//   };

//   const onFinish = async (values) => {
//     if (!validateBatches()) return;

//     setUploading(true);
//     try {
//       const formattedBatches = batches.map((batch) => {
//         const obj = {
//           start_time: batch.start_time ? batch.start_time.toISOString() : null,
//           end_time: batch.end_time ? batch.end_time.toISOString() : null,
//         };
//         if (batch.capacity !== null) obj.capacity = batch.capacity;
//         const pricing = formatPricing(batch.pricing);
//         if (Object.keys(pricing).length > 0) obj.pricing = pricing;
//         return obj;
//       });

//       const payload = {
//         title: values.title,
//         date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
//         instructor_user_ids: values.instructors,
//         batches: formattedBatches,
//       };

//       await axios.put(`${API_BASE_URL}workshop/${id}`, payload, config);
//       message.success("Workshop updated successfully!");
//       navigate(-1);
//     } catch (err) {
//       message.error("Failed to update workshop. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-8 px-2 font-[glancyr]">
//       <div className="w-full max-w-3xl rounded-xl shadow-lg p-6 sm:p-8 bg-white">
//         <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">
//           Edit Workshop
//         </h2>
//         <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
//           {/* Media upload removed as requested */}

//           <Form.Item label="Workshop Title" name="title" rules={[{ required: true, message: "Please enter the workshop title" }]}>
//             <Input placeholder="Enter workshop title" />
//           </Form.Item>

//           <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select a date" }]}>
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item
//             label="Instructors"
//             name="instructors"
//             rules={[{ required: true, message: "Please select instructor(s)" }]}
//           >
//             <Select
//               mode="multiple"
//               showSearch
//               placeholder="Select instructor(s)"
//               optionFilterProp="children"
//               optionLabelProp="children" // ensures full name shows in input and UI
//               filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
//             >
//               {instructors.map((ins) => (
//                 <Option key={ins._id} value={ins._id}>
//                   {ins.name || ins._id}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Divider orientation="left">Batches</Divider>

//           {batches.map((batch, index) => (
//             <Card
//               key={index}
//               className="mb-4"
//               extra={
//                 <Button danger onClick={() => removeBatch(index)} disabled={batches.length === 1}>
//                   Remove
//                 </Button>
//               }
//             >
//               <Space direction="vertical" size="middle" style={{ width: "100%" }}>
//                 <Form.Item label="Start Time" required>
//                   <TimePicker style={{ width: "100%" }} value={batch.start_time} onChange={(v) => handleBatchChange(index, "start_time", v)} format="h:mm a" use12Hours />
//                 </Form.Item>
//                 <Form.Item label="End Time" required>
//                   <TimePicker style={{ width: "100%" }} value={batch.end_time} onChange={(v) => handleBatchChange(index, "end_time", v)} format="h:mm a" use12Hours />
//                 </Form.Item>
//                 <Form.Item label="Capacity" required>
//                   <InputNumber style={{ width: "100%" }} min={1} value={batch.capacity} onChange={(v) => handleBatchChange(index, "capacity", v)} />
//                 </Form.Item>
//                 <h4 className="font-semibold">Pricing</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//                   <div>
//                     <label>Early Bird Price</label>
//                     <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.early_bird.price} onChange={(v) => handleBatchChange(index, "early_bird_price", v)} />
//                   </div>
//                   <div>
//                     <label>Early Bird Capacity Limit</label>
//                     <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.early_bird.capacity_limit} onChange={(v) => handleBatchChange(index, "early_bird_capacity", v)} />
//                   </div>
//                   <div>
//                     <label>Regular Price</label>
//                     <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.regular.price} onChange={(v) => handleBatchChange(index, "regular_price", v)} />
//                   </div>
//                   <div>
//                     <label>On the Spot Price</label>
//                     <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.on_the_spot.price} onChange={(v) => handleBatchChange(index, "on_the_spot_price", v)} />
//                   </div>
//                 </div>
//               </Space>
//             </Card>
//           ))}

//           <Button type="dashed" block onClick={addBatch} className="mb-4">
//             + Add Batch
//           </Button>

//           <Form.Item className="mt-6">
//             <div style={{ display: "flex", gap: 12 }}>
//               <Button onClick={() => navigate(-1)} style={{ flex: 1, borderColor: "#26452D", color: "#26452D", fontWeight: 600 }}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit" loading={uploading || loading} style={{ flex: 1, background: "#26452D", borderColor: "#26452D", fontFamily: "glancyr", fontWeight: 600, fontSize: 16 }}>
//                 Save Changes
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default EditWorkshop;
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  message,
  Card,
  Divider,
  Select,
  Space,
  InputNumber,
  Upload,
} from "antd";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
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
  const [fileList, setFileList] = useState([]);
  const [imageId, setImageId] = useState(null);

  const user = useSelector((state) => state.user.value);

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch instructors list
  useEffect(() => {
    async function fetchInstructors() {
      try {
        const res = await axios.get(`${API_BASE_URL}user/coaches`, config);
        const fetchedInstructors = (res.data.data || []).map((ins) => ({
          _id: ins._id || ins.id,
          name: `${ins.first_name || ""} ${ins.last_name || ""}`.trim(),
        }));
        setInstructors(fetchedInstructors);
      } catch (e) {
        message.error("Failed to load instructors");
      }
    }
    fetchInstructors();
    // eslint-disable-next-line
  }, []);

  // add helper to resolve image urls (same logic as EditMembership/AddWorkshop)
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}${url}`; // fallback - prefix API base
  };

  // Fetch existing workshop and prefill form + batches + media
  useEffect(() => {
    async function fetchWorkshop() {
      try {
        const res = await axios.get(`${API_BASE_URL}workshop/${id}`, config);
        const w = res.data?.data || res.data || {};

        // Prefill simple fields
        form.setFieldsValue({
          title: w.title,
          date: w.date ? dayjs(w.date) : null,
          instructors: Array.isArray(w.instructor_user_ids)
            ? w.instructor_user_ids.map((ins) => ins.id || ins._id)
            : Array.isArray(w.instructors)
            ? w.instructors.map((ins) => ins.id || ins._id)
            : [],
        });

        // Prefill batches
        if (Array.isArray(w.batches) && w.batches.length > 0) {
          const prefilled = w.batches.map((b) => ({
            name: b.name || null,
            start_time: b.start_time ? dayjs(b.start_time) : null,
            end_time: b.end_time ? dayjs(b.end_time) : null,
            capacity: b.capacity ?? null,
            pricing: {
              early_bird: {
                price: b.pricing?.early_bird?.price ?? null,
                capacity_limit: b.pricing?.early_bird?.capacity_limit ?? null,
              },
              regular: { price: b.pricing?.regular?.price ?? null },
              on_the_spot: { price: b.pricing?.on_the_spot?.price ?? null },
            },
          }));
          setBatches(prefilled);
        } else {
          // fallback single batch using start_time / end_time
          const start = w.start_time ? dayjs(w.start_time) : null;
          const end = w.end_time ? dayjs(w.end_time) : null;
          setBatches([
            {
              name: null,
              start_time: start,
              end_time: end,
              capacity: w.capacity ?? null,
              pricing: {
                early_bird: { price: w.price ?? null, capacity_limit: null },
                regular: { price: null },
                on_the_spot: { price: null },
              },
            },
          ]);
        }

        // Prefill media file list and imageId (mirror EditMembership behavior)
        if (Array.isArray(w.media) && w.media.length > 0) {
          const media = w.media[0];
          const thumb =
            media.image_url?.thumbnail?.low_res ||
            media.image_url?.thumbnail?.high_res ||
            media.image_url?.full?.low_res ||
            media.image_url?.full?.high_res ||
            "";
          const url = getImageUrl(thumb);
          setImageId(media.id || media._id || null);

          setFileList([
            {
              uid: media.id || media._id || "-existing-1",
              name: media.name?.original || "image",
              status: "done",
              url,
              thumbUrl: url,
              originFileObj: null,
            },
          ]);
        } else {
          setFileList([]);
          setImageId(null);
        }
      } catch (e) {
        message.error("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchWorkshop();
    // eslint-disable-next-line
  }, [id]);

  // media upload removed per request

  // Batch Handlers
  const addBatch = () => {
    setBatches((s) => [
      ...s,
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
    if (field === "start_time" || field === "end_time" || field === "capacity" || field === "name") {
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
      obj.early_bird = { price: pricing.early_bird.price };
      if (pricing.early_bird.capacity_limit !== null) obj.early_bird.capacity_limit = pricing.early_bird.capacity_limit;
    }
    if (pricing.regular.price !== null) obj.regular = { price: pricing.regular.price };
    if (pricing.on_the_spot.price !== null) obj.on_the_spot = { price: pricing.on_the_spot.price };
    return obj;
  };

  // Upload Handlers similar to AddWorkshop
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
    if (!validateBatches()) return;

    setUploading(true);
    try {
      const formattedBatches = batches.map((batch) => {
        const obj = {
          ...(batch.name ? { name: batch.name } : {}),
          start_time: batch.start_time ? batch.start_time.toISOString() : null,
          end_time: batch.end_time ? batch.end_time.toISOString() : null,
        };
        if (batch.capacity !== null) obj.capacity = batch.capacity;
        const pricing = formatPricing(batch.pricing);
        if (Object.keys(pricing).length > 0) obj.pricing = pricing;
        return obj;
      });

      const payload = {
        title: values.title,
        date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
        instructor_user_ids: values.instructors,
        batches: formattedBatches,
        ...(imageId ? { media: [imageId] } : {}),
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
      <div className="w-full max-w-3xl rounded-xl shadow-lg p-6 sm:p-8 bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#26452D] font-[glancyr]">Edit Workshop</h2>
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
          <Form.Item label="Workshop Title" name="title" rules={[{ required: true, message: "Please enter the workshop title" }]}>
            <Input placeholder="Enter workshop title" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select a date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* <Form.Item
            label="Instructors"
            name="instructors"
            rules={[{ required: true, message: "Please select instructor(s)" }]}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Select instructor(s)"
              optionFilterProp="children"
              optionLabelProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {instructors.map((ins) => (
                <Option key={ins._id} value={ins._id}>
                  {ins.name || ins._id}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

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
                  <InputNumber style={{ width: "100%" }} min={1} value={batch.capacity} onChange={(v) => handleBatchChange(index, "capacity", v)} />
                </Form.Item>
                <h4 className="font-semibold">Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label>Early Bird Price</label>
                    <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.early_bird.price} onChange={(v) => handleBatchChange(index, "early_bird_price", v)} />
                  </div>
                  <div>
                    <label>Early Bird Capacity Limit</label>
                    <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.early_bird.capacity_limit} onChange={(v) => handleBatchChange(index, "early_bird_capacity", v)} />
                  </div>
                  <div>
                    <label>Regular Price</label>
                    <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.regular.price} onChange={(v) => handleBatchChange(index, "regular_price", v)} />
                  </div>
                  <div>
                    <label>On the Spot Price</label>
                    <InputNumber style={{ width: "100%" }} min={0} value={batch.pricing.on_the_spot.price} onChange={(v) => handleBatchChange(index, "on_the_spot_price", v)} />
                  </div>
                </div>
              </Space>
            </Card>
          ))}

          <Button type="dashed" block onClick={addBatch} className="mb-4">
            + Add Batch
          </Button>

          <Form.Item className="mt-6">
            <div style={{ display: "flex", gap: 12 }}>
              <Button onClick={() => navigate(-1)} style={{ flex: 1, borderColor: "#26452D", color: "#26452D", fontWeight: 600 }}>
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
