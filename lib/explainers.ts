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
    icon: '🏦',
    title: { mr: 'कर्ज प्रक्रिया कशी चालते?', hi: 'लोन प्रक्रिया कैसे चलती है?' },
    steps: [
      { mr: 'माहिती भरा', hi: 'जानकारी भरें' },
      { mr: 'कागदपत्रे तयार ठेवा', hi: 'दस्तावेज़ तैयार रखें' },
      { mr: 'बँकेकडून तपासणी', hi: 'बैंक से जांच' },
    ],
  },
  {
    id: 'fd',
    icon: '💰',
    title: { mr: 'FD मध्ये पैसे कसे वाढतात?', hi: 'FD में पैसे कैसे बढ़ते हैं?' },
    steps: [
      { mr: 'रक्कम जमा करा', hi: 'राशि जमा करें' },
      { mr: 'निश्चित दराने व्याज मिळते', hi: 'निश्चित दर पर ब्याज मिलता है' },
      { mr: 'मुदतीनंतर वाढीव रक्कम', hi: 'अवधि के बाद बढ़ी राशि' },
    ],
  },
  {
    id: 'sip',
    icon: '📈',
    title: { mr: 'SIP मध्ये गुंतवणूक कशी वाढते?', hi: 'SIP में निवेश कैसे बढ़ता है?' },
    steps: [
      { mr: 'रक्कम निवडा', hi: 'राशि चुनें' },
      { mr: 'कालावधी निवडा', hi: 'अवधि चुनें' },
      { mr: 'अंदाजित वाढ पाहा', hi: 'अनुमानित वृद्धि देखें' },
    ],
  },
  {
    id: 'insurance',
    icon: '🛡️',
    title: { mr: 'विमा कव्हर कसे निवडावे?', hi: 'बीमा कवर कैसे चुनें?' },
    steps: [
      { mr: 'कव्हर निवडा', hi: 'कवर चुनें' },
      { mr: 'आरोग्य माहिती द्या', hi: 'स्वास्थ्य जानकारी दें' },
      { mr: 'premium estimate पाहा', hi: 'premium estimate देखें' },
    ],
  },
];
