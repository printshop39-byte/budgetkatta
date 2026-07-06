// lib/authI18n.ts — bilingual strings for the auth surfaces. Kept local to the
// auth context (and unit-tested) rather than editing the large shared i18n file.
import type { Language } from '@/types';

const strings = {
  mr: {
    title: 'साइन इन करा',
    subtitle: 'तुमचं आर्थिक आरोग्य ट्रॅक करण्यासाठी सुरक्षितपणे साइन इन करा.',
    google: 'Google ने पुढे जा',
    or: 'किंवा',
    phone_label: 'मोबाइल नंबर',
    phone_placeholder: '१० अंकी मोबाइल नंबर',
    send_otp: 'OTP पाठवा',
    otp_label: 'OTP टाका',
    otp_placeholder: '६ अंकी OTP',
    verify: 'पडताळणी करा',
    change_number: 'नंबर बदला',
    resend: 'पुन्हा पाठवा',
    sending: 'पाठवत आहे…',
    verifying: 'पडताळत आहे…',
    err_phone: 'कृपया वैध १० अंकी मोबाइल नंबर टाका.',
    err_otp: 'चुकीचा किंवा कालबाह्य OTP. पुन्हा प्रयत्न करा.',
    err_generic: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
    err_rate: 'खूप जास्त प्रयत्न. थोड्या वेळाने पुन्हा करा.',
    dev_hint: 'डेव्ह मोड OTP:',
    account_title: 'माझं खातं',
    signed_in_as: 'साइन इन:',
    role: 'भूमिका',
    sign_out: 'साइन आउट',
    loading: 'लोड होत आहे…',
    privacy_note: 'आम्ही कधीही OTP, पासवर्ड किंवा कागदपत्रे मागत नाही.',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Sign in securely to track your financial health.',
    google: 'Continue with Google',
    or: 'or',
    phone_label: 'Mobile number',
    phone_placeholder: '10-digit mobile number',
    send_otp: 'Send OTP',
    otp_label: 'Enter OTP',
    otp_placeholder: '6-digit OTP',
    verify: 'Verify',
    change_number: 'Change number',
    resend: 'Resend',
    sending: 'Sending…',
    verifying: 'Verifying…',
    err_phone: 'Please enter a valid 10-digit mobile number.',
    err_otp: 'Incorrect or expired OTP. Please try again.',
    err_generic: 'Something went wrong. Please try again.',
    err_rate: 'Too many attempts. Please try again later.',
    dev_hint: 'Dev-mode OTP:',
    account_title: 'My account',
    signed_in_as: 'Signed in as',
    role: 'Role',
    sign_out: 'Sign out',
    loading: 'Loading…',
    privacy_note: 'We never ask for your OTP, password, or documents.',
  },
};

export type AuthStrings = (typeof strings)['en'];

export function getAuthStrings(language: Language): AuthStrings {
  return strings[language] ?? strings.mr;
}
