"use strict";

const { Category } = require("../models/category.model");
const { News } = require("../models/news.model");
const { Post } = require("../models/post.model");
const { unGetSelectData } = require("../utils");

const postPopulate = [
  {
    path: "author",
    select: "userName email phone address avatar _id",
  },
  {
    path: "category",
    select: "name _id",
  },
];

class HomeService {
  static getHomeData = async ({
    featuredLimit = 8,
    latestLimit = 8,
    categoryLimit = 10,
    newsLimit = 4,
  } = {}) => {
    const activePostFilters = {
      isDelete: "active",
      verification: true,
      status: "in-stock",
    };

    const [
      featuredPosts,
      latestPosts,
      categories,
      news,
      totalPosts,
      rentPosts,
      sellPosts,
      totalCategories,
      totalNews,
    ] = await Promise.all([
      Post.find(activePostFilters)
        .sort({ views: -1, favorites: -1, createdAt: -1 })
        .limit(+featuredLimit)
        .select(unGetSelectData(["isDelete", "__v"]))
        .populate(postPopulate)
        .lean(),
      Post.find(activePostFilters)
        .sort({ createdAt: -1 })
        .limit(+latestLimit)
        .select(unGetSelectData(["isDelete", "__v"]))
        .populate(postPopulate)
        .lean(),
      Category.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(+categoryLimit)
        .select(unGetSelectData(["__v", "status"]))
        .lean(),
      News.find({ isDelete: "active" })
        .sort({ createdAt: -1 })
        .limit(+newsLimit)
        .select(unGetSelectData(["__v", "isDelete"]))
        .lean(),
      Post.countDocuments(activePostFilters),
      Post.countDocuments({ ...activePostFilters, type: "RENT" }),
      Post.countDocuments({ ...activePostFilters, type: "SELL" }),
      Category.countDocuments({ status: "active" }),
      News.countDocuments({ isDelete: "active" }),
    ]);

    return {
      featuredPosts,
      latestPosts,
      categories,
      news,
      stats: {
        totalPosts,
        rentPosts,
        sellPosts,
        totalCategories,
        totalNews,
      },
    };
  };
}

module.exports = HomeService;
