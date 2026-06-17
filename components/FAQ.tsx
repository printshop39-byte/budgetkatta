"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown as AccordionIcon } from "lucide-react";

const faqs = [
  {
    q: "म्युच्युअल फंडमधील SIP खरोखरच सुरक्षित आहे का?",
    a: "म्युच्युअल फंडमध्ये बाजारातील चढ-उतारांची जोखीम असते, पण दीर्घकाळात (५ ते १० वर्षे किंवा अधिक) सरासरी १२% ते १५% पर्यंत चांगला परतावा मिळतो. बँक एफडीच्या तुलनेत महागाईवर मात करण्यासाठी SIP हा एक उत्तम मार्ग मानला जातो.",
  },
  {
    q: "५०/३०/२० नियम म्हणजे काय आणि तो कसा वापरावा?",
    a: "हा एक सोपा बजेट नियम आहे. यामध्ये तुमच्या मासिक उत्पन्नाचे ३ भाग केले जातात: ५०% अत्यावश्यक गरजा (Needs), ३०% वैयक्तिक इच्छा (Wants) आणि २०% बचत व गुंतवणूक (Savings). हा नियम पाळल्यास तुमचे आर्थिक नियोजन आपोआप शिस्तबद्ध होते.",
  },
  {
    q: "टर्म इन्शुरन्स का आवश्यक आहे? पारंपारिक विम्यापेक्षा तो कसा वेगळा आहे?",
    a: "टर्म इन्शुरन्स हा खऱ्या अर्थाने शुद्ध विमा आहे. यामध्ये खूपच कमी प्रीमियममध्ये मोठा विमा सुरक्षितता (उदा. ५० लाख किंवा १ कोटी) मिळते. जर विमाधारकाचा मृत्यू झाला तर संपूर्ण रक्कम कुटुंबाला मिळते. पारंपारिक विम्यात विमा आणि गुंतवणूक एकत्र केल्यामुळे परतावा खूपच कमी (५-६%) मिळतो आणि विमा कव्हरही अपुरे असते.",
  },
  {
    q: "आणीबाणीचा निधी (Emergency Fund) किती असावा आणि तो कुठे ठेवावा?",
    a: "तुमच्या एकूण मासिक खर्चाच्या किमान ६ पट रक्कम आणीबाणीचा निधी म्हणून सुरक्षित असावी. हा निधी अशा ठिकाणी असावा जिथून तो कधीही काढता येईल, जसे की बँकेचे बचत खाते किंवा लिक्विड म्युच्युअल फंड.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800">
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">प्रश्नोत्तरे</span>
        <h2 className="text-3xl font-extrabold text-slate-100 mt-4 tracking-normal leading-[1.4]">वारंवार विचारले जाणारे प्रश्न (FAQs)</h2>
      </div>

      {/* Accordion Cards */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-sm md:text-base font-bold text-slate-200 pr-4">{faq.q}</span>
              <motion.span
                animate={{ rotate: openFaq === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 bg-slate-800 rounded-lg text-amber-300 flex-shrink-0"
              >
                <AccordionIcon className="h-4.5 w-4.5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800 font-medium">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
