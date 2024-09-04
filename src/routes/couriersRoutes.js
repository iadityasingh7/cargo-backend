import express from "express";
import {
  shiprocket,
  getAllExistingCouriers,
} from "../controllers/couriersControllers.js";

const router = express.Router();

// Authentication
router.post("/shiprocket", shiprocket);

// Get all the couriers from database
router.get("/getAllExistingCouriers", getAllExistingCouriers);

export default router;
