"use strict";
const { SuccessResponse } = require("../core/success.response");
const SummaryService = require("../services/summary.service");

class SummaryController {
  // Lấy thống kê tổng quan
  getOverallSummary = async (req, res, next) => {
    new SuccessResponse({
      message: "Get overall summary successfully",
      data: await SummaryService.getOverallSummary(),
    }).send(res);
  };

  // Lấy thống kê người dùng chi tiết
  getUserSummary = async (req, res, next) => {
    new SuccessResponse({
      message: "Get user summary successfully",
      data: await SummaryService.getUserSummary(),
    }).send(res);
  };

  // Lấy thống kê bài đăng chi tiết
  getPostSummary = async (req, res, next) => {
    new SuccessResponse({
      message: "Get post summary successfully",
      data: await SummaryService.getPostSummary(),
    }).send(res);
  };

  // Lấy thống kê báo cáo
  getReportSummary = async (req, res, next) => {
    new SuccessResponse({
      message: "Get report summary successfully",
      data: await SummaryService.getReportSummary(),
    }).send(res);
  };

  // Lấy thống kê tin tức
  getNewsSummary = async (req, res, next) => {
    new SuccessResponse({
      message: "Get news summary successfully",
      data: await SummaryService.getNewsSummary(),
    }).send(res);
  };

  // Lấy thống kê dashboard
  getDashboardSummary = async (req, res, next) => {
    const { timeRange = 30 } = req.query;
    new SuccessResponse({
      message: "Get dashboard summary successfully",
      data: await SummaryService.getDashboardSummary(parseInt(timeRange)),
    }).send(res);
  };

  // Lấy thống kê theo tác giả
  getAuthorSummary = async (req, res, next) => {
    const { authorId } = req.params;
    new SuccessResponse({
      message: "Get author summary successfully",
      data: await SummaryService.getAuthorSummary(authorId),
    }).send(res);
  };

  // Lấy thống kê tìm kiếm
  getSearchSummary = async (req, res, next) => {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      throw new Error("Search term is required");
    }
    new SuccessResponse({
      message: "Get search summary successfully",
      data: await SummaryService.getSearchSummary(searchTerm),
    }).send(res);
  };

  // Lấy thống kê cho admin (tổng hợp tất cả)
  getAdminSummary = async (req, res, next) => {
    const [overall, users, posts, reports, news] = await Promise.all([
      SummaryService.getOverallSummary(),
      SummaryService.getUserSummary(),
      SummaryService.getPostSummary(),
      SummaryService.getReportSummary(),
      SummaryService.getNewsSummary(),
    ]);

    new SuccessResponse({
      message: "Get admin summary successfully",
      data: {
        overall,
        users,
        posts,
        reports,
        news,
      },
    }).send(res);
  };
}

module.exports = new SummaryController();
