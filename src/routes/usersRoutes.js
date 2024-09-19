import express from "express";
import { getAllExistingUsers } from "../controllers/usersControllers.js";

const router = express.Router();

router.post("/getAllExistingUsers", getAllExistingUsers);

export default router;