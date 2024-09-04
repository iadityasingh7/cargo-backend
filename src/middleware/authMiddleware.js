import jwt from "jsonwebtoken";
import User from "../models/User.js";

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("AuthMiddleware profile token", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization Failed, Token is not present" });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const userId = decodedToken?.user?.id;

    const userDetails = await User.findById(userId);

    console.log("user", userDetails.isAdmin);

    if (userDetails.isAdmin !== true) {
      return res
        .status(403)
        .json({ message: "You have not a valid Permissions." });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export { authMiddleware, adminMiddleware };
