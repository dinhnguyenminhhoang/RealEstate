import {
  BellOutlined,
  HeartOutlined,
  MenuOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigator = useNavigate();
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="flex items-center" onClick={() => navigator("/")}>
              <div className="text-red-600 font-bold text-2xl cursor-pointer">
                Batdongsan.com
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link
                to="/property-list"
                className="font-medium hover:text-red-600"
              >
                Nhà đất bán
              </Link>
              <Link
                to="/property-list"
                className="font-medium hover:text-red-600"
              >
                Nhà đất cho thuê
              </Link>
              {/* <a href="#" className="font-medium hover:text-red-600">
                Dự án
              </a>
              <a href="#" className="font-medium hover:text-red-600">
                Tin tức
              </a>
              <a href="#" className="font-medium hover:text-red-600">
                Wiki BĐS
              </a>
              <a href="#" className="font-medium hover:text-red-600">
                Môi giới
              </a> */}
            </nav>
          </div>

          {/* User Navigation */}
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-600"
            >
              <HeartOutlined />
              <span>Yêu thích</span>
            </a>
            {/* <a
              href="#"
              className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-600"
            >
              <BellOutlined />
              <span>Thông báo</span>
            </a> */}
            <Button
              onClick={() => navigator("/signin")}
              type="primary"
              danger
              className="flex items-center"
            >
              <UserOutlined />
              <span className="ml-1">Đăng nhập</span>
            </Button>
            <Button danger className="hidden md:flex items-center">
              <PlusOutlined />
              <span className="ml-1">Đăng tin</span>
            </Button>
            <Button className="lg:hidden">
              <MenuOutlined />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
