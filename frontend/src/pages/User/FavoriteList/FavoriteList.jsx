import React, { useEffect, useState } from "react";
import { userGetAllFavoriteList } from "../../../services/userService";
import { Card, Pagination, Tag, Button, Empty, Spin, Image, Rate } from "antd";
import {
  HeartFilled,
  EnvironmentOutlined,
  ArrowsAltOutlined,
  PhoneOutlined,
  DollarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BASEIMAGE } from "../../../utils";

const { Meta } = Card;

const FavoriteList = () => {
  const [listPost, setListPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 4,
    page: 1,
    total: 1,
    totalPages: 1,
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await userGetAllFavoriteList();
      if (res.status === 200) {
        setListPost(res.data.data);
        setPagination({
          ...pagination,
          total: res.data.pagination.totalDocs,
          totalPages: res.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getPropertyType = (type) => {
    return type === "RENT" ? "Cho thuê" : "Bán";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <HeartFilled className="text-red-500 mr-2" />
          Danh sách yêu thích
        </h1>
        <Tag color="red" className="text-lg">
          {pagination.total} bất động sản
        </Tag>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : listPost.length === 0 ? (
        <Empty
          description="Bạn chưa có bất động sản nào trong danh sách yêu thích"
          className="flex flex-col items-center justify-center py-16"
        >
          <Button
            type="primary"
            onClick={() => navigate("/properties")}
            className="mt-4"
          >
            Khám phá ngay
          </Button>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listPost.map((item) => (
              <Card
                key={item._id}
                hoverable
                className="shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                cover={
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      alt={item.title}
                      src={
                        BASEIMAGE + item.images[0]?.path ||
                        "/placeholder-property.jpg"
                      }
                      preview={false}
                      className="w-full h-full object-cover"
                      placeholder={
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Spin />
                        </div>
                      }
                    />
                    <Tag
                      color={item.type === "RENT" ? "blue" : "green"}
                      className="absolute top-2 left-2 z-10"
                    >
                      {getPropertyType(item.type)}
                    </Tag>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={<ArrowsAltOutlined />}
                    onClick={() =>
                      navigate(`/property-detail/${item.title}/${item._id}`)
                    }
                  >
                    Xem chi tiết
                  </Button>,
                  <Button type="text" icon={<PhoneOutlined />}>
                    {item?.author?.phone}
                  </Button>,
                ]}
              >
                <Meta
                  description={
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <DollarOutlined className="mr-2" />
                        <span className="font-semibold text-red-500">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <HomeOutlined className="mr-2" />
                        <span>
                          {item.acreage}m<sup>2</sup>
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <EnvironmentOutlined className="mr-2" />
                        <span className="truncate">{item.address}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Rate
                          disabled
                          defaultValue={4}
                          className="text-sm"
                          character={<HeartFilled />}
                        />
                        <Tag color="gold">{item.favorites} lượt thích</Tag>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="ant-pagination-custom"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to extract phone number from description
const extractPhoneNumber = (description) => {
  const phoneRegex = /(\d{3}\s?\d{3}\s?\d{3,4})/;
  const match = description.match(phoneRegex);
  return match ? match[0].replace(/\s/g, "") : "0900000000";
};

export default FavoriteList;
