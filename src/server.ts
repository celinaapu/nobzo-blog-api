import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB, { getConnectionStatus } from "./config/database";
import errorHandler from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";

dotenv.config();

const app: Application = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  const dbStatus = getConnectionStatus();
  
  res.json({
    success: true,
    message: "Blog API is running",
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.state,
      host: dbStatus.host,
      name: dbStatus.name,
      connected: dbStatus.readyState === 1
    }
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
