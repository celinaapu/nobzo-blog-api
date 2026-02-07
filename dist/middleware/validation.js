"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationResult = exports.validateUpdatePost = exports.validateCreatePost = exports.validateLogin = exports.validateRegister = void 0;
const schema_1 = require("express-validator/lib/middlewares/schema");
const validation_result_1 = require("express-validator/lib/validation-result");
Object.defineProperty(exports, "validationResult", { enumerable: true, get: function () { return validation_result_1.validationResult; } });
exports.validateRegister = (0, schema_1.checkSchema)({
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
            errorMessage: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
    },
});
exports.validateLogin = (0, schema_1.checkSchema)({
    email: {
        isEmail: { errorMessage: "Please provide a valid email" },
        normalizeEmail: true,
    },
    password: {
        notEmpty: { errorMessage: "Password is required" },
    },
});
exports.validateCreatePost = (0, schema_1.checkSchema)({
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
            options: (tags) => {
                if (tags.length > 10)
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
exports.validateUpdatePost = (0, schema_1.checkSchema)({
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
            options: (tags) => {
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
//# sourceMappingURL=validation.js.map