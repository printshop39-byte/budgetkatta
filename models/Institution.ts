// models/Institution.ts
// One row per bank/branch record imported from the RBI master list.
// Designed for the bank directory (District → City → Pincode lookups).
import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true, index: true },
    // Public | Private | Co-op | SFB | RRB | Foreign | Other — kept as free string
    // so an unexpected RBI category label never rejects a row.
    category: { type: String, default: 'Other', index: true },
    state: { type: String, default: '' },
    district: { type: String, default: '', index: true },
    city: { type: String, default: '' },
    pincode: { type: String, default: '', index: true },
  },
  { timestamps: true },
);

// Common access pattern: filter by district then pincode/city.
institutionSchema.index({ district: 1, pincode: 1 });

export const Institution =
  mongoose.models.Institution || mongoose.model('Institution', institutionSchema);
