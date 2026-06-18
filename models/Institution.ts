// models/Institution.ts
// One row per bank/branch/banking-channel record imported from the official
// banking export CSVs. Backs the bank directory (District → City → Pincode).
import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true }, // Bank Name
    branch: { type: String, default: '' }, // Banking Channel Name
    address: { type: String, default: '' }, // Full address string
    city: { type: String, default: '' },
    district: { type: String, default: '', index: true },
    state: { type: String, default: '' },
    pincode: { type: String, default: '', index: true },
    // Verified export data → authorized by default.
    isRbiAuthorized: { type: Boolean, default: true },
    // Useful extras present in the export (optional).
    bankGroup: { type: String, default: '' },
    ifsc: { type: String, default: '' },
  },
  { timestamps: true },
);

// Common access patterns: filter by district then city (branch lookup) or pincode.
institutionSchema.index({ district: 1, city: 1 });
institutionSchema.index({ district: 1, pincode: 1 });
// The directory's branch query is district + city + category (bankGroup/name);
// this compound index covers the paginated category lookup.
institutionSchema.index({ district: 1, city: 1, bankGroup: 1 });

export const Institution =
  mongoose.models.Institution || mongoose.model('Institution', institutionSchema);
