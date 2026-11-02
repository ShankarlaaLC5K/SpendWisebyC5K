import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*"
}));

app.use(express.json());

let isConnected = false;

app.use(async (_req, _res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SpendWise API is running"
  });
});

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;