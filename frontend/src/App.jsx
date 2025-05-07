import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout/RootLayout";
import UserLayout from "./layouts/UserLayout/UserLayout";
import ConfirmAccount from "./pages/Auth/ConfirmAccoount/ConfirmAccoount";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import Home from "./pages/Home/Home";
import PropertyDetailPage from "./pages/PropertyDetail/PropertyDetail";
import PropertyListing from "./pages/PropertyListing/PropertyListing";
import CreateOrUpdatePost from "./pages/User/CreateOrUpdatePost/CreateOrUpdatePost";
import Dashboard from "./pages/User/Dashboard/Dashboard";
import UserManagePost from "./pages/User/ManagePost/ManagePost";
import Profile from "./pages/User/Profile/Profile";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import ManagerUser from "./pages/Admin/ManageUser/ManageUser";
import ManageCategory from "./pages/Admin/ManageCategory/ManageCategory";
import ManagePost from "./pages/Admin/ManagePost/ManagePost";
import ManageNews from "./pages/Admin/ManageNews/ManageNews";
import NewsDetails from "./pages/NewsDetail/NewsDetails";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
        <Route path="/confirm-account/:token" element={<ConfirmAccount />} />
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/property-detail/:name/:id"
            element={<PropertyDetailPage />}
          />
          <Route path="/property-list/:type" element={<PropertyListing />} />
          <Route path="/news/:id" element={<NewsDetails />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/action-post" element={<CreateOrUpdatePost />} />
          <Route path="/user/manage-post" element={<UserManagePost />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<ManagerUser />} />
          <Route path="/admin/categories" element={<ManageCategory />} />
          <Route path="/admin/posts" element={<ManagePost />} />
          <Route path="/admin/news" element={<ManageNews />} />
        </Route>
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
