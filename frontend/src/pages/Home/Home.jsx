import {
  ArrowRightOutlined,
  DollarOutlined,
  FilterOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Cascader, Pagination, Select, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholder_image from "../../assets/images/placeholder-home-banner_desktop.jpg";
import PostCard from "../../components/PostCard/PostCard";
import { getAllCategoryApi } from "../../services/categoryService";
import {
  getAllPostAPi,
  getPostOutstandingAPi,
} from "../../services/postService";
import { BASEIMAGE, fetchCity } from "../../utils";
import { getAllNewsApi } from "../../services/newsService";

const { TabPane } = Tabs;
const { Option } = Select;

export default function BatDongSanHomepage() {
  const [activeTab, setActiveTab] = useState("SELL");
  const [postOutstanding, setPostOutstanding] = useState([]);
  const [allPost, setAllPost] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [allNews, setALLNews] = useState([]);
  const [pagi, setPagi] = useState({
    limit: 4,
    page: 1,
    total: 1,
    totalPages: 1,
  });
  const [newsPagi, setNewsPagi] = useState({
    limit: 4,
    page: 1,
    total: 1,
    totalPages: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  const navigate = useNavigate();

  const fetchData = async (page = 1, limit = 4) => {
    const filters = {};

    if (selectedCategory) filters.category = selectedCategory;
    if (selectedLocation && selectedLocation.length > 0) {
      filters.address = selectedLocation.filter(Boolean)?.join(", ");
    }
    if (priceRange) filters.priceRange = priceRange;
    if (selectedArea) filters.area = selectedArea;
    const res = await getAllPostAPi({
      limit,
      page,
      filters,
    });

    if (res.status === 200) {
      setAllPost(res.data.data);
      setPagi({
        limit: res.data.meta.limit,
        page: res.data.meta.page,
        total: res.data.meta.total,
        totalPages: res.data.meta.totalPages,
      });
    }
  };
  const fetchNewsData = async () => {
    const res = await getAllNewsApi({
      limit: newsPagi.limit,
      page: newsPagi.page,
    });
    if (res.status === 200) {
      setALLNews(res.data.data);
      setNewsPagi({
        limit: res.data.meta.limit,
        page: res.data.meta.page,
        total: res.data.meta.total,
        totalPages: res.data.meta.totalPages,
      });
    }
  };
  useEffect(() => {
    const fetchPostOutstanding = async () => {
      const res = await getPostOutstandingAPi();
      if (res.status === 200) {
        setPostOutstanding(res.data);
      }
    };

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
    fetchNewsData();
    fetchData(pagi.page, pagi.limit);
    fetchPostOutstanding();
    fetchCity(setLocationOptions);
  }, []);

  const handleSearch = () => {
    // Xây dựng queryString từ các trạng thái lọc
    const queryParams = new URLSearchParams();

    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (selectedLocation && selectedLocation.length > 0) {
      queryParams.append(
        "address",
        selectedLocation.filter(Boolean).join(", ")
      );
    }
    if (priceRange) queryParams.append("priceRange", priceRange);
    if (selectedArea) queryParams.append("area", selectedArea);

    // Điều hướng đến trang tương ứng với tab đang chọn
    navigate(
      `/property-list/${activeTab.toUpperCase()}?${queryParams.toString()}`
    );
  };

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
                key="SELL"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                  <Select
                    placeholder="Loại nhà đất"
                    className="w-full"
                    size="large"
                    onChange={(value) => setSelectedCategory(value)}
                  >
                    {allCategory?.length > 0 &&
                      allCategory?.map((category) => (
                        <Option key={category._id} value={category._id}>
                          {category.name}
                        </Option>
                      ))}
                  </Select>
                  <Cascader
                    options={locationOptions}
                    placeholder="Tỉnh/Thành phố"
                    size="large"
                    className="!w-full rounded-lg"
                    onChange={(value) => setSelectedLocation(value)}
                  />
                  <Select
                    placeholder="Diện tích"
                    className="w-full"
                    size="large"
                    onChange={(value) => setSelectedArea(value)}
                  >
                    <Option value="0-30">Dưới 30m²</Option>
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
                    onClick={handleSearch}
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
                key="RENT"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                  <Select
                    placeholder="Loại nhà đất"
                    className="w-full"
                    size="large"
                    onChange={(value) => setSelectedCategory(value)}
                  >
                    {allCategory?.length > 0 &&
                      allCategory?.map((category) => (
                        <Option key={category._id} value={category._id}>
                          {category.name}
                        </Option>
                      ))}
                  </Select>
                  <Cascader
                    options={locationOptions}
                    placeholder="Tỉnh/Thành phố"
                    size="large"
                    className="!w-full rounded-lg"
                    onChange={(value) => setSelectedLocation(value)}
                  />
                  <Select
                    placeholder="Diện tích"
                    className="w-full"
                    size="large"
                    onChange={(value) => setSelectedArea(value)}
                  >
                    <Option value="0-30">Dưới 30m²</Option>
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
                    onClick={handleSearch}
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
            {postOutstanding?.length > 0 &&
              postOutstanding?.map((listing) => (
                <PostCard listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Bất động sản dành cho bạn</h2>
            <Button type="link" className="text-red-600 flex items-center">
              Xem tất cả <ArrowRightOutlined className="ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {postOutstanding &&
              postOutstanding?.length > 0 &&
              postOutstanding?.map((listing) => (
                <PostCard listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Danh sách bất động sản</h2>
            <Button type="link" className="text-red-600 flex items-center">
              Xem tất cả <ArrowRightOutlined className="ml-1" />
            </Button>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allPost.length > 0 &&
                allPost?.map((listing) => (
                  <PostCard listing={listing} key={listing._id} />
                ))}
            </div>
            <div className="flex justify-center w-full mt-4">
              <Pagination
                current={pagi.page}
                total={pagi.total}
                pageSize={pagi.limit}
                onChange={(page) => fetchData(page, pagi.limit)}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tin tức bất động sản</h2>
          </div>

          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {allNews?.map((news) => (
                <div
                  onClick={() => navigate(`/news/${news._id}`)}
                  key={news._id}
                  className="flex space-x-4 shadow-md cursor-pointer p-4 rounded-md"
                >
                  <img
                    src={BASEIMAGE + news.thumb}
                    alt={news.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <h3 className="font-medium line-clamp-2 mb-1">
                      {news.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-auto">
                      {news?.tags?.length &&
                        news.tags?.map((item) => (
                          <Tag color="blue" className="mr-2" key={item}>
                            {item}
                          </Tag>
                        ))}
                      <span>{news.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center w-full mt-4">
              <Pagination
                current={newsPagi.page}
                total={newsPagi.total}
                pageSize={newsPagi.limit}
                onChange={(page) => fetchNewsData(page, newsPagi.limit)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
