import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Image, Modal, Popconfirm, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";

import {
  admiEditNewsApi,
  createNewsApi,
  deleteNewsApi,
  getAllNewsApi,
} from "../../../services/newsService";
import {
  BASEIMAGE,
  formatDateTime,
  stripHtmlAndLimitLength,
} from "../../../utils";
import useNotification from "../../../hooks/useNotification";
import NewsForm from "../../../components/FormManage/NewsForm/NewsForm";

const ManageNews = () => {
  const openNotification = useNotification();
  const [listNews, setListNews] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [pagi, setPagi] = useState({
    limit: 4,
    page: 1,
    total: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await getAllNewsApi({ page, limit });
      if (res.status === 200) {
        setListNews(res.data.data);
        setPagi({
          limit: res.data.meta.limit,
          page: res.data.meta.page,
          total: res.data.meta.total,
          totalPages: res.data.meta.totalPages,
        });
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (News) => {
    setEditNews(News);
    setIsShowModal(true);
  };

  const handleDelete = async (category) => {
    try {
      const res = await deleteNewsApi(category);
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thông báo",
          description: `News with ID ${category} deleted successfully!`,
        });
        fetchData(pagi.page, pagi.limit);
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
    }
  };

  const handleAddNew = () => {
    setIsShowModal(true);
    if (editNews) setEditNews(null);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: false }}
          className="max-w-80"
        >
          {stripHtmlAndLimitLength(text)}
        </Typography.Paragraph>
      ),
    },
    {
      title: "thumb",
      dataIndex: "thumb",
      key: "thumb",
      render: (text) => (
        <Image src={BASEIMAGE + text} className="!w-20 !h-20" />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => <span>{formatDateTime(createdAt)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleEdit(record)}
            style={{ marginRight: 10 }}
            type="primary"
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData(pagi.page, pagi.limit);
  }, [pagi.page, pagi.limit]);
  const handleSave = async (values) => {
    console.log("values", values);
    try {
      let res;
      if (editNews) {
        res = await admiEditNewsApi(values, editNews._id);
      } else {
        res = await createNewsApi(values);
      }
      if (res.status === 201) {
        setIsShowModal(false);
        openNotification({
          type: "success",
          message: "Thông báo",
          description: `Tạo nhãn hàng thành công`,
        });
        fetchData(pagi.page, pagi.limit);
      } else if (res.status === 200) {
        setIsShowModal(false);
        openNotification({
          type: "success",
          message: "Thông báo",
          description: `Cập nhật nhãn hàng thành công`,
        });
        fetchData(pagi.page, pagi.limit);
      }
    } catch (error) {
      openNotification({
        type: "error",
        message: "Thông báo",
        error: error,
      });
    }
  };
  return (
    <div>
      <span className="flex justify-center items-center text-3xl mb-4 font-bold uppercase">
        Quản lí tin tức
      </span>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleAddNew}
        style={{ marginBottom: 20 }}
      >
        Thêm mới
      </Button>
      <Table
        columns={columns}
        dataSource={listNews}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: pagi.page,
          pageSize: pagi.limit,
          total: pagi.total,
          onChange: (page, pageSize) =>
            setPagi({ ...pagi, page, limit: pageSize }),
        }}
      />
      {isShowModal ? (
        <Modal
          title={editNews ? "Chỉnh sửa tin tức" : "Thêm mới tin tức"}
          visible={isShowModal}
          footer={null}
          onCancel={() => setIsShowModal(false)}
        >
          <NewsForm
            initialValues={editNews ? editNews : null}
            onSubmit={handleSave}
            onCancel={() => setIsShowModal(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default ManageNews;
