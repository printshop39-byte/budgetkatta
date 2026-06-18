// models/BankRate.ts
// Canonical "bank rate" model: bank name + per-tenure interest rates for both
// regular and senior-citizen customers. This is the same schema and collection
// as models/FDRate.ts — re-exported here under the BankRate name so there is a
// single source of truth (the existing repository, /api/fd and the FD/Rates
// pages all already read it). The rates write-path (POST /api/rates) upserts
// into this model.
export { FDRate as BankRate } from '@/models/FDRate';
