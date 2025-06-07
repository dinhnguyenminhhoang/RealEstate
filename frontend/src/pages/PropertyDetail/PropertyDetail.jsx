import {
  AreaChartOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  HomeOutlined,
  MessageOutlined,
  PhoneOutlined,
  RightOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  List,
  message,
  Row,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllPostAPi,
  getPostDetailAPi,
  updateViewApi,
} from "../../services/postService";
import { BASEIMAGE, formatMoneyVND } from "../../utils";
import { savePostApi } from "../../services/userService";
import { FileWarning } from "lucide-react";
import { ReportPostDialog } from "../../components/ReportPostDialog/ReportPostDialog";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function PropertyDetailPage() {
  const [activeTab, setActiveTab] = useState("1");
  const [showPhone, setShowPhone] = useState(false);
  const [property, setProperty] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [similarProperty, setSimilarProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigator = useNavigate();
  const getSimilarData = async (categoryId) => {
    try {
      const res = await getAllPostAPi({
        limit: 3,
        page: 1,
        filters: { category: categoryId },
      });
      if (res.status === 200) {
        setSimilarProperty(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };
  const incView = async (id) => {
    try {
      await updateViewApi(id);
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };
  const fetchData = async () => {
    try {
      const res = await getPostDetailAPi(id);
      if (res.status === 200) {
        setProperty(res.data);
        await incView(res.data._id);
        await getSimilarData(res.data.category._id);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Không tìm thấy thông tin bất động sản</div>;

  const formattedProperty = {
    ...property,
    priceText: formatMoneyVND(property.price),
    images: property.images.map((img) => ({
      url: img.path,
      alt: `Ảnh bất động sản ${property.title}`,
    })),
    features: [
      {
        name: "Loại tin đăng",
        value: property.category?.name || "Nhà đất bán",
      },
      { name: "Địa chỉ", value: property.address },
      { name: "Diện tích", value: property?.acreage || "coming soon" },
      { name: "Mức giá", value: formatMoneyVND(property.price) },
      {
        name: "Ngày đăng",
        value: new Date(property.createdAt).toLocaleDateString(),
      },
      { name: "Lượt xem", value: property.views },
    ],
    agent: {
      name: property.author?.userName || "Chủ nhà",
      avatar:
        property.author?.avatar ||
        "https://randomuser.me/api/portraits/men/1.jpg",
      phone: property.author?.phone || "0337 xxx xxx",
      fullPhone: property.author?.phone || "0337 972 123",
      memberSince: new Date(
        property.author?.createdAt || property.createdAt
      ).getFullYear(),
      verified: true,
      listings: 10,
    },
  };
  const handleSavePost = async () => {
    try {
      const res = await savePostApi(id);
      if (res.status === 200) {
        fetchData();
        message("Lưu bài đăng thành công");
      } else {
        message("Lưu bài đăng thất bại");
      }
    } catch (error) {}
  };
  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item
            href={`/${property.category?.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {property.category?.name}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{property.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="relative">
                <Carousel autoplay>
                  {formattedProperty.images.map((image, index) => (
                    <div key={index}>
                      <div className="h-96 relative">
                        <img
                          src={BASEIMAGE + image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm">
                  {formattedProperty.images.length} ảnh
                </div>
              </div>

              {/* Title and Basic Info */}
              <div className="p-6">
                <div className="mb-4">
                  <Title level={2} className="mb-3">
                    {property.title}
                  </Title>
                  <div className="flex items-center text-gray-600 mb-2">
                    <EnvironmentOutlined className="mr-2" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center">
                      <DollarOutlined className="text-red-600 text-xl mr-2" />
                      <div>
                        <div className="text-red-600 text-xl font-bold">
                          {formattedProperty.priceText}
                        </div>
                        <div className="text-gray-500 text-sm">Giá bán</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <AreaChartOutlined className="text-blue-600 text-xl mr-2" />
                      <div>
                        <div className="text-blue-600 text-xl font-bold">
                          {formattedProperty?.acreage || 0} m²
                        </div>
                        <div className="text-gray-500 text-sm">Diện tích</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-green-600 text-xl mr-2" />
                      <div>
                        <div className="text-green-600 text-lg font-bold">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-sm">Ngày đăng</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Property ID and Actions */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-500">
                    Mã tin: <span className="font-medium">{property._id}</span>{" "}
                    ·
                    <EyeOutlined className="ml-2 mr-1" /> {property.views} lượt
                    xem
                  </div>
                  <div className="flex space-x-2">
                    {!property?.isFavorite ? (
                      <Button icon={<HeartOutlined />} onClick={handleSavePost}>
                        Lưu tin
                      </Button>
                    ) : (
                      <Button
                        className="!border-red-500 !text-red-500 !cursor-not-allowed"
                        icon={<HeartFilled className="!text-red-600" />}
                      >
                        Đã lưu
                      </Button>
                    )}

                    <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
                    <Button
                      onClick={() => setDialogVisible(true)}
                      icon={<FileWarning />}
                      className="!text-red-500 !border-red-500"
                    >
                      Báo cáo
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className="mt-6"
                >
                  <TabPane tab="Thông tin mô tả" key="1">
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
                  </TabPane>
                  <TabPane tab="Tổng quan" key="2">
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: property.overview }}
                    />
                  </TabPane>
                  <TabPane tab="Đặc điểm bất động sản" key="3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formattedProperty.features.map((feature, index) => (
                        <div key={index} className="flex">
                          <div className="w-1/2 text-gray-600">
                            {feature.name}:
                          </div>
                          <div className="w-1/2 font-medium">
                            {feature.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
            {similarProperty.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <Title level={4}>Tin đăng tương tự</Title>
                  <Button
                    type="link"
                    className="text-red-600 flex items-center"
                  >
                    Xem thêm <ArrowRightOutlined className="ml-1" />
                  </Button>
                </div>
                <List
                  itemLayout="horizontal"
                  dataSource={similarProperty}
                  renderItem={(item) => (
                    <List.Item className="py-4 border-b last:border-b-0">
                      <div className="flex flex-col md:flex-row w-full">
                        <div className="md:w-1/4 mb-3 md:mb-0 md:mr-4">
                          <img
                            src={BASEIMAGE + item.images[0].path}
                            alt={item.title}
                            className="w-full h-28 object-cover rounded-md"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="text-base font-medium mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2 text-sm">
                            <EnvironmentOutlined className="mr-1" />
                            <span>{item.address}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex space-x-4">
                              <div>
                                <span className="text-gray-500 text-sm">
                                  Diện tích:{" "}
                                </span>
                                <span className="font-medium text-blue-600">
                                  {item.acreage} m2
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-sm">
                                  Giá:{" "}
                                </span>
                                <span className="font-medium text-red-600">
                                  {formatMoneyVND(item.price)}
                                </span>
                              </div>
                            </div>
                            <Button
                              type="link"
                              className="text-red-600 p-0"
                              onClick={() =>
                                navigator(
                                  `/property-detail/${item.title}/${item._id}`
                                )
                              }
                            >
                              Chi tiết <RightOutlined />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card className="!mb-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Avatar
                  src={BASEIMAGE + formattedProperty.agent.avatar}
                  size={64}
                  icon={<UserOutlined />}
                  className="mr-4"
                />
                <div className="ml-2">
                  <div className="font-bold text-lg flex items-center">
                    {formattedProperty.agent.name}
                    {formattedProperty.agent.verified && (
                      <Tooltip title="Đã xác thực">
                        <CheckCircleOutlined className="text-blue-500 ml-1" />
                      </Tooltip>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Thành viên từ {formattedProperty.agent.memberSince} ·{" "}
                    {formattedProperty.agent.listings} tin đăng
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  icon={<PhoneOutlined />}
                  onClick={() => setShowPhone(true)}
                  className="mb-3"
                >
                  {showPhone
                    ? formattedProperty.agent.fullPhone
                    : formattedProperty.agent.phone}
                </Button>
                <Button
                  block
                  size="large"
                  icon={<MessageOutlined />}
                  className="mb-3"
                >
                  Gửi tin nhắn
                </Button>
              </div>

              <Divider className="my-4" />

              <Form layout="vertical">
                <Form.Item label="Họ tên">
                  <Input placeholder="Nhập họ tên của bạn" />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>
                <Form.Item label="Email">
                  <Input placeholder="Nhập email của bạn" />
                </Form.Item>
                <Form.Item label="Nội dung">
                  <TextArea
                    rows={4}
                    placeholder="Tôi quan tâm đến bất động sản này, vui lòng liên hệ với tôi"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" danger block size="large">
                    Gửi yêu cầu
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card className="mb-6 shadow-sm">
              <Title level={4} className="mb-4">
                Thông tin nhanh
              </Title>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Diện tích ${property.acreage}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Giá bán {formattedProperty.priceText}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Vị trí đắc địa {formattedProperty.address}</span>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
      {dialogVisible ? (
        <ReportPostDialog
          onClose={() => setDialogVisible(false)}
          postId={id}
          postTitle={property?.title || ""}
          visible={dialogVisible}
        />
      ) : null}
    </div>
  );
}
