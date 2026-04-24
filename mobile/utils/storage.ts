import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

export const storage = {
  // Token
  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
  setToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  removeToken: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  // User ID
  getUserId: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(USER_ID_KEY);
  },
  setUserId: async (userId: string): Promise<void> => {
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
  },
  removeUserId: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  },

  // Clear all
  clearAll: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  },
};
