// lib/repository.ts
// Single data-access layer for product reads. Strategy for every getter:
//   1. If MONGODB_URI is missing            → return demo data.
//   2. If MongoDB is reachable AND non-empty → return DB data (mapped to types).
//   3. If MongoDB is empty OR errors         → fall back to demo data.
// This keeps the site fully functional with or without a database, and makes
// the "seed then it goes live" transition automatic.

import { connectDB, isMongoConfigured } from '@/lib/mongodb';
import { FDRate as FDRateModel } from '@/models/FDRate';
import { LoanProduct as LoanModel } from '@/models/LoanProduct';
import { SIPFund as SIPModel } from '@/models/SIPFund';
import { Insurance as InsuranceModel } from '@/models/Insurance';
import { fdRates, loanProducts, sipFunds, insurancePlans } from '@/lib/data';
import type { FDRate, LoanProduct, SIPFund, InsurancePlan } from '@/types';

export interface SourcedResult<T> {
  data: T[];
  source: 'mongodb' | 'demo';
}

// Generic helper: run a DB query, fall back to demo data on empty/error.
async function withFallback<T>(
  demo: T[],
  query: () => Promise<T[]>
): Promise<SourcedResult<T>> {
  if (!isMongoConfigured()) return { data: demo, source: 'demo' };
  try {
    await connectDB();
    const rows = await query();
    if (!rows || rows.length === 0) return { data: demo, source: 'demo' };
    return { data: rows, source: 'mongodb' };
  } catch (err) {
    console.error('[BudgetKatta] DB read failed, using demo data:', err);
    return { data: demo, source: 'demo' };
  }
}

const id = (doc: { _id: unknown }) => String(doc._id);

export function getFDRates(): Promise<SourcedResult<FDRate>> {
  return withFallback<FDRate>(fdRates, async () => {
    const docs = await FDRateModel.find().lean();
    return docs.map((d: any) => ({
      id: id(d),
      bankName: d.bankName,
      bankType: d.bankType,
      logo: d.logo,
      rates: (d.rates ?? []).map((r: any) => ({
        tenureLabel: r.tenureLabel,
        tenureMonths: r.tenureMonths,
        regularRate: r.regularRate,
        seniorRate: r.seniorRate,
      })),
    }));
  });
}

export function getLoanProducts(): Promise<SourcedResult<LoanProduct>> {
  return withFallback<LoanProduct>(loanProducts, async () => {
    const docs = await LoanModel.find().lean();
    return docs.map((d: any) => ({
      id: id(d),
      bankName: d.bankName,
      loanType: d.loanType,
      roiMin: d.roiMin,
      roiMax: d.roiMax,
      processingFee: d.processingFee,
      maxTenureMonths: d.maxTenureMonths,
      collateralRequired: d.collateralRequired,
      maxAmount: d.maxAmount,
      features: d.features ?? [],
    }));
  });
}

export function getSIPFunds(): Promise<SourcedResult<SIPFund>> {
  return withFallback<SIPFund>(sipFunds, async () => {
    const docs = await SIPModel.find().lean();
    return docs.map((d: any) => ({
      id: id(d),
      fundName: d.fundName,
      category: d.category,
      return3y: d.return3y,
      return5y: d.return5y,
      risk: d.risk,
    }));
  });
}

export function getInsurancePlans(): Promise<SourcedResult<InsurancePlan>> {
  return withFallback<InsurancePlan>(insurancePlans, async () => {
    const docs = await InsuranceModel.find().lean();
    return docs.map((d: any) => ({
      id: id(d),
      company: d.company,
      planName: d.planName,
      insuranceType: d.insuranceType,
      annualPremium: d.annualPremium,
      features: d.features ?? [],
    }));
  });
}
