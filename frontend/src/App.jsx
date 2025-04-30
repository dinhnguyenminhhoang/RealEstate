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
import Profile from "./pages/User/Profile/Profile";
import Dashboard from "./pages/User/Dashboard/Dashboard";

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
          <Route path="/property-list" element={<PropertyListing />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/dashboard" element={<Dashboard />} />
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
