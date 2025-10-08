/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Form, Input, Select, TimePicker, DatePicker, Button, message, Card, Row, Col, InputNumber } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const { Option } = Select;

const AddClasses = () => {
  const [form] = Form.useForm();
  const [classTypes, setClassTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Get user and config for headers
  const user = useSelector((state) => state.user.value);
  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  // Fetch class types
  const fetchClassTypes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}class-type?page=1&limit=100`, config);
      const classTypesData = Array.isArray(res.data.data?.classTypes)
        ? res.data.data.classTypes
        : [];
      setClassTypes(classTypesData);
    } catch (err) {
      message.error("Failed to fetch class types");
      console.error("Error fetching class types:", err);
    }
  };

  // Fetch coaches
  const fetchCoaches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}user/coaches`, config);
      const coachesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setCoaches(coachesData);
    } catch (err) {
      message.error("Failed to fetch coaches");
      console.error("Error fetching coaches:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      await Promise.all([fetchClassTypes(), fetchCoaches()]);
      setLoadingData(false);
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        class_name: values.className,
        class_type_id: values.classType,
        instructor_user_ids: values.coach,
        date: values.date.format("YYYY-MM-DD"),
        start_at: values.startTime.format("HH:mm:ss"),
        end_at: values.endTime.format("HH:mm:ss"),
        capacity: parseInt(values.capacity),
      };

      console.log("Payload:", payload);

      const response = await axios.post(`${API_BASE_URL}class-session`, payload, config);
      
      message.success("Class added successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error adding class:", error);
      message.error("Failed to add class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields");
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2 font-[glancyr]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#0B3D0B] font-[glancyr]">
          Add Classes
        </h2>
        
        <Form
          form={form}
          name="addClassForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Class Name"
                name="className"
                rules={[
                  {
                    required: true,
                    message: "Please enter class name!",
                  },
                ]}
              >
                <Input placeholder="Enter class name" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Class Type"
                name="classType"
                rules={[
                  {
                    required: true,
                    message: "Please select class type!",
                  },
                ]}
              >
                <Select
                  placeholder="Select class type"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {classTypes.map((classType) => (
                    <Option key={classType._id} value={classType._id}>
                      {classType.title} - {classType.level} ({classType.category})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
  <Col xs={24} sm={12}>
    <Form.Item
      label="Coach"
      name="coach"
      rules={[
        {
          required: true,
          message: "Please select at least one coach!",
          type: 'array', // add this to validate multiple selections
        },
      ]}
    >
      <Select
        mode="multiple"  // enable multiple selection
        placeholder="Select coach(es)"
        size="large"
        showSearch
        filterOption={(input, option) =>
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {coaches.map((coach) => (
          <Option key={coach._id} value={coach._id}>
            {coach.first_name} {coach.last_name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Col>
</Row>


          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Please select date!",
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select date"
                  size="large"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
            <Form.Item
  label="Capacity"
  name="capacity"
  rules={[
    {
      required: true,
      message: "Please enter capacity!",
    },
    {
      type: "number",
      min: 1,
      message: "Capacity must be at least 1!",
    },
  ]}
>
  <InputNumber
    min={1}
    size="large"
    style={{ width: "100%" }}
    placeholder="Enter capacity"
  />
</Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[
                  {
                    required: true,
                    message: "Please select start time!",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="Select start time"
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: "Please select end time!",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="Select end time"
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="bg-[#adc290] hover:bg-[#9bb17d] border-[#adc290] hover:border-[#9bb17d] text-white font-medium px-8 py-2 h-auto"
            >
              Add Class
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddClasses;
