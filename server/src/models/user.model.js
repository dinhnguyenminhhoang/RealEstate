"use strict";
//
const { model, Schema, default: mongoose } = require("mongoose");
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: String,
    taxCode: String,
    status: {
      type: String,
      enum: ["active", "inActive"],
      default: "active",
    },
    verification: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String],
      enum: ["ADMIN", "PARTNER", "USER"],
      default: ["USER"],
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    invoiceInformation: {
      invoiceName: String,
      invoiceEmail: String,
      companyName: String,
      companyTaxCode: String,
      address: String,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  User: model(DOCUMENT_NAME, userSchema),
};
