import {
  ArrowRightOutlined,
  BankOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Tabs, Tag } from "antd";
import React, { useState } from "react";
import placeholder_image from "../../assets/images/placeholder-home-banner_desktop.jpg";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const { Option } = Select;

export default function BatDongSanHomepage() {
  const [activeTab, setActiveTab] = useState("buy");
  const navigator = useNavigate();
  const featuredProjects = [
    {
      id: 1,
      name: "Vinhomes Ocean Park",
      location: "Hà Nội",
      price: "35 triệu/m²",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 2,
      name: "Masteri Centre Point",
      location: "TP HCM",
      price: "45 triệu/m²",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 3,
      name: "Eco Green Saigon",
      location: "TP HCM",
      price: "38 triệu/m²",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 4,
      name: "The Matrix One",
      location: "Hà Nội",
      price: "42 triệu/m²",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
  ];

  const featuredListings = [
    {
      id: 1,
      title: "Nhà phố liền kề mặt tiền đường",
      location: "Quận 7, TP HCM",
      price: "12.5 tỷ",
      area: "120m²",
      bedrooms: 4,
      bathrooms: 3,
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 2,
      title: "Căn hộ cao cấp view sông",
      location: "Quận 2, TP HCM",
      price: "5.8 tỷ",
      area: "90m²",
      bedrooms: 3,
      bathrooms: 2,
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 3,
      title: "Biệt thự sân vườn khu compound",
      location: "Quận Nam Từ Liêm, Hà Nội",
      price: "25 tỷ",
      area: "300m²",
      bedrooms: 5,
      bathrooms: 5,
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 4,
      title: "Đất nền dự án đã có sổ đỏ",
      location: "Thủ Đức, TP HCM",
      price: "3.2 tỷ",
      area: "80m²",
      bedrooms: null,
      bathrooms: null,
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
  ];

  const newsPosts = [
    {
      id: 1,
      title: "10 xu hướng bất động sản nổi bật năm 2025",
      category: "Thị trường",
      date: "20/04/2025",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 2,
      title: "Giá nhà tại các thành phố lớn tiếp tục tăng trong quý II",
      category: "Phân tích",
      date: "19/04/2025",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
    {
      id: 3,
      title: "Hướng dẫn đầu tư bất động sản cho người mới bắt đầu",
      category: "Tư vấn",
      date: "18/04/2025",
      image:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2025/04/1-chung-cu-Binh-Duong.jpg",
    },
  ];

  return (
    <div className="font-sans">
      <section className="relative">
        <div autoplay className="h-96">
          <div>
            <div
              className="h-96 bg-cover bg-center rounded-md"
              style={{ backgroundImage: `url(${placeholder_image})` }}
            >
              <div className="container mx-auto px-4 py-20">
                <div className="max-w-lg">
                  <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                    Tìm kiếm bất động sản dễ dàng và nhanh chóng
                  </h1>
                  <p className="text-lg mb-6 drop-shadow-lg">
                    Hàng nghìn tin đăng bất động sản được cập nhật thường xuyên
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 relative -mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="font-medium"
            >
              <TabPane
                tab={
                  <span>
                    <HomeOutlined className="mr-2" />
                    Nhà đất bán
                  </span>
                }
                key="buy"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  <Select
                    placeholder="Loại nhà đất"
                    className="w-full"
                    size="large"
                  >
                    <Option value="apartment">Căn hộ chung cư</Option>
                    <Option value="house">Nhà riêng</Option>
                    <Option value="villa">Biệt thự</Option>
                    <Option value="land">Đất nền</Option>
                  </Select>

                  <Select
                    placeholder="Tỉnh/Thành phố"
                    className="w-full"
                    size="large"
                  >
                    <Option value="hcm">TP. Hồ Chí Minh</Option>
                    <Option value="hanoi">Hà Nội</Option>
                    <Option value="danang">Đà Nẵng</Option>
                  </Select>

                  <Select
                    placeholder="Quận/Huyện"
                    className="w-full"
                    size="large"
                    disabled
                  />

                  <Select
                    placeholder="Khoảng giá"
                    className="w-full"
                    size="large"
                  >
                    <Option value="1">Dưới 1 tỷ</Option>
                    <Option value="1-3">1 - 3 tỷ</Option>
                    <Option value="3-5">3 - 5 tỷ</Option>
                    <Option value="5-10">5 - 10 tỷ</Option>
                    <Option value="10+">Trên 10 tỷ</Option>
                  </Select>

                  <Select
                    placeholder="Diện tích"
                    className="w-full"
                    size="large"
                  >
                    <Option value="30-">Dưới 30m²</Option>
                    <Option value="30-50">30 - 50m²</Option>
                    <Option value="50-80">50 - 80m²</Option>
                    <Option value="80-100">80 - 100m²</Option>
                    <Option value="100+">Trên 100m²</Option>
                  </Select>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
                  <Button
                    type="primary"
                    danger
                    icon={<SearchOutlined />}
                    size="large"
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <DollarOutlined className="mr-2" />
                    Nhà đất cho thuê
                  </span>
                }
                key="rent"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  <Select
                    placeholder="Loại nhà đất"
                    className="w-full"
                    size="large"
                  >
                    <Option value="apartment">Căn hộ chung cư</Option>
                    <Option value="house">Nhà riêng</Option>
                    <Option value="villa">Biệt thự</Option>
                    <Option value="room">Phòng trọ</Option>
                  </Select>

                  <Select
                    placeholder="Tỉnh/Thành phố"
                    className="w-full"
                    size="large"
                  >
                    <Option value="hcm">TP. Hồ Chí Minh</Option>
                    <Option value="hanoi">Hà Nội</Option>
                    <Option value="danang">Đà Nẵng</Option>
                  </Select>

                  <Select
                    placeholder="Quận/Huyện"
                    className="w-full"
                    size="large"
                    disabled
                  />

                  <Select
                    placeholder="Khoảng giá"
                    className="w-full"
                    size="large"
                  >
                    <Option value="5-">Dưới 5 triệu</Option>
                    <Option value="5-10">5 - 10 triệu</Option>
                    <Option value="10-20">10 - 20 triệu</Option>
                    <Option value="20+">Trên 20 triệu</Option>
                  </Select>

                  <Select
                    placeholder="Diện tích"
                    className="w-full"
                    size="large"
                  >
                    <Option value="30-">Dưới 30m²</Option>
                    <Option value="30-50">30 - 50m²</Option>
                    <Option value="50-80">50 - 80m²</Option>
                    <Option value="80-100">80 - 100m²</Option>
                    <Option value="100+">Trên 100m²</Option>
                  </Select>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button icon={<FilterOutlined />}>Thêm bộ lọc</Button>
                  <Button
                    type="primary"
                    danger
                    icon={<SearchOutlined />}
                    size="large"
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <BankOutlined className="mr-2" />
                    Dự án
                  </span>
                }
                key="project"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  <Select
                    placeholder="Loại hình dự án"
                    className="w-full"
                    size="large"
                  >
                    <Option value="apartment">Căn hộ chung cư</Option>
                    <Option value="house">Nhà phố</Option>
                    <Option value="villa">Biệt thự</Option>
                    <Option value="land">Đất nền</Option>
                  </Select>

                  <Select
                    placeholder="Tỉnh/Thành phố"
                    className="w-full"
                    size="large"
                  >
                    <Option value="hcm">TP. Hồ Chí Minh</Option>
                    <Option value="hanoi">Hà Nội</Option>
                    <Option value="danang">Đà Nẵng</Option>
                  </Select>

                  <Select
                    placeholder="Quận/Huyện"
                    className="w-full"
                    size="large"
                    disabled
                  />

                  <Input.Search
                    placeholder="Tên dự án"
                    allowClear
                    size="large"
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="primary"
                    danger
                    icon={<SearchOutlined />}
                    size="large"
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Bất động sản nổi bật</h2>
            <Button type="link" className="text-red-600 flex items-center">
              Xem tất cả <ArrowRightOutlined className="ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <Card
                onClick={() =>
                  navigator(`/property-detail/${listing.title}/${listing.id}`)
                }
                key={listing.id}
                hoverable
                cover={
                  <img
                    alt={listing.title}
                    src={listing.image}
                    className="h-48 object-cover"
                  />
                }
                className="overflow-hidden"
              >
                <div className="flex flex-col h-48">
                  <div className="flex justify-between items-start mb-1">
                    <Tag color="red">{listing.location}</Tag>
                    <HeartOutlined className="text-lg text-gray-400 hover:text-red-600" />
                  </div>

                  <h3 className="text-lg font-medium line-clamp-2 mb-2">
                    {listing.title}
                  </h3>

                  <div className="flex items-center text-gray-500 mb-2">
                    <EnvironmentOutlined className="mr-1" />
                    <span className="text-sm truncate">{listing.location}</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center space-x-4 mb-2">
                      {listing.bedrooms && (
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium mr-1">
                            {listing.bedrooms}
                          </span>
                          <span>PN</span>
                        </div>
                      )}

                      {listing.bathrooms && (
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium mr-1">
                            {listing.bathrooms}
                          </span>
                          <span>WC</span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-1">{listing.area}</span>
                      </div>
                    </div>

                    <div className="text-red-600 font-bold text-lg">
                      {listing.price}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dự án nổi bật</h2>
            <Button type="link" className="text-red-600 flex items-center">
              Xem tất cả <ArrowRightOutlined className="ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project) => (
              <Card
                onClick={() =>
                  navigator(`/property-detail/${project.name}/${project.id}`)
                }
                key={project.id}
                hoverable
                cover={
                  <img
                    alt={project.name}
                    src={project.image}
                    className="h-48 object-cover"
                  />
                }
                className="overflow-hidden"
              >
                <div className="flex flex-col h-36">
                  <h3 className="text-lg font-medium mb-2">{project.name}</h3>

                  <div className="flex items-center text-gray-500 mb-2">
                    <EnvironmentOutlined className="mr-1" />
                    <span>{project.location}</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center">
                      <StarOutlined className="text-yellow-500 mr-1" />
                      <StarOutlined className="text-yellow-500 mr-1" />
                      <StarOutlined className="text-yellow-500 mr-1" />
                      <StarOutlined className="text-yellow-500 mr-1" />
                      <StarOutlined className="text-gray-300 mr-1" />
                      <span className="text-gray-500 text-sm">
                        (24 đánh giá)
                      </span>
                    </div>

                    <div className="text-red-600 font-bold text-lg mt-2">
                      {project.price}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tin tức bất động sản</h2>
            <Button type="link" className="text-red-600 flex items-center">
              Xem tất cả <ArrowRightOutlined className="ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {newsPosts.map((post) => (
              <div key={post.id} className="flex space-x-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="flex flex-col">
                  <h3 className="font-medium line-clamp-2 mb-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-auto">
                    <Tag color="blue" className="mr-2">
                      {post.category}
                    </Tag>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
