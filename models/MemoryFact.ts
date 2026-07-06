// models/MemoryFact.ts — AI Financial Memory (Sprint 1 · EPIC 3). The moat (M1):
// the CFO never forgets. Structured, queryable facts about the user's money life,
// written server-side and read as compact grounded context into every AI surface.
// In Sprint 1 only the 'profile'/'derived' writers exist; chat/document writers
// arrive in the Engagement phase (per frozen PRD).
import mongoose from 'mongoose';

const MEMORY_FACT_TYPES = [
  'income',
  'expense',
  'emi',
  'loan',
  'goal',
  'risk_profile',
  'insurance',
  'investment',
  'preference',
  'decision',
  'life_event',
  'doc_summary',
];

const memoryFactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: MEMORY_FACT_TYPES, required: true },
    key: { type: String, required: true }, // e.g. 'monthly_income'
    value: { type: mongoose.Schema.Types.Mixed }, // number(paise) | string | enum
    unit: { type: String }, // e.g. 'paise', 'months', 'pct'
    source: { type: String, enum: ['profile', 'chat', 'document', 'action', 'derived'], required: true },
    confidence: { type: Number, default: 1, min: 0, max: 1 }, // decays with age
    asOf: { type: Date, default: Date.now }, // staleness → re-confirm hook
    status: { type: String, enum: ['active', 'superseded', 'deleted'], default: 'active' },
  },
  { timestamps: true }
);

// A user has at most one active fact per (type, key); new writes supersede old.
memoryFactSchema.index({ userId: 1, type: 1, key: 1, status: 1 });
memoryFactSchema.index({ userId: 1, asOf: -1 });

export const MEMORY_FACT_TYPES_LIST = MEMORY_FACT_TYPES;
export const MemoryFact = mongoose.models.MemoryFact || mongoose.model('MemoryFact', memoryFactSchema);
