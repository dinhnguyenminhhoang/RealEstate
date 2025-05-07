import React from "react";
import { Form, Input, Button, Typography, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import useAuthForm from "../../../hooks/useAuthForm";
import { useAuth } from "../../../context/AuthContext";

const { Title, Text } = Typography;

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const SignIn = () => {
  const [form] = Form.useForm();
  const { loading, handleSignIn } = useAuthForm();
  const { role } = useAuth();
  const navigator = useNavigate();
  const handleSubmit = async (values) => {
    try {
      signInSchema.parse(values);
      const success = await handleSignIn(values);
      if (success && success.includes("ADMIN")) {
        navigator("/admin/dashboard");
      } else if (success) {
        navigator("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach((err) => {
          const path = err.path[0];
          errors[path] = err.message;
        });

        form.setFields(
          Object.entries(errors).map(([name, error]) => ({
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
              Agent Login
            </h2>
            <p className="text-gray-500">Please enter your details</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            name="signin_form"
            onFinish={handleSubmit}
            requiredMark={false}
            className="space-y-6"
          >
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

            <div className="flex items-center justify-between mb-4">
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="h-12 text-lg font-medium bg-gray-800 hover:bg-gray-700 border-gray-800 rounded-lg"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-8">
            <span className="text-gray-500">Are you new?</span>{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create an Account
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

export default SignIn;
