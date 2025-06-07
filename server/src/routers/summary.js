"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { authentication } = require("../auth/authUtils");
const summaryController = require("../controller/summary.controller");
const router = express.Router();

router.get(
  "/summary/overall",
  asynchandler(summaryController.getOverallSummary)
);

router.get(
  "/summary/dashboard",
  asynchandler(summaryController.getDashboardSummary)
);

router.get("/summary/search", asynchandler(summaryController.getSearchSummary));

router.use(authentication);

router.get("/summary/users", asynchandler(summaryController.getUserSummary));

router.get("/summary/posts", asynchandler(summaryController.getPostSummary));

router.get(
  "/summary/reports",
  asynchandler(summaryController.getReportSummary)
);

router.get("/summary/news", asynchandler(summaryController.getNewsSummary));

router.get(
  "/summary/author/:authorId",
  asynchandler(summaryController.getAuthorSummary)
);

router.get("/summary/admin", asynchandler(summaryController.getAdminSummary));

module.exports = router;
