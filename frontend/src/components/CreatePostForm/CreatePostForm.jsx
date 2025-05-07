import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadImageApi } from "../../services/uploadService";
import { BASEIMAGE, fetchProvinces } from "../../utils";
import { getAllCategoryApi } from "../../services/categoryService";
import { formatAddress } from "../../utils/formatAddress";

const { Option } = Select;

const CreatePostForm = ({ onSubmit, initialValues, isEditMode }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [categories, setCategories] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  // Quill modules and formats configuration
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
  useEffect(() => {
    const getAllCategory = async () => {
      const response = await getAllCategoryApi({ page: 1, limit: 100 });
      if (response) {
        setCategories(response.data?.data);
      }
    };
    fetchProvinces(setLocationOptions);
    getAllCategory();
  }, []);
  useEffect(() => {
    if (isEditMode && initialValues) {
      // Phân tích địa chỉ nếu là chỉnh sửa bài đăng
      const formValues = { ...initialValues };

      // Nếu địa chỉ là một chuỗi và không phải mảng, cần phân tích để hiển thị trong Cascader
      if (formValues.address && typeof formValues.address === "string") {
        const addressParts = formValues.address.split(", ");
        // Thường chuỗi địa chỉ sẽ có định dạng: "Số nhà Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
        if (addressParts.length >= 4) {
          // Chuẩn bị giá trị cho Cascader [Tỉnh/TP, Quận/Huyện, Phường/Xã]
          formValues.address = [
            addressParts[addressParts.length - 1], // Tỉnh/TP
            addressParts[addressParts.length - 2], // Quận/Huyện
            addressParts[addressParts.length - 3], // Phường/Xã
          ];

          // Địa chỉ chi tiết là phần còn lại (nếu có nhiều phần)
          if (addressParts.length > 3) {
            formValues.detailAddress = addressParts
              .slice(0, addressParts.length - 3)
              .join(", ");
          }
        }
      }

      form.setFieldsValue({
        title: formValues.title,
        price: formValues.price,
        address: formValues.address,
        detailAddress: formValues.detailAddress,
        category: formValues.category,
        acreage: formValues.acreage,
        type: formValues?.type === "RENT" ? "THUÊ" : "BÁN",
      });

      if (initialValues.description) {
        setDescription(initialValues.description);
      }

      if (initialValues.overview) {
        setOverview(initialValues.overview);
      }

      if (initialValues.images && initialValues.images.length > 0) {
        const formattedImages = initialValues.images.map((image, index) => ({
          uid: image._id || `-${index}`,
          name: image.filename,
          status: "done",
          url: `${BASEIMAGE}${image.path}`,
          path: image.path,
          _id: image._id,
          isExisting: true, // Flag to mark existing images
        }));
        setFileList(formattedImages);
      }
    }
  }, [initialValues, isEditMode, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Xử lý chuyển đổi địa chỉ từ Cascader thành chuỗi
      const formattedValues = { ...values };

      if (Array.isArray(formattedValues.address)) {
        const city = formattedValues.address[0]; // Tỉnh/TP
        const district = formattedValues.address[1]; // Quận/Huyện
        const ward = formattedValues.address[2]; // Phường/Xã
        const street = formattedValues.detailAddress || ""; // Địa chỉ chi tiết

        // Sử dụng hàm formatAddress để tạo chuỗi địa chỉ đầy đủ
        formattedValues.address = formatAddress({
          street,
          ward,
          district,
          city,
        });

        // Xóa trường detailAddress vì đã được đưa vào address
        delete formattedValues.detailAddress;
      }

      const newFiles = fileList.filter((file) => file.originFileObj);
      let newImageUrls = [];

      if (newFiles.length > 0) {
        newImageUrls = await uploadImages(newFiles);
      }

      const existingImages = fileList
        .filter((file) => file.isExisting)
        .map((file) => ({
          filename: file.name,
          path: file.path,
          _id: file._id,
        }));

      const allImages = [...existingImages, ...newImageUrls];

      const postData = {
        ...formattedValues,
        description: description,
        overview: overview,
        images: allImages,
      };

      await onSubmit(postData);

      if (!isEditMode) {
        form.resetFields();
        setFileList([]);
        setDescription("");
        setOverview("");
      } else {
        message.success("Cập nhật bài đăng thành công");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xử lý bài đăng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file.originFileObj);
    });

    const response = await uploadImageApi(formData);
    return response.data.map((img) => ({
      filename: img.filename,
      path: img.path,
    }));
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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

    return false;
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    return false;
  };

  const handleChange = ({ fileList: newFileList }) => {
    const processedFiles = newFileList.map((file) => {
      if (file.isExisting) {
        return file;
      }

      return {
        ...file,
        preview: file.originFileObj
          ? URL.createObjectURL(file.originFileObj)
          : undefined,
      };
    });

    setFileList(processedFiles);
  };

  const onPreview = async (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
      return;
    }

    if (!file.preview && file.originFileObj) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }

    const previewWindow = window.open("", "_blank");
    previewWindow.document.write(
      '<img src="' +
        file.preview +
        '" style="max-width: 100%; max-height: 100%;" />'
    );
    previewWindow.document.title = file.name || "Image Preview";
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="mx-auto p-4"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">
        {isEditMode ? "Chỉnh sửa bài đăng" : "Đăng tin bất động sản"}
      </h1>

      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[
          { required: true, message: "Vui lòng nhập tiêu đề" },
          { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" },
          { max: 200, message: "Tiêu đề không quá 200 ký tự" },
        ]}
      >
        <Input placeholder="Nhập tiêu đề bài đăng" />
      </Form.Item>

      <Form.Item
        label="Mô tả chi tiết"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={description}
          onChange={setDescription}
          placeholder="Mô tả chi tiết về bất động sản"
          style={{ height: "200px", marginBottom: "40px" }}
        />
      </Form.Item>

      <Form.Item label="Tổng quan">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={overview}
          onChange={setOverview}
          placeholder="Thông tin tổng quan về bất động sản"
          style={{ height: "150px", marginBottom: "40px" }}
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá (VNĐ)"
        rules={[
          { required: true, message: "Vui lòng nhập giá" },
          { type: "number", min: 0, message: "Giá không được âm" },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="Nhập giá bất động sản"
        />
      </Form.Item>

      <Form.Item
        name="acreage"
        label="Diện tích (m2)"
        rules={[
          { required: true, message: "Vui lòng nhập diện tích" },
          { type: "number", min: 0, message: "Diện tích không được âm" },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Nhập giá diện tích"
        />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: "Vui lòng chọn địa chỉ của bạn" }]}
      >
        <Cascader
          options={locationOptions}
          placeholder="Chọn Tỉnh/Thành phố - Quận/Huyện - Phường/Xã"
          size="large"
          className="w-full rounded-lg"
        />
      </Form.Item>

      <Form.Item name="detailAddress" label="Địa chỉ chi tiết">
        <Input
          placeholder="Địa chỉ chi tiết (VD: Số 123 Đường ABC)"
          size="large"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Thể loại bất động sản"
        rules={[{ required: true, message: "Vui lòng chọn loại bất động sản" }]}
      >
        <Select placeholder="Chọn loại bất động sản">
          {categories.length &&
            categories?.map((category) => (
              <Option value={category._id} key={category._id}>
                {category.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="type"
        label="Loại bất động (bán/thuê)"
        rules={[{ required: true, message: "Vui lòng chọn loại bất động sản" }]}
      >
        <Select placeholder="Chọn loại bất động sản">
          <Option value={"RENT"}>THUÊ</Option>
          <Option value={"SELL"}>BÁN</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="images"
        label="Hình ảnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          { required: !isEditMode, message: "Vui lòng tải lên ít nhất 1 ảnh" },
        ]}
        style={{ width: "100%" }}
      >
        <Upload
          listType="picture-card"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
          multiple
          accept="image/*"
          fileList={fileList}
          onPreview={onPreview}
        >
          {fileList.length < 10 && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} size="large">
          {isEditMode ? "Cập nhật" : "Đăng tin"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreatePostForm;
