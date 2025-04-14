import { message } from "antd";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import useNotification from "../hooks/useNotification";
import { signinApi } from "../services/authService";

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const openNotification = useNotification();
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now() ? false : true;
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
      return true;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await signinApi({ email, password });
      if (response.status === 200) {
        console.log("Login response:", response);
        const { tokens, user } = response.data;
        Cookie.set("token", tokens?.accessToken);
        Cookie.set("userId", user._id);
        setUser(user);
        openNotification({
          type: "success",
          message: "Thông báo",
          description: "Đăng nhap thành công",
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookie.remove("token");
    Cookie.remove("userId");
    setUser(null);
    message.success("Logged out successfully");
  };

  const checkToken = () => {
    const token = Cookie.get("token");
    if (!token) return false;

    if (isTokenExpired(token)) {
      logout();
      return false;
    }

    return true;
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      if (!checkToken()) return null;

      //   const userId = Cookie.get("userId");
      //   const response = await api.get(`/users/${userId}`);

      //   if (response.status === "success") {
      //     setUser(response.data.user);
      //     return response.data.user;
      //   }
      return null;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkToken,
    getUserProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route component to use with React Router
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/signin";
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default AuthContext;
