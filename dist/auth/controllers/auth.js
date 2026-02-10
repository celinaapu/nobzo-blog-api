"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const repository_1 = __importDefault(require("../repository"));
const express_validator_1 = __importDefault(require("express-validator"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const authRepository = new repository_1.default();
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await authRepository.findUserByIdentifier(email);
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }
        const user = await authRepository.createUser({ name, email, password });
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: { id: user._id, name: user.name, email: user.email },
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
        const errors = (0, express_validator_1.default)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
            return;
        }
        const { email, password } = req.body;
        const user = await authRepository.findUserByIdentifier(email);
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
                user: { id: user._id, name: user.name, email: user.email },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.js.map