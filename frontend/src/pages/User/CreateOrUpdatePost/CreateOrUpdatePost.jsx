import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreatePostForm from "../../../components/CreatePostForm/CreatePostForm";
import useNotification from "../../../hooks/useNotification";
import {
  userCreatePostAPi,
  userGetYourDetailPost,
  userUpdatePostApi,
} from "../../../services/postService";
import { fetchProvinces } from "../../../utils";

const CreateOrUpdatePost = () => {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const openNotification = useNotification();

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        setLoading(true);
        try {
          const response = await userGetYourDetailPost(postId);
          if (response.data) {
            setInitialValues(response.data);
          }
        } catch (error) {
          openNotification({
            type: "error",
            message: "Lỗi",
            description: error,
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPostData();
  }, [postId]);

  const handleSubmit = async (postData) => {
    try {
      let response;
      if (postId) {
        response = await userUpdatePostApi(postData, postId);
        if (response.status === 200) {
          openNotification({
            message: "Thông báo",
            description: "Cập nhật bài đăng thành công",
          });
        }
      } else {
        // Tạo mới bài đăng nếu không có ID
        response = await userCreatePostAPi(postData);
        if (response.status === 201) {
          openNotification({
            message: "Thông báo",
            description: "Đã tạo bài đăng thành công, vui lòng chờ duyệt",
          });
        }
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        description: error.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {postId ? "Cập nhật bài đăng" : "Tạo bài đăng mới"}
        </h1>
        {loading && postId ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : (
          <CreatePostForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
            isEditMode={!!postId}
          />
        )}
      </div>
    </div>
  );
};

export default CreateOrUpdatePost;
