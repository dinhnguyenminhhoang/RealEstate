"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ReportService = require("../services/report.service");

class ReportController {
  createNewReport = async (req, res, next) => {
    new CREATED({
      data: await ReportService.createNewReport(req.body, req.user),
    }).send(res);
  };
  getAllReport = async (req, res, next) => {
    const query = req.query;
    new SuccessResponse({
      data: await ReportService.getAllReport(query),
    }).send(res);
  };
  updateStatusReport = async (req, res, next) => {
    const { reportId } = req.params;
    new SuccessResponse({
      data: await ReportService.updateStatusReport(reportId, req.body),
    }).send(res);
  };
}
module.exports = new ReportController();
