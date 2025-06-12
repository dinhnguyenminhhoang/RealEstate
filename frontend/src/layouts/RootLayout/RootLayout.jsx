import React from "react";
import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import Chat from "../../components/Chat/Chat";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="container mx-auto flex-grow p-4">
        <Outlet />
        <Chat />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
