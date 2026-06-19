// lib/gadgetCategories.ts
// Modular data for the Gadget & Lifestyle EMI section.
//
// Each category bundles its bilingual labels, EMI-calculator defaults/ranges,
// and a list of "Recommended Accessories" affiliate cards. To add a new gadget
// later, append one more entry to GADGET_CATEGORIES — the UI (tabs, calculator,
// accessories) is fully data-driven and needs no further changes.
//
// NOTE: accessory `href`s are placeholders ('#'). Replace them with real
// Amazon / Flipkart affiliate (tag) URLs before going live.

import type { Bi } from '@/types';
import {
  Bike,
  Car,
  Smartphone,
  Laptop,
  Camera,
  Aperture,
  type LucideIcon,
} from 'lucide-react';

export type GadgetCategoryId =
  | 'bike'
  | 'car'
  | 'mobile'
  | 'laptop'
  | 'camera'
  | 'accessories';

export type Retailer = 'amazon' | 'flipkart';

export interface AffiliateAccessory {
  id: string;
  name: Bi;
  desc: Bi;
  /** Display price label, e.g. "₹2,499". Optional. */
  price?: string;
  retailer: Retailer;
  /** Affiliate / referral URL. Placeholder '#' until real links are added. */
  href: string;
}

export interface NumberRange {
  min: number;
  max: number;
  step: number;
}

export interface GadgetCategory {
  id: GadgetCategoryId;
  icon: LucideIcon;
  label: Bi;
  tagline: Bi;
  /** Starting values for the EMI calculator sliders. */
  defaults: {
    price: number;
    downPayment: number;
    rate: number; // annual %
    tenureMonths: number;
  };
  /** Slider bounds tuned per category. `tenure` is in months. */
  ranges: {
    price: NumberRange;
    rate: NumberRange;
    tenure: NumberRange;
  };
  accessories: AffiliateAccessory[];
}

export const RETAILER_LABEL: Record<Retailer, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
};

export const GADGET_CATEGORIES: GadgetCategory[] = [
  // ---------------------------------------------------------------- Bike
  {
    id: 'bike',
    icon: Bike,
    label: { mr: 'बाईक', en: 'Bike' },
    tagline: {
      mr: 'दुचाकीचा मासिक हप्ता आणि एकूण खर्च आधीच जाणून घ्या.',
      en: 'Know your two-wheeler EMI and total cost upfront.',
    },
    defaults: { price: 120000, downPayment: 20000, rate: 9.5, tenureMonths: 24 },
    ranges: {
      price: { min: 40000, max: 500000, step: 5000 },
      rate: { min: 7, max: 20, step: 0.25 },
      tenure: { min: 6, max: 48, step: 3 },
    },
    accessories: [
      {
        id: 'bike-helmet',
        name: { mr: 'ISI हेल्मेट', en: 'ISI-Certified Helmet' },
        desc: {
          mr: 'सुरक्षेसाठी प्रमाणित फुल-फेस हेल्मेट.',
          en: 'Certified full-face helmet for safety.',
        },
        price: '₹1,499',
        retailer: 'amazon',
        href: '#',
      },
      {
        id: 'bike-cover',
        name: { mr: 'वॉटरप्रूफ बाईक कव्हर', en: 'Waterproof Bike Cover' },
        desc: {
          mr: 'पाऊस आणि धुळीपासून संरक्षण.',
          en: 'Protects against rain and dust.',
        },
        price: '₹699',
        retailer: 'flipkart',
        href: '#',
      },
      {
        id: 'bike-mount',
        name: { mr: 'मोबाईल माउंट + USB चार्जर', en: 'Phone Mount + USB Charger' },
        desc: {
          mr: 'नेव्हिगेशनसाठी हँडलबार माउंट.',
          en: 'Handlebar mount for navigation.',
        },
        price: '₹899',
        retailer: 'amazon',
        href: '#',
      },
    ],
  },
  // ---------------------------------------------------------------- Car
  {
    id: 'car',
    icon: Car,
    label: { mr: 'कार', en: 'Car' },
    tagline: {
      mr: 'कारच्या कर्जाचा हप्ता आणि व्याज सहज मोजा.',
      en: 'Estimate your car loan EMI and interest easily.',
    },
    defaults: { price: 800000, downPayment: 150000, rate: 9, tenureMonths: 60 },
    ranges: {
      price: { min: 300000, max: 5000000, step: 25000 },
      rate: { min: 7, max: 18, step: 0.25 },
      tenure: { min: 12, max: 84, step: 6 },
    },
    accessories: [
      {
        id: 'car-dashcam',
        name: { mr: 'डॅश कॅम (फुल HD)', en: 'Dash Cam (Full HD)' },
        desc: {
          mr: 'प्रवासाचे रेकॉर्डिंग आणि सुरक्षा.',
          en: 'Records your drive for safety.',
        },
        price: '₹3,999',
        retailer: 'amazon',
        href: '#',
      },
      {
        id: 'car-seatcover',
        name: { mr: 'सीट कव्हर सेट', en: 'Premium Seat Cover Set' },
        desc: {
          mr: 'आरामदायी आणि टिकाऊ सीट कव्हर.',
          en: 'Comfortable, durable seat covers.',
        },
        price: '₹2,499',
        retailer: 'flipkart',
        href: '#',
      },
      {
        id: 'car-charger',
        name: { mr: 'फास्ट कार चार्जर', en: 'Fast Car Charger' },
        desc: {
          mr: 'ड्युअल USB-C जलद चार्जिंग.',
          en: 'Dual USB-C fast charging.',
        },
        price: '₹799',
        retailer: 'amazon',
        href: '#',
      },
    ],
  },
  // ---------------------------------------------------------------- Mobile
  {
    id: 'mobile',
    icon: Smartphone,
    label: { mr: 'मोबाईल', en: 'Mobile' },
    tagline: {
      mr: 'नवीन स्मार्टफोनसाठी नो-कॉस्ट / EMI चे गणित पाहा.',
      en: 'Check EMI maths for your next smartphone.',
    },
    defaults: { price: 45000, downPayment: 5000, rate: 14, tenureMonths: 9 },
    ranges: {
      price: { min: 8000, max: 200000, step: 1000 },
      rate: { min: 0, max: 24, step: 0.5 },
      tenure: { min: 3, max: 24, step: 3 },
    },
    accessories: [
      {
        id: 'mobile-case',
        name: { mr: 'प्रोटेक्टिव्ह केस + ग्लास', en: 'Protective Case + Tempered Glass' },
        desc: {
          mr: 'स्क्रीन आणि बॉडीचे संरक्षण.',
          en: 'Protects screen and body.',
        },
        price: '₹599',
        retailer: 'flipkart',
        href: '#',
      },
      {
        id: 'mobile-buds',
        name: { mr: 'वायरलेस इअरबड्स', en: 'Wireless Earbuds' },
        desc: {
          mr: 'लो-लेटन्सी ब्लूटूथ इअरबड्स.',
          en: 'Low-latency Bluetooth earbuds.',
        },
        price: '₹1,999',
        retailer: 'amazon',
        href: '#',
      },
      {
        id: 'mobile-powerbank',
        name: { mr: '20000mAh पॉवर बँक', en: '20000mAh Power Bank' },
        desc: {
          mr: 'फास्ट चार्जिंग पॉवर बँक.',
          en: 'Fast-charging power bank.',
        },
        price: '₹1,799',
        retailer: 'amazon',
        href: '#',
      },
    ],
  },
  // ---------------------------------------------------------------- Laptop
  {
    id: 'laptop',
    icon: Laptop,
    label: { mr: 'लॅपटॉप', en: 'Laptop' },
    tagline: {
      mr: 'कामासाठी किंवा अभ्यासासाठी लॅपटॉप EMI वर घ्या.',
      en: 'Plan your laptop purchase on EMI for work or study.',
    },
    defaults: { price: 65000, downPayment: 10000, rate: 13, tenureMonths: 12 },
    ranges: {
      price: { min: 20000, max: 300000, step: 2500 },
      rate: { min: 0, max: 24, step: 0.5 },
      tenure: { min: 3, max: 36, step: 3 },
    },
    accessories: [
      {
        id: 'laptop-bag',
        name: { mr: 'लॅपटॉप बॅकपॅक', en: 'Laptop Backpack' },
        desc: {
          mr: 'पॅडेड, वॉटर-रेझिस्टंट बॅग.',
          en: 'Padded, water-resistant bag.',
        },
        price: '₹1,299',
        retailer: 'flipkart',
        href: '#',
      },
      {
        id: 'laptop-mouse',
        name: { mr: 'वायरलेस माउस + कीबोर्ड', en: 'Wireless Mouse + Keyboard' },
        desc: {
          mr: 'एर्गोनॉमिक कॉम्बो सेट.',
          en: 'Ergonomic combo set.',
        },
        price: '₹1,499',
        retailer: 'amazon',
        href: '#',
      },
      {
        id: 'laptop-stand',
        name: { mr: 'अॅल्युमिनियम लॅपटॉप स्टँड', en: 'Aluminium Laptop Stand' },
        desc: {
          mr: 'चांगल्या पोश्चरसाठी अॅडजस्टेबल स्टँड.',
          en: 'Adjustable stand for better posture.',
        },
        price: '₹999',
        retailer: 'amazon',
        href: '#',
      },
    ],
  },
  // ---------------------------------------------------------------- Camera
  {
    id: 'camera',
    icon: Camera,
    label: { mr: 'कॅमेरा', en: 'Camera' },
    tagline: {
      mr: 'DSLR / मिररलेस कॅमेरा हप्त्यांत घेण्याचे नियोजन करा.',
      en: 'Plan a DSLR / mirrorless camera purchase on EMI.',
    },
    defaults: { price: 75000, downPayment: 15000, rate: 13, tenureMonths: 12 },
    ranges: {
      price: { min: 20000, max: 500000, step: 2500 },
      rate: { min: 0, max: 24, step: 0.5 },
      tenure: { min: 3, max: 36, step: 3 },
    },
    accessories: [
      {
        id: 'camera-tripod',
        name: { mr: 'ट्रायपॉड स्टँड', en: 'Tripod Stand' },
        desc: {
          mr: 'स्थिर शॉट्ससाठी मजबूत ट्रायपॉड.',
          en: 'Sturdy tripod for stable shots.',
        },
        price: '₹2,199',
        retailer: 'amazon',
        href: '#',
      },
      {
        id: 'camera-sdcard',
        name: { mr: '128GB हाय-स्पीड SD कार्ड', en: '128GB High-Speed SD Card' },
        desc: {
          mr: '4K रेकॉर्डिंगसाठी जलद कार्ड.',
          en: 'Fast card for 4K recording.',
        },
        price: '₹1,599',
        retailer: 'flipkart',
        href: '#',
      },
      {
        id: 'camera-bag',
        name: { mr: 'कॅमेरा बॅग', en: 'Camera Bag' },
        desc: {
          mr: 'लेन्स आणि बॉडीसाठी संरक्षक बॅग.',
          en: 'Protective bag for lens and body.',
        },
        price: '₹1,899',
        retailer: 'amazon',
        href: '#',
      },
    ],
  },
  // ------------------------------------------------------ Gimbal / Accessories
  {
    id: 'accessories',
    icon: Aperture,
    label: { mr: 'गिम्बल / अॅक्सेसरीज', en: 'Gimbal / Accessories' },
    tagline: {
      mr: 'गिम्बल, माईक आणि कंटेंट-क्रिएशन गिअरसाठी EMI मोजा.',
      en: 'Calculate EMI for gimbals, mics and creator gear.',
    },
    defaults: { price: 20000, downPayment: 2000, rate: 14, tenureMonths: 6 },
    ranges: {
      price: { min: 3000, max: 150000, step: 1000 },
      rate: { min: 0, max: 24, step: 0.5 },
      tenure: { min: 3, max: 24, step: 3 },
    },
    accessories: [
      {
        id: 'acc-gimbal',
        name: { mr: '3-अॅक्सिस गिम्बल', en: '3-Axis Gimbal Stabilizer' },
        desc: {
          mr: 'स्मूथ व्हिडिओसाठी स्टॅबिलायझर.',
          en: 'Stabilizer for smooth video.',
        },
        price: '₹8,999',
        retailer: 'amazon',
        href: '#',
      },
      {
        id: 'acc-mic',
        name: { mr: 'वायरलेस लॅव्हलियर माईक', en: 'Wireless Lavalier Mic' },
        desc: {
          mr: 'स्पष्ट आवाजासाठी क्लिप-ऑन माईक.',
          en: 'Clip-on mic for clear audio.',
        },
        price: '₹2,499',
        retailer: 'flipkart',
        href: '#',
      },
      {
        id: 'acc-light',
        name: { mr: 'LED रिंग लाईट', en: 'LED Ring Light' },
        desc: {
          mr: 'व्हिडिओ शूटसाठी अॅडजस्टेबल लाईट.',
          en: 'Adjustable light for video shoots.',
        },
        price: '₹1,499',
        retailer: 'amazon',
        href: '#',
      },
    ],
  },
];

/** Lookup helper used by the section UI. */
export function getGadgetCategory(id: GadgetCategoryId): GadgetCategory {
  return GADGET_CATEGORIES.find((c) => c.id === id) ?? GADGET_CATEGORIES[0];
}
