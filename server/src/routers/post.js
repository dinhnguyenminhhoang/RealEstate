"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication, authentication } = require("../auth/authUtils");
const postController = require("../controller/post.controller");
const router = express.Router();

router.post(
  "/user-post",
  authentication,
  asynchandler(postController.userCreateNewPost)
);
router.get(
  "/user-post",
  authentication,
  asynchandler(postController.getAllPostByUser)
);
router.get(
  "/user-post/:id",
  authentication,
  asynchandler(postController.userGetYourPost)
);
router.put(
  "/user-post/:id",
  authentication,
  asynchandler(postController.userUpdateYourPost)
);
router.delete(
  "/user-post/:id",
  authentication,
  asynchandler(postController.userDeleteYourPost)
);
router.get("/post", postController.getAllPost);
router.put("/post/:id/view", postController.updatePostView);
router.get("/post/:id", postController.getPostDetail);
router.get("/post-outstanding", postController.getPostOutstanding);
router.put(
  "/confirm-post/:id",
  adminAuthentication,
  asynchandler(postController.confirmPost)
);
router.put(
  "/unPublish-post/:id",
  adminAuthentication,
  asynchandler(postController.unPublishPost)
);
router.delete(
  "/post/:id",
  adminAuthentication,
  asynchandler(postController.deletePost)
);
module.exports = router;
