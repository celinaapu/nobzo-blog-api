"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostBySlug = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const validation_1 = require("../middleware/validation");
const createPost = async (req, res, next) => {
    try {
        const errors = (0, validation_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
            return;
        }
        const { title, content, status = "draft", tags } = req.body;
        const post = new Post_1.default({
            title,
            content,
            author: req.user._id,
            status,
            tags: tags || [],
        });
        await post.save();
        await post.populate("author", "name email");
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let query = { deletedAt: null };
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: "i" } },
                { content: { $regex: req.query.search, $options: "i" } },
            ];
        }
        if (req.query.tag) {
            query.tags = { $in: [req.query.tag] };
        }
        if (req.query.author) {
            query.author = req.query.author;
        }
        if (req.user) {
            if (req.query.status) {
                query.status = req.query.status;
                if (req.query.status === "draft") {
                    query.author = req.user._id;
                }
            }
            else {
                query.status = "published";
            }
        }
        else {
            query.status = "published";
        }
        const posts = await Post_1.default.find(query)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Post_1.default.countDocuments(query);
        const pagination = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        };
        const response = {
            posts,
            pagination,
        };
        res.json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPosts = getPosts;
const getPostBySlug = async (req, res, next) => {
    try {
        const post = await Post_1.default.findOne({
            slug: req.params.slug,
            status: "published",
            deletedAt: null,
        }).populate("author", "name email");
        if (!post) {
            res.status(404).json({
                success: false,
                message: "Post not found",
            });
            return;
        }
        res.json({
            success: true,
            data: post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostBySlug = getPostBySlug;
const updatePost = async (req, res, next) => {
    try {
        const errors = (0, validation_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
            return;
        }
        const post = await Post_1.default.findOne({
            _id: req.params.id,
            deletedAt: null,
        });
        if (!post) {
            res.status(404).json({
                success: false,
                message: "Post not found",
            });
            return;
        }
        if (post.author.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: "Not authorized to update this post",
            });
            return;
        }
        const { title, content, status, tags } = req.body;
        if (title)
            post.title = title;
        if (content)
            post.content = content;
        if (status !== undefined)
            post.status = status;
        if (tags)
            post.tags = tags;
        await post.save();
        await post.populate("author", "name email");
        res.json({
            success: true,
            message: "Post updated successfully",
            data: post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res, next) => {
    try {
        const post = await Post_1.default.findOne({
            _id: req.params.id,
            deletedAt: null,
        });
        if (!post) {
            res.status(404).json({
                success: false,
                message: "Post not found",
            });
            return;
        }
        if (post.author.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: "Not authorized to delete this post",
            });
            return;
        }
        await post.softDelete();
        res.json({
            success: true,
            message: "Post deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map