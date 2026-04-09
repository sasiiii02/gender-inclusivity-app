import React, { useState } from "react";

const faqs = [
  {
    question: "How do I report an incident of bias?",
    answer: "You can report any incidents using the 'Report' button on your dashboard. All reports are kept strictly confidential and will be reviewed by our specialized support team."
  },
  {
    question: "How do I access counseling services?",
    answer: "We offer 24/7 access to mental health professionals. Click on the 'Connect with a Counselor' button below to schedule an anonymous text or video session."
  },
  {
    question: "Can I change my preferred name and pronouns?",
    answer: "Absolutely. Go to your Profile settings from the top right menu, then select 'Identity Preferences'. Updates will reflect immediately across the platform."
  },
  {
    question: "I'm having trouble accessing my quiz.",
    answer: "Ensure you are using the correct magic link provided by your instructor. If you still face issues, try clearing your browser cache or reach out to technical support."
  }
];

const StudentSupport = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm ring-8 ring-rose-50">
          🛟
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
          How can we help you today?
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto text-lg">
          Whether you need technical assistance, want to report an incident, or just need someone to talk to—we are here for you.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-100 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">
            💬
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Connect with a Counselor</h3>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Get confidential support from certified professionals who understand your experiences and can provide guidance.
          </p>
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
            Start Confidential Chat
          </button>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-8 rounded-3xl border border-rose-100 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">
            🚨
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Report an Incident</h3>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Have you witnessed or experienced bias, harassment, or discrimination? Let us know safely and anonymously.
          </p>
          <button className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-md">
            File a Report
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <span className="text-2xl">❓</span> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-stone-100 rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'bg-stone-50 ring-1 ring-stone-200' : 'bg-white hover:bg-stone-50'}`}
            >
              <button 
                className="w-full px-6 py-5 flex items-center justify-between font-semibold text-stone-800 text-left"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                <span className={`text-stone-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <div 
                className={`px-6 text-stone-600 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Technical Support */}
      <div className="text-center mt-12 bg-stone-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="font-serif text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-stone-300 mb-8 max-w-lg mx-auto">
            Our technical support team is available Monday through Friday to help you with any platform-related issues.
          </p>
          <button className="px-8 py-3 bg-white text-stone-900 rounded-xl font-bold hover:bg-stone-100 transition-colors shadow-lg">
            Contact Technical Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSupport;
