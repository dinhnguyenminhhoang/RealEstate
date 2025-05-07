import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  userDeletePostApi,
  userGetAllPostAPi,
} from "../../../services/postService";
import { BASEIMAGE } from "../../../utils";

const UserManagePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPostImages, setCurrentPostImages] = useState([]);
  const navigator = useNavigate();
  const fetchPosts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await userGetAllPostAPi({
        page: params.pagination?.current || pagination.current,
        limit: params.pagination?.pageSize || pagination.pageSize,
      });
      setPosts(res.data.data);
      setPagination({
        ...params.pagination,
        total: res.data.meta.total,
        current: res.data.meta.page,
        pageSize: res.data.meta.limit,
      });
    } catch (error) {
      message.error("Failed to fetch posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts({ pagination });
  }, []);

  const handleTableChange = (newPagination) => {
    fetchPosts({
      pagination: newPagination,
    });
  };

  const handleEdit = (postId) => {
    navigator(`/user/action-post?id=${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      const response = await userDeletePostApi(postId);
      if (response.status === 200) {
        await message.success("Bài đăng đã được xóa");
        fetchPosts();
      } else {
        message.error(`Lỗi không xác định: ${response.status}`);
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      message.error(
        error.response?.data?.message ||
          "Xóa bài đăng thất bại. Vui lòng thử lại sau"
      );
    }
  };
  const handleAddNew = () => {
    navigator("/user/action-post");
  };

  const handlePreview = (images, index) => {
    setCurrentPostImages(images);
    setCurrentImageIndex(index);
    setPreviewImage(BASEIMAGE + images[index].path);
    setPreviewTitle(`Image ${index + 1} of ${images.length}`);
    setPreviewVisible(true);
  };

  const handleNext = () => {
    const nextIndex = (currentImageIndex + 1) % currentPostImages.length;
    setCurrentImageIndex(nextIndex);
    setPreviewImage(BASEIMAGE + currentPostImages[nextIndex].path);
    setPreviewTitle(`Image ${nextIndex + 1} of ${currentPostImages.length}`);
  };

  const handlePrev = () => {
    const prevIndex =
      (currentImageIndex - 1 + currentPostImages.length) %
      currentPostImages.length;
    setCurrentImageIndex(prevIndex);
    setPreviewImage(BASEIMAGE + currentPostImages[prevIndex].path);
    setPreviewTitle(`Image ${prevIndex + 1} of ${currentPostImages.length}`);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    setPreviewImage(BASEIMAGE + currentPostImages[index].path);
    setPreviewTitle(`Image ${index + 1} of ${currentPostImages.length}`);
  };

  const columns = [
    {
      title: "#Id",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div className="flex space-x-1">
          {images.slice(0, 3).map((img, index) => (
            <Image
              key={img._id}
              src={BASEIMAGE + img.path}
              alt={img.filename}
              width={50}
              height={50}
              className="rounded object-cover cursor-pointer"
              onClick={() => handlePreview(images, index)}
              preview={false}
            />
          ))}
          {images.length > 3 && (
            <Tag
              className="flex items-center justify-center cursor-pointer"
              onClick={() => handlePreview(images, 0)}
            >
              +{images.length - 3}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "in-stock" ? "green" : "red"}>
          {status === "in-stock" ? "Còn hàng" : "Hết hàng"}
        </Tag>
      ),
    },
    {
      title: "Duyệt",
      dataIndex: "verification",
      key: "verification",
      render: (verification) => (
        <Tag color={verification ? "blue" : "orange"}>
          {verification ? "Đã xác minh" : "Đang trong quá trình kiểm tra"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
            className="text-blue-500 hover:text-blue-700"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        Quản lý bài đăng
      </h2>
      <div className="my-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={posts}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
        bordered
      />

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        className="image-preview-modal"
      >
        <div className="relative">
          <div className="flex justify-center mb-4">
            <Image
              src={previewImage}
              alt="Preview"
              style={{ maxHeight: "60vh" }}
              className="object-contain"
            />
          </div>

          <Button
            icon={<LeftOutlined />}
            onClick={handlePrev}
            className="!absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            shape="circle"
            size="large"
          />

          <Button
            icon={<RightOutlined />}
            onClick={handleNext}
            className="!absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            shape="circle"
            size="large"
          />

          <div className="flex overflow-x-auto py-2 mt-4">
            {currentPostImages.map((img, index) => (
              <div
                key={img._id}
                className={`mx-1 cursor-pointer ${
                  currentImageIndex === index
                    ? "border-2 border-blue-500"
                    : "border border-gray-200"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={BASEIMAGE + img.path}
                  alt={img.filename}
                  width={80}
                  height={60}
                  className="object-cover"
                  preview={false}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagePost;
