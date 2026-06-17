// models/Insurance.ts
import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    planName: { type: String, required: true },
    insuranceType: { type: String, enum: ['health', 'life', 'vehicle'] },
    annualPremium: Number,
    features: [String],
  },
  { timestamps: true }
);

export const Insurance =
  mongoose.models.Insurance || mongoose.model('Insurance', insuranceSchema);
