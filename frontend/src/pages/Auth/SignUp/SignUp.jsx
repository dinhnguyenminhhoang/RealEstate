import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Cascader, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import useAuthForm from "../../../hooks/useAuthForm";

const signupSchema = z
  .object({
    userName: z.string().min(3).max(30),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[^A-Za-z0-9]/, "At least one special character"),
    confirmPassword: z.string(),
    phone: z.string().regex(/^\d{10}$/, "10-digit phone number"),
    address: z
      .array(z.string())
      .min(3, "Please select your full address (Province/District/Ward)"),
    taxCode: z.string().optional(),
    detailAddress: z.string().optional(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignUp = () => {
  const [form] = Form.useForm();
  const { loading, handleSignUp } = useAuthForm();
  const navigate = useNavigate();
  const [locationOptions, setLocationOptions] = useState([]);

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
        message.error("Failed to load location data");
      }
    };

    fetchProvinces();
  }, []);

  const handleSubmit = async (values) => {
    try {
      signupSchema.parse(values);
      values.address = [...values.address, values.detailAddress]
        .join(", ")
        .replace(", " + values.detailAddress, " " + values.detailAddress);
      const success = await handleSignUp(values);
      if (success) {
        navigate("/signin");
      }
      form.resetFields();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0];
          fieldErrors[path] = err.message;
        });
        form.setFields(
          Object.entries(fieldErrors).map(([name, error]) => ({
            name,
            errors: [error],
          }))
        );
        message.error("Please fix the errors in the form");
      } else {
        message.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl bg-white">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" width="32" height="32" className="mr-2">
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  fill="none"
                  stroke="#2f3542"
                  strokeWidth="2"
                />
                <polyline
                  points="9 22 9 12 15 12 15 22"
                  fill="none"
                  stroke="#2f3542"
                  strokeWidth="2"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 m-0">HORIZON</h1>
            </div>
            <span className="text-gray-500 text-sm tracking-widest">
              VISTA HOMES
            </span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Agent Sign Up
            </h2>
            <p className="text-gray-500">
              Please enter your details to create an account
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            name="signup_form"
            onFinish={handleSubmit}
            requiredMark={false}
            className="space-y-6"
          >
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: "Please enter your userName" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="UserName"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Phone Number"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Please select your address" },
              ]}
            >
              <Cascader
                options={locationOptions}
                placeholder="Select your address"
                size="large"
                className="w-full rounded-lg"
              />
            </Form.Item>
            <Form.Item name="detailAddress">
              <Input
                placeholder="Detailed Address (e.g. 123 ABC Street)"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item name="taxCode">
              <Input
                placeholder="Tax Code (Optional)"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="agreeTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "You must agree to the terms and conditions"
                          )
                        ),
                },
              ]}
              className="mb-6"
            >
              <Checkbox>
                I agree to the{" "}
                <Link className="text-blue-600 hover:text-blue-800">
                  Terms and Conditions
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="h-12 text-lg font-medium bg-gray-800 hover:bg-gray-700 border-gray-800 rounded-lg"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-8">
            <span className="text-gray-500">Already have an account?</span>{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right side - Image */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignUp;
