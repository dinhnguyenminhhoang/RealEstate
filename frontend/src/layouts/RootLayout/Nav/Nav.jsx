import {
  HeartOutlined,
  MenuOutlined,
  PlusOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu, Space } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
    } else {
      navigate(`/${key}`);
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Trang cá nhân</Menu.Item>
      <Menu.Item key="post">Quản lí đăng tin</Menu.Item>
      <Menu.Item key="logout">Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-12">
            <div className="flex items-center" onClick={() => navigate("/")}>
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

            {isAuthenticated ? (
              <Dropdown overlay={userMenu}>
                <Button type="text" className="flex items-center space-x-2">
                  <UserOutlined />
                  <span>{user?.userName}</span>
                  <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <Button
                onClick={() => navigate("/signin")}
                type="primary"
                danger
                className="flex items-center"
              >
                <UserOutlined />
                <span className="ml-1">Đăng nhập</span>
              </Button>
            )}

            <Button danger className="hidden md:flex items-center">
              <PlusOutlined />
              <span className="ml-1">Đăng tin</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
