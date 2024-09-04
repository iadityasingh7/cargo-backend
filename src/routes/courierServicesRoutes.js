import express from "express";
import { getAllActiveCourierServices, getCourierServicesFromDatabase } from "../controllers/courierServicesControllers.js";

const router = express.Router();

router.post("/getAllActiveCourierServices", getAllActiveCourierServices);
router.post("/getCourierServicesFromDatabase", getCourierServicesFromDatabase);

export default router;
