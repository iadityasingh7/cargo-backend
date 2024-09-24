import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// firebase admin for google login
import admin from "../../firebaseAdmin.js";
//env
const jwtSecret = process.env.JWT_SECRET;

// Register Endpoint

const registerUser = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const {
    firstName,
    lastName,
    companyName,
    phoneNumber,
    email,
    password,
    ordersPerMonth,
  } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
      password,
      ordersPerMonth,
    });

    const saltRange = 10;
    const salt = await bcrypt.genSalt(saltRange);
    user.password = await bcrypt.hash(password, salt);

    await user
      .save()
      .then(() => {
        // console.log("User register successfully");
        res
          .status(200)
          .json({ message: "User register successfully", data: user });
      })
      .catch((error) => {
        // console.log("Something Went Wrong While Ragister a User", error);
        res.status(500).json({ message: "Internal Server Error", error });
      });

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.CORS_TYPE === "production",
          sameSite: "None",
        })
        .status(200)
        .json({ message: "User registered successfully" });
    });
  } catch (error) {
    // console.log("Something When Wrong - Register User", error);
    res
      .status(500)
      .json({ message: "Something Went Wrong While Registring the User!!" });
  }
};

// Login Endpoint

const loginUser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials Please Enter Valid Email and Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Please Enter valid Password " });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.CORS_TYPE === "production",
          sameSite: "None",
          // secure: false, for development only and Now I make it an dynamic
        })
        .status(200)
        .json({ user: user, token: token, message: "Login Successfully" });
    });
  } catch (error) {
    res.status(500).send("Something Went Wrong while Login User!!");
  }
};

// Logout Endpoint

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.CORS_TYPE === "production",
      sameSite: "None",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong logout failed Please try again",
      error,
    });
  }
};

// Check User is Authorize or not If authorize automatic redirecte to the dashboard page

const getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Server error");
  }
};

// Google Login/Register Endpoint
// We handle both case Login and Register by using firebase authentication by using Google

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId: uid,
        email,
        name,
        picture,
      });

      await user.save();
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.CORS_TYPE === "production",
        sameSite: "None",
      })
      .status(200)
      .json({
        user,
        token,
        message: "Google Login Successfull",
      });
  } catch (error) {
    res.status(500).json({ message: "Google Login Failed" });
  }
};

const gitHubLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId: uid,
        email,
        name,
        picture,
      });

      await user.save();
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.CORS_TYPE === "production",
        sameSite: "None",
      })
      .status(200)
      .json({
        user,
        token,
        message: "GitHub Login Successfull",
      });
  } catch (error) {
    res.status(500).json({ message: "GitHub Login Failed" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getAuthenticatedUser,
  googleLogin,
  gitHubLogin,
};
