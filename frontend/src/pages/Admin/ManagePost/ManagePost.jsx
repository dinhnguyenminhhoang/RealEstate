import {
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Drawer,
  Descriptions,
  Card,
  Avatar,
  Badge,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  confirmPostApi,
  deletePostApi,
  getAllPostAPi,
} from "../../../services/postService";
import { BASEIMAGE, formatCurrencyVND } from "../../../utils";
import useNotification from "../../../hooks/useNotification";

const { Text, Title } = Typography;

const ManagerPost = () => {
  const openNotification = useNotification();
  const [listPosts, setListPosts] = useState([]);
  const [detailPost, setDetailPost] = useState(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [pagi, setPagi] = useState({
    limit: 4,
    page: 1,
    total: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await getAllPostAPi({ page, limit });
      if (res.status === 200) {
        setListPosts(res.data.data);
        setPagi({
          limit: res.data.meta.limit,
          page: res.data.meta.page,
          total: res.data.meta.total,
          totalPages: res.data.meta.totalPages,
        });
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        description: error || "Lỗi khi tải dữ liệu bài đăng",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagi.page, pagi.limit);
  }, []);

  const handleViewDetail = (record) => {
    setDetailPost(record);
    setShowDetailDrawer(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc chắn?",
      content: `Bạn thực sự muốn xóa bài đăng "${record.title}"?`,
      onOk: async () => {
        try {
          const res = await deletePostApi(record._id);
          if (res.status === 200) {
            openNotification({
              message: "Thông báo",
              description: "Xóa bài đăng thành công",
            });
            fetchData(pagi.page, pagi.limit);
          }
        } catch (error) {
          openNotification({
            type: "error",
            message: "Lỗi",
            description: "Xóa bài đăng thất bại",
          });
        }
      },
    });
  };

  const handleConfirmPost = async (post) => {
    try {
      const res = await confirmPostApi(post._id);
      if (res.status === 200) {
        openNotification({
          message: "Thông báo",
          description: "Cập nhật trạng thái bài đăng thành công",
        });
        setShowDetailDrawer(false);
        await fetchData(pagi.page, pagi.limit);
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        description: error || "Có lỗi xảy ra",
      });
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "20%",
      ellipsis: true,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {record.images && record.images.length > 0 ? (
            <Avatar
              shape="square"
              size={40}
              src={BASEIMAGE + record.images[0].path}
            />
          ) : (
            <Avatar shape="square" size={40} icon={<InfoCircleOutlined />} />
          )}
          <div>
            <Text strong className="block mb-1">
              {text}
            </Text>
            <Text type="secondary" className="text-xs">
              {new Date(record.createdAt).toLocaleDateString()}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin",
      dataIndex: "price",
      key: "info",
      width: "25%",
      render: (price, record) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Text strong>{formatCurrencyVND(price)}</Text>
            <Badge
              status={record.status === "in-stock" ? "success" : "error"}
              text={record.status === "in-stock" ? "Còn hàng" : "Hết hàng"}
            />
          </div>
          <Tooltip title={record.address}>
            <Text type="secondary" ellipsis className="block w-40">
              {record.address}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Người đăng",
      dataIndex: "author",
      key: "author",
      width: "20%",
      render: (author) => (
        <Tooltip
          title={
            <div>
              <p>Email: {author.email}</p>
              <p>SĐT: {author.phone}</p>
              <p>Địa chỉ: {author.address}</p>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <Avatar icon={<UserOutlined />} />
            <Text ellipsis className="max-w-32">
              {author.userName}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "verification",
      key: "verification",
      width: "15%",
      render: (verification) => (
        <Tag color={verification ? "blue" : "orange"}>
          {verification ? "Đã xác minh" : "Chưa xác minh"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => handleViewDetail(record)}
            icon={<EyeOutlined />}
          />
          <Button
            danger
            size="small"
            onClick={() => handleDelete(record)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="m-0">
          Quản lý bài đăng
        </Title>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table
          dataSource={listPosts}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={false}
          size="middle"
          scroll={{ x: 800 }}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={pagi.page}
            total={pagi.total}
            pageSize={pagi.limit}
            onChange={(page) => fetchData(page, pagi.limit)}
            showSizeChanger
            onShowSizeChange={(current, size) => fetchData(current, size)}
          />
        </div>
      </Card>

      <Drawer
        title="Chi tiết bài đăng"
        placement="right"
        onClose={() => setShowDetailDrawer(false)}
        open={showDetailDrawer}
        width={520}
      >
        {detailPost && (
          <div className="space-y-6">
            <div>
              <Title level={5}>{detailPost.title}</Title>
              <Badge
                status={detailPost.status === "in-stock" ? "success" : "error"}
                text={
                  detailPost.status === "in-stock" ? "Còn hàng" : "Hết hàng"
                }
                className="mb-2"
              />
              <div className="mb-2">
                <Text strong>Giá: </Text>
                <Text>{formatCurrencyVND(detailPost.price)}</Text>
              </div>
            </div>

            <Descriptions
              title="Thông tin bài đăng"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="ID">{detailPost._id}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {detailPost.address}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(detailPost.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái xác minh">
                <div className="flex items-center gap-2">
                  <Tag color={detailPost.verification ? "blue" : "orange"}>
                    {detailPost.verification ? "Đã xác minh" : "Chưa xác minh"}
                  </Tag>
                  <Button
                    type="primary"
                    onClick={() => handleConfirmPost(detailPost)}
                  >
                    {detailPost.verification ? "Hủy xác minh" : "Xác nhận"}
                  </Button>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Lượt xem">
                {detailPost.views}
              </Descriptions.Item>
              <Descriptions.Item label="Lượt yêu thích">
                {detailPost.favorites}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5}>Thông tin người đăng</Title>
              <Card size="small">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar size="large" icon={<UserOutlined />} />
                  <div>
                    <Text strong>{detailPost.author.userName}</Text>
                    <Text type="secondary" className="block">
                      {detailPost.author.email}
                    </Text>
                  </div>
                </div>
                <div className="mt-2">
                  <p>
                    <Text strong>SĐT:</Text> {detailPost.author.phone}
                  </p>
                  <p>
                    <Text strong>Địa chỉ:</Text> {detailPost.author.address}
                  </p>
                </div>
              </Card>
            </div>

            <div>
              <Title level={5}>Hình ảnh</Title>
              <Image.PreviewGroup>
                <div className="grid grid-cols-3 gap-2">
                  {detailPost.images.map((img) => (
                    <Image
                      key={img._id}
                      src={BASEIMAGE + img.path}
                      alt={img.filename}
                      className="object-cover rounded h-24 w-full"
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>

            <div>
              <Title level={5}>Mô tả</Title>
              <div
                dangerouslySetInnerHTML={{ __html: detailPost.description }}
              />
            </div>

            <div>
              <Title level={5}>Tổng quan</Title>
              <div dangerouslySetInnerHTML={{ __html: detailPost.overview }} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ManagerPost;
