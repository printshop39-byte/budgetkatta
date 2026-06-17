// models/Lead.ts
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    userName: { type: String },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    selectedLanguage: { type: String, enum: ['mr', 'hi'], required: true },
    interestedModule: { type: String, enum: ['FD', 'LOAN', 'SIP', 'INSURANCE', 'GENERAL', 'CONTACT'] },
    selectedProduct: { type: String },
    userQuery: { type: String },
    sourcePage: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
  },
  { timestamps: true }
);

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
