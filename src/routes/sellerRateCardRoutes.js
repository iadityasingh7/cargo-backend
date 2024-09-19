import express from "express";
import {
  createSellerRateCard,
  getAllExistingSellerRateCard,
} from "../controllers/sellerRateCardControllers.js";

const router = express.Router();

router.post("/sellerRatecard", createSellerRateCard);
router.post("/sellerRatecards", getAllExistingSellerRateCard);

export default router;
