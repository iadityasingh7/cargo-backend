import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
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
});

const rateCardSchema = new mongoose.Schema({
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
  
});

const RateCard = mongoose.model("RateCard", rateCardSchema, "RateCards");

export default RateCard;
