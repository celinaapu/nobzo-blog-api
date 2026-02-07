import { Router } from "express";
import auth from "../middleware/auth";
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} from "../controllers/postController";
import {
  validateCreatePost,
  validateUpdatePost,
} from "../middleware/validation";

const router = Router();

router.post("/", auth, validateCreatePost, createPost);
router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.put("/:id", auth, validateUpdatePost, updatePost);
router.delete("/:id", auth, deletePost);

export default router;
