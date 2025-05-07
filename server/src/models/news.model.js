"use strict";
//
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "News";
const COLLECTION_NAME = "Newss";

const newsSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    thumb: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
    },
    title: {
      type: String,
      trim: true,
    },
    isDelete: {
      type: String,
      enum: ["active", "inActive"],
      default: "active",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = {
  News: model(DOCUMENT_NAME, newsSchema),
};
