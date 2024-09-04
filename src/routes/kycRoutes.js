import express from "express";
import {
  verifyAadhaar,
  aadhaarVarifictionOtp,
  verifyPan,
  verifyBank,
  verifyGst,
} from "../controllers/kycControllers.js";

const router = express.Router();

router.post("/aadhaar", verifyAadhaar);
router.post("/aadhaarVarificationOtp", aadhaarVarifictionOtp);
router.post("/pan", verifyPan);
router.post("/bank", verifyBank);
router.post("/gst", verifyGst);

export default router;
