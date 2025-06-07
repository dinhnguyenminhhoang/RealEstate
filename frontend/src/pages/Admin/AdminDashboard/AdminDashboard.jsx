import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  message,
  Progress,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Heart,
  Home,
  MapPin,
  Newspaper,
  RotateCcw,
  Search,
  Star,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  getDashboardSummaryApi,
  getOverallSummaryApi,
  getPostSummaryApi,
  getReportSummaryApi,
  getUserSummaryApi,
  getNewsSummaryApi,
  getSearchSummaryApi,
} from "../../../services/summaryService";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search: AntSearch } = Input;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overallData, setOverallData] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [postSummary, setPostSummary] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);
  const [newsSummary, setNewsSummary] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [overall, users, posts, dashboard, reports, news] =
        await Promise.all([
          getOverallSummaryApi().then((res) => res.data),
          getUserSummaryApi().then((res) => res.data),
          getPostSummaryApi().then((res) => res.data),
          getDashboardSummaryApi({ timeRange }).then((res) => res.data),
          getReportSummaryApi().then((res) => res.data),
          getNewsSummaryApi().then((res) => res.data),
        ]);

      setOverallData(overall);
      setUserSummary(users);
      setPostSummary(posts);
      setDashboardData(dashboard);
      setReportSummary(reports);
      setNewsSummary(news);
    } catch (error) {
      console.error("Error loading data:", error);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    setSearchResults(null);
    message.success("Dữ liệu đã được cập nhật");
  };

  const handleTimeRangeChange = async (value) => {
    setTimeRange(value);
    try {
      const dashboard = await getDashboardSummaryApi({ timeRange: value });
      setDashboardData(dashboard.data);
    } catch (error) {
      console.error("Error updating dashboard:", error);
      message.error("Không thể cập nhật dữ liệu dashboard");
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    try {
      const results = await getSearchSummaryApi({ searchTerm });
      setSearchResults(results.data);
    } catch (error) {
      console.error("Error searching:", error);
      message.error("Lỗi khi tìm kiếm");
    } finally {
      setSearchLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0";
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu`;
    }
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num || 0);
  };

  const formatGrowth = (growth) => {
    const isPositive = growth > 0;
    return (
      <span
        className={`font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? "↗" : "↘"} {Math.abs(growth || 0)}%
      </span>
    );
  };

  // Enhanced chart colors with gradients
  const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spin size="large" />
        <Text className="mt-4 text-gray-600">Đang tải dữ liệu...</Text>
      </div>
    );
  }

  const overallCards = [
    {
      title: "Tổng người dùng",
      value: overallData?.users?.total || 0,
      growth: overallData?.users?.growth || 0,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      color: "#3b82f6",
      bgGradient: "from-blue-500 to-blue-600",
      subData: [
        {
          label: "Hoạt động",
          value: overallData?.users?.active || 0,
          color: "#10b981",
          icon: <CheckCircle className="w-4 h-4" />,
        },
        {
          label: "Không hoạt động",
          value: overallData?.users?.inactive || 0,
          color: "#ef4444",
          icon: <XCircle className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "Tổng bài đăng",
      value: overallData?.posts?.total || 0,
      growth: overallData?.posts?.growth || 0,
      icon: <Home className="w-8 h-8 text-green-500" />,
      color: "#10b981",
      bgGradient: "from-green-500 to-green-600",
      subData: [
        {
          label: "Cho thuê",
          value: overallData?.posts?.rent || 0,
          color: "#f59e0b",
          icon: <MapPin className="w-4 h-4" />,
        },
        {
          label: "Bán",
          value: overallData?.posts?.sell || 0,
          color: "#8b5cf6",
          icon: <DollarSign className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "Báo cáo",
      value: overallData?.reports?.total || 0,
      growth: overallData?.reports?.growth || 0,
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      color: "#ef4444",
      bgGradient: "from-red-500 to-red-600",
      subData: [
        {
          label: "Chờ xử lý",
          value: overallData?.reports?.pending || 0,
          color: "#f59e0b",
          icon: <Clock className="w-4 h-4" />,
        },
        {
          label: "Đã xử lý",
          value: overallData?.reports?.resolved || 0,
          color: "#10b981",
          icon: <CheckCircle className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "Tin tức",
      value: overallData?.news?.total || 0,
      growth: overallData?.news?.growth || 0,
      icon: <Newspaper className="w-8 h-8 text-purple-500" />,
      color: "#8b5cf6",
      bgGradient: "from-purple-500 to-purple-600",
      subData: [
        {
          label: "Hoạt động",
          value: overallData?.news?.active || 0,
          color: "#06b6d4",
          icon: <Newspaper className="w-4 h-4" />,
        },
        {
          label: "Danh mục",
          value: overallData?.categories?.total || 0,
          color: "#f97316",
          icon: <FileText className="w-4 h-4" />,
        },
      ],
    },
  ];

  const topPostsColumns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <Text className="font-medium block">{text}</Text>
          <div className="flex items-center mt-1 text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <Text type="secondary" className="text-xs">
              {record.address || "Chưa có địa chỉ"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={type === "RENT" ? "blue" : "green"}
          className="rounded-full px-3"
        >
          {type === "RENT" ? "Cho thuê" : "Bán"}
        </Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text className="font-semibold text-green-600">
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: "Thống kê",
      key: "stats",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Eye className="w-4 h-4 text-blue-500 mr-1" />
            <Text className="text-sm">{formatNumber(record.views)}</Text>
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-red-500 mr-1" />
            <Text className="text-sm">{formatNumber(record.favorites)}</Text>
          </div>
        </div>
      ),
    },
  ];

  const userRoleData =
    userSummary?.byRole?.map((item) => ({
      name:
        item._id === "USER"
          ? "Người dùng"
          : item._id === "PARTNER"
          ? "Đối tác"
          : item._id === "ADMIN"
          ? "Quản trị"
          : item._id,
      value: item.count,
    })) || [];

  const postCategoryData =
    postSummary?.byCategory?.map((item) => ({
      name: item._id,
      posts: item.count,
      avgPrice: item.avgPrice,
    })) || [];

  const reportStatusData =
    reportSummary?.byStatus?.map((item) => ({
      name:
        item._id === "pending"
          ? "Chờ xử lý"
          : item._id === "resolved"
          ? "Đã xử lý"
          : item._id === "rejected"
          ? "Từ chối"
          : item._id,
      value: item.count,
    })) || [];

  const reportReasonData =
    reportSummary?.byReason?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const generateWeeklyData = (type = "users") => {
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
    return days.map((day, index) => ({
      day,
      [type]: Math.floor(Math.random() * 100) + 20,
    }));
  };
  console.log("reportSummary", postCategoryData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <Title level={2} className="mb-0">
                    Dashboard Quản trị
                  </Title>
                  <Text type="secondary">Tổng quan hệ thống bất động sản</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                count={
                  reportSummary?.byStatus?.find((s) => s._id === "pending")
                    ?.count || 0
                }
                size="small"
              >
                <Button
                  icon={<Bell className="w-4 h-4" />}
                  type="text"
                  className="flex items-center justify-center"
                />
              </Badge>
              <AntSearch
                placeholder="Tìm kiếm trong hệ thống..."
                onSearch={handleSearch}
                loading={searchLoading}
                className="w-80"
                size="large"
              />
              <Tooltip title="Làm mới dữ liệu">
                <Button
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={handleRefresh}
                  loading={refreshing}
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
                >
                  Làm mới
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search Results */}
        {searchResults && (
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center mb-4">
              <Search className="w-5 h-5 text-blue-500 mr-2" />
              <Title level={4} className="mb-0">
                Kết quả tìm kiếm: "{searchResults.searchTerm}"
              </Title>
            </div>
            <Row gutter={16}>
              <Col span={6}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <Statistic
                    title="Người dùng"
                    value={searchResults.results?.users || 0}
                    valueStyle={{ color: "#3b82f6" }}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Home className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <Statistic
                    title="Bài đăng"
                    value={searchResults.results?.posts || 0}
                    valueStyle={{ color: "#10b981" }}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Newspaper className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <Statistic
                    title="Tin tức"
                    value={searchResults.results?.news || 0}
                    valueStyle={{ color: "#8b5cf6" }}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <Statistic
                    title="Danh mục"
                    value={searchResults.results?.categories || 0}
                    valueStyle={{ color: "#f97316" }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Enhanced Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-6">
          {overallCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.bgGradient}`}
                ></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl">{card.icon}</div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: card.color }}
                      >
                        {formatNumber(card.value)}
                      </div>
                      {formatGrowth(card.growth)}
                    </div>
                    <div className="text-gray-500 text-sm font-medium">
                      {card.title}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {card.subData?.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <div style={{ color: sub.color }}>{sub.icon}</div>
                        <span className="text-sm text-gray-600 font-medium">
                          {sub.label}
                        </span>
                      </div>
                      <span
                        className="font-semibold"
                        style={{ color: sub.color }}
                      >
                        {formatNumber(sub.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Enhanced Dashboard Controls */}
        <Card className="mb-6 border-0 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <Title level={4} className="mb-0">
                Hoạt động gần đây
              </Title>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="w-48"
                size="large"
              >
                <Option value={7}>7 ngày qua</Option>
                <Option value={30}>30 ngày qua</Option>
                <Option value={90}>90 ngày qua</Option>
              </Select>
              <Button icon={<Download className="w-4 h-4" />} size="large">
                Xuất báo cáo
              </Button>
            </div>
          </div>
          <Row gutter={24}>
            <Col span={8}>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="p-3 bg-blue-500 rounded-full inline-block mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Statistic
                  title="Người dùng mới"
                  value={dashboardData?.recentActivity?.newUsers || 0}
                  valueStyle={{
                    color: "#3b82f6",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="p-3 bg-green-500 rounded-full inline-block mb-3">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <Statistic
                  title="Bài đăng mới"
                  value={dashboardData?.recentActivity?.newPosts || 0}
                  valueStyle={{
                    color: "#10b981",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                <div className="p-3 bg-red-500 rounded-full inline-block mb-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <Statistic
                  title="Báo cáo mới"
                  value={dashboardData?.recentActivity?.newReports || 0}
                  valueStyle={{
                    color: "#ef4444",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Enhanced Charts and Tables */}
        <Card className="border-0 shadow-lg">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="enhanced-tabs"
            size="large"
            items={[
              {
                key: "1",
                label: (
                  <span className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Người dùng</span>
                  </span>
                ),
                children: (
                  <Row gutter={24}>
                    <Col span={12}>
                      <Card title="Phân bố theo vai trò" className="shadow-md">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={userRoleData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {userRoleData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Tăng trưởng theo tuần" className="shadow-md">
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart
                            data={
                              userSummary?.weeklyGrowth ||
                              generateWeeklyData("users")
                            }
                          >
                            <defs>
                              <linearGradient
                                id="colorUsers"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <RechartsTooltip />
                            <Area
                              type="monotone"
                              dataKey="users"
                              stroke="#3b82f6"
                              fillOpacity={1}
                              fill="url(#colorUsers)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={24} className="mt-6">
                      <Card title="Trạng thái xác thực" className="shadow-md">
                        <div className="grid grid-cols-2 gap-6">
                          {userSummary?.byVerification?.map((item, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center space-x-2">
                                  {item._id ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                  )}
                                  <span className="font-medium">
                                    {item._id ? "Đã xác thực" : "Chưa xác thực"}
                                  </span>
                                </div>
                                <span className="text-2xl font-bold text-gray-700">
                                  {formatNumber(item.count)}
                                </span>
                              </div>
                              <Progress
                                percent={Math.round(
                                  (item.count /
                                    (overallData?.users?.total || 1)) *
                                    100
                                )}
                                strokeColor={item._id ? "#10b981" : "#f59e0b"}
                                trailColor="#e5e7eb"
                                strokeWidth={8}
                                className="mb-2"
                              />
                              <Text type="secondary" className="text-sm">
                                {Math.round(
                                  (item.count /
                                    (overallData?.users?.total || 1)) *
                                    100
                                )}
                                % tổng người dùng
                              </Text>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: "2",
                label: (
                  <span className="flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Bài đăng</span>
                  </span>
                ),
                children: (
                  <Row gutter={24}>
                    <Col span={24}>
                      <Card
                        title="Thống kê theo danh mục"
                        className="shadow-md"
                      >
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={postCategoryData}>
                            <defs>
                              <linearGradient
                                id="colorPosts"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#10b981"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#10b981"
                                  stopOpacity={0.4}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="posts" fill="url(#colorPosts)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={24} className="mt-6">
                      <Card title="Trạng thái xác thực" className="shadow-md">
                        <div className="grid grid-cols-2 gap-6">
                          {userSummary?.byVerification?.map((item, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center space-x-2">
                                  {item._id ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                  )}
                                  <span className="font-medium">
                                    {item._id ? "Đã xác thực" : "Chưa xác thực"}
                                  </span>
                                </div>
                                <span className="text-2xl font-bold text-gray-700">
                                  {formatNumber(item.count)}
                                </span>
                              </div>
                              <Progress
                                percent={Math.round(
                                  (item.count /
                                    (overallData?.users?.total || 1)) *
                                    100
                                )}
                                strokeColor={item._id ? "#10b981" : "#f59e0b"}
                                trailColor="#e5e7eb"
                                strokeWidth={8}
                                className="mb-2"
                              />
                              <Text type="secondary" className="text-sm">
                                {Math.round(
                                  (item.count /
                                    (overallData?.users?.total || 1)) *
                                    100
                                )}
                                % tổng người dùng
                              </Text>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: "3",
                label: (
                  <span className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Báo cáo</span>
                  </span>
                ),
                children: (
                  <Row gutter={24}>
                    <Col span={12}>
                      <Card title="Trạng thái báo cáo" className="shadow-md">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={reportStatusData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="value"
                            >
                              {reportStatusData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card
                        title="Lý do báo cáo phổ biến"
                        className="shadow-md"
                      >
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={reportReasonData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={120} />
                            <RechartsTooltip />
                            <Bar
                              dataKey="value"
                              fill="#ef4444"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={24} className="mt-6">
                      <Card title="Chi tiết báo cáo" className="shadow-md">
                        <div className="grid grid-cols-3 gap-4">
                          {reportSummary?.byStatus?.map((status, index) => {
                            const statusConfig = {
                              pending: {
                                label: "Chờ xử lý",
                                color: "#f59e0b",
                                bgColor: "from-yellow-50 to-yellow-100",
                                icon: <Clock className="w-6 h-6" />,
                              },
                              resolved: {
                                label: "Đã xử lý",
                                color: "#10b981",
                                bgColor: "from-green-50 to-green-100",
                                icon: <CheckCircle className="w-6 h-6" />,
                              },
                              rejected: {
                                label: "Từ chối",
                                color: "#ef4444",
                                bgColor: "from-red-50 to-red-100",
                                icon: <XCircle className="w-6 h-6" />,
                              },
                            };
                            const config = statusConfig[status._id];

                            return (
                              <div
                                key={index}
                                className={`p-6 bg-gradient-to-br ${config.bgColor} rounded-xl text-center`}
                              >
                                <div
                                  className="flex justify-center mb-3"
                                  style={{ color: config.color }}
                                >
                                  {config.icon}
                                </div>
                                <div
                                  className="text-2xl font-bold mb-1"
                                  style={{ color: config.color }}
                                >
                                  {formatNumber(status.count)}
                                </div>
                                <div className="text-gray-600 font-medium">
                                  {config.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: "4",
                label: (
                  <span className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Danh mục hàng đầu</span>
                  </span>
                ),
                children: (
                  <Card
                    title="Danh mục được quan tâm nhất"
                    className="shadow-md"
                  >
                    <div className="space-y-4">
                      {dashboardData?.topCategories?.map((category, index) => (
                        <div
                          key={category._id}
                          className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${
                                index === 0
                                  ? "from-yellow-400 to-yellow-500"
                                  : index === 1
                                  ? "from-gray-400 to-gray-500"
                                  : "from-orange-400 to-orange-500"
                              } text-white rounded-full font-bold text-lg shadow-lg`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-lg text-gray-800">
                                {category.name}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <div className="flex items-center">
                                  <Home className="w-4 h-4 mr-1" />
                                  {formatNumber(category.count)} bài đăng
                                </div>
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {formatNumber(category.totalViews)} lượt xem
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {formatNumber(category.totalViews)}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              tổng lượt xem
                            </div>
                            <div className="mt-2">
                              <Tag color="blue" className="rounded-full">
                                Trung bình:{" "}
                                {Math.round(
                                  category.totalViews / category.count
                                )}{" "}
                                view/bài
                              </Tag>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional insights */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center mb-4">
                        <Activity className="w-5 h-5 text-blue-500 mr-2" />
                        <Title level={5} className="mb-0">
                          Thông tin thêm
                        </Title>
                      </div>
                      <Row gutter={16}>
                        <Col span={8}>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatNumber(
                                dashboardData?.topCategories?.reduce(
                                  (sum, cat) => sum + cat.count,
                                  0
                                ) || 0
                              )}
                            </div>
                            <div className="text-gray-600">Tổng bài đăng</div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {formatNumber(
                                dashboardData?.topCategories?.reduce(
                                  (sum, cat) => sum + cat.totalViews,
                                  0
                                ) || 0
                              )}
                            </div>
                            <div className="text-gray-600">Tổng lượt xem</div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {Math.round(
                                (dashboardData?.topCategories?.reduce(
                                  (sum, cat) => sum + cat.totalViews,
                                  0
                                ) || 0) /
                                  (dashboardData?.topCategories?.reduce(
                                    (sum, cat) => sum + cat.count,
                                    0
                                  ) || 1)
                              )}
                            </div>
                            <div className="text-gray-600">View TB/bài</div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                ),
              },
            ]}
          />
        </Card>
        <Card title="📈 Top Posts - Bài đăng hàng đầu" className="w-full">
          <Table
            columns={topPostsColumns}
            dataSource={dashboardData?.topPosts}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} bài đăng`,
            }}
            scroll={{ x: 800 }}
            className="ant-table-striped"
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
