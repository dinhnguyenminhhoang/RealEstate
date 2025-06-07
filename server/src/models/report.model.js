"use strict";
//
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Report";
const COLLECTION_NAME = "Reports";

const reportSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    phone: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  Report: model(DOCUMENT_NAME, reportSchema),
};
