"use strict";

const { NotFoundError } = require("../core/error.response");
const sendEmail = require("../helpers/sendEmail");
const { Report } = require("../models/report.model");
const { replyReportEmailForm } = require("../utils/emailExtension");
const { paginate } = require("../utils/paginate");

class ReportService {
  static createNewReport = async (data, user) => {
    const { post, reason, content } = data;
    if (!user) throw new NotFoundError("User not found");
    if (!post) throw new NotFoundError("Post not found");
    return await Report.create({
      content: content,
      post: post,
      reason: reason,
      content: content,
      author: user.userId,
    });
  };
  static getAllReport = async ({
    limit = 10,
    page = 1,
    filters,
    sortBy,
    ...query
  }) => {
    const options = {};
    if (sortBy) {
      const [field, order] = sortBy.split("-");
      options.sort = { [field]: order === "asc" ? 1 : -1 };
    } else {
      options.sort = { createdAt: -1 };
    }
    let reports = await paginate({
      model: Report,
      limit: +limit,
      page: +page,
      filters,
      options,
      populate: ["author", "post"],
    });
    return reports;
  };
  static updateStatusReport = async (reportId, data) => {
    const { status } = data;
    if (!status) throw new NotFoundError("Status not found");
    const report = await Report.findById(reportId);
    if (!report) throw new NotFoundError("Report not found");
    report.status = status;
    await report.save();
    return report;
  };
}
module.exports = ReportService;
