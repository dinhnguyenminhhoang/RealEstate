"use strict";

const { NotFoundError } = require("../core/error.response");
const sendEmail = require("../helpers/sendEmail");
const { Application } = require("../models/application.modal");
const { applicationEmailForm } = require("../utils/emailExtension");
const { paginate } = require("../utils/paginate");

class ApplicationService {
  static createNewApplication = async (data, user) => {
    const { post, content, phone, email, fullName } = data;
    if (!user) throw new NotFoundError("User not found");
    if (!post) throw new NotFoundError("Post not found");

    const newApplication = await Application.create({
      name: fullName,
      phone,
      email,
      content,
      post,
      author: user.userId,
    });
    return newApplication;
  };

  static getAllApplications = async ({
    limit = 10,
    page = 1,
    filters,
    sortBy,
    ...query
  }) => {
    const options = {};

    if (sortBy) {
      const [field, order] = sortBy.split("-");
      options.sort = { [field]: order === "asc" ? 1 : -1 };
    } else {
      options.sort = { createdAt: -1 };
    }

    return await paginate({
      model: Application,
      limit: +limit,
      page: +page,
      filters,
      options,
      populate: ["author", "post"],
    });
  };

  static getApplicationsByPost = async (postId, { limit = 10, page = 1 }) => {
    if (!postId) throw new NotFoundError("Post ID is required");

    return await paginate({
      model: Application,
      limit: +limit,
      page: +page,
      filters: { post: postId },
      options: { sort: { createdAt: -1 } },
      populate: ["author"],
    });
  };

  static getApplicationById = async (applicationId) => {
    const application = await Application.findById(applicationId)
      .populate("author")
      .populate("post");

    if (!application) throw new NotFoundError("Application not found");
    return application;
  };

  static deleteApplication = async (applicationId) => {
    const application = await Application.findByIdAndDelete(applicationId);
    if (!application) throw new NotFoundError("Application not found");
    return application;
  };

  static getApplicationsByAuthor = async (
    authorId,
    { limit = 10, page = 1 }
  ) => {
    if (!authorId) throw new NotFoundError("Author ID is required");

    return await paginate({
      model: Application,
      limit: +limit,
      page: +page,
      filters: { author: authorId },
      options: { sort: { createdAt: -1 } },
      populate: ["post"],
    });
  };
}

module.exports = ApplicationService;
