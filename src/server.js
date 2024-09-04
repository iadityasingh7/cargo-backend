import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./env",
});

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// { limit: "100kb" }

app.use(
  express.urlencoded({
    extended: true,
    // limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(express.json());

connectDB();

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import paymentRoutes from "./routes/walletRoutes.js";
import couriersRoutes from "./routes/couriersRoutes.js";
import courierServicesRoutes from "./routes/courierServicesRoutes.js";
import zoneManagementRoutes from "./routes/zoneManagementRoutes.js";
import rateCardRoutes from "./routes/rateCardRoutes.js";

// admin ratecard middleware to check you have a valid permitions or not

import {
  authMiddleware,
  adminMiddleware,
} from "./middleware/authMiddleware.js";
// Route Declaration

// for authentication login and register
app.use("/api/auth", authRoutes);

// for KYC aadhar varification & pan varifiction
app.use("/api/kyc", kycRoutes);

// for KYC aadhar varification & pan varifiction
app.use("/api/wallet", paymentRoutes);

// ------------------------------>ADMIN ROUTES<------------------------------------

app.use("/admin/api/couriers", couriersRoutes);

app.use("/admin/api/courierServices", courierServicesRoutes);

// ZONE MANAGEMENT

app.use("/api/zone-management", zoneManagementRoutes);

// RATE CARD

app.use("/admin/api/rate-card", authMiddleware, adminMiddleware, rateCardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running in PORT: ${PORT}`));

export default app;
