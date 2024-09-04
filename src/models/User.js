import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (num) {
          return /^\d{10}$/.test(num);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    ordersPerMonth: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema, "Users");

export default User;
