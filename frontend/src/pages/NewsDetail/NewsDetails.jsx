import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllNewsApi, getNewsDetailApi } from "../../services/newsService";
import {
  Breadcrumb,
  Card,
  Image,
  Spin,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { BASEIMAGE, formatDateTime } from "../../utils";

const { Title, Paragraph, Text } = Typography;

const NewsDetails = () => {
  const [newsData, setNewsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const { id } = useParams();

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const res = await getNewsDetailApi(id);
      if (res.status === 200) {
        setNewsData(res.data);
        fetchRelatedNews(res.data.tags);
      }
    } catch (error) {
      console.error("Error fetching news details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async (tags) => {
    if (!tags || tags.length === 0) return;

    try {
      const res = await getAllNewsApi({ limit: 4, page: 1 });
      if (res.status === 200) {
        const filtered = res.data.data
          .filter((news) => news._id !== id)
          .slice(0, 3);
        setRelatedNews(filtered);
      }
    } catch (error) {
      console.error("Error fetching related news:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }

    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    return formatDateTime(dateString);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải bài viết..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link>Tin tức</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{newsData.title}</Breadcrumb.Item>
      </Breadcrumb>

      <div bordered={false} className="mb-8 shadow-sm">
        <div className="mb-6">
          <Title level={2} className="!mb-3">
            {newsData.title}
          </Title>
          <div className="flex items-center text-gray-500 mb-2">
            <ClockCircleOutlined className="mr-2" />
            <span>{formatDate(newsData.createdAt)}</span>
          </div>

          {newsData.tags && newsData.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-3">
              <TagOutlined className="mr-2" />
              {newsData.tags.map((tag, index) => (
                <Tag key={index} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto container">
          {newsData.content ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: newsData.content }}
            />
          ) : (
            <Paragraph>Không có nội dung</Paragraph>
          )}
        </div>
      </div>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="mt-8">
          <Divider orientation="left">
            <Title level={4}>Tin tức liên quan</Title>
          </Divider>

          <Row gutter={[16, 16]}>
            {relatedNews.map((news) => (
              <Col xs={24} sm={12} md={8} key={news._id}>
                <Link to={`/news/${news._id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={news.title}
                        src={
                          news.thumb
                            ? news.thumb.startsWith("http")
                              ? news.thumb
                              : BASEIMAGE + news.thumb
                            : ""
                        }
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    }
                    className="h-full"
                  >
                    <Card.Meta
                      title={news.title}
                      description={
                        <div>
                          <Text type="secondary">
                            {formatDate(news.createdAt)}
                          </Text>
                          {news.tags && news.tags.length > 0 && (
                            <div className="mt-2">
                              {news.tags.slice(0, 2).map((tag, i) => (
                                <Tag key={i} color="blue">
                                  {tag}
                                </Tag>
                              ))}
                              {news.tags.length > 2 && <Tag>...</Tag>}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
