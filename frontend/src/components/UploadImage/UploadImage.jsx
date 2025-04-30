// components/UploadAvatar.js
import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Upload } from "antd";
import { useEffect, useState } from "react";
import instance from "../../config/instance";
import { BASEIMAGE } from "../../utils";

const UploadAvatar = ({ currentAvatar, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || "");
  useEffect(() => {
    if (!avatarUrl && currentAvatar) {
      setAvatarUrl(currentAvatar);
    }
  }, [currentAvatar]);
  const handleUpload = async (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Ảnh phải nhỏ hơn 10MB!");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await instance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        const url = response.data[0]?.path || "";
        setAvatarUrl(url);
        onUpdate(url); // Gửi URL ảnh về component cha
        message.success("Cập nhật ảnh đại diện thành công!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Upload ảnh thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    handleUpload(file);
    return false; // Return false để tự xử lý upload
  };

  const onRemove = () => {
    setAvatarUrl("");
    onUpdate(""); // Gửi giá trị rỗng khi xóa avatar
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar
        size={100}
        src={BASEIMAGE + avatarUrl}
        className="mb-4 bg-gray-300 text-3xl"
      >
        {!avatarUrl && (currentAvatar ? currentAvatar[0]?.toUpperCase() : "U")}
      </Avatar>

      <Upload
        beforeUpload={beforeUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} loading={loading} className="mb-2">
          {avatarUrl ? "Đổi ảnh đại diện" : "Tải ảnh đại diện"}
        </Button>
      </Upload>
      {avatarUrl && (
        <Button danger size="small" onClick={onRemove}>
          Xóa ảnh
        </Button>
      )}
      <div className="text-xs text-gray-500 mt-1">
        Hỗ trợ: JPG, PNG dưới 10MB
      </div>
    </div>
  );
};

export default UploadAvatar;
