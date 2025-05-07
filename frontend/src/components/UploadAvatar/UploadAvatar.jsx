import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Upload } from "antd";
import React, { useState } from "react";
import instance from "../../config/instance";
import { BASEIMAGE } from "../../utils";

const UploadAvatar = ({ onUpdate, currentAvatar }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || "");

  const handleUpload = async (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must smaller than 10MB!");
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
        onUpdate(url);
        message.success("Avatar uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    if (fileList.length > 0) {
      message.warning("You can only upload one avatar");
      return false;
    }

    handleUpload(file);
    return false; // Return false để tự xử lý upload
  };

  const onRemove = () => {
    setFileList([]);
    setAvatarUrl("");
    onUpdate(""); // Gửi giá trị rỗng khi xóa avatar
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar
        size={100}
        src={avatarUrl ? `${BASEIMAGE}${avatarUrl}` : null}
        className="mb-4"
      >
        {!avatarUrl && (currentAvatar ? currentAvatar[0]?.toUpperCase() : "U")}
      </Avatar>

      <Upload
        fileList={fileList}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        maxCount={1}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} loading={loading} className="mb-2">
          {avatarUrl ? "Change Avatar" : "Upload Avatar"}
        </Button>
      </Upload>
      {avatarUrl && (
        <Button danger size="small" onClick={onRemove}>
          Remove Avatar
        </Button>
      )}
      <div className="text-xs text-gray-500 mt-1">
        Support: JPG, PNG under 10MB
      </div>
    </div>
  );
};

export default UploadAvatar;
