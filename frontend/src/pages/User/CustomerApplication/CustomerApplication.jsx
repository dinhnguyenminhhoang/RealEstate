import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Pagination,
  Typography,
  Spin,
  Empty,
  message,
  Tag,
  Space,
  Divider,
  Button,
  Avatar,
  Badge,
  Timeline,
  Row,
  Col,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { getMyApplicationsApi } from "../../../services/applicationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // for Vietnamese relative time
import { BASEIMAGE } from "../../../utils";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Title, Paragraph } = Typography;

const statusColors = {
  pending: "processing",
  approved: "success",
  rejected: "error",
};

const statusIcons = {
  pending: <SyncOutlined spin />,
  approved: <CheckCircleOutlined />,
  rejected: <CloseCircleOutlined />,
};

const CustomerApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagi, setPagi] = useState({
    page: 1,
    limit: 9,
    totalPage: 0,
    totalCount: 0,
  });
  const navigator = useNavigate();
  const fetchData = async (page = 1, limit = 9) => {
    try {
      setLoading(true);
      const res = await getMyApplicationsApi({ page, limit });

      if (res?.data?.data) {
        setApplications(res.data.data);
        const meta = res.data.meta;
        setPagi({
          page: meta.page,
          limit: meta.limit,
          totalPage: meta.totalPages,
          totalCount: meta.total,
        });
      } else {
        message.warning("Không tìm thấy dữ liệu");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách yêu cầu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagi.page, pagi.limit);
  }, [pagi.page]);

  const handlePageChange = (page, pageSize) => {
    setPagi((prev) => ({ ...prev, page, limit: pageSize || 9 }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="px-20 mx-auto">
      <Title level={6} className="!text-center !my-8 !text-primary">
        Danh sách yêu cầu của bạn
      </Title>

      {loading ? (
        <div className="text-center py-20">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 120 }}
            description={<Text type="secondary">Bạn chưa có yêu cầu nào</Text>}
          >
            <Button type="primary" href="/properties">
              Xem bất động sản ngay
            </Button>
          </Empty>
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {applications.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item._id}>
                <Card
                  className="!rounded-lg !shadow-sm hover:!shadow-md transition-all duration-300 h-full"
                  bordered={false}
                  cover={
                    item.post?.images?.[0]?.path && (
                      <div className="h-48 overflow-hidden">
                        <img
                          alt={item.post.title}
                          src={`${BASEIMAGE}${item.post.images[0].path}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  }
                >
                  <div className="flex justify-between items-start mb-3">
                    <Tag
                      icon={statusIcons[item.status || "pending"]}
                      color={statusColors[item.status || "pending"]}
                    >
                      {item.status ? item.status.toUpperCase() : "PENDING"}
                    </Tag>
                    <Text type="secondary">
                      {dayjs(item.createdAt).fromNow()}
                    </Text>
                  </div>

                  <Title
                    level={4}
                    className="!mb-2 !text-lg !cursor-pointer hover:!text-primary transition-colors duration-200"
                    onClick={() => {
                      navigator(
                        `/property-detail/${item.post?.title}/${item.post?._id}`
                      );
                    }}
                  >
                    {item.post?.title}
                  </Title>

                  <div className="flex items-center mb-3 text-gray-600">
                    <EnvironmentOutlined className="mr-2" />
                    <Text ellipsis>{item.post?.address}</Text>
                  </div>

                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <DollarOutlined className="mr-2 text-green-600" />
                      <Text strong className="text-green-600">
                        {item.post?.price
                          ? formatPrice(item.post.price)
                          : "Liên hệ"}
                      </Text>
                    </div>
                    {item.post?.acreage && (
                      <div className="flex items-center">
                        <Text strong className="mr-2">
                          Diện tích:
                        </Text>
                        <Text>{item.post.acreage}m²</Text>
                      </div>
                    )}
                  </div>

                  <Divider dashed className="!my-3" />

                  <div className="mb-3">
                    <Text strong>Thông tin liên hệ:</Text>
                    <div className="flex items-center mt-2">
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        className="!bg-primary !mr-2"
                      />
                      <Text>{item.name}</Text>
                    </div>
                    <div className="flex items-center mt-1">
                      <PhoneOutlined className="!mr-2 !text-gray-500" />
                      <Text>{item.phone}</Text>
                    </div>
                    <div className="flex items-center mt-1">
                      <MailOutlined className="!mr-2 !text-gray-500" />
                      <Text>{item.email}</Text>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <Text strong>Nội dung yêu cầu:</Text>
                    <Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: "Xem thêm",
                      }}
                      className="!mb-0 !mt-2"
                    >
                      {item.content}
                    </Paragraph>
                  </div>

                  {item.notes && (
                    <Timeline className="mt-4">
                      <Timeline.Item
                        dot={
                          <ClockCircleOutlined className="timeline-clock-icon" />
                        }
                      >
                        <Text strong>Ghi chú từ chủ nhà:</Text>
                        <Paragraph className="!mb-0 !mt-1">
                          {item.notes}
                        </Paragraph>
                      </Timeline.Item>
                    </Timeline>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-8">
            <Pagination
              current={pagi.page}
              pageSize={pagi.limit}
              total={pagi.totalCount}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["9", "18", "27", "36"]} // Updated to multiples of 3
              showTotal={(total) => `Tổng ${total} yêu cầu`}
              className="!inline-block"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerApplication;
