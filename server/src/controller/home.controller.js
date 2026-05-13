"use strict";

const { SuccessResponse } = require("../core/success.response");
const HomeService = require("../services/home.service");

class HomeController {
  getHomeData = async (req, res, next) => {
    new SuccessResponse({
      data: await HomeService.getHomeData(req.query),
    }).send(res);
  };
}

module.exports = new HomeController();
