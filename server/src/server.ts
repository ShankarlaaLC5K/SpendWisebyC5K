import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);
const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SpendWise API is running"
  });
});
const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();
