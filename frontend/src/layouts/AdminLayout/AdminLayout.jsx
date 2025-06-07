import React from "react";
import { Outlet } from "react-router-dom";
import AdminSiderbar from "./AdminSiderbar/AdminSiderbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[250px]">
        <AdminSiderbar />
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
