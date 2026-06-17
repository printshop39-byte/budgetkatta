// models/FDRate.ts
import mongoose from 'mongoose';

const fdRateSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    bankType: { type: String, enum: ['govt', 'private', 'cooperative'] },
    logo: { type: String },
    rates: [
      {
        tenureLabel: String,
        tenureMonths: Number,
        regularRate: Number,
        seniorRate: Number,
      },
    ],
  },
  { timestamps: true }
);

export const FDRate = mongoose.models.FDRate || mongoose.model('FDRate', fdRateSchema);
