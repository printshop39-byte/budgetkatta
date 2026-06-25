// Testimonials shown in the social-proof section on the home page.
//
// ⚠️ IMPORTANT — these are SAMPLE / PLACEHOLDER entries to establish the layout.
// Before relying on them as social proof, REPLACE them with genuine, consented
// user feedback (real name/initials + city, with the person's permission).
// Publishing fabricated reviews is misleading and breaches advertising norms
// (e.g. ASCI). Keep quotes about the *experience* (clarity, language, ease) and
// avoid unverifiable claims like specific amounts saved or returns earned.
//
// To swap in real ones: edit the array below (or wire it to a CMS / form later).

type Bi = { mr: string; en: string };

export interface Testimonial {
  id: string;
  /** Real name or initials of a consenting user. Samples use first-name + city. */
  name: string;
  location: Bi;
  role: Bi;
  quote: Bi;
  /** Whether this is placeholder content (renders a small "sample" tag). */
  sample?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Snehal P.',
    location: { mr: 'पुणे', en: 'Pune' },
    role: { mr: 'शिक्षिका', en: 'Teacher' },
    quote: {
      mr: 'EMI आणि व्याज मराठीत समजावून सांगितल्यामुळे कर्ज घेण्यापूर्वी मला सगळं स्पष्ट कळलं.',
      en: 'Having EMI and interest explained in Marathi helped me understand everything clearly before taking a loan.',
    },
    sample: true,
  },
  {
    id: 't2',
    name: 'Rohan K.',
    location: { mr: 'नाशिक', en: 'Nashik' },
    role: { mr: 'लहान व्यावसायिक', en: 'Small business owner' },
    quote: {
      mr: 'SIP कॅल्क्युलेटर आणि आर्थिक आरोग्य चाचणीमुळे गुंतवणुकीची सुरुवात कुठून करायची ते कळलं.',
      en: 'The SIP calculator and health quiz showed me exactly where to begin investing.',
    },
    sample: true,
  },
  {
    id: 't3',
    name: 'Asmita D.',
    location: { mr: 'छत्रपती संभाजीनगर', en: 'Chh. Sambhajinagar' },
    role: { mr: 'गृहिणी', en: 'Homemaker' },
    quote: {
      mr: 'जवळची बँक आणि IFSC शोधणं खूप सोपं झालं — सगळी माहिती एकाच ठिकाणी मिळते.',
      en: 'Finding a nearby bank and IFSC became so easy — everything is in one place.',
    },
    sample: true,
  },
];
