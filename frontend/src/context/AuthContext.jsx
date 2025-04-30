import React, { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useNotification from "../hooks/useNotification";
import { signinApi } from "../services/authService";
import { getUserProfileAPi } from "../services/userService";

// Create context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const getTokenAndUserId = () => ({
  token: Cookie.get("token"),
  userId: Cookie.get("userId"),
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const openNotification = useNotification();

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await signinApi({ email, password });
      if (response.status === 200) {
        const { tokens, user } = response.data;
        Cookie.set("token", tokens?.accessToken);
        Cookie.set("userId", user._id);
        setUser(user);
        openNotification({
          type: "success",
          message: "Thông báo",
          description: "Đăng nhập thành công",
        });
        return true;
      }
      return false;
    } catch (error) {
      openNotification({ type: "error", message: "Thông báo", error });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookie.remove("token");
    Cookie.remove("userId");
    setUser(null);
    openNotification({
      type: "success",
      message: "Thông báo",
      description: "Đăng xuất thành công",
    });
  };

  const checkToken = () => {
    const { token } = getTokenAndUserId();
    if (!token || isTokenExpired(token)) {
      logout();
      return false;
    }
    return true;
  };

  const validateAndFetchUser = async () => {
    const { token, userId } = getTokenAndUserId();
    if (!token || !userId || isTokenExpired(token)) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const response = await getUserProfileAPi();
      if (response.status === 200) {
        setUser(response.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Tự động đăng nhập lỗi:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateAndFetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkToken,
        getUserProfile: validateAndFetchUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/signin";
    }
  }, [isAuthenticated]);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : null;
};

export default AuthContext;
