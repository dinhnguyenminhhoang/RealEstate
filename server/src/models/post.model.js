"use strict";
//
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a name for this post."],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [200, "Name is too large"],
    },
    description: {
      type: String,
    },
    overview: {
      type: String,
    },
    type: {
      type: String,
      enum: ["RENT", "SELL"],
      default: "RENT",
    },
    images: [
      {
        filename: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: [0, "Post price can't be negative"],
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      require: true,
    },
    acreage: {
      type: Number,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["in-stock", "out-of-stock"],
      },
      default: "in-stock",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verification: {
      type: Boolean,
      default: false,
    },
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    isDelete: {
      type: String,
      enum: ["active", "inActive"],
      default: "active",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);
module.exports = {
  Post: model(DOCUMENT_NAME, postSchema),
};
