"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const PostService = require("../services/post.service");
const ReportService = require("../services/report.service");

class PostController {
  userCreateNewPost = async (req, res, next) => {
    new CREATED({
      data: await PostService.userCreateNewPost(req.body, req.user.userId),
    }).send(res);
  };
  getAllPostByUser = async (req, res, next) => {
    console.log("req", req.user);
    new SuccessResponse({
      data: await PostService.getAllPostByUser(req.query, req.user),
    }).send(res);
  };
  getAllPost = async (req, res, next) => {
    const { page, limit, sort, ...query } = req.query;
    new SuccessResponse({
      data: await PostService.getAllPost({
        page,
        limit,
        filters: {},
        options: {},
        sort,
        ...query,
      }),
    }).send(res);
  };
  getPostDetail = async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.query;
    new SuccessResponse({
      data: await PostService.getPostDetail({
        id,
        userId,
      }),
    }).send(res);
  };
  getPostOutstanding = async (req, res, next) => {
    new SuccessResponse({
      data: await PostService.getPostOutstanding(req.query),
    }).send(res);
  };
  confirmPost = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.confirmPost(id),
    }).send(res);
  };
  unPublishPost = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.unPublishPost(id),
    }).send(res);
  };
  userGetYourPost = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.userGetYourPost(req.user, id),
    }).send(res);
  };
  userUpdateYourPost = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.userUpdateYourPost(req.body, req.user, id),
    }).send(res);
  };
  updatePostView = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.updatePostView(id),
    }).send(res);
  };
  userDeleteYourPost = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.userDeleteYourPost(req.user, id),
    }).send(res);
  };
  deletePost = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      data: await PostService.deletePost(id),
    }).send(res);
  };
}
module.exports = new PostController();
