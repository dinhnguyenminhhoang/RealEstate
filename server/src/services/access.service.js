"use strict";

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const process = require("process");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const {
  badRequestError,
  AuthFailureError,
  NotFoundError,
} = require("../core/error.response");
const { User } = require("../models/user.model");
const { findByEmail } = require("../models/repo/user.repo");
const { getInfoData } = require("../utils");
const sendEmail = require("../helpers/sendEmail");
const {
  resetPasswordForm,
  confirmAccountForm,
} = require("../utils/emailExtension");
const RolesUser = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

class AccessService {
  static singUp = async ({
    userName,
    email,
    phone,
    password,
    address,
    taxCode,
  }) => {
    const hodelUser = await User.findOne({ email }).lean();
    if (hodelUser) {
      throw new badRequestError("error user already rigisted");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const otpCode = generateOtpCode();
    const otpCodeHash = await bcrypt.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      userName,
      email,
      phone,
      password: passwordHash,
      roles: [RolesUser.USER],
      address,
      taxCode,
      status: "active",
      verificationCode: otpCodeHash,
      verificationCodeExpiry: otpExpiry,
    });

    // Send OTP code via email
    const confirmAccountFormContent = confirmAccountForm(otpCode);
    await sendEmail(
      user.email,
      confirmAccountFormContent.title,
      confirmAccountFormContent.body,
    );

    return {
      data: {
        email: user.email,
      },
    };
  };
  static login = async ({ email, password }) => {
    const foundUser = await findByEmail({
      email,
    });
    if (!foundUser) {
      throw new NotFoundError("user not registered");
    }
    if (foundUser.status !== "active")
      throw new badRequestError("Tài khoản bị khóa");

    const { _id: userId, userName, roles, phone } = foundUser;
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication Error");
    const key = crypto.randomBytes(64).toString(`hex`);
    const tokens = await createTokenPair(
      {
        userId: userId,
        email: email,
        userName,
        phone,
        role: roles,
      },
      key,
    );
    await KeyTokenService.createKeyToken({
      userId: userId,
      key,
    });

    return {
      user: getInfoData({
        fill: ["_id", "userName", "email", "phone"],
        object: foundUser,
      }),
      tokens,
    };
  };
  static forgotPassword = async (payload) => {
    const { email } = payload;
    if (!email) throw new badRequestError("Vui lòng nhập email");

    const user = await findByEmail({ email });
    if (!user?._id) throw new NotFoundError("Not found User");

    const otpCode = generateOtpCode();
    const otpCodeHash = await bcrypt.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetPasswordCode: otpCodeHash,
      resetPasswordCodeExpiry: otpExpiry,
    });

    const resetPasswordFormContent = resetPasswordForm(otpCode);
    await sendEmail(
      user.email,
      resetPasswordFormContent.title,
      resetPasswordFormContent.body,
    );

    return {
      email: user.email,
    };
  };
  static resetPassword = async (payload) => {
    const { email, code, password } = payload;
    if (!email || !code || !password) {
      throw new badRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    const userExiting = await findByEmail({ email });
    if (!userExiting?._id) throw new NotFoundError("Not found User");

    if (!userExiting.resetPasswordCode || !userExiting.resetPasswordCodeExpiry) {
      throw new badRequestError(
        "Không có mã đặt lại mật khẩu. Vui lòng yêu cầu gửi lại mã",
      );
    }

    if (new Date() > new Date(userExiting.resetPasswordCodeExpiry)) {
      throw new badRequestError(
        "Mã đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu gửi lại mã",
      );
    }

    const isMatch = await bcrypt.compare(code, userExiting.resetPasswordCode);
    if (!isMatch) {
      throw new badRequestError("Mã đặt lại mật khẩu không đúng");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userUpdated = await User.findByIdAndUpdate(userExiting._id, {
      password: passwordHash,
      resetPasswordCode: null,
      resetPasswordCodeExpiry: null,
    });
    if (!userUpdated) throw new badRequestError("reset password faild");

    return "OK";
  };
  static verifyOtp = async ({ email, code }) => {
    const user = await findByEmail({ email });
    if (!user) throw new NotFoundError("Không tìm thấy người dùng");

    if (user.verification) {
      throw new badRequestError("Tài khoản đã được xác thực");
    }

    if (!user.verificationCode || !user.verificationCodeExpiry) {
      throw new badRequestError(
        "Không có mã xác thực. Vui lòng yêu cầu gửi lại mã",
      );
    }

    // Check expiry
    if (new Date() > new Date(user.verificationCodeExpiry)) {
      throw new badRequestError(
        "Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã",
      );
    }

    // Compare OTP code
    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) {
      throw new badRequestError("Mã xác thực không đúng");
    }

    // Update user verification status
    await User.findByIdAndUpdate(user._id, {
      verification: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    });

    return "OK";
  };
  static resendOtp = async ({ email }) => {
    const user = await findByEmail({ email });
    if (!user) throw new NotFoundError("Không tìm thấy người dùng");

    if (user.verification) {
      throw new badRequestError("Tài khoản đã được xác thực");
    }

    // Generate new OTP code
    const otpCode = generateOtpCode();
    const otpCodeHash = await bcrypt.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, {
      verificationCode: otpCodeHash,
      verificationCodeExpiry: otpExpiry,
    });

    // Send OTP code via email
    const confirmAccountFormContent = confirmAccountForm(otpCode);
    await sendEmail(
      user.email,
      confirmAccountFormContent.title,
      confirmAccountFormContent.body,
    );

    return "OK";
  };
  static Logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
}
module.exports = AccessService;
