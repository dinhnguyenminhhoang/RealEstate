import {
  AreaChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DownOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Input,
  Menu,
  message,
  Pagination,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllCategoryApi } from "../../services/categoryService";
import { getAllPostAPi } from "../../services/postService";
import {
  BASEIMAGE,
  fetchCity,
  formatCurrencyVND,
  formatTimeAgo,
} from "../../utils";
import { areaRanges, priceRanges } from "../../utils/enum";

const { Option } = Select;
const { Panel } = Collapse;

export default function PropertyListing() {
  const [sortBy, setSortBy] = useState("default");
  const [viewType, setViewType] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [popularLocations, setPopularLocations] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    address: "",
    priceRange: [0, 50],
    areaRange: [0, 500],
    bedrooms: "",
    direction: [],
    type: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { type } = useParams();

  useEffect(() => {
    fetchCity(setPopularLocations);

    const fetchAllCategory = async () => {
      const res = await getAllCategoryApi({
        limit: 100,
        page: 1,
      });
      if (res.status === 200) {
        setAllCategory(res.data.data);
      }
    };
    fetchAllCategory();
    const searchParams = new URLSearchParams(location.search);

    const category = searchParams.get("category") || "";
    const address = searchParams.get("address") || "";
    const area = searchParams.get("area") || "0-500";
    const price = searchParams.get("price") || "0-50";
    const bedrooms = searchParams.get("bedrooms") || "";
    const direction = searchParams.get("direction") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "12");
    const sort = searchParams.get("sort") || "default";

    const [minArea, maxArea] = area.split("-").map((val) => parseInt(val));
    const [minPrice, maxPrice] = price.split("-").map((val) => parseInt(val));

    setFilters({
      category,
      address,
      priceRange: [minPrice, maxPrice],
      areaRange: [minArea, maxArea],
      bedrooms,
      direction: direction ? direction.split(",") : [],
      type: type || "",
    });
    setCurrentPage(page);
    setPageSize(size);
    setSortBy(sort);

    fetchProperties(page, size, {
      category,
      address,
      area,
      price,
      bedrooms,
      direction,
      type: type || "",
      sort,
    });
  }, [location.search, type]);

  const fetchProperties = async (page, limit, queryParams) => {
    setLoading(true);
    try {
      const response = await getAllPostAPi({
        page,
        limit,
        filters: { ...queryParams },
      });

      if (response.status === 200) {
        setProperties(response.data.data || []);
        setTotalResults(response.data.meta?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      message.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and update URL
  const applyFilters = () => {
    const searchParams = new URLSearchParams();

    // Build query parameters based on filters
    if (filters.category && filters.category !== "all")
      searchParams.set("category", filters.category);
    if (filters.address) searchParams.set("address", filters.address);

    // Handle area range
    const areaStr = `${filters.areaRange[0]}-${filters.areaRange[1]}`;
    searchParams.set("area", areaStr);

    // Handle price range
    const priceStr = `${filters.priceRange[0]}-${filters.priceRange[1]}`;
    searchParams.set("price", priceStr);

    if (filters.bedrooms) searchParams.set("bedrooms", filters.bedrooms);

    // Handle direction as array
    if (filters.direction.length > 0) {
      searchParams.set("direction", filters.direction.join(","));
    }

    if (filters.type) {
      searchParams.set("type", filters.type);
    }

    if (sortBy !== "default") {
      searchParams.set("sort", sortBy);
    }

    searchParams.set("page", "1");
    searchParams.set("size", pageSize.toString());

    navigate(`?${searchParams.toString()}`);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page.toString());
    searchParams.set("size", pageSize.toString());
    navigate(`?${searchParams.toString()}`);
  };

  const handleSortChange = (key) => {
    setSortBy(key);

    const searchParams = new URLSearchParams(location.search);
    if (key !== "default") {
      searchParams.set("sort", key);
    } else {
      searchParams.delete("sort");
    }

    navigate(`?${searchParams.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const changeViewType = (type) => {
    setViewType(type);
    localStorage.setItem("propertyViewPreference", type);
  };
  const handleSubmitFillter = () => {
    applyFilters();
  };

  // Sort menu
  const sortMenu = (
    <Menu
      selectedKeys={[sortBy]}
      onClick={(e) => handleSortChange(e.key)}
      items={[
        { key: "default-default", label: "Thông thường" },
        { key: "createdAt-desc", label: "Tin mới nhất" },
        { key: "price-asc", label: "Giá thấp đến cao" },
        { key: "price-desc", label: "Giá cao đến thấp" },
        { key: "area-asc", label: "Diện tích bé đến lớn" },
        { key: "area-desc", label: "Diện tích lớn đến bé" },
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
              value={filters.category || undefined}
              onChange={(value) => handleFilterChange("category", value)}
            >
              <Option value={"all"}>Tất cả</Option>
              {allCategory.map((type) => (
                <Option key={type._id} value={type._id}>
                  {type.name}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Khu vực"
              style={{ width: 160 }}
              allowClear
              value={filters.address || undefined}
              onChange={(value) => handleFilterChange("address", value)}
            >
              {popularLocations.map((location) => (
                <Option key={location.value} value={location.value}>
                  {location.label}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Mức giá"
              style={{ width: 160 }}
              allowClear
              value={`${filters.priceRange[0]}-${filters.priceRange[1]}`}
              onChange={(value) => {
                if (value) {
                  const [min, max] = value.split("-").map(Number);
                  handleFilterChange("priceRange", [min, max]);
                } else {
                  handleFilterChange("priceRange", [0, 50]);
                }
              }}
            >
              {priceRanges.map((range) => (
                <Option key={range.value} value={range.value}>
                  {range.label}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Diện tích"
              style={{ width: 160 }}
              allowClear
              value={`${filters.areaRange[0]}-${filters.areaRange[1]}`}
              onChange={(value) => {
                if (value) {
                  const [min, max] = value.split("-").map(Number);
                  handleFilterChange("areaRange", [min, max]);
                } else {
                  handleFilterChange("areaRange", [0, 500]);
                }
              }}
            >
              {areaRanges.map((range) => (
                <Option key={range.value} value={range.value}>
                  {range.label}
                </Option>
              ))}
            </Select>

            <Button
              type="primary"
              danger
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {type === "RENT" ? "Nhà đất cho thuê" : "Nhà đất bán"}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold">Lọc kết quả</h3>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Loại bất động sản</h4>
                  <Radio.Group
                    className="flex flex-col space-y-2"
                    value={filters.category || "all"}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <Radio value="all">Tất cả</Radio>
                    {allCategory?.map((category) => (
                      <Radio value={category._id} key={category._id}>
                        {category.name}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Khoảng giá</h4>
                  <Row gutter={[8, 8]} className="mb-3">
                    <Col span={12}>
                      <Input
                        placeholder="Từ"
                        suffix="tỷ"
                        value={filters.priceRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          handleFilterChange("priceRange", [
                            value,
                            filters.priceRange[1],
                          ]);
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <Input
                        placeholder="Đến"
                        suffix="tỷ"
                        value={filters.priceRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          handleFilterChange("priceRange", [
                            filters.priceRange[0],
                            value,
                          ]);
                        }}
                      />
                    </Col>
                  </Row>
                  <div className="px-1">
                    <Slider
                      range
                      value={[filters.priceRange[0], filters.priceRange[1]]}
                      max={50}
                      onChange={(values) =>
                        handleFilterChange("priceRange", values)
                      }
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
                      <Input
                        placeholder="Từ"
                        suffix="m²"
                        value={filters.areaRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          handleFilterChange("areaRange", [
                            value,
                            filters.areaRange[1],
                          ]);
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <Input
                        placeholder="Đến"
                        suffix="m²"
                        value={filters.areaRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          handleFilterChange("areaRange", [
                            filters.areaRange[0],
                            value,
                          ]);
                        }}
                      />
                    </Col>
                  </Row>
                  <div className="px-1">
                    <Slider
                      range
                      value={[filters.areaRange[0], filters.areaRange[1]]}
                      max={500}
                      onChange={(values) =>
                        handleFilterChange("areaRange", values)
                      }
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

                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  onClick={handleSubmitFillter}
                >
                  Áp dụng
                </Button>
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
                  <div className="text-gray-500">
                    Có {totalResults} bất động sản
                  </div>
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
                {properties?.map((property) => (
                  <Card
                    onClick={() =>
                      navigate(
                        `/property-detail/${property.title}/${property._id}`
                      )
                    }
                    key={property.id}
                    hoverable
                    cover={
                      <div className="relative">
                        <img
                          alt={property.title}
                          src={BASEIMAGE + property.images[0].path}
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
                            <span>{property.acreage}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="text-red-600 font-bold text-lg">
                            {formatCurrencyVND(property.price || 0)}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <CalendarOutlined className="mr-1" />
                            <span>{formatTimeAgo(property.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <div className="flex items-center">
                            <UserOutlined className="mr-1" />
                            <span className="mr-1">
                              {property.author.userName}
                            </span>
                          </div>
                          <Tooltip title="Đã xác thực">
                            <CheckCircleOutlined className="text-blue-500" />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6 flex flex-col gap-6">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    hoverable
                    className="overflow-hidden"
                    onClick={() => {
                      navigate(
                        `/property-detail/${property.title}/${property._id}`
                      );
                    }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          alt={property.title}
                          src={BASEIMAGE + property.images[0].path}
                          className="w-full h-48 object-cover"
                        />
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
                            <span className="font-medium">
                              {property.acreage} m2
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-auto">
                          <div className="text-red-600 font-bold text-xl">
                            {formatCurrencyVND(property.price || 0)}
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-gray-500 text-sm mb-1">
                              <CalendarOutlined className="mr-1" />
                              <span>{formatTimeAgo(property.createdAt)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="flex items-center">
                                <UserOutlined className="mr-1" />
                                <span className="mr-1">
                                  {property.author.userName}
                                </span>
                              </div>
                              <Tooltip title="Đã xác thực">
                                <CheckCircleOutlined className="text-blue-500" />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalResults}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                onChange={handlePageChange}
                onShowSizeChange={(current, size) => {
                  setPageSize(size);
                  handlePageChange(current, size);
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
