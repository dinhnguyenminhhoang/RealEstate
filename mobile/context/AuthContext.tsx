import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { storage } from "@/utils/storage";
import { signinApi } from "@/services/authService";
import { getUserProfileApi } from "@/services/userService";
import { User, LoginPayload } from "@/types";

interface DecodedToken {
  userId: string;
  email: string;
  userName: string;
  phone: string;
  role: string[];
  exp: number;
  type?: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  getUserProfile: () => Promise<void>;
  checkToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkRole = (accessToken: string): string | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      const userRole = decoded.role?.includes("ADMIN") ? "ADMIN" : "USER";
      setRole(userRole);
      return userRole;
    } catch {
      return null;
    }
  };

  const getUserProfile = useCallback(async () => {
    try {
      const res: any = await getUserProfileApi();
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error) {
      console.log("Error fetching user profile:", error);
    }
  }, []);

  const checkToken = useCallback(async (): Promise<boolean> => {
    const token = await storage.getToken();
    if (!token || isTokenExpired(token)) {
      return false;
    }
    return true;
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const res: any = await signinApi({ email, password });
      if (res.status === 200) {
        const { user: userData, tokens } = res.data;
        await storage.setToken(tokens.accessToken);
        await storage.setUserId(userData._id);
        const userRole = checkRole(tokens.accessToken);
        // Fetch full user profile (login response only has _id, userName, email, phone)
        await getUserProfile();
        return userRole;
      }
      return null;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Đăng nhập thất bại";
      throw new Error(message);
    }
  };

  const logout = async () => {
    await storage.clearAll();
    setUser(null);
    setRole(null);
    router.replace("/(auth)/sign-in");
  };

  // Auto-login on app start
  const validateAndFetchUser = useCallback(async () => {
    try {
      const token = await storage.getToken();
      const userId = await storage.getUserId();
      if (!token || !userId) {
        setLoading(false);
        return;
      }
      if (isTokenExpired(token)) {
        await storage.clearAll();
        setLoading(false);
        return;
      }
      checkRole(token);
      await getUserProfile();
    } catch (error) {
      console.log("Auto-login failed:", error);
      await storage.clearAll();
    } finally {
      setLoading(false);
    }
  }, [getUserProfile]);

  useEffect(() => {
    validateAndFetchUser();
  }, [validateAndFetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated,
        login,
        logout,
        getUserProfile,
        checkToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
