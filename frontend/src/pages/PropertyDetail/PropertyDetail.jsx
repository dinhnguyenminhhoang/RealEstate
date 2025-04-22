import {
  AreaChartOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HeartOutlined,
  HomeOutlined,
  LinkOutlined,
  MessageOutlined,
  PhoneOutlined,
  RightOutlined,
  ShareAltOutlined,
  StarOutlined,
  UserOutlined,
  WarningOutlined,
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
  Row,
  Tabs,
  Tooltip,
} from "antd";
import React, { useState } from "react";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function PropertyDetailPage() {
  const [activeTab, setActiveTab] = useState("1");
  const [showPhone, setShowPhone] = useState(false);

  // Thông tin bất động sản
  const property = {
    id: "PR40999065",
    title:
      "BQL cho thuê văn phòng tòa nhà Hồ Gươm Plaza, DT 100m2, 320m2, 500m2, 2000m2, giá từ 150k/m2/th",
    address: "Đường Trần Phú, Phường Mộ Lao, Hà Đông, Hà Nội",
    price: "150.000 đ/m²/tháng",
    area: "100 - 2000 m²",
    project: "Hồ Gươm Plaza",
    postDate: "19/04/2025",
    expireDate: "19/05/2025",
    verified: true,
    views: 256,
    description: `BQL cho thuê văn phòng tòa nhà Hồ Gươm Plaza
- Địa chỉ: 102 Trần Phú, Phường Mộ Lao, Quận Hà Đông, Hà Nội
- Diện tích: 100m2, 320m2, 500m2, 2000m2 có thể cắt nhỏ hoặc ghép diện tích theo nhu cầu khách thuê
- Giá thuê: từ 150.000 đ/m²/tháng (đã bao gồm phí quản lý, phí dịch vụ)
- Miễn phí gửi xe máy, ưu đãi gửi ô tô
- Miễn phí 2 tháng thi công

Đặc điểm tòa nhà:
- Vị trí: Mặt tiền đường Trần Phú, giao thông thuận tiện, dễ dàng kết nối các khu vực trung tâm
- Hệ thống điều hòa trung tâm hiện đại, làm việc từ 8h00 - 18h00 các ngày trong tuần (thứ 2 - thứ 7)
- Hệ thống phòng cháy chữa cháy tiêu chuẩn quốc tế
- Hệ thống camera an ninh 24/7
- Nhà vệ sinh trong từng căn văn phòng
- Sảnh lễ tân sang trọng, thang máy tốc độ cao
- Hệ thống viễn thông, internet cáp quang tốc độ cao

Tiện ích xung quanh:
- Khu tổ hợp mua sắm, giải trí, ẩm thực
- Hệ thống ngân hàng, ATM
- Siêu thị, cửa hàng tiện lợi
- Bưu điện, bệnh viện, trường học

Liên hệ ngay với chúng tôi để được tư vấn chi tiết và sắp xếp lịch xem văn phòng.`,
    features: [
      { name: "Loại tin đăng", value: "Cho thuê văn phòng" },
      { name: "Dự án", value: "Hồ Gươm Plaza" },
      { name: "Diện tích", value: "100 - 2000 m²" },
      { name: "Mức giá", value: "150.000 đ/m²/tháng" },
      { name: "Phường/Xã", value: "Phường Mộ Lao" },
      { name: "Quận/Huyện", value: "Hà Đông" },
      { name: "Tỉnh/Thành phố", value: "Hà Nội" },
      { name: "Đường/Phố", value: "Trần Phú" },
    ],
    agent: {
      name: "Ban Quản Lý Tòa Nhà",
      avatar:
        "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      phone: "0981 xxx xxx",
      fullPhone: "0981 234 567",
      memberSince: "2020",
      verified: true,
      listings: 25,
    },
    images: [
      "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
    ],
    similarProperties: [
      {
        id: 1,
        title:
          "Cho thuê văn phòng tại tòa nhà Viwaseen, diện tích 200m2, giá 180k/m2/tháng",
        address: "Nam Từ Liêm, Hà Nội",
        price: "180.000 đ/m²/tháng",
        area: "200 m²",
        image:
          "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      },
      {
        id: 2,
        title:
          "Cho thuê văn phòng hạng A tại tòa nhà Lotte, diện tích từ 100-500m2",
        address: "Đống Đa, Hà Nội",
        price: "230.000 đ/m²/tháng",
        area: "100 - 500 m²",
        image:
          "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      },
      {
        id: 3,
        title:
          "Văn phòng cho thuê tại tòa nhà Icon4, diện tích linh hoạt, giá từ 160 nghìn/m2/tháng",
        address: "Cầu Giấy, Hà Nội",
        price: "160.000 đ/m²/tháng",
        area: "50 - 300 m²",
        image:
          "https://file4.batdongsan.com.vn/resize/1275x717/2024/09/23/20240923214531-508f_wm.jpg",
      },
    ],
  };

  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/cho-thue-van-phong">
            Cho thuê văn phòng
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/cho-thue-van-phong-ha-noi">
            Hà Nội
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/cho-thue-van-phong-ha-dong">
            Hà Đông
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mộ Lao</Breadcrumb.Item>
        </Breadcrumb>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Property Details */}
          <Col xs={24} lg={16}>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              {/* Image Gallery */}
              <div className="relative">
                <Carousel autoplay>
                  {property.images.map((image, index) => (
                    <div key={index}>
                      <div className="h-96 relative">
                        <img
                          src={image}
                          alt={`Ảnh ${index + 1} của ${property.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm">
                  {property.images.length} ảnh
                </div>
              </div>

              {/* Title and Basic Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-3">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <EnvironmentOutlined className="mr-2" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center">
                      <DollarOutlined className="text-red-600 text-xl mr-2" />
                      <div>
                        <div className="text-red-600 text-xl font-bold">
                          {property.price}
                        </div>
                        <div className="text-gray-500 text-sm">Giá thuê</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <AreaChartOutlined className="text-blue-600 text-xl mr-2" />
                      <div>
                        <div className="text-blue-600 text-xl font-bold">
                          {property.area}
                        </div>
                        <div className="text-gray-500 text-sm">Diện tích</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-green-600 text-xl mr-2" />
                      <div>
                        <div className="text-green-600 text-lg font-bold">
                          {property.postDate}
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
                    Mã tin: <span className="font-medium">{property.id}</span> ·
                    <EyeOutlined className="ml-2 mr-1" /> {property.views} lượt
                    xem
                  </div>
                  <div className="flex space-x-2">
                    <Button icon={<HeartOutlined />}>Lưu tin</Button>
                    <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
                    <Button icon={<WarningOutlined />}>Báo cáo</Button>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className="mt-6"
                >
                  <TabPane tab="Thông tin mô tả" key="1">
                    <div className="whitespace-pre-line text-gray-700">
                      {property.description}
                    </div>
                  </TabPane>
                  <TabPane tab="Đặc điểm bất động sản" key="2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.features.map((feature, index) => (
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
                  <TabPane tab="Bản đồ" key="3">
                    <div className="h-96 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <EnvironmentOutlined className="text-4xl text-red-600 mb-3" />
                        <p className="text-gray-600">
                          Đường Trần Phú, Phường Mộ Lao, Hà Đông, Hà Nội
                        </p>
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>

            {/* Project Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Thông tin dự án</h2>
                <Button type="link" className="text-red-600 flex items-center">
                  Xem chi tiết <ArrowRightOutlined className="ml-1" />
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src="/api/placeholder/300/200"
                    alt="Hồ Gươm Plaza"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-medium mb-2">Hồ Gươm Plaza</h3>
                  <div className="flex items-center mb-3">
                    <EnvironmentOutlined className="mr-2 text-gray-500" />
                    <span className="text-gray-700">
                      102 Trần Phú, Phường Mộ Lao, Quận Hà Đông, Hà Nội
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Chủ đầu tư</span>
                      <span className="font-medium">Tập đoàn Hồ Gươm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Trạng thái</span>
                      <span className="font-medium">Đã hoàn thành</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Quy mô</span>
                      <span className="font-medium">2.5 ha</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Loại hình</span>
                      <span className="font-medium">
                        Tổ hợp TTTM, Văn phòng, Căn hộ
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <StarOutlined className="text-yellow-500 mr-1" />
                    <StarOutlined className="text-yellow-500 mr-1" />
                    <StarOutlined className="text-yellow-500 mr-1" />
                    <StarOutlined className="text-yellow-500 mr-1" />
                    <StarOutlined className="text-gray-300 mr-2" />
                    <span className="text-gray-500">(42 đánh giá)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Tin đăng tương tự</h2>
                <Button type="link" className="text-red-600 flex items-center">
                  Xem thêm <ArrowRightOutlined className="ml-1" />
                </Button>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={property.similarProperties}
                renderItem={(item) => (
                  <List.Item className="py-4 border-b last:border-b-0">
                    <div className="flex flex-col md:flex-row w-full">
                      <div className="md:w-1/4 mb-3 md:mb-0 md:mr-4">
                        <img
                          src={item.image}
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
                                {item.area}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 text-sm">
                                Giá:{" "}
                              </span>
                              <span className="font-medium text-red-600">
                                {item.price}
                              </span>
                            </div>
                          </div>
                          <Button type="link" className="text-red-600 p-0">
                            Chi tiết <RightOutlined />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Col>

          {/* Right Column - Contact and Info */}
          <Col xs={24} lg={8}>
            {/* Contact Card */}
            <Card className="mb-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Avatar
                  src={property.agent.avatar}
                  size={64}
                  icon={<UserOutlined />}
                  className="mr-4"
                />
                <div>
                  <div className="font-bold text-lg flex items-center">
                    {property.agent.name}
                    {property.agent.verified && (
                      <Tooltip title="Đã xác thực">
                        <CheckCircleOutlined className="text-blue-500 ml-1" />
                      </Tooltip>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Thành viên từ {property.agent.memberSince} ·{" "}
                    {property.agent.listings} tin đăng
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
                  {showPhone ? property.agent.fullPhone : property.agent.phone}
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

            {/* Quick Info Card */}
            <Card className="mb-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Thông tin nhanh</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Diện tích linh hoạt từ 100m² đến 2000m²</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>
                    Giá thuê từ 150.000 đ/m²/tháng (đã bao gồm phí quản lý)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Miễn phí 2 tháng thi công</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Miễn phí gửi xe máy, ưu đãi gửi ô tô</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <span>Hệ thống điều hòa trung tâm, PCCC tiêu chuẩn</span>
                </li>
              </ul>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-sm">
              <h3 className="text-lg font-bold mb-4">
                Lưu ý khi thuê văn phòng
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <WarningOutlined className="text-yellow-500 mt-1 mr-2" />
                  <span>Kiểm tra kỹ hợp đồng trước khi ký kết</span>
                </li>
                <li className="flex items-start">
                  <WarningOutlined className="text-yellow-500 mt-1 mr-2" />
                  <span>
                    Xác nhận chi phí phát sinh ngoài giá thuê (điện, nước,
                    internet...)
                  </span>
                </li>
                <li className="flex items-start">
                  <WarningOutlined className="text-yellow-500 mt-1 mr-2" />
                  <span>Tìm hiểu về chính sách tăng giá trong tương lai</span>
                </li>
                <li className="flex items-start">
                  <WarningOutlined className="text-yellow-500 mt-1 mr-2" />
                  <span>
                    Xem xét vị trí đi lại và phương tiện công cộng gần đó
                  </span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <Button
                  type="link"
                  className="text-blue-600 flex items-center p-0"
                  icon={<LinkOutlined className="mr-1" />}
                >
                  Xem thêm kinh nghiệm thuê văn phòng
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
