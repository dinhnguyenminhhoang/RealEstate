"use strict";
const { Types } = require("mongoose");
const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const { Report } = require("../models/report.model");
const { News } = require("../models/news.model");
const { Category } = require("../models/category.model");

class SummaryService {
  // Tổng quan thống kê tổng thể
  static getOverallSummary = async () => {
    try {
      const [
        totalUsers,
        activeUsers,
        totalPosts,
        activePosts,
        rentPosts,
        sellPosts,
        totalReports,
        pendingReports,
        totalNews,
        activeNews,
        totalCategories,
      ] = await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ status: "active" }),
        Post.countDocuments({}),
        Post.countDocuments({ isDelete: "active" }),
        Post.countDocuments({ type: "RENT", isDelete: "active" }),
        Post.countDocuments({ type: "SELL", isDelete: "active" }),
        Report.countDocuments({}),
        Report.countDocuments({ status: "pending" }),
        News.countDocuments({}),
        News.countDocuments({ isDelete: "active" }),
        Category.countDocuments({ status: "active" }),
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        posts: {
          total: totalPosts,
          active: activePosts,
          inactive: totalPosts - activePosts,
          rent: rentPosts,
          sell: sellPosts,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          resolved: totalReports - pendingReports,
        },
        news: {
          total: totalNews,
          active: activeNews,
          inactive: totalNews - activeNews,
        },
        categories: {
          total: totalCategories,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  // Thống kê người dùng chi tiết
  static getUserSummary = async () => {
    try {
      const userStats = await User.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const roleStats = await User.aggregate([
        { $unwind: "$roles" },
        {
          $group: {
            _id: "$roles",
            count: { $sum: 1 },
          },
        },
      ]);

      const verificationStats = await User.aggregate([
        {
          $group: {
            _id: "$verification",
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        byStatus: userStats,
        byRole: roleStats,
        byVerification: verificationStats,
      };
    } catch (error) {
      throw error;
    }
  };

  // Thống kê bài đăng chi tiết
  static getPostSummary = async () => {
    try {
      const postStats = await Post.aggregate([
        {
          $group: {
            _id: {
              type: "$type",
              status: "$status",
              isDelete: "$isDelete",
            },
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            totalViews: { $sum: "$views" },
            totalFavorites: { $sum: "$favorites" },
          },
        },
      ]);

      const categoryStats = await Post.aggregate([
        {
          $match: { isDelete: "active" },
        },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $group: {
            _id: "$categoryInfo.name",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
          },
        },
        { $sort: { count: -1 } },
      ]);

      const priceRangeStats = await Post.aggregate([
        {
          $match: { isDelete: "active" },
        },
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 1000000, 5000000, 10000000, 50000000, Infinity],
            default: "Other",
            output: {
              count: { $sum: 1 },
              avgPrice: { $avg: "$price" },
            },
          },
        },
      ]);

      return {
        general: postStats,
        byCategory: categoryStats,
        byPriceRange: priceRangeStats,
      };
    } catch (error) {
      throw error;
    }
  };

  // Thống kê báo cáo
  static getReportSummary = async () => {
    try {
      const reportStats = await Report.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const reasonStats = await Report.aggregate([
        {
          $group: {
            _id: "$reason",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      const monthlyReports = await Report.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]);

      return {
        byStatus: reportStats,
        byReason: reasonStats,
        monthly: monthlyReports,
      };
    } catch (error) {
      throw error;
    }
  };

  // Thống kê tin tức
  static getNewsSummary = async () => {
    try {
      const newsStats = await News.aggregate([
        {
          $group: {
            _id: "$isDelete",
            count: { $sum: 1 },
          },
        },
      ]);

      const tagStats = await News.aggregate([
        { $unwind: "$tags" },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      const monthlyNews = await News.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]);

      return {
        byStatus: newsStats,
        popularTags: tagStats,
        monthly: monthlyNews,
      };
    } catch (error) {
      throw error;
    }
  };

  // Thống kê theo thời gian (dashboard)
  static getDashboardSummary = async (timeRange = 30) => {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - timeRange);

      const [newUsers, newPosts, newReports] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: dateFrom } }),
        Post.countDocuments({ createdAt: { $gte: dateFrom } }),
        Report.countDocuments({ createdAt: { $gte: dateFrom } }),
      ]);

      const topViewedPosts = await Post.find({ isDelete: "active" })
        .sort({ views: -1 })
        .limit(10)
        .populate("author", "userName email")
        .populate("category", "name")
        .select("title views favorites price type");

      const topCategories = await Post.aggregate([
        { $match: { isDelete: "active" } },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $group: {
            _id: "$categoryInfo._id",
            name: { $first: "$categoryInfo.name" },
            count: { $sum: 1 },
            totalViews: { $sum: "$views" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);

      return {
        recentActivity: {
          newUsers,
          newPosts,
          newReports,
          timeRange,
        },
        topPosts: topViewedPosts,
        topCategories,
      };
    } catch (error) {
      throw error;
    }
  };

  // Thống kê theo tác giả
  static getAuthorSummary = async (authorId) => {
    try {
      const author = await User.findById(authorId);
      if (!author) {
        throw new Error("Author not found");
      }

      const authorStats = await Post.aggregate([
        {
          $match: {
            author: new Types.ObjectId(authorId),
            isDelete: "active",
          },
        },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalFavorites: { $sum: "$favorites" },
            avgPrice: { $avg: "$price" },
            rentPosts: {
              $sum: { $cond: [{ $eq: ["$type", "RENT"] }, 1, 0] },
            },
            sellPosts: {
              $sum: { $cond: [{ $eq: ["$type", "SELL"] }, 1, 0] },
            },
          },
        },
      ]);

      const recentPosts = await Post.find({
        author: authorId,
        isDelete: "active",
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title views favorites price type createdAt");

      return {
        author: {
          id: author._id,
          userName: author.userName,
          email: author.email,
        },
        stats: authorStats[0] || {
          totalPosts: 0,
          totalViews: 0,
          totalFavorites: 0,
          avgPrice: 0,
          rentPosts: 0,
          sellPosts: 0,
        },
        recentPosts,
      };
    } catch (error) {
      throw error;
    }
  };

  // Tìm kiếm và thống kê
  static getSearchSummary = async (searchTerm) => {
    try {
      const searchRegex = new RegExp(searchTerm, "i");

      const [users, posts, news, categories] = await Promise.all([
        User.countDocuments({
          $or: [{ userName: searchRegex }, { email: searchRegex }],
        }),
        Post.countDocuments({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { address: searchRegex },
          ],
        }),
        News.countDocuments({
          $or: [{ title: searchRegex }, { content: searchRegex }],
        }),
        Category.countDocuments({ name: searchRegex }),
      ]);

      return {
        searchTerm,
        results: {
          users,
          posts,
          news,
          categories,
          total: users + posts + news + categories,
        },
      };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = SummaryService;
