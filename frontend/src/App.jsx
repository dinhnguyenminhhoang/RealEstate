import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout/RootLayout";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import ConfirmAccount from "./pages/Auth/ConfirmAccoount/ConfirmAccoount";
import { ProtectedRoute } from "./context/AuthContext";
import PropertyDetailPage from "./pages/PropertyDetail/PropertyDetail";
import PropertyListing from "./pages/PropertyListing/PropertyListing";

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
