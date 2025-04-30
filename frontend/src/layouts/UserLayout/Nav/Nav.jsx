import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Avatar } from "antd";
import { LogoutOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { user, logout } = useAuth();
  const navigator = useNavigate();
  return (
    <div className="flex items-center justify-between h-20 px-10 border-b border-b-gray-500">
      <div className="flex items-center gap-2">
        <Avatar
          className="text-white"
          style={{ width: "56px", height: "56px" }}
        >
          {user?.userName?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <div className="flex flex-col items-start gap-1">
          <p className="text-xs font-medium">Xin chào</p>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              navigator("/profile");
            }}
          >
            <p className="font-bold">{user?.userName || "user"}</p>
            <RightOutlined />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 cursor-pointer" onClick={logout}>
        <LogoutOutlined />
        <p className="font-bold">Đăng xuất</p>
      </div>
    </div>
  );
};

export default Nav;
