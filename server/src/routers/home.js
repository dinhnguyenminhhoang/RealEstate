"use strict";

const express = require("express");
const homeController = require("../controller/home.controller");
const { asynchandler } = require("../helpers/asynchandler");

const router = express.Router();

router.get("/home", asynchandler(homeController.getHomeData));

module.exports = router;
