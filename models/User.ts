// models/User.ts — member identity (Sprint 1 · EPIC 1/2/3 substrate).
// Auth is Google + Phone OTP: a user may have a phone, an email/googleId, or
// both (linked). Each identity field is unique but SPARSE so Google-only or
// phone-only accounts don't collide on a missing value.
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, sparse: true },
    phoneVerifiedAt: { type: Date },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    displayName: { type: String },
    image: { type: String }, // avatar URL (e.g. from Google)
    locale: { type: String, enum: ['mr', 'en'], default: 'mr' },
    district: { type: String }, // for regional intelligence (M2)
    roles: { type: [String], default: ['member'] }, // 'member' | 'admin'
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
    lastActiveAt: { type: Date, default: Date.now }, // powers WAMa / retention
    streak: {
      count: { type: Number, default: 0 },
      lastCheckInAt: { type: Date },
    },
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
    householdRole: { type: String, enum: ['owner', 'adult', 'managed_minor'] },
  },
  { timestamps: true }
);

userSchema.index({ lastActiveAt: -1 });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
