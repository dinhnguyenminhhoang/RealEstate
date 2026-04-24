import instance from "./instance";
import { Platform } from "react-native";

export const uploadImageApi = async (uris: string[]) => {
  const formData = new FormData();

  for (const uri of uris) {
    const filename = uri.split("/").pop() || `image_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      name: filename,
      type,
    } as any);
  }

  return instance.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
