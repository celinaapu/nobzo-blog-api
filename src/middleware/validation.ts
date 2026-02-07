import { checkSchema } from "express-validator/lib/middlewares/schema";
import { validationResult } from "express-validator/lib/validation-result";

export const validateRegister = checkSchema({
  name: {
    trim: true,
    notEmpty: { errorMessage: "Name is required" },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Name must be between 2 and 50 characters",
    },
  },
  email: {
    isEmail: { errorMessage: "Please provide a valid email" },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
    matches: {
      options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/],
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },
});

export const validateLogin = checkSchema({
  email: {
    isEmail: { errorMessage: "Please provide a valid email" },
    normalizeEmail: true,
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
  },
});

export const validateCreatePost = checkSchema({
  title: {
    trim: true,
    notEmpty: { errorMessage: "Title is required" },
    isLength: {
      options: { max: 200 },
      errorMessage: "Title cannot exceed 200 characters",
    },
  },
  content: {
    trim: true,
    notEmpty: { errorMessage: "Content is required" },
  },
  status: {
    optional: true,
    isIn: {
      options: [["draft", "published"]],
      errorMessage: "Status must be either draft or published",
    },
  },
  tags: {
    optional: true,
    isArray: { errorMessage: "Tags must be an array" },
    custom: {
      options: (tags: string[]) => {
        if (tags.length > 10) throw new Error("Cannot have more than 10 tags");
        return true;
      },
    },
  },
  "tags.*": {
    optional: true,
    trim: true,
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters",
    },
  },
});

export const validateUpdatePost = checkSchema({
  title: {
    optional: true,
    trim: true,
    notEmpty: { errorMessage: "Title cannot be empty" },
    isLength: {
      options: { max: 200 },
      errorMessage: "Title cannot exceed 200 characters",
    },
  },
  content: {
    optional: true,
    trim: true,
    notEmpty: { errorMessage: "Content cannot be empty" },
  },
  status: {
    optional: true,
    isIn: {
      options: [["draft", "published"]],
      errorMessage: "Status must be either draft or published",
    },
  },
  tags: {
    optional: true,
    isArray: { errorMessage: "Tags must be an array" },
    custom: {
      options: (tags: string[]) => {
        if (tags && tags.length > 10)
          throw new Error("Cannot have more than 10 tags");
        return true;
      },
    },
  },
  "tags.*": {
    optional: true,
    trim: true,
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters",
    },
  },
});

export { validationResult };
