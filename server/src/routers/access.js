"use strict";
const express = require("express");
const { asynchandler } = require("../helpers/asynchandler");
const accessController = require("../controller/access.controller");
const router = express.Router();
// signUp
router.post("/register", asynchandler(accessController.singUp));

//signIn
router.post("/login", asynchandler(accessController.login));
router.post("/forgot-password", asynchandler(accessController.forgotPassword));

// OTP verification (no auth required - user hasn't logged in yet)
router.post("/verify-otp", asynchandler(accessController.verifyOtp));
router.post("/resend-otp", asynchandler(accessController.resendOtp));

router.post("/reset-password", asynchandler(accessController.resetPassword));

module.exports = router;
