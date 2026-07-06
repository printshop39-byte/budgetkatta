// models/FinancialProfile.ts — the data foundation for the Health Score and all
// personalization (Sprint 1 · EPIC 2). One per user. ALL money is stored as
// integer paise (never floats) to avoid drift — format at the edge with lib/format.
import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema(
  {
    type: { type: String }, // home | personal | vehicle | education | gold | business | credit_card
    principalPaise: { type: Number, default: 0 },
    emiPaise: { type: Number, default: 0 },
    ratePct: { type: Number },
    tenureMonths: { type: Number },
    ccLimitPaise: { type: Number }, // for credit-card utilization
  },
  { _id: false }
);

const financialProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    age: { type: Number },
    employmentType: {
      type: String,
      enum: ['salaried', 'self_employed', 'business', 'student', 'retired'],
    },
    dependents: { type: Number },
    monthlyIncomePaise: { type: Number },
    monthlyExpensesPaise: { type: Number },
    savings: {
      bankPaise: { type: Number, default: 0 },
      fdPaise: { type: Number, default: 0 },
      rdPaise: { type: Number, default: 0 },
      otherPaise: { type: Number, default: 0 },
    },
    investments: {
      sipMonthlyPaise: { type: Number, default: 0 },
      mfCorpusPaise: { type: Number, default: 0 },
      epfPaise: { type: Number, default: 0 },
      stocksPaise: { type: Number, default: 0 },
      otherPaise: { type: Number, default: 0 },
    },
    debts: { type: [debtSchema], default: [] },
    insurance: {
      lifeCoverPaise: { type: Number, default: 0 },
      healthCoverPaise: { type: Number, default: 0 },
      hasTermLife: { type: Boolean, default: false },
    },
    creditScoreSelfReported: { type: Number }, // 300–900, optional
    completionPct: { type: Number, default: 0 }, // derived, cached
    dataAsOf: { type: Date, default: Date.now }, // staleness → time-decay of confidence
    version: { type: Number, default: 1 }, // bumped each edit (audit trail)
  },
  { timestamps: true }
);

export const FinancialProfile =
  mongoose.models.FinancialProfile || mongoose.model('FinancialProfile', financialProfileSchema);
