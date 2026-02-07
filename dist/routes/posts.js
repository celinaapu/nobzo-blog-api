"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const postController_1 = require("../controllers/postController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post("/", auth_1.default, validation_1.validateCreatePost, postController_1.createPost);
router.get("/", postController_1.getPosts);
router.get("/:slug", postController_1.getPostBySlug);
router.put("/:id", auth_1.default, validation_1.validateUpdatePost, postController_1.updatePost);
router.delete("/:id", auth_1.default, postController_1.deletePost);
exports.default = router;
//# sourceMappingURL=posts.js.map