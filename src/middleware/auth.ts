import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "../types";

const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
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

export default auth;
