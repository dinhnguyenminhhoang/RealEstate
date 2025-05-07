"use strict";

const { default: mongoose } = require("mongoose");
const { NotFoundError } = require("../core/error.response");
const { paginate } = require("../utils/paginate");
const { unGetSelectData } = require("../utils");
const { News } = require("../models/news.model");

class NewsService {
  static createNewNews = async (data) => {
    const news = await News.create(data);
    return news;
  };

  static getAllNews = async ({
    limit = 10,
    page = 1,
    filters = { isDelete: "active" },
    options,
    ...query
  }) => {
    let news = await paginate({
      model: News,
      limit: +limit,
      page: +page,
      filters,
      options,
      projection: unGetSelectData(["__v", "isDelete"]),
    });
    return news;
  };
  static getNewsDetail = async (id) => {
    return await News.findById(id)
      .lean()
      .select(unGetSelectData(["isDelete", "__v"]));
  };
  static deleteNews = async (id) => {
    try {
      const updatedNews = await News.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { isDelete: "inActive" },
        { new: true }
      );

      if (!updatedNews) {
        throw new NotFoundError("News not found");
      }

      return updatedNews;
    } catch (error) {
      throw new Error(`Error updating news: ${error.message}`);
    }
  };

  static updateNews = async (id, payload) => {
    const isExist = await News.findOne({ _id: id });

    if (!isExist) {
      throw new NotFoundError("News not found!");
    }

    const result = await News.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    return result;
  };
}

module.exports = NewsService;
