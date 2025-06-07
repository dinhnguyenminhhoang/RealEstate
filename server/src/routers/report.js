"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication, authentication } = require("../auth/authUtils");
const reportController = require("../controller/report.controller");
const router = express.Router();

router.post(
  "/report",
  authentication,
  asynchandler(reportController.createNewReport)
);

router.put(
  "/report/status/:reportId",
  authentication,
  asynchandler(reportController.updateStatusReport)
);
router.get(
  "/report",
  adminAuthentication,
  asynchandler(reportController.getAllReport)
);
module.exports = router;
