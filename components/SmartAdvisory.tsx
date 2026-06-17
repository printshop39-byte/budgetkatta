"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, HelpCircle as QuestionIcon, RefreshCw, ArrowRight, Sparkles } from "lucide-react";

export default function SmartAdvisory() {
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSmartQuery = (e: FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setChatLoading(true);
    setChatResponse(null);

    setTimeout(() => {
      const query = userQuery.toLowerCase();
      let response = "";

      if (query.includes("गुंतवणूक") || query.includes("investment") || query.includes("कुठे")) {
        response = "तुमच्यासाठी सल्ला: जर तुम्ही नवशिक्या असाल, तर दरमहा कमीत कमी ५०० रुपयांपासून म्युच्युअल फंडमध्ये SIP (शिस्तबद्ध गुंतवणूक) सुरू करा. यामुळे तुम्हाला चक्रवाढ व्याजाचा फायदा मिळेल आणि जोखीमही कमी राहील. दीर्घकालीन उद्दिष्टांसाठी (उदा. १०+ वर्षे) लार्ज-कॅप किंवा इंडेक्स फंड उत्तम पर्याय आहेत.";
      } else if (query.includes("कर्ज") || query.includes("loan") || query.includes("emi")) {
        response = "तुमच्यासाठी सल्ला: कर्ज घेताना नेहमी लक्षात ठेवा की तुमचा एकूण ईएमआय (EMI) तुमच्या मासिक उत्पन्नाच्या ३५% पेक्षा जास्त नसावा. गृहकर्जासाठी शक्यतो जास्त डाऊनपेमेंट करा आणि वेळेपूर्वी कर्ज फेडण्यासाठी दरवर्षी ५-१०% अतिरिक्त हप्ता देण्याचा प्रयत्न करा.";
      } else if (query.includes("विमा") || query.includes("insurance")) {
        response = "तुमच्यासाठी सल्ला: आपल्या कुटुंबाच्या सुरक्षेसाठी दोन विमा असणे अत्यंत आवश्यक आहे. १) टर्म विमा (तुमच्या वार्षिक उत्पन्नाच्या किमान १५ पट कव्हर असणारा), २) आरोग्य विमा (किमान ५ ते १० लाख रुपयांचा फॅमिली फ्लोटर). कोणत्याही इन्व्हेस्टमेंट कम इन्शुरन्स (उदा. पारंपरिक मनीबॅक पॉलिसी) मध्ये गुंतवणे टाळा.";
      } else if (query.includes("बचत") || query.includes("saving") || query.includes("खर्च")) {
        response = "तुमच्यासाठी सल्ला: बजेट बनवण्यासाठी '५०/३०/२०' चा सुवर्ण नियम वापरा. उत्पन्नातील ५०% भाग तुमच्या गरजांवर (भाडे, अन्न, बिले), ३०% भाग तुमच्या इच्छांवर (फिरणे, हॉटेलिंग) आणि किमान २०% भाग भविष्यातील बचतीसाठी व गुंतवणुकीसाठी बाजूला काढा. दरमहा खर्चाची नोंद ठेवल्यास वायफळ खर्च कमी होण्यास मदत होते.";
      } else {
        response = "तुमच्या प्रश्नाचे विश्लेषण: बजेटकट्टाच्या मते, सुदृढ आर्थिक आरोग्यासाठी प्रथम १ लाख रुपयांचा आणीबाणीचा निधी (Emergency Fund) तयार करा, त्यानंतर स्वतःचा टर्म व आरोग्य विमा घ्या, आणि शेवटी म्युच्युअल फंड किंवा एफडीमध्ये नियमित गुंतवणूक सुरू करा. कोणत्याही मदतीसाठी आमचे कॅल्क्युलेटर वापरून पाहा!";
      }

      setChatResponse(response);
      setChatLoading(false);
    }, 900);
  };

  return (
    <section id="budget-section" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Information */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 uppercase tracking-widest">
            स्मार्ट सल्लागार
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            तुमच्या प्रश्नांचे निरसन, एका क्षणात!
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            गुंतवणूक, कर्ज, विमा किंवा बजेट संदर्भात तुमच्या मनात काही शंका आहे का? खाली तुमच्या शब्दांत प्रश्न विचारा आणि आमचा डिजिटल आर्थिक सल्लागार तुम्हाला सर्वोत्तम मार्गदर्शन करेल.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-slate-800">झटपट शिफारसी</span>
                <p className="text-xs text-slate-500">कोणतीही क्लिष्ट आकडेमोड न करता सोपे आणि व्यावहारिक उपाय.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-slate-800">पूर्णपणे सुरक्षित व खाजगी</span>
                <p className="text-xs text-slate-500">तुमची माहिती १००% सुरक्षित ठेवली जाते आणि कोणाशीही शेअर केली जात नाही.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Query Box */}
        <div className="lg:col-span-6">
          <div className="bg-white/75 backdrop-blur-xl border border-white/60 p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                <QuestionIcon className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">तुमचा प्रश्न इथे विचारा:</h3>
            </div>

            <form onSubmit={handleSmartQuery} className="space-y-4">
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="उदा. 'मी दरमहा ३००० रुपयांची बचत कुठे करावी?' किंवा 'माझे उत्पन्न ५०,००० आहे, कर्ज किती घ्यावे?'"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold">मराठी किंवा इंग्लिश भाषेत लिहा</span>
                <button
                  type="submit"
                  disabled={chatLoading || !userQuery.trim()}
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-all shadow-sm flex items-center space-x-1.5"
                >
                  {chatLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>शोधात आहे...</span>
                    </>
                  ) : (
                    <>
                      <span>सल्ला मिळवा</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Chat Response Display */}
            <AnimatePresence mode="wait">
              {chatResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-teal-50/60 border border-teal-100 p-5 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="p-1 bg-teal-100 rounded-lg text-teal-700">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-bold text-teal-800">बजेटकट्टा सल्लागाराचे उत्तर:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{chatResponse}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
