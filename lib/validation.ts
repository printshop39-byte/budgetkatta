// lib/validation.ts — Zod schemas for API request bodies.
import { z } from 'zod';

export const leadSchema = z.object({
  userName: z.string().max(120).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().max(160).optional(),
  city: z.string().max(120).optional(),
  selectedLanguage: z.enum(['mr', 'hi']),
  interestedModule: z.enum(['FD', 'LOAN', 'SIP', 'INSURANCE', 'GENERAL', 'CONTACT']),
  selectedProduct: z.string().max(300).optional(),
  userQuery: z.string().max(2000).optional(),
  sourcePage: z.string().min(1).max(120),
  timestamp: z.string().max(40),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  language: z.enum(['mr', 'hi']).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
