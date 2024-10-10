import mongoose from "mongoose";

const KycSchema = new mongoose.Schema({
  aadharDetails: {
    name: { type: String },
    dob: { type: String },
    yearOfBirth: { type: String },
    street: { type: String },
    dist: { type: String },
    state: { type: String },
    country: { type: String },
    status: { type: String },
  },
  panDetails: {
    valid: { type: String },
    pan: { type: String },
    registered_name: { type: String },
    type: { type: String },
    last_updated_at: { type: String },
  },
  bankDetails: {
    name_at_bank: { type: String },
    bank_name: { type: String },
    branch: { type: String },
    city: { type: String },
    account_status: { type: String },
  },
});

export default KycSchema;
