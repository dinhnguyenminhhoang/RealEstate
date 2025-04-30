"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const { adminAuthentication } = require("../auth/authUtils");
const categoryController = require("../controller/category.controller");
const router = express.Router();

router.post("/category", asynchandler(categoryController.createNewCategory));

router.put("/category/:id", asynchandler(categoryController.updateCategory));

router.get("/category", asynchandler(categoryController.getAllCategories));

router.delete("/category/:id", asynchandler(categoryController.deleteCategory));

module.exports = router;
