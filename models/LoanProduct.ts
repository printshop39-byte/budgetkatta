// models/LoanProduct.ts
import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    loanType: { type: String, enum: ['home', 'personal', 'vehicle', 'business', 'education'] },
    roiMin: Number,
    roiMax: Number,
    processingFee: String,
    maxTenureMonths: Number,
    collateralRequired: Boolean,
    maxAmount: Number,
    features: [String],
  },
  { timestamps: true }
);

export const LoanProduct =
  mongoose.models.LoanProduct || mongoose.model('LoanProduct', loanSchema);
