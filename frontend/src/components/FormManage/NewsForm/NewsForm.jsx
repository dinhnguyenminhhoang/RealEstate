import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadImageApi } from "../../../services/uploadService";
import { tagOptions } from "../../../utils/enum";
import { BASEIMAGE } from "../../../utils";

const NewsForm = ({ onSubmit, initialValues = {}, isEditMode }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setDescription] = useState(initialValues?.content || []);
  const [thumb, setThumb] = useState(initialValues?.thumb || null);

  // Set initial thumb value if available
  useEffect(() => {
    if (initialValues?.thumb) {
      setThumb(initialValues.thumb);
    }
  }, [initialValues]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "background",
    "align",
  ];

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadImageApi(formData);
      setThumb(response.data[0].path || response.url);
      message.success("Tải ảnh lên thành công!");
      return false;
    } catch (error) {
      message.error("Tải ảnh lên thất bại!");
      return Upload.LIST_IGNORE;
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = (values) => {
    const data = {
      ...values,
      content,
      thumb,
    };
    onSubmit(data);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }

    handleUpload(file);
    return false;
  };

  const onPreview = async (file) => {
    if (thumb) {
      window.open(thumb, "_blank");
    }
  };

  const fileList = thumb
    ? [{ uid: "-1", status: "done", url: BASEIMAGE + thumb }]
    : [];

  const handleRemove = () => {
    setThumb(null);
    return true;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
      >
        <Input placeholder="Nhập tiêu đề tin tức" />
      </Form.Item>

      <Form.Item label="Tags" name="tags">
        <Select
          mode="tags"
          placeholder="Chọn hoặc nhập tags"
          style={{ width: "100%" }}
          options={tagOptions.map((tag) => ({ label: tag, value: tag }))}
        />
      </Form.Item>

      <Form.Item label="Mô tả chi tiết">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setDescription}
          modules={modules}
          formats={formats}
          placeholder="Nhập mô tả chi tiết"
        />
      </Form.Item>

      <Form.Item label="Hình ảnh đại diện (Thumbnail)">
        <Upload
          listType="picture-card"
          beforeUpload={beforeUpload}
          fileList={fileList}
          onRemove={handleRemove}
          onPreview={onPreview}
          maxCount={1}
          accept="image/*"
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        >
          {!thumb && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEditMode ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewsForm;
