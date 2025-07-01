import {
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  InfoCircleOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  HeartOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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
  Divider,
  Row,
  Col,
  Statistic,
  Alert,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllReportApi,
  updateStatusReportApi,
} from "../../../services/reportService";
import { BASEIMAGE } from "../../../utils";
import { unPublishPostApi } from "../../../services/postService";

const { Text, Title } = Typography;

const formatCurrencyVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getReasonText = (reason) => {
  const reasonMap = {
    fake_info: "Thông tin giả mạo",
    spam: "Spam",
    inappropriate: "Nội dung không phù hợp",
    duplicate: "Trùng lặp",
    scam: "Lừa đảo",
    other: "Khác",
  };
  return reasonMap[reason] || reason;
};

const getReasonColor = (reason) => {
  const colorMap = {
    fake_info: "red",
    spam: "orange",
    inappropriate: "purple",
    duplicate: "blue",
    scam: "volcano",
    other: "default",
  };
  return colorMap[reason] || "default";
};

const getStatusColor = (status) => {
  const colorMap = {
    pending: "orange",
    resolved: "green",
    rejected: "red",
  };
  return colorMap[status] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    pending: "Đang xử lý",
    resolved: "Đã giải quyết",
    rejected: "Đã từ chối",
  };
  return statusMap[status] || status;
};

const ReportManagement = () => {
  const [listReports, setListReports] = useState([]);
  const [detailReport, setDetailReport] = useState(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagi, setPagi] = useState({
    limit: 10,
    page: 1,
    total: 3,
    totalPages: 1,
  });

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await getAllReportApi({ page, limit });
      if (res.status === 200) {
        setListReports(res.data.data);
        setPagi({
          limit: res.data.meta.limit,
          page: res.data.meta.page,
          total: res.data.meta.total,
          totalPages: res.data.meta.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagi.page, pagi.limit);
  }, []);

  const handleViewDetail = (record) => {
    setDetailReport(record);
    setShowDetailDrawer(true);
  };

  const handleResolveReport = async (reportId, action) => {
    Modal.confirm({
      title:
        action === "resolve"
          ? "Giải quyết báo cáo  (Tạm khóa bài đăng)"
          : "Từ chối báo cáo",
      content: `Bạn có chắc chắn muốn ${
        action === "resolve" ? "giải quyết" : "từ chối"
      } báo cáo này?`,
      onOk: async () => {
        try {
          const newStatus = action === "resolve" ? "resolved" : "rejected";

          const res = await updateStatusReportApi(
            { status: newStatus },
            reportId
          );
          if (res.status === 200) {
            if (newStatus === "resolved") {
              await unPublishPostApi(detailReport.post._id);
            }
            setShowDetailDrawer(false);
            await fetchData(pagi.page, pagi.limit);
          }
        } catch (error) {
          console.error("Error updating report status:", error);
        }
      },
    });
  };

  const columns = [
    {
      title: "Thông tin báo cáo",
      key: "reportInfo",
      width: "25%",
      render: (_, record) => (
        <div className="flex items-start gap-3">
          <Avatar
            size={40}
            icon={<FlagOutlined />}
            style={{ backgroundColor: getReasonColor(record.reason) }}
          />
          <div className="flex-1">
            <Text strong className="block mb-1">
              {getReasonText(record.reason)}
            </Text>
            <Text type="secondary" className="text-xs block mb-1">
              ID: {record._id.slice(-8)}
            </Text>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-xs" />
              <Text type="secondary" className="text-xs">
                {new Date(record.createdAt).toLocaleString("vi-VN")}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Bài đăng bị báo cáo",
      key: "postInfo",
      width: "30%",
      render: (_, record) => (
        <div className="flex items-start gap-3">
          {record.post.images && record.post.images.length > 0 ? (
            <Avatar
              shape="square"
              size={40}
              src={BASEIMAGE + record.post.images[0].path}
            />
          ) : (
            <Avatar shape="square" size={40} icon={<ShopOutlined />} />
          )}
          <div className="flex-1">
            <Tooltip title={record.post.title}>
              <Text strong className="block mb-1 line-clamp-2">
                {record.post.title}
              </Text>
            </Tooltip>
            <div className="flex items-center gap-2 mb-1">
              <DollarOutlined className="text-xs text-green-600" />
              <Text className="text-sm text-green-600 font-medium">
                {formatCurrencyVND(record.post.price)}
              </Text>
            </div>
            <div className="flex items-center gap-1">
              <EnvironmentOutlined className="text-xs text-gray-400" />
              <Text type="secondary" className="text-xs truncate max-w-40">
                {record.post.address}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Người báo cáo",
      key: "reporter",
      width: "20%",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={
              record.author?.avatar
                ? `https://picsum.photos/40/40?random=${record.author._id}`
                : null
            }
            icon={<UserOutlined />}
          />
          <div>
            <Text className="block font-medium">{record.author.userName}</Text>
            <Text type="secondary" className="text-xs">
              {record.author.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          icon={
            status === "pending" ? (
              <ClockCircleOutlined />
            ) : status === "resolved" ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              size="small"
              onClick={() => handleViewDetail(record)}
              icon={<EyeOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={3} className="mb-2 flex items-center gap-2">
          <FlagOutlined className="text-red-500" />
          Quản lý báo cáo
        </Title>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card className="text-center shadow-sm">
              <Statistic
                title="Tổng báo cáo"
                value={pagi.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center shadow-sm">
              <Statistic
                title="Đang xử lý"
                value={listReports.filter((r) => r.status === "pending").length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center shadow-sm">
              <Statistic
                title="Đã giải quyết"
                value={
                  listReports.filter((r) => r.status === "resolved").length
                }
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center shadow-sm">
              <Statistic
                title="Đã từ chối"
                value={
                  listReports.filter((r) => r.status === "rejected").length
                }
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table
          dataSource={listReports}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={false}
          size="middle"
          scroll={{ x: 1000 }}
          rowClassName={(record) =>
            record.status === "pending"
              ? "bg-orange-50"
              : record.status === "resolved"
              ? "bg-green-50"
              : "bg-red-50"
          }
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={pagi.page}
            total={pagi.total}
            pageSize={pagi.limit}
            onChange={(page) => fetchData(page, pagi.limit)}
            onShowSizeChange={(current, size) => fetchData(current, size)}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} báo cáo`
            }
          />
        </div>
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <FlagOutlined />
            <span>Chi tiết báo cáo</span>
          </div>
        }
        placement="right"
        onClose={() => setShowDetailDrawer(false)}
        open={showDetailDrawer}
        width={600}
        extra={
          detailReport?.status === "pending" && (
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveReport(detailReport._id, "resolve")}
              >
                Giải quyết
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleResolveReport(detailReport._id, "reject")}
              >
                Từ chối
              </Button>
            </Space>
          )
        }
      >
        {detailReport && (
          <div className="space-y-6">
            <Alert
              message={`Trạng thái: ${getStatusText(detailReport.status)}`}
              type={
                detailReport.status === "pending"
                  ? "warning"
                  : detailReport.status === "resolved"
                  ? "success"
                  : "error"
              }
              showIcon
              className="!mb-4"
            />

            {/* Report Information */}
            <Card title="Thông tin báo cáo" size="small" className="shadow-sm">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="ID báo cáo">
                  <Text code>{detailReport._id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Loại vi phạm">
                  <Tag color={getReasonColor(detailReport.reason)}>
                    {getReasonText(detailReport.reason)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung báo cáo">
                  <Text>{detailReport.content}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    <Text>
                      {new Date(detailReport.createdAt).toLocaleString("vi-VN")}
                    </Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    <Text>
                      {new Date(detailReport.updatedAt).toLocaleString("vi-VN")}
                    </Text>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            {/* Reporter Information */}
            <Card
              title="Thông tin người báo cáo"
              size="small"
              className="shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar
                  size={60}
                  src={
                    detailReport.author.avatar
                      ? `https://picsum.photos/60/60?random=${detailReport.author._id}`
                      : null
                  }
                  icon={<UserOutlined />}
                />
                <div className="flex-1">
                  <Title level={5} className="mb-1">
                    {detailReport.author.userName}
                  </Title>
                  <Text type="secondary">{detailReport.author.email}</Text>
                  <div className="mt-2">
                    {detailReport.author.roles.map((role) => (
                      <Tag key={role} color={role === "ADMIN" ? "red" : "blue"}>
                        {role}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Số điện thoại">
                  {detailReport.author.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {detailReport.author.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            {/* Post Information */}
            <Card
              title="Thông tin bài đăng bị báo cáo"
              size="small"
              className="shadow-sm"
            >
              <div className="mb-4">
                <Title level={5} className="mb-2">
                  {detailReport.post.title}
                </Title>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Tag
                    color={detailReport.post.verification ? "green" : "orange"}
                  >
                    {detailReport.post.verification
                      ? "Đã xác minh"
                      : "Chưa xác minh"}
                  </Tag>
                  <Tag
                    color={
                      detailReport.post.status === "in-stock" ? "blue" : "red"
                    }
                  >
                    {detailReport.post.status === "in-stock"
                      ? "Còn hàng"
                      : "Hết hàng"}
                  </Tag>
                  <Tag
                    color={
                      detailReport.post.type === "RENT" ? "purple" : "cyan"
                    }
                  >
                    {detailReport.post.type === "RENT" ? "Cho thuê" : "Bán"}
                  </Tag>
                </div>
              </div>

              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  <Statistic
                    title="Giá"
                    value={detailReport.post.price}
                    formatter={(value) => formatCurrencyVND(value)}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#52c41a", fontSize: "16px" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Diện tích"
                    value={detailReport.post.acreage}
                    suffix="m²"
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Col>
              </Row>

              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  <Statistic
                    title="Lượt xem"
                    value={detailReport.post.views}
                    prefix={<EyeOutlined />}
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Yêu thích"
                    value={detailReport.post.favorites}
                    prefix={<HeartOutlined />}
                    valueStyle={{ color: "#ff4d4f", fontSize: "16px" }}
                  />
                </Col>
              </Row>

              <Descriptions column={1} size="small">
                <Descriptions.Item label="Địa chỉ">
                  <div className="flex items-start gap-2">
                    <EnvironmentOutlined className="mt-1" />
                    <Text>{detailReport.post.address}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="ID bài đăng">
                  <Text code>{detailReport.post._id}</Text>
                </Descriptions.Item>
              </Descriptions>

              {/* Post Images */}
              {detailReport.post.images &&
                detailReport.post.images.length > 0 && (
                  <div className="mt-4">
                    <Title level={5} className="mb-3">
                      Hình ảnh bài đăng
                    </Title>
                    <Image.PreviewGroup>
                      <div className="grid grid-cols-3 gap-2">
                        {detailReport.post.images
                          .slice(0, 6)
                          .map((img, index) => (
                            <Image
                              key={img._id}
                              src={BASEIMAGE + img.path}
                              alt={`Image ${index + 1}`}
                              className="object-cover rounded h-20 w-full"
                            />
                          ))}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                )}
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ReportManagement;
