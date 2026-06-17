// models/SIPFund.ts
import mongoose from 'mongoose';

const sipFundSchema = new mongoose.Schema(
  {
    fundName: { type: String, required: true },
    category: { type: String },
    return3y: Number,
    return5y: Number,
    risk: { type: String, enum: ['low', 'medium', 'high'] },
  },
  { timestamps: true }
);

export const SIPFund = mongoose.models.SIPFund || mongoose.model('SIPFund', sipFundSchema);
