"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const validation_1 = require("../middleware/validation");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const register = async (req, res, next) => {
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
        const { name, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }
        const user = new User_1.default({ name, email, password });
        await user.save();
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
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
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const token = generateToken(user._id.toString());
        res.json({
            success: true,
            message: "Login successful",
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map