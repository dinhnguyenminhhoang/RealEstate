"use strict";
const express = require("express");
const router = express.Router();

router.use(`/v1/api`, require("./access"));
router.use(`/v1/api`, require("./user"));
router.use(`/v1/api`, require("./upload"));
router.use(`/v1/api`, require("./report"));
router.use(`/v1/api`, require("./category"));

module.exports = router;
