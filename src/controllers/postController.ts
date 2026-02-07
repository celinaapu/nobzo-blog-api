import { Response, NextFunction } from "express";
import Post from "../models/Post";
import { AuthRequest, ApiResponse, PaginatedResponse, PaginationInfo } from "../types";
import { validationResult } from "../middleware/validation";

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
      return;
    }

    const { title, content, status = "draft", tags } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user!._id,
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
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let query: any = { deletedAt: null };

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
      } else {
        query.status = "published";
      }
    } else {
      query.status = "published";
    }

    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    const response: PaginatedResponse<any> = {
      posts,
      pagination,
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await Post.findOne({
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
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
      return;
    }

    const post = await Post.findOne({
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

    if (post.author.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
      return;
    }

    const { title, content, status, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (status !== undefined) post.status = status;
    if (tags) post.tags = tags;

    await post.save();
    await post.populate("author", "name email");

    res.json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await Post.findOne({
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

    if (post.author.toString() !== req.user!._id.toString()) {
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
  } catch (error) {
    next(error);
  }
};
