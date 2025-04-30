import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "../RootLayout/Footer/Footer";
import Nav from "./Nav/Nav";

const UserLayout = () => {
  return (
    <div>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-[90px]">
          <Nav />
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
