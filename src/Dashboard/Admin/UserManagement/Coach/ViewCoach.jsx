import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Spin, Popconfirm, message } from "antd";
import { API_BASE_URL } from "../../../../../config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewCoach = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: user.access_token,
    },
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}user/coaches`, config)
      .then((response) => {
        // Assuming response.data.data contains array of coaches
        const fetchedData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setData(fetchedData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("assets/")) {
    // Try without "/api" if that's how your image URLs are served
    const newUrl = `${API_BASE_URL}${url}`;
    console.log("Constructed image url:", newUrl);
    return newUrl;
    // Or if it should have /api/, adjust accordingly
  }
  return `${API_BASE_URL}api/${url}`;
};



  const handleImageClick = (url, alt) => {
    setSelectedImage({ url, alt });
    setImageModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/editcoach/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}user/delete/${id}`, config);
      setData((prev) => prev.filter((item) => item._id !== id));
      message.success("Coach deleted successfully");
    } catch (error) {
      message.error("Failed to delete coach");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Sl. No.",
      key: "slno",
      width: 60,
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
    },
//     {
//       title: "profile picture",
//       key: "profile_picture",
//       width: 100,
//       render: (_, record) => {
//   const firstMedia = Array.isArray(record.media_details) ? record.media_details[0] : null;
// const thumbUrl = firstMedia?.image_url?.thumbnail?.low_res || firstMedia?.image_url?.thumbnail?.high_res;

// if (thumbUrl) {
//   return (
//     <img
//       src={getImageUrl(thumbUrl)}
//       alt={firstMedia.name?.original || "User Image"}
//       style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
//       onClick={() => handleImageClick(getImageUrl(firstMedia.image_url.full.high_res), firstMedia.name?.original || "User Image")}
//       // onError={(e) => { e.currentTarget.style.display = "none"; }}
//       title="Click to preview"
//     />
//   );
// }
// return <span style={{ color: "#64748b", fontSize: 12 }}>No Image</span>;
//       },
//     },
{
  title: "Profile Photo",
  key: "profilePhoto",
  width: 120,
  render: (_, record) => {
    const photos = record.media_details || [];
        if (Array.isArray(photos) && photos.length > 0) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {photos.map((media, i) => {
                if (
                  media.image_url &&
                  media.image_url.thumbnail &&
                  media.image_url.thumbnail.high_res
                ) {
                  const thumbnailUrl = getImageUrl(
                    media.image_url.thumbnail.low_res ||
                      media.image_url.thumbnail.high_res
                  );
                  const fullUrl = getImageUrl(media.image_url.full.high_res);
                  const altText = media.name?.original || "Profile Photo";

                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        onClick={() => handleImageClick(fullUrl, altText)}
                        style={{
                          cursor: "pointer",
                          display: "inline-block",
                        }}
                        title="Click to view full image"
                      >
                        <img
                          src={thumbnailUrl}
                          alt={altText}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "none";
                          }}
                          onError={(e) => {
                            console.error(
                              "Failed to load image:",
                              thumbnailUrl
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => handleImageClick(fullUrl, altText)}
                        style={{
                          padding: 0,
                          marginTop: 4,
                          fontWeight: 500,
                          color: "#3182ce",
                          fontSize: 12,
                          display: "block",
                        }}
                      >
                        View
                      </Button>
                    </div>
                  );
                }

                if (media.doc_url) {
                  return (
                    <a
                      key={i}
                      href={getImageUrl(media.doc_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#6366f1",
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      PDF
                    </a>
                  );
                }

                if (
                  media.video_url &&
                  (media.video_url.video?.high_res ||
                    media.video_url.video?.low_res)
                ) {
                  return (
                    <span
                      key={i}
                      style={{
                        color: "#06b6d4",
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      Video
                    </span>
                  );
                }

                return (
                  <span key={i} style={{ fontSize: 12 }}>
                    Media
                  </span>
                );
              })}
            </div>
          );
        }
        return <span style={{ color: "#64748b", fontSize: 12 }}>No Photo</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(record._id)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this coach?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: 24, marginBottom: 24 }}>
        Coaches List
      </h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={paginatedData}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data.length,
            onChange: handlePageChange,
          }}
          scroll={{ x: 900 }}
          bordered
        />
      )}

      <Modal
        title="Media Preview"
        visible={imageModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        centered
      >
        {selectedImage && (
          <img
            src={selectedImage.url}
            alt={selectedImage.alt}
            style={{
              width: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ViewCoach;
