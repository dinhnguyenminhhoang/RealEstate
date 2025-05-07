import { Button, Cascader, Form, Input, message, Spin } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
import { updateUserProfileApi } from "../../../services/userService";
import UploadAvatar from "../../../components/UploadAvatar/UploadAvatar";

// Schema validation với thông báo tiếng Việt
const profileSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  taxCode: z.string().regex(/^\d*$/, "Mã số thuế chỉ được chứa số").optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  invoiceName: z.string().optional(),
  invoiceEmail: z.string().email("Email nhận hóa đơn không hợp lệ").optional(),
  companyName: z.string().optional(),
  companyTaxCode: z
    .string()
    .regex(/^\d*$/, "Mã số thuế chỉ được chứa số")
    .optional(),
  address: z.any().optional(),
  addressDetail: z.string().optional(),
  companyAddress: z.any().optional(),
  companyAddressDetail: z.string().optional(),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  const [loading, setLoading] = useState({
    save: false,
    initial: true,
    avatar: false,
  });
  const [locationOptions, setLocationOptions] = useState([]);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const parseAddressToArray = (address) => {
    if (!address) return [];
    const parts = address.split(", ").reverse();
    return parts.length >= 3 ? parts.slice(0, 3) : [];
  };

  const formatAddressToString = (addressArray, detail) => {
    const address = addressArray.reverse().join(", ");
    return detail ? `${address}, ${detail}` : address;
  };

  // Fetch danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=3"
        );
        const options = res.data.map((province) => ({
          label: province.name,
          value: province.name,
          children: province.districts.map((district) => ({
            label: district.name,
            value: district.name,
            children: district.wards.map((ward) => ({
              label: ward.name,
              value: ward.name,
            })),
          })),
        }));
        setLocationOptions(options);
      } catch (error) {
        message.error("Không thể tải dữ liệu địa chỉ");
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    fetchProvinces();
  }, []);

  // Khởi tạo giá trị form khi có user
  useEffect(() => {
    if (user) {
      const initialData = {
        fullName: user.userName || "",
        taxCode: user.taxCode || "",
        phone: user.phone || "",
        email: user.email || "",
        invoiceName: user.invoiceInformation?.invoiceName || "",
        invoiceEmail: user.invoiceInformation?.invoiceEmail || "",
        companyName: user.invoiceInformation?.companyName || "",
        companyTaxCode: user.invoiceInformation?.companyTaxCode || "",
        companyAddress: parseAddressToArray(user.invoiceInformation?.address),
        address: parseAddressToArray(user.address),
        addressDetail: "",
        companyAddressDetail: "",
      };

      form.setFieldsValue(initialData);
      setInitialValues(initialData);
    }
  }, [user, form]);

  // Kiểm tra thay đổi form
  const handleValuesChange = useCallback(
    (changedValues, allValues) => {
      const changed =
        JSON.stringify(allValues) !== JSON.stringify(initialValues);
      setFormChanged(changed);
    },
    [initialValues]
  );

  const handleAvatarUpload = (url) => {
    setAvatarUrl(url);
    setFormChanged(true);
  };

  const handleSubmit = async (values) => {
    try {
      profileSchema.parse(values);

      const payload = {
        ...values,
        avatar: avatarUrl,
        address: formatAddressToString(values.address, values.addressDetail),
        companyAddress: formatAddressToString(
          values.companyAddress,
          values.companyAddressDetail
        ),
      };

      setLoading((prev) => ({ ...prev, save: true }));
      const res = await updateUserProfileApi({
        ...payload,
        invoiceInformation: {
          invoiceName: payload.invoiceName,
          invoiceEmail: payload.invoiceEmail,
          companyName: payload.companyName,
          companyTaxCode: payload.companyTaxCode,
          address: payload.companyAddress,
        },
      });
      if (res.status === 200) {
      }

      // Cập nhật context/user
      if (updateUser) {
        await updateUser({
          ...payload,
          avatar: avatarUrl,
        });
      }

      message.success("Cập nhật thông tin thành công");
      setInitialValues(values);
      setFormChanged(false);
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  if (loading.initial) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col p-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        className="max-w-3xl w-full space-y-6"
      >
        {/* Avatar + upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex justify-center mb-6">
            <UploadAvatar
              currentAvatar={user?.avatar}
              onUpdate={handleAvatarUpload}
            />
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item label="Mã số thuế cá nhân" name="taxCode">
              <Input placeholder="VD: 1234567890" maxLength={10} />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Thông tin hóa đơn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Tên người mua hàng" name="invoiceName">
              <Input />
            </Form.Item>

            <Form.Item
              label="Email nhận hóa đơn"
              name="invoiceEmail"
              rules={[
                {
                  type: "email",
                  message: "Email không hợp lệ",
                },
              ]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Tên công ty" name="companyName">
              <Input />
            </Form.Item>

            <Form.Item label="Mã số thuế công ty" name="companyTaxCode">
              <Input maxLength={13} />
            </Form.Item>
          </div>

          <Form.Item name="companyAddress" label="Địa chỉ công ty">
            <Cascader
              options={locationOptions}
              placeholder="Chọn Tỉnh/Thành - Quận/Huyện - Phường/Xã"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ cụ thể (công ty)"
            name="companyAddressDetail"
          >
            <Input placeholder="Số nhà, đường, tòa nhà..." />
          </Form.Item>
        </div>

        {/* Địa chỉ cá nhân */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Địa chỉ cá nhân</h2>
          <Form.Item name="address" label="Địa chỉ">
            <Cascader
              options={locationOptions}
              placeholder="Chọn Tỉnh/Thành - Quận/Huyện - Phường/Xã"
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Địa chỉ cụ thể" name="addressDetail">
            <Input placeholder="Số nhà, đường, tòa nhà..." />
          </Form.Item>
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end sticky bottom-4 bg-white p-4 rounded-lg shadow">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading.save}
            disabled={!formChanged}
            className="min-w-32 h-10"
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Profile;
