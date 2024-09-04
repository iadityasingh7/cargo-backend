import express from "express";
import { payment, callback, updateWallet } from "../controllers/rechargeControllers.js";

const router = express.Router();
// -----------------------------------> PAYTM PAYMENT ROUTES TO MAKE A NEW PAYMENT <-------------------------------
router.post("/paynow", payment);

router.post("/callback", callback);

// --------------------------------> UPDATE WALLET, WALLET HISTORY, WALLET BALENCE<---------------------------------

router.post("/updateWallet", updateWallet);

export default router;