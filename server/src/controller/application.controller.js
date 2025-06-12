"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ApplicationService = require("../services/application.service");

class ApplicationController {
  createNewApplication = async (req, res, next) => {
    new CREATED({
      message: "Application submitted successfully",
      data: await ApplicationService.createNewApplication(req.body, req.user),
    }).send(res);
  };

  getAllApplications = async (req, res, next) => {
    new SuccessResponse({
      data: await ApplicationService.getAllApplications(req.query),
    }).send(res);
  };

  getApplicationsByPost = async (req, res, next) => {
    const { postId } = req.params;
    new SuccessResponse({
      data: await ApplicationService.getApplicationsByPost(postId, req.query),
    }).send(res);
  };

  getApplicationById = async (req, res, next) => {
    const { applicationId } = req.params;
    new SuccessResponse({
      data: await ApplicationService.getApplicationById(applicationId),
    }).send(res);
  };

  deleteApplication = async (req, res, next) => {
    const { applicationId } = req.params;
    new SuccessResponse({
      message: "Application deleted successfully",
      data: await ApplicationService.deleteApplication(applicationId),
    }).send(res);
  };

  getApplicationsByAuthor = async (req, res, next) => {
    new SuccessResponse({
      data: await ApplicationService.getApplicationsByAuthor(
        req.user.userId,
        req.query
      ),
    }).send(res);
  };
}

module.exports = new ApplicationController();
