import {
  AppstoreAddOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import React, { useState } from "react";
import { MdCategory, MdNewspaper } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FileWarning } from "lucide-react";

const { Sider } = Layout;

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: "/admin/posts",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/admin/posts">Quản lý bài đăng</Link>,
    },
    {
      key: "/admin/categories",
      icon: <MdCategory className="text-lg" />,
      label: <Link to="/admin/categories">Quản lý thể loại</Link>,
    },
    {
      key: "/admin/news",
      icon: <MdNewspaper className="text-lg" />,
      label: <Link to="/admin/news">Quản lý tin tức</Link>,
    },
    {
      key: "/admin/reports",
      icon: <FileWarning className="text-lg" />,
      label: <Link to="/admin/reports">Quản lí report</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      style={{
        background: "white",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div
        className="flex items-center justify-center py-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        {!collapsed ? (
          <h2 className="text-xl font-bold text-blue-600">Quản trị viên</h2>
        ) : (
          <h2 className="text-xl font-bold text-blue-600">QTV</h2>
        )}
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          border: "none",
        }}
        items={menuItems}
      />

      <div className="absolute bottom-20 w-full px-4">
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="w-full flex items-center justify-center h-10"
        >
          {!collapsed && "Đăng xuất"}
        </Button>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
