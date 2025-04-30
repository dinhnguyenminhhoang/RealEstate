import {
  DashboardOutlined,
  AppstoreOutlined,
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Tổng quan", icon: <DashboardOutlined />, path: "/user/dashboard" },
  { label: "Tin đăng", icon: <AppstoreOutlined />, path: "/user/postings" },
  { label: "Đăng tin", icon: <PlusOutlined />, path: "/user/post" },
  { label: "Khách hàng", icon: <UserOutlined />, path: "/user/customers" },
  {
    label: "Gói Hội viên",
    icon: (
      <Badge
        count="-39%"
        offset={[8, -5]}
        style={{ backgroundColor: "#f5222d", fontWeight: "bold" }}
      >
        <TeamOutlined />
      </Badge>
    ),
    path: "/user/membership",
  },
  { label: "Tài khoản", icon: <SolutionOutlined />, path: "/account" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[90px] h-screen bg-white shadow-md flex flex-col items-center py-4 fixed">
      <img
        src={
          "https://cdn-assets-seller.batdongsan.com.vn/seller-staticfile/logo-full.svg"
        }
        alt="Logo"
        className="w-8 h-8 mb-6"
      />
      <nav className="flex flex-col space-y-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center text-xs font-medium ${
                isActive ? "text-black font-semibold" : "text-gray-500"
              } hover:text-red-600`}
            >
              <div className="text-lg">{item.icon}</div>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
