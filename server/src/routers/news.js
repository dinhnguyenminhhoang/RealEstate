"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication } = require("../auth/authUtils");
const newsController = require("../controller/news.controller");
const router = express.Router();

router.post(
  "/news",
  adminAuthentication,
  asynchandler(newsController.createNewNews)
);

router.put(
  "/news/:id",
  adminAuthentication,
  asynchandler(newsController.updateNews)
);

router.get("/news", asynchandler(newsController.getAllNews));
router.get("/news/:id", asynchandler(newsController.getNewsDetail));

router.delete(
  "/news/:id",
  adminAuthentication,
  asynchandler(newsController.deleteNews)
);

module.exports = router;
