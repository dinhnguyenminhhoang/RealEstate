"use strict";
//
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Application";
const COLLECTION_NAME = "Applications";

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a name"],
      maxLength: 100,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please provide a phone number"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide a email"],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Please provide a content"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  Application: model(DOCUMENT_NAME, categoriesSchema),
};
