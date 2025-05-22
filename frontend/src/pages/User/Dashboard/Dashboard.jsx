import {
  DollarSign,
  Download,
  Eye,
  Filter,
  Heart,
  Home,
  MapPin,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { userGetAllPostAPi } from "../../../services/postService";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [postData, setPostData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    const res = await userGetAllPostAPi();
    if (res.status === 200) {
      setPostData(res.data.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const filteredData = useMemo(() => {
    if (timeFilter === "all") return postData;

    const now = new Date();
    let startDate = new Date();

    switch (timeFilter) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        if (dateRange.startDate && dateRange.endDate) {
          return postData.filter((item) => {
            const itemDate = new Date(item.createdAt);
            return (
              itemDate >= new Date(dateRange.startDate) &&
              itemDate <= new Date(dateRange.endDate)
            );
          });
        }
        return postData;
      default:
        return postData;
    }

    return postData.filter((item) => new Date(item.createdAt) >= startDate);
  }, [postData, timeFilter, dateRange]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalPosts = filteredData.length;
    const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
    const totalFavorites = filteredData.reduce(
      (sum, item) => sum + item.favorites,
      0
    );
    const avgPrice =
      filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + item.price, 0) /
          filteredData.length
        : 0;

    return { totalPosts, totalViews, totalFavorites, avgPrice };
  }, [filteredData]);

  const categoryData = useMemo(() => {
    const categories = {};
    filteredData.forEach((item) => {
      const categoryName = item.category?.name || item.category || "Khác";
      categories[categoryName] = (categories[categoryName] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredData]);
  console.log("categoryData", categoryData);
  const priceRangeData = useMemo(() => {
    const ranges = {
      "< 5 tỷ": 0,
      "5-10 tỷ": 0,
      "10-20 tỷ": 0,
      "> 20 tỷ": 0,
    };

    filteredData.forEach((item) => {
      const price = item.price / 1000000000;
      if (price < 5) ranges["< 5 tỷ"]++;
      else if (price < 10) ranges["5-10 tỷ"]++;
      else if (price < 20) ranges["10-20 tỷ"]++;
      else ranges["> 20 tỷ"]++;
    });

    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const monthlyData = useMemo(() => {
    const months = {};
    filteredData.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
      });
      if (!months[month]) {
        months[month] = { month, posts: 0, views: 0, favorites: 0 };
      }
      months[month].posts++;
      months[month].views += item.views;
      months[month].favorites += item.favorites;
    });
    return Object.values(months).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );
  }, [filteredData]);

  const typeData = useMemo(() => {
    const types = {};
    filteredData.forEach((item) => {
      types[item.type] = (types[item.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({
      name: name === "RENT" ? "Cho thuê" : "Bán",
      value,
    }));
  }, [filteredData]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const exportToExcel = () => {
    try {
      // Tạo workbook mới
      const wb = XLSX.utils.book_new();

      // Sheet 1: Tổng quan thống kê
      const overviewData = [
        ["BÁO CÁO THỐNG KÊ BẤT ĐỘNG SẢN"],
        ["Ngày xuất báo cáo:", new Date().toLocaleDateString("vi-VN")],
        ["Thời gian lọc:", timeFilter === "all" ? "Tất cả" : timeFilter],
        [],
        ["TỔNG QUAN"],
        ["Chỉ số", "Giá trị"],
        ["Tổng tin đăng", stats.totalPosts],
        ["Tổng lượt xem", stats.totalViews],
        ["Tổng yêu thích", stats.totalFavorites],
        ["Giá trung bình", stats.avgPrice],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, ws1, "Tổng quan");

      // Sheet 2: Chi tiết bất động sản
      const detailData = [
        ["DANH SÁCH BẤT ĐỘNG SẢN CHI TIẾT"],
        [],
        [
          "STT",
          "Tiêu đề",
          "Giá (VNĐ)",
          "Địa chỉ",
          "Loại hình",
          "Diện tích (m²)",
          "Loại giao dịch",
          "Lượt xem",
          "Yêu thích",
          "Ngày tạo",
        ],
      ];

      filteredData.forEach((item, index) => {
        detailData.push([
          index + 1,
          item.title,
          item.price,
          item.address,
          item.category?.name || "N/A",
          item.acreage || "N/A",
          item.type === "RENT" ? "Cho thuê" : "Bán",
          item.views,
          item.favorites,
          new Date(item.createdAt).toLocaleDateString("vi-VN"),
        ]);
      });
      const ws2 = XLSX.utils.aoa_to_sheet(detailData);
      XLSX.utils.book_append_sheet(wb, ws2, "Chi tiết BDS");

      // Sheet 3: Thống kê theo loại hình
      const categorySheetData = [
        ["THỐNG KÊ THEO LOẠI HÌNH"],
        [],
        ["Loại hình", "Số lượng", "Tỷ lệ (%)"],
      ];

      const totalPosts = categoryData.reduce(
        (sum, item) => sum + item.value,
        0
      );
      categoryData.forEach((item) => {
        const percentage =
          totalPosts > 0 ? ((item.value / totalPosts) * 100).toFixed(1) : 0;
        categorySheetData.push([item.name, item.value, percentage]);
      });
      const ws3 = XLSX.utils.aoa_to_sheet(categorySheetData);
      XLSX.utils.book_append_sheet(wb, ws3, "Thống kê loại hình");

      // Sheet 4: Thống kê theo khoảng giá
      const priceRangeSheetData = [
        ["THỐNG KÊ THEO KHOẢNG GIÁ"],
        [],
        ["Khoảng giá", "Số lượng"],
      ];

      priceRangeData.forEach((item) => {
        priceRangeSheetData.push([item.name, item.value]);
      });
      const ws4 = XLSX.utils.aoa_to_sheet(priceRangeSheetData);
      XLSX.utils.book_append_sheet(wb, ws4, "Thống kê giá");

      // Sheet 5: Thống kê theo tháng
      if (monthlyData.length > 0) {
        const monthlySheetData = [
          ["THỐNG KÊ THEO THÁNG"],
          [],
          ["Tháng", "Tin đăng", "Lượt xem", "Yêu thích"],
        ];

        monthlyData.forEach((item) => {
          monthlySheetData.push([
            item.month,
            item.posts,
            item.views,
            item.favorites,
          ]);
        });
        const ws5 = XLSX.utils.aoa_to_sheet(monthlySheetData);
        XLSX.utils.book_append_sheet(wb, ws5, "Thống kê tháng");
      }

      // Sheet 6: Top BDS được xem nhiều
      const topViewsData = [
        ["TOP BẤT ĐỘNG SẢN ĐƯỢC XEM NHIỀU NHẤT"],
        [],
        ["STT", "Tiêu đề", "Lượt xem", "Yêu thích", "Giá (VNĐ)", "Địa chỉ"],
      ];

      const topViewed = [...filteredData]
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      topViewed.forEach((item, index) => {
        topViewsData.push([
          index + 1,
          item.title,
          item.views,
          item.favorites,
          item.price,
          item.address,
        ]);
      });
      const ws6 = XLSX.utils.aoa_to_sheet(topViewsData);
      XLSX.utils.book_append_sheet(wb, ws6, "Top lượt xem");

      // Xuất file
      const fileName = `Bao_cao_BDS_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Thống Kê Bất Động Sản
          </h1>
          <p className="text-gray-600">
            Tổng quan và phân tích dữ liệu bất động sản
          </p>
        </div>

        {/* Time Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Lọc theo thời gian:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "7days", label: "7 ngày" },
                { value: "30days", label: "30 ngày" },
                { value: "3months", label: "3 tháng" },
                { value: "6months", label: "6 tháng" },
                { value: "1year", label: "1 năm" },
                { value: "custom", label: "Tùy chọn" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeFilter(option.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {timeFilter === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-gray-500">đến</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}

            <button
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              onClick={exportToExcel}
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng tin đăng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPosts}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng lượt xem
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng yêu thích
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalFavorites}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Giá trung bình
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.avgPrice).replace("₫", "đ")}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố theo loại hình
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Price Range Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố theo khoảng giá
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xu hướng theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="posts"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="Tin đăng"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="views"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Lượt xem"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Type and Views Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sale vs Rent */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bán vs Cho thuê
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Properties by Views */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top tin đăng được xem nhiều
            </h3>
            <div className="space-y-4 overflow-x-auto">
              {filteredData
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">
                        {item.views} views
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.favorites} likes
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
