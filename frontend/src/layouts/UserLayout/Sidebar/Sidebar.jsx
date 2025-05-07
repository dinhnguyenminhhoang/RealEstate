import {
  AppstoreOutlined,
  DashboardOutlined,
  PlusOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Tổng quan", icon: <DashboardOutlined />, path: "/user/dashboard" },
  { label: "Tin đăng", icon: <AppstoreOutlined />, path: "/user/manage-post" },
  { label: "Đăng tin", icon: <PlusOutlined />, path: "/user/action-post" },
  { label: "Tài khoản", icon: <SolutionOutlined />, path: "/profile" },
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
