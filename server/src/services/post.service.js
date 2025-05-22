"use strict";

const { NotFoundError, AuthFailureError } = require("../core/error.response");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { unGetSelectData, removeUndefinedObject } = require("../utils");

const { paginate } = require("../utils/paginate");

class PostService {
  static userCreateNewPost = async (data, userId) => {
    const {
      title,
      address,
      category,
      description,
      overview,
      price,
      images,
      acreage,
    } = data;
    if (!title || !address || !description || !price) {
      throw new NotFoundError("Missing parametor");
    }
    const post = await Post.create({
      title,
      address,
      description,
      author: userId,
      category: category,
      overview,
      price,
      images,
      acreage,
    });
    if (post._id) {
      return "Create success";
    }
  };
  static getAllPostByUser = async (
    {
      limit = 10,
      page = 1,
      filters = { isDelete: "active" },
      options,
      ...query
    },
    user
  ) => {
    if (!user) {
      throw new AuthFailureError("can't not find user");
    }
    filters = { ...filters, author: user.userId };
    let posts = await paginate({
      model: Post,
      limit: +limit,
      page: +page,
      filters,
      options,
      projection: unGetSelectData(["isDelete", "__v"]),
      populate: ["category"],
    });

    return posts;
  };
  static getAllPost = async ({
    page = 1,
    limit = 10,
    filters,
    options,
    sort,
    ...query
  }) => {
    filters = { ...filters, isDelete: "active" };
    if (sort) {
      const sortObj = {};
      const sortSplit = sort.split("-");
      console.log("sortSplit", sortSplit);
      if (sortSplit.length === 2) {
        const [key, value] = sortSplit;
        if (value === "default") {
          sort = null;
        } else {
          sortObj[key] = value === "desc" ? -1 : 1;
          sort = sortObj;
        }
      }
    }
    if (query) {
      query = removeUndefinedObject(query);
    }
    if (query.area) {
      const areaRange = query.area.split("-");
      if (areaRange.length === 2) {
        const [minArea, maxArea] = areaRange;
        filters.acreage = {
          $gte: parseInt(minArea),
          $lte: parseInt(maxArea),
        };
      }
      delete query.area;
    }
    if (query.price) {
      const priceRange = query.price.split("-");
      if (priceRange.length === 2) {
        const [minPrice, maxPrice] = priceRange;
        filters.price = {
          $gte: parseInt(minPrice * 1000000000),
          $lte: parseInt(maxPrice * 1000000000),
        };
      }
      delete query.price;
    }
    if (query.address) {
      filters.address = { $regex: query.address, $options: "i" };
      delete query.address;
    }

    filters = { ...filters, ...query };

    let posts = await paginate({
      model: Post,
      limit: +limit,
      page: +page,
      filters,
      options,
      sort,
      projection: unGetSelectData(["isDelete", "__v"]),
      populate: {
        path: "author",
        select: "userName email phone address _id",
      },
    });

    return posts;
  };
  static getPostDetail = async ({ id, userId }) => {
    const filters = {
      _id: id,
      isDelete: "active",
    };
    const post = await Post.findOne(filters)
      .populate([
        {
          path: "author",
          select: "userName email phone address _id avatar",
        },
        {
          path: "category",
          select: "name _id",
        },
      ])
      .select(unGetSelectData(["__v", "isDelete", "verification"]));

    if (!post) {
      throw new NotFoundError("Post not found or has been deleted");
    }

    const postObject = post.toObject();

    if (userId) {
      const user = await User.findOne({
        _id: userId,
        favorites: { $in: [id] },
      });

      postObject.isFavorite = !!user;
    } else {
      postObject.isFavorite = false;
    }

    return postObject;
  };
  static getPostOutstanding = async ({ limit = 8 } = {}) => {
    const posts = await Post.find({ isDelete: "active" })
      .sort({ views: -1 })
      .limit(+limit)
      .select(unGetSelectData(["isDelete", "__v"]))
      .populate([
        {
          path: "author",
          select: "userName email phone address _id",
        },
        {
          path: "category",
          select: "name _id",
        },
      ])
      .lean();

    return posts;
  };
  static userGetYourPost = async (user, id) => {
    const isExist = await Post.findOne({ _id: id, author: user.userId });

    if (!isExist) {
      throw new NotFoundError("Post not found!");
    }
    return isExist;
  };
  static userUpdateYourPost = async (payload, user, id) => {
    const isExist = await Post.findOne({ _id: id, author: user.userId });

    if (!isExist) {
      throw new NotFoundError("Post not found!");
    }

    const result = await Post.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    return result;
  };
  static updatePostView = async (id) => {
    const isExist = await Post.findOne({ _id: id });
    if (!isExist) {
      throw new NotFoundError("Post not found!");
    }

    const result = await Post.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } },
      { new: true }
    );

    return result;
  };
  static confirmPost = async (id) => {
    const isExist = await Post.findOne({ _id: id });

    if (!isExist) {
      throw new NotFoundError("Post not found!");
    }

    const result = await Post.findOneAndUpdate(
      { _id: id },
      { verification: !isExist.verification },
      {
        new: true,
      }
    );
    return result;
  };
  static userDeleteYourPost = async (user, id) => {
    const isExist = await Post.findOne({ _id: id, author: user.userId });

    if (!isExist) {
      throw new NotFoundError("Post not found!");
    }

    const result = await Post.findOneAndUpdate(
      { _id: id },
      { isDelete: "inActive" },
      {
        new: true,
      }
    );
    return result;
  };
  static deletePost = async (id) => {
    const isExist = await Post.findOne({ _id: id });

    if (!isExist) {
      throw new NotFoundError("Post not found!");
    }

    const result = await Post.findOneAndUpdate(
      { _id: id },
      { isDelete: "inActive" },
      {
        new: true,
      }
    );
    return result;
  };
}
module.exports = PostService;
