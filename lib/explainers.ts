// lib/explainers.ts — localized 3-step explainer content for AnimatedExplainerCard.
import type { Bi } from '@/types';

export interface Explainer {
  id: string;
  icon: string;
  title: Bi;
  steps: Bi[];
}

export const explainers: Explainer[] = [
  {
    id: 'loan',
    icon: 'bank',
    title: { mr: 'कर्ज प्रक्रिया कशी चालते?', en: 'How does the loan process work?' },
    steps: [
      { mr: 'माहिती भरा', en: 'Fill in your details' },
      { mr: 'कागदपत्रे तयार ठेवा', en: 'Keep documents ready' },
      { mr: 'बँकेकडून तपासणी', en: 'Verification by the bank' },
    ],
  },
  {
    id: 'fd',
    icon: 'money',
    title: { mr: 'FD मध्ये पैसे कसे वाढतात?', en: 'How does money grow in an FD?' },
    steps: [
      { mr: 'रक्कम जमा करा', en: 'Deposit the amount' },
      { mr: 'निश्चित दराने व्याज मिळते', en: 'Earn interest at a fixed rate' },
      { mr: 'मुदतीनंतर वाढीव रक्कम', en: 'Get the matured amount at the end of tenure' },
    ],
  },
  {
    id: 'sip',
    icon: 'sip',
    title: { mr: 'SIP मध्ये गुंतवणूक कशी वाढते?', en: 'How does an SIP investment grow?' },
    steps: [
      { mr: 'रक्कम निवडा', en: 'Choose your amount' },
      { mr: 'कालावधी निवडा', en: 'Choose your tenure' },
      { mr: 'अंदाजित वाढ पाहा', en: 'See the estimated growth' },
    ],
  },
  {
    id: 'insurance',
    icon: 'insurance',
    title: { mr: 'विमा कव्हर कसे निवडावे?', en: 'How to choose insurance cover?' },
    steps: [
      { mr: 'कव्हर निवडा', en: 'Choose your cover' },
      { mr: 'आरोग्य माहिती द्या', en: 'Share your health details' },
      { mr: 'premium estimate पाहा', en: 'View the premium estimate' },
    ],
  },
];
