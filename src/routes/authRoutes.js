import express from "express";
import { check } from "express-validator";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAuthenticatedUser,
  googleLogin,
  gitHubLogin,
} from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register Route

router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("companyName", "Company name is required").not().isEmpty(),
    check("phoneNumber", "Phone number is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength(),
    check("ordersPerMonth", "Numbers of orders per month is required").isInt(),
  ],
  registerUser
);

// login Route

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

// logout route

router.post("/logout", logoutUser);

// profile route

router.get("/profile", authMiddleware, getAuthenticatedUser);

// signInWithGoogle route
// We check both cases like Login and Register by using this google-login route

router.post("/google-login", googleLogin);

// signInWithGitHub route
// We check both cases like Login and Register by using this github-login route

router.post("/github-login", gitHubLogin);

export default router;
