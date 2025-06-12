"use strict";

const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const applicationController = require("../controller/application.controller");
const { authentication } = require("../auth/authUtils");
const router = express.Router();

router.post(
  "/applications",
  authentication,
  asynchandler(applicationController.createNewApplication)
);

router.get(
  "/applications/my-applications",
  authentication,
  asynchandler(applicationController.getApplicationsByAuthor)
);

router.get(
  "/",
  authentication,
  asynchandler(applicationController.getAllApplications)
);

router.get(
  "/post/:postId",
  authentication,
  asynchandler(applicationController.getApplicationsByPost)
);

router.get(
  "/:applicationId",
  authentication,
  asynchandler(applicationController.getApplicationById)
);

router.delete(
  "/:applicationId",
  authentication,
  asynchandler(applicationController.deleteApplication)
);

module.exports = router;
