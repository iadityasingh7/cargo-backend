import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./env",
});

const app = express();

app.use(
  cors({
    origin: "https://shipex-cargo-me.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

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
import sellerRateCardRoutes from "./routes/sellerRateCardRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

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

// ADMIN RATE CARD

app.use(
  "/admin/api/rate-card",
  authMiddleware,
  adminMiddleware,
  rateCardRoutes
);

// SELLER RATE CARD

app.use(
  "/api/admin/seller-ratecard",
  authMiddleware,
  adminMiddleware,
  sellerRateCardRoutes
);

// get all user to admin side to make a new rate card for a perticuller user

app.use("/api/admin/users", authMiddleware, adminMiddleware, usersRoutes);

app.options("*", cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running in PORT: ${PORT}`));

export default app;
