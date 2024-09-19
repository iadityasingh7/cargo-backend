import User from "../models/User.js";

const getAllExistingUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .json({ message: "Users fetch from Database", users: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Somthing Went Wrong to get users from the database. please try again after some time. Server side error",
      error: error,
    });
  }
};

export { getAllExistingUsers };
