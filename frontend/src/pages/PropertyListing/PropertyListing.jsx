import {
  AreaChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DownOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Input,
  Menu,
  Pagination,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Tooltip,
} from "antd";
import React, { useState } from "react";

const { Option } = Select;
const { Panel } = Collapse;

export default function PropertyListing() {
  const [sortBy, setSortBy] = useState("default");
  const [viewType, setViewType] = useState("grid");

  // Sample property data
  const properties = [
    {
      id: 1,
      title: "Bán nhà riêng 4 tầng mặt tiền đường Nguyễn Văn Linh",
      address: "Đường Nguyễn Văn Linh, Quận 7, TP HCM",
      price: "12,5 tỷ",
      area: "120 m²",
      bedrooms: 4,
      bathrooms: 5,
      direction: "Đông Nam",
      postDate: "19/04/2025",
      verified: true,
      hot: true,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Nguyễn Văn A",
        verified: true,
      },
    },
    {
      id: 2,
      title: "Căn hộ 2 phòng ngủ view sông tại Vinhomes Central Park",
      address: "Vinhomes Central Park, Bình Thạnh, TP HCM",
      price: "5,8 tỷ",
      area: "78 m²",
      bedrooms: 2,
      bathrooms: 2,
      direction: "Tây Nam",
      postDate: "18/04/2025",
      verified: true,
      hot: false,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Công ty ABC",
        verified: true,
      },
    },
    {
      id: 3,
      title: "Đất nền sổ đỏ chính chủ, mặt tiền đường Lê Văn Lương",
      address: "Đường Lê Văn Lương, Nhà Bè, TP HCM",
      price: "3,2 tỷ",
      area: "90 m²",
      bedrooms: null,
      bathrooms: null,
      direction: "Đông",
      postDate: "18/04/2025",
      verified: false,
      hot: false,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Trần Thị B",
        verified: false,
      },
    },
    {
      id: 4,
      title: "Biệt thự đơn lập Lavila Nhà Bè, đã hoàn thiện, sổ hồng từng căn",
      address: "Dự án Lavila, Nhà Bè, TP HCM",
      price: "18 tỷ",
      area: "300 m²",
      bedrooms: 5,
      bathrooms: 6,
      direction: "Đông Bắc",
      postDate: "17/04/2025",
      verified: true,
      hot: true,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Công ty BĐS XYZ",
        verified: true,
      },
    },
    {
      id: 5,
      title: "Căn hộ cao cấp 3PN The Metropole Thủ Thiêm, view sông",
      address: "The Metropole, Thủ Đức, TP HCM",
      price: "12 tỷ",
      area: "110 m²",
      bedrooms: 3,
      bathrooms: 2,
      direction: "Nam",
      postDate: "17/04/2025",
      verified: true,
      hot: false,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Lê Thị C",
        verified: true,
      },
    },
    {
      id: 6,
      title: "Đất nền dự án Vạn Phúc City, sổ đỏ riêng, xây tự do",
      address: "Vạn Phúc City, Thủ Đức, TP HCM",
      price: "6,5 tỷ",
      area: "85 m²",
      bedrooms: null,
      bathrooms: null,
      direction: "Tây",
      postDate: "16/04/2025",
      verified: false,
      hot: false,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Phạm Văn D",
        verified: false,
      },
    },
    {
      id: 7,
      title: "Nhà phố liền kề KĐT Vinhomes Grand Park, đã có sổ",
      address: "Vinhomes Grand Park, Thủ Đức, TP HCM",
      price: "10 tỷ",
      area: "100 m²",
      bedrooms: 3,
      bathrooms: 4,
      direction: "Đông",
      postDate: "16/04/2025",
      verified: true,
      hot: true,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Công ty BĐS ABC",
        verified: true,
      },
    },
    {
      id: 8,
      title: "Căn hộ 4PN Landmark 81, tầng cao view trọn thành phố",
      address: "Landmark 81, Bình Thạnh, TP HCM",
      price: "25 tỷ",
      area: "165 m²",
      bedrooms: 4,
      bathrooms: 4,
      direction: "Đông Nam",
      postDate: "15/04/2025",
      verified: true,
      hot: false,
      image:
        "https://file4.batdongsan.com.vn/crop/562x284/2024/11/04/20241104103239-1caf_wm.jpg",
      agent: {
        name: "Võ Thị E",
        verified: true,
      },
    },
  ];

  // Popular locations
  const popularLocations = [
    { name: "TP Hồ Chí Minh", count: 125400 },
    { name: "Hà Nội", count: 98760 },
    { name: "Đà Nẵng", count: 43210 },
    { name: "Bình Dương", count: 39850 },
    { name: "Hải Phòng", count: 27640 },
    { name: "Đồng Nai", count: 25980 },
    { name: "Khánh Hòa", count: 18760 },
    { name: "Long An", count: 15430 },
    { name: "Bà Rịa - Vũng Tàu", count: 13750 },
    { name: "Quảng Ninh", count: 12560 },
  ];

  // Property types
  const propertyTypes = [
    { name: "Căn hộ chung cư", count: 65430 },
    { name: "Nhà riêng", count: 48970 },
    { name: "Đất nền", count: 39840 },
    { name: "Biệt thự", count: 17650 },
    { name: "Nhà mặt phố", count: 15780 },
    { name: "Shophouse", count: 10950 },
    { name: "Nhà phố thương mại", count: 8740 },
    { name: "Đất nền dự án", count: 7890 },
    { name: "Văn phòng", count: 4530 },
    { name: "Kho, xưởng", count: 2180 },
  ];

  // Sort menu
  const sortMenu = (
    <Menu
      selectedKeys={[sortBy]}
      onClick={(e) => setSortBy(e.key)}
      items={[
        { key: "default", label: "Thông thường" },
        { key: "newest", label: "Tin mới nhất" },
        { key: "priceAsc", label: "Giá thấp đến cao" },
        { key: "priceDesc", label: "Giá cao đến thấp" },
        { key: "areaAsc", label: "Diện tích bé đến lớn" },
        { key: "areaDesc", label: "Diện tích lớn đến bé" },
      ]}
    />
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Filter banner */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              placeholder="Loại nhà đất"
              style={{ width: 160 }}
              allowClear
            >
              <Option value="apartment">Căn hộ chung cư</Option>
              <Option value="house">Nhà riêng</Option>
              <Option value="villa">Biệt thự</Option>
              <Option value="townhouse">Nhà mặt phố</Option>
              <Option value="land">Đất nền</Option>
            </Select>

            <Select placeholder="Khu vực" style={{ width: 160 }} allowClear>
              <Option value="hcm">TP. Hồ Chí Minh</Option>
              <Option value="hanoi">Hà Nội</Option>
              <Option value="danang">Đà Nẵng</Option>
              <Option value="binhduong">Bình Dương</Option>
              <Option value="dongnai">Đồng Nai</Option>
            </Select>

            <Select placeholder="Mức giá" style={{ width: 160 }} allowClear>
              <Option value="1">Dưới 1 tỷ</Option>
              <Option value="1-3">1 - 3 tỷ</Option>
              <Option value="3-5">3 - 5 tỷ</Option>
              <Option value="5-10">5 - 10 tỷ</Option>
              <Option value="10-20">10 - 20 tỷ</Option>
              <Option value="20+">Trên 20 tỷ</Option>
            </Select>

            <Select placeholder="Diện tích" style={{ width: 160 }} allowClear>
              <Option value="0-30">Dưới 30 m²</Option>
              <Option value="30-50">30 - 50 m²</Option>
              <Option value="50-80">50 - 80 m²</Option>
              <Option value="80-100">80 - 100 m²</Option>
              <Option value="100-150">100 - 150 m²</Option>
              <Option value="150+">Trên 150 m²</Option>
            </Select>

            <Button type="primary" danger icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>

            <Button icon={<FilterOutlined />}>Lọc thêm</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>Nhà đất bán</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          {/* Sidebar Filters */}
          <Col xs={24} lg={6}>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold">Lọc kết quả</h3>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Loại bất động sản</h4>
                  <Radio.Group className="flex flex-col space-y-2">
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="apartment">Căn hộ chung cư</Radio>
                    <Radio value="house">Nhà riêng</Radio>
                    <Radio value="land">Đất nền</Radio>
                    <Radio value="villa">Biệt thự</Radio>
                    <Radio value="townhouse">Nhà mặt phố</Radio>
                  </Radio.Group>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Khoảng giá</h4>
                  <Row gutter={[8, 8]} className="mb-3">
                    <Col span={12}>
                      <Input placeholder="Từ" suffix="tỷ" />
                    </Col>
                    <Col span={12}>
                      <Input placeholder="Đến" suffix="tỷ" />
                    </Col>
                  </Row>
                  <div className="px-1">
                    <Slider
                      range
                      defaultValue={[0, 20]}
                      max={50}
                      marks={{
                        0: "0",
                        10: "10",
                        20: "20",
                        30: "30",
                        40: "40",
                        50: "50+",
                      }}
                    />
                  </div>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Diện tích</h4>
                  <Row gutter={[8, 8]} className="mb-3">
                    <Col span={12}>
                      <Input placeholder="Từ" suffix="m²" />
                    </Col>
                    <Col span={12}>
                      <Input placeholder="Đến" suffix="m²" />
                    </Col>
                  </Row>
                  <div className="px-1">
                    <Slider
                      range
                      defaultValue={[0, 100]}
                      max={500}
                      marks={{
                        0: "0",
                        100: "100",
                        200: "200",
                        300: "300",
                        400: "400",
                        500: "500+",
                      }}
                    />
                  </div>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Số phòng ngủ</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button className="min-w-[40px]">1+</Button>
                    <Button className="min-w-[40px]">2+</Button>
                    <Button className="min-w-[40px]">3+</Button>
                    <Button className="min-w-[40px]">4+</Button>
                    <Button className="min-w-[40px]">5+</Button>
                  </div>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Hướng nhà</h4>
                  <Checkbox.Group className="grid grid-cols-2 gap-2">
                    <Checkbox value="east">Đông</Checkbox>
                    <Checkbox value="west">Tây</Checkbox>
                    <Checkbox value="south">Nam</Checkbox>
                    <Checkbox value="north">Bắc</Checkbox>
                    <Checkbox value="northeast">Đông Bắc</Checkbox>
                    <Checkbox value="northwest">Tây Bắc</Checkbox>
                    <Checkbox value="southeast">Đông Nam</Checkbox>
                    <Checkbox value="southwest">Tây Nam</Checkbox>
                  </Checkbox.Group>
                </div>

                <Divider className="my-4" />

                <Collapse bordered={false} className="bg-white">
                  <Panel header="Tiện ích" key="1">
                    <Checkbox.Group className="flex flex-col space-y-2">
                      <Checkbox value="pool">Hồ bơi</Checkbox>
                      <Checkbox value="gym">Phòng gym</Checkbox>
                      <Checkbox value="security">An ninh 24/7</Checkbox>
                      <Checkbox value="parking">Chỗ đỗ xe</Checkbox>
                      <Checkbox value="elevator">Thang máy</Checkbox>
                      <Checkbox value="garden">Sân vườn</Checkbox>
                    </Checkbox.Group>
                  </Panel>
                  <Panel header="Tình trạng pháp lý" key="2">
                    <Checkbox.Group className="flex flex-col space-y-2">
                      <Checkbox value="redbook">Sổ đỏ/Sổ hồng</Checkbox>
                      <Checkbox value="contract">Hợp đồng mua bán</Checkbox>
                      <Checkbox value="deposit">Đặt cọc</Checkbox>
                      <Checkbox value="other">Khác</Checkbox>
                    </Checkbox.Group>
                  </Panel>
                </Collapse>

                <Divider className="my-4" />

                <Button type="primary" danger block size="large">
                  Áp dụng
                </Button>
              </div>
            </div>

            {/* Popular Locations */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold">Khu vực nổi bật</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {popularLocations.map((location, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center hover:text-red-600"
                    >
                      <a href="#" className="hover:text-red-600">
                        {location.name}
                      </a>
                      <span className="text-gray-500 text-sm">
                        ({location.count.toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Property Types */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold">Loại nhà đất</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {propertyTypes.map((type, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center hover:text-red-600"
                    >
                      <a href="#" className="hover:text-red-600">
                        {type.name}
                      </a>
                      <span className="text-gray-500 text-sm">
                        ({type.count.toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={18}>
            {/* Section Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-bold mb-1">Nhà đất bán</h1>
                  <div className="text-gray-500">Có 238.970 bất động sản</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Dropdown overlay={sortMenu} trigger={["click"]}>
                    <Button className="flex items-center">
                      <Space>
                        Sắp xếp
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>

                  <div className="flex border border-gray-200 rounded">
                    <Button
                      type={viewType === "grid" ? "default" : "text"}
                      onClick={() => setViewType("grid")}
                      className={viewType === "grid" ? "bg-gray-100" : ""}
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2 h-2 bg-current"></div>
                        <div className="w-2 h-2 bg-current"></div>
                        <div className="w-2 h-2 bg-current"></div>
                        <div className="w-2 h-2 bg-current"></div>
                      </div>
                    </Button>
                    <Button
                      type={viewType === "list" ? "default" : "text"}
                      onClick={() => setViewType("list")}
                      className={viewType === "list" ? "bg-gray-100" : ""}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="w-4 h-2 bg-current"></div>
                        <div className="w-4 h-2 bg-current"></div>
                        <div className="w-4 h-2 bg-current"></div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {viewType === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    hoverable
                    cover={
                      <div className="relative">
                        <img
                          alt={property.title}
                          src={property.image}
                          className="h-48 w-full object-cover"
                        />
                        {property.hot && (
                          <Tag color="red" className="absolute top-2 left-2">
                            HOT
                          </Tag>
                        )}
                        <Button
                          size="small"
                          icon={<HeartOutlined />}
                          className="absolute top-2 right-2 bg-white bg-opacity-70"
                        />
                      </div>
                    }
                    className="h-full"
                  >
                    <div className="flex flex-col h-64">
                      <h3 className="text-base font-medium line-clamp-2 mb-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3 text-sm">
                        <EnvironmentOutlined className="mr-1" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                          <div className="flex items-center">
                            <AreaChartOutlined className="mr-1 text-blue-600" />
                            <span>{property.area}</span>
                          </div>
                        </div>

                        {property.bedrooms && (
                          <div className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                            <div className="flex items-center">
                              <span className="mr-1">🛏️</span>
                              <span>{property.bedrooms} PN</span>
                            </div>
                          </div>
                        )}

                        {property.direction && (
                          <div className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                            <div className="flex items-center">
                              <span className="mr-1">🧭</span>
                              <span>{property.direction}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-2">
                          <div className="text-red-600 font-bold text-lg">
                            {property.price}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <CalendarOutlined className="mr-1" />
                            <span>{property.postDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <div className="flex items-center">
                            <UserOutlined className="mr-1" />
                            <span className="mr-1">{property.agent.name}</span>
                          </div>
                          {property.agent.verified && (
                            <Tooltip title="Đã xác thực">
                              <CheckCircleOutlined className="text-blue-500" />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              /* Properties List View */
              <div className="space-y-6">
                {properties.map((property) => (
                  <Card key={property.id} hoverable className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          alt={property.title}
                          src={property.image}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        {property.hot && (
                          <Tag color="red" className="absolute top-2 left-2">
                            HOT
                          </Tag>
                        )}
                        <Button
                          size="small"
                          icon={<HeartOutlined />}
                          className="absolute top-2 right-2 bg-white bg-opacity-70"
                        />
                      </div>
                      <div className="md:w-2/3 p-4">
                        <h3 className="text-lg font-medium line-clamp-2 mb-2">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-3">
                          <EnvironmentOutlined className="mr-1" />
                          <span>{property.address}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center">
                            <AreaChartOutlined className="text-blue-600 mr-1" />
                            <span className="font-medium">{property.area}</span>
                          </div>

                          {property.bedrooms && (
                            <div className="flex items-center">
                              <span className="mr-1">🛏️</span>
                              <span>{property.bedrooms} phòng ngủ</span>
                            </div>
                          )}

                          {property.bathrooms && (
                            <div className="flex items-center">
                              <span className="mr-1">🚿</span>
                              <span>{property.bathrooms} phòng tắm</span>
                            </div>
                          )}

                          {property.direction && (
                            <div className="flex items-center">
                              <span className="mr-1">🧭</span>
                              <span>Hướng {property.direction}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-end mt-auto">
                          <div className="text-red-600 font-bold text-xl">
                            {property.price}
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-gray-500 text-sm mb-1">
                              <CalendarOutlined className="mr-1" />
                              <span>{property.postDate}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="flex items-center">
                                <UserOutlined className="mr-1" />
                                <span className="mr-1">
                                  {property.agent.name}
                                </span>
                              </div>
                              {property.agent.verified && (
                                <Tooltip title="Đã xác thực">
                                  <CheckCircleOutlined className="text-blue-500" />
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                defaultCurrent={1}
                total={500}
                showSizeChanger
                showQuickJumper
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
