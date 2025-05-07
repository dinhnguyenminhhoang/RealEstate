"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const NewsService = require("../services/news.service");

class NewsController {
  createNewNews = async (req, res, next) => {
    new CREATED({
      data: await NewsService.createNewNews(req.body),
    }).send(res);
  };
  deleteNews = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await NewsService.deleteNews(id),
    }).send(res);
  };
  getAllNews = async (req, res, next) => {
    new SuccessResponse({
      data: await NewsService.getAllNews(req.query),
    }).send(res);
  };
  getNewsDetail = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await NewsService.getNewsDetail(id),
    }).send(res);
  };
  updateNews = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await NewsService.updateNews(id, req.body),
    }).send(res);
  };
}
module.exports = new NewsController();
