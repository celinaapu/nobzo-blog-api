"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid token. User not found.",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
            return;
        }
        if (error.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                message: "Token expired.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Server error during authentication.",
        });
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map