import React, { useState } from "react";
import { createNewReportAPi } from "../../services/reportService";
import { message } from "antd";

export const ReportPostDialog = ({ visible, onClose, postId, postTitle }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Danh sách lý do báo cáo
  const reportReasons = [
    {
      value: "spam",
      label: "Spam hoặc quảng cáo không phù hợp",
      description: "Nội dung spam, quảng cáo quá mức hoặc không liên quan",
    },
    {
      value: "fake_info",
      label: "Thông tin gian lận",
      description: "Thông tin không chính xác, giá cả không đúng thực tế",
    },
    {
      value: "duplicate",
      label: "Tin trùng lặp",
      description: "Bài đăng đã được đăng nhiều lần",
    },
    {
      value: "inappropriate",
      label: "Nội dung không phù hợp",
      description: "Nội dung vi phạm quy định cộng đồng",
    },
    {
      value: "wrong_category",
      label: "Sai danh mục",
      description: "Bài đăng không đúng danh mục quy định",
    },
    {
      value: "scam",
      label: "Lừa đảo",
      description: "Nghi ngờ hoạt động lừa đảo",
    },
    {
      value: "other",
      label: "Khác",
      description: "Lý do khác (vui lòng mô tả chi tiết)",
    },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!selectedReason) {
      newErrors.reason = "Vui lòng chọn lý do báo cáo!";
    }

    if (!content.trim()) {
      newErrors.content = "Vui lòng mô tả chi tiết lý do báo cáo!";
    } else if (content.trim().length < 10) {
      newErrors.content = "Mô tả phải có ít nhất 10 ký tự!";
    } else if (content.length > 500) {
      newErrors.content = "Mô tả không được vượt quá 500 ký tự!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const reportData = {
        post: postId,
        reason: selectedReason,
        content: content.trim(),
      };
      const res = await createNewReportAPi(reportData);
      if (res.status === 201) {
        message.success("Báo cáo đã được gửi thành công!");
      }
      handleReset();
      onClose();
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      message.error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedReason("");
    setContent("");
    setErrors({});
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReasonChange = (value) => {
    setSelectedReason(value);
    if (errors.reason) {
      setErrors((prev) => ({ ...prev, reason: "" }));
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,.8)] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-lg font-semibold">Báo cáo bài đăng</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Post Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Bài đăng được báo cáo:</p>
            <p className="font-medium text-gray-800">{postTitle}</p>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-3">
              Lý do báo cáo <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    className="mt-1 text-red-500 focus:ring-red-500"
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {reason.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reason.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.reason && (
              <p className="text-red-500 text-sm mt-2">{errors.reason}</p>
            )}
          </div>

          {/* Content Description */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Chi tiết mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={handleContentChange}
              rows={4}
              maxLength={500}
              placeholder={
                selectedReason === "other"
                  ? "Vui lòng mô tả chi tiết lý do báo cáo khác..."
                  : "Mô tả chi tiết về vấn đề bạn gặp phải với bài đăng này..."
              }
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            <div className="flex justify-between mt-1">
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {content.length}/500
              </p>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Vui lòng cung cấp thông tin chính xác và chi tiết</li>
                  <li>Báo cáo sai có thể dẫn đến hạn chế tài khoản</li>
                  <li>Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ</li>
                  <li>Thông tin báo cáo sẽ được bảo mật</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{loading ? "Đang gửi..." : "Gửi báo cáo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component demo để test
const ReportPostDemo = () => {
  const [visible, setVisible] = useState(false);

  const handleOpenReport = () => {
    setVisible(true);
  };

  const handleCloseReport = () => {
    setVisible(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Demo Dialog Báo Cáo Bài Đăng
        </h1>

        {/* Sample post card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">
            GIÁ TỐT NHẤT ECO GREEN QUẬN 7 - FULL GIỎ HÀNG BÁN CĂN HỘ VIEW SÔNG
            2PN 66M2 GIÁ 4.8 TỶ
          </h3>
          <p className="text-gray-600 mb-4">
            Căn hộ cao cấp tại Eco Green Sài Gòn với view sông tuyệt đẹp, đầy đủ
            nội thất...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-red-600">4.8 tỷ</span>
            <button
              onClick={handleOpenReport}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Báo cáo bài đăng</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Click vào nút "Báo cáo bài đăng" để mở dialog</li>
            <li>Chọn lý do báo cáo phù hợp</li>
            <li>Mô tả chi tiết vấn đề bạn gặp phải</li>
            <li>Nhấn "Gửi báo cáo" để hoàn tất</li>
          </ul>
        </div>
      </div>

      <ReportPostDialog
        visible={visible}
        onClose={handleCloseReport}
        postId="681469e542c2fad82d50d606"
        postTitle="GIÁ TỐT NHẤT ECO GREEN QUẬN 7 - FULL GIỎ HÀNG BÁN CĂN HỘ VIEW SÔNG 2PN 66M2 GIÁ 4.8 TỶ"
      />
    </div>
  );
};

export default ReportPostDemo;
