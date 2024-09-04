import mongoose from "mongoose";
import validator from "validator";

const SellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model("Seller", SellerSchema, "Sellers");

export default Seller;
