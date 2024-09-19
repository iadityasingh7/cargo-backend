import { createReadStream } from "fs";
import mongoose from "mongoose";
import { type } from "os";
import validator from "validator";

// Seller Rate Card Schema or Model

const weightSchema = new mongoose.Schema(
  {
    weight: {
      type: String,
      required: true,
    },
    zoneA: {
      type: Number,
      required: true,
    },
    zoneB: {
      type: Number,
      required: true,
    },
    zoneC: {
      type: Number,
      required: true,
    },
    zoneD: {
      type: Number,
      required: true,
    },
    zoneE: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const sellerRateCardSchema = new mongoose.Schema(
  {
    courierProviderId: {
      type: String,
      required: true,
    },
    courierProvider: {
      type: String,
      required: true,
    },
    courierServiceId: {
      type: String,
      required: true,
    },
    weightPriceBasic: [weightSchema],
    weightPriceAdditional: [weightSchema],
    codPercent: {
      type: Number,
      required: true,
    },
    codCharge: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  txnId: {
    type: String,
    required: true,
  },
  txnAmount: {
    type: String,
    required: true,
  },
  txnType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

// User Schema or Model

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
    sellerRateCards: [sellerRateCardSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema, "Users");

export default User;
