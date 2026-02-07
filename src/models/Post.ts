import mongoose, { Schema, Query } from "mongoose";
import { IPost } from "../types";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.pre("validate", function (this: IPost) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

postSchema.pre(/^find/, function (this: Query<any, IPost>) {
  this.where({ deletedAt: null });
});

postSchema.methods.softDelete = async function (this: IPost): Promise<IPost> {
  this.deletedAt = new Date();
  return this.save();
};

export default mongoose.model<IPost>("Post", postSchema);
