"use strict";

const { badRequestError } = require("../core/error.response");
const { User } = require("../models/user.model");
const { paginate } = require("../utils/paginate");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Post } = require("../models/post.model");
const { unGetSelectData } = require("../utils");

class UserService {
  static getUserInfo = async (user) => {
    return await User.findById(user.userId).select({
      _id: 1,
      userName: 1,
      phone: 1,
      email: 1,
      address: 1,
      avatar: 1,
      taxCode: 1,
      invoiceInformation: 1,
      avatar: 1,
    });
  };
  static updateProfile = async (payload, user) => {
    return await User.findByIdAndUpdate(user.userId, payload, {
      new: true,
    }).lean();
  };
  static getAllUser = async ({
    limit = 10,
    page = 1,
    filters = { status: "active" },
    options,
    ...query
  }) => {
    let users = await paginate({
      model: User,
      limit: +limit,
      page: +page,
      filters,
      options,
      projection: [
        "email",
        "userName",
        "roles",
        "phone",
        "status",
        "createdAt",
      ],
    });
    return users;
  };
  static deleteUser = async (userId) => {
    return await User.findByIdAndUpdate(
      userId,
      { status: "inActive" },
      {
        new: true,
      }
    ).lean();
  };
  static createUser = async ({
    userName,
    email,
    phone,
    password,
    roles,
    address,
  }) => {
    const hodelUser = await User.findOne({ email }).lean();
    if (hodelUser) {
      throw new badRequestError("error user already rigisted");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      userName,
      email,
      phone,
      password: passwordHash,
      roles: roles,
      address,
    });
    return {
      data: null,
    };
  };
  static updateUser = async (userId, payload) => {
    return await User.findByIdAndUpdate(userId, payload, {
      new: true,
    }).lean();
  };
  static userSavePost = async (userId, postId) => {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new NotFoundError("Post not found!");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    const alreadySaved = user.favorites.includes(postId);
    if (alreadySaved) {
      return user ? true : false;
    }

    await Post.findOneAndUpdate({ _id: postId }, { $inc: { favorites: 1 } });

    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { favorites: postId } },
      { new: true }
    );

    return result._id ? true : false;
  };
  static userGetAllFavoriteList = async ({
    userId,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = -1,
  }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const favoriteIds = user.favorites || [];

    const skip = (page - 1) * limit;

    const sort = {};
    sort[sortBy] = sortOrder;

    const totalDocs = await Post.countDocuments({
      _id: { $in: favoriteIds },
      isDelete: "active",
    });

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    if (favoriteIds.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          totalDocs: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    // Truy vấn để lấy chi tiết các bài viết yêu thích
    const favoritePosts = await Post.find({
      _id: { $in: favoriteIds },
      isDelete: "active",
    })
      .populate([
        {
          path: "author",
          select: "userName email _id avatar phone",
        },
        {
          path: "category",
          select: "name _id",
        },
      ])
      .select(unGetSelectData(["__v", "isDelete", "verification"]))
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const favoritePostsWithFlag = favoritePosts.map((post) => {
      const postObj = post.toObject();
      postObj.isFavorite = true;
      return postObj;
    });

    return {
      data: favoritePostsWithFlag,
      pagination: {
        page,
        limit,
        totalDocs,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  };
}
module.exports = UserService;
