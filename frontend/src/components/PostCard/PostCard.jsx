import { Card, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BASEIMAGE, formatMoneyVND, formatTimeAgo } from "../../utils";
import { EnvironmentOutlined, HeartOutlined } from "@ant-design/icons";

const PostCard = ({ listing }) => {
  const navigator = useNavigate();
  return (
    <Card
      onClick={() =>
        navigator(`/property-detail/${listing.title}/${listing._id}`)
      }
      key={listing.id}
      hoverable
      cover={
        <img
          alt={listing.title}
          src={BASEIMAGE + listing.images[0]?.path}
          className="h-48 object-cover"
        />
      }
      className="overflow-hidden"
    >
      <div className="flex flex-col h-48">
        <div className="flex justify-between items-start mb-1">
          <Tag color="red">{listing?.category?.name || ""}</Tag>
        </div>

        <h3 className="text-lg font-medium line-clamp-2 mb-2">
          {listing.title}
        </h3>

        <div className="flex items-center text-gray-500 mb-2">
          <EnvironmentOutlined className="mr-1" />
          <span className="text-sm truncate">{listing.address}</span>
        </div>

        <div className="text-red-600 font-bold text-lg">
          {formatMoneyVND(listing.price)}
        </div>
        <div className="flex items-center justify-between">
          <p>{formatTimeAgo(listing.createdAt)}</p>
          <HeartOutlined className="!text-lg !text-gray-400 hover:!text-red-600" />
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
