import express from "express";
import { getZone } from "../controllers/zoneManagementControllers.js";

const router = express.Router();

router.post('/zone', getZone )

export default router;