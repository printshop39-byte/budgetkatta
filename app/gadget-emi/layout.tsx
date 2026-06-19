import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'गॅजेट व लाइफस्टाईल EMI कॅल्क्युलेटर | Gadget & Lifestyle EMI Calculator',
  description:
    'बाईक, कार, मोबाईल, लॅपटॉप, कॅमेरा आणि गिम्बल/अॅक्सेसरीजसाठी EMI मोजा | Calculate EMI for bikes, cars, mobiles, laptops, cameras and gimbals — with recommended accessories.',
  path: '/gadget-emi',
});

export default function GadgetEMILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
