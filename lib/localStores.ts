// lib/localStores.ts
// Local data for the "Local Finance & Store Locator" section.
//
// Each store records its name, product category, the in-store finance/EMI
// providers it offers (Bajaj Finserv, Airtel Finance, HDFC, …), and its
// location (area + city). The locator page filters this list by City/Area and
// Finance Provider, and links to each store via a pre-filled WhatsApp message.
//
// Fully data-driven: add a store by appending to LOCAL_STORES; the city and
// provider filter options are derived from the data, so no UI changes needed.
//
// NOTE: phone numbers below are placeholder samples in E.164 (country code +
// number, no "+") form for wa.me links. Replace with real store numbers before
// going live.

import type { Bi } from '@/types';
import {
  Smartphone,
  Bike,
  Camera,
  Laptop,
  Car,
  Headphones,
  type LucideIcon,
} from 'lucide-react';

export type StoreCategory =
  | 'mobile'
  | 'bike'
  | 'camera'
  | 'laptop'
  | 'car'
  | 'accessories';

/** Known in-store finance / EMI providers used for the filter dropdown. */
export type FinanceProvider =
  | 'Bajaj Finserv'
  | 'Airtel Finance'
  | 'HDFC Bank'
  | 'ICICI Bank'
  | 'IDFC First Bank'
  | 'TVS Credit'
  | 'HDB Financial'
  | 'Home Credit';

export interface LocalStore {
  id: string;
  name: string;
  category: StoreCategory;
  /** In-store EMI / finance options available at this shop. */
  financeProviders: FinanceProvider[];
  /** Locality / area within the city. */
  area: string;
  city: string;
  address: string;
  /** wa.me number in E.164 form (country code + number, no "+"). */
  whatsapp: string;
}

export const CATEGORY_META: Record<StoreCategory, { label: Bi; icon: LucideIcon }> = {
  mobile: { label: { mr: 'मोबाईल', en: 'Mobile' }, icon: Smartphone },
  bike: { label: { mr: 'बाईक', en: 'Bike' }, icon: Bike },
  camera: { label: { mr: 'कॅमेरा', en: 'Camera' }, icon: Camera },
  laptop: { label: { mr: 'लॅपटॉप', en: 'Laptop' }, icon: Laptop },
  car: { label: { mr: 'कार', en: 'Car' }, icon: Car },
  accessories: { label: { mr: 'अॅक्सेसरीज', en: 'Accessories' }, icon: Headphones },
};

export const LOCAL_STORES: LocalStore[] = [
  {
    id: 'pune-mobile-1',
    name: 'Shree Mobile World',
    category: 'mobile',
    financeProviders: ['Bajaj Finserv', 'Airtel Finance', 'HDFC Bank'],
    area: 'FC Road',
    city: 'Pune',
    address: 'Shop 12, FC Road, Shivajinagar, Pune 411005',
    whatsapp: '919812345670',
  },
  {
    id: 'pune-bike-1',
    name: 'Maharashtra Motors',
    category: 'bike',
    financeProviders: ['TVS Credit', 'Bajaj Finserv', 'IDFC First Bank'],
    area: 'Kothrud',
    city: 'Pune',
    address: 'Paud Road, Kothrud, Pune 411038',
    whatsapp: '919812345671',
  },
  {
    id: 'pune-laptop-1',
    name: 'TechZone Computers',
    category: 'laptop',
    financeProviders: ['Bajaj Finserv', 'HDB Financial', 'ICICI Bank'],
    area: 'Deccan',
    city: 'Pune',
    address: 'JM Road, Deccan Gymkhana, Pune 411004',
    whatsapp: '919812345672',
  },
  {
    id: 'mumbai-mobile-1',
    name: 'Gadget Galaxy',
    category: 'mobile',
    financeProviders: ['Airtel Finance', 'Home Credit', 'Bajaj Finserv'],
    area: 'Andheri West',
    city: 'Mumbai',
    address: 'SV Road, Andheri West, Mumbai 400058',
    whatsapp: '919812345673',
  },
  {
    id: 'mumbai-camera-1',
    name: 'PixelPro Camera Store',
    category: 'camera',
    financeProviders: ['HDFC Bank', 'Bajaj Finserv'],
    area: 'Dadar',
    city: 'Mumbai',
    address: 'Ranade Road, Dadar West, Mumbai 400028',
    whatsapp: '919812345674',
  },
  {
    id: 'mumbai-car-1',
    name: 'Coastal Auto Hub',
    category: 'car',
    financeProviders: ['HDFC Bank', 'ICICI Bank', 'IDFC First Bank'],
    area: 'Borivali',
    city: 'Mumbai',
    address: 'Western Express Highway, Borivali East, Mumbai 400066',
    whatsapp: '919812345675',
  },
  {
    id: 'nagpur-mobile-1',
    name: 'Orange City Mobiles',
    category: 'mobile',
    financeProviders: ['Bajaj Finserv', 'Airtel Finance'],
    area: 'Sitabuldi',
    city: 'Nagpur',
    address: 'Main Road, Sitabuldi, Nagpur 440012',
    whatsapp: '919812345676',
  },
  {
    id: 'nagpur-bike-1',
    name: 'Vidarbha Wheels',
    category: 'bike',
    financeProviders: ['TVS Credit', 'HDB Financial'],
    area: 'Dharampeth',
    city: 'Nagpur',
    address: 'West High Court Road, Dharampeth, Nagpur 440010',
    whatsapp: '919812345677',
  },
  {
    id: 'nashik-laptop-1',
    name: 'Grape City Electronics',
    category: 'laptop',
    financeProviders: ['Bajaj Finserv', 'ICICI Bank', 'Home Credit'],
    area: 'College Road',
    city: 'Nashik',
    address: 'College Road, Nashik 422005',
    whatsapp: '919812345678',
  },
  {
    id: 'nashik-accessories-1',
    name: 'SoundWave Accessories',
    category: 'accessories',
    financeProviders: ['Airtel Finance', 'Bajaj Finserv'],
    area: 'Gangapur Road',
    city: 'Nashik',
    address: 'Gangapur Road, Nashik 422013',
    whatsapp: '919812345679',
  },
  {
    id: 'aurangabad-mobile-1',
    name: 'Deogiri Mobile Center',
    category: 'mobile',
    financeProviders: ['Bajaj Finserv', 'Home Credit', 'HDFC Bank'],
    area: 'Nirala Bazar',
    city: 'Chhatrapati Sambhajinagar',
    address: 'Nirala Bazar, Chhatrapati Sambhajinagar 431001',
    whatsapp: '919812345680',
  },
  {
    id: 'kolhapur-bike-1',
    name: 'Rankala Auto Point',
    category: 'bike',
    financeProviders: ['TVS Credit', 'Bajaj Finserv', 'IDFC First Bank'],
    area: 'Rajarampuri',
    city: 'Kolhapur',
    address: 'Rajarampuri Main Road, Kolhapur 416008',
    whatsapp: '919812345681',
  },
  {
    id: 'pune-camera-1',
    name: 'FrameWorks Camera House',
    category: 'camera',
    financeProviders: ['Bajaj Finserv', 'HDB Financial'],
    area: 'Camp',
    city: 'Pune',
    address: 'MG Road, Camp, Pune 411001',
    whatsapp: '919812345682',
  },
  {
    id: 'mumbai-laptop-1',
    name: 'MetroByte Systems',
    category: 'laptop',
    financeProviders: ['HDFC Bank', 'Bajaj Finserv', 'ICICI Bank'],
    area: 'Lamington Road',
    city: 'Mumbai',
    address: 'Lamington Road, Grant Road, Mumbai 400007',
    whatsapp: '919812345683',
  },
];

/** Sorted, de-duplicated city list for the City/Area filter dropdown. */
export function getStoreCities(): string[] {
  return Array.from(new Set(LOCAL_STORES.map((s) => s.city))).sort((a, b) =>
    a.localeCompare(b)
  );
}

/** Sorted, de-duplicated finance-provider list for the provider filter. */
export function getFinanceProviders(): FinanceProvider[] {
  return Array.from(
    new Set(LOCAL_STORES.flatMap((s) => s.financeProviders))
  ).sort((a, b) => a.localeCompare(b)) as FinanceProvider[];
}
