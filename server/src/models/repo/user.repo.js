"use strict";

const { User } = require("../user.model");

const findByEmail = async ({
  email,
  seclect = {
    email: 1,
    password: 1,
    status: 1,
    roles: 1,
    userName: 1,
    phone: 1,
    verification: 1,
    verificationCode: 1,
    verificationCodeExpiry: 1,
    resetPasswordCode: 1,
    resetPasswordCodeExpiry: 1,
  },
}) => {
  return await User.findOne({ email: email }).select(seclect).lean();
};
const findByEmailAndActive = async ({
  email,
  seclect = {
    email: 1,
    password: 1,
    status: 1,
    roles: 1,
    userName: 1,
    phone: 1,
  },
}) => {
  return await User.findOne({ email: email, status: "active" })
    .select(seclect)
    .lean();
};
module.exports = { findByEmail };
