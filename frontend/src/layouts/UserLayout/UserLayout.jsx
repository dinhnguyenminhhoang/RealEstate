import { Outlet } from "react-router-dom";
import Footer from "../RootLayout/Footer/Footer";
import Nav from "./Nav/Nav";
import Sidebar from "./Sidebar/Sidebar";

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
