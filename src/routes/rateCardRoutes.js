import express from "express";
import {createRateCard, updateRateCard, deleteRateCard, getAllExistingRateCard} from "../controllers/adminRateCardControllers.js";


const router = express.Router();

router.post("/ratecard", createRateCard);
router.put("/ratecard/:id", updateRateCard);
router.delete("/ratecard/:id", deleteRateCard);
router.get("/ratecards", getAllExistingRateCard);

export default router;