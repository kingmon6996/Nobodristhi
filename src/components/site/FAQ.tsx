import { useState } from "react";
import { Reveal } from "./Reveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I subscribe to the premium news feed?",
    answer: "You can subscribe by clicking the 'Sign in' button at the top right, creating an account, and choosing a subscription tier in your dashboard."
  },
  {
    question: "Can I customize which topics appear on my homepage?",
    answer: "Yes! Once logged in, head over to your profile settings where you can select your favorite categories like Technology, Business, or World News to personalize your feed."
  },
  {
    question: "Are there any student or educational discounts?",
    answer: "Absolutely. We offer a 50% discount for registered students and educators. Simply sign up with your valid .edu email address to automatically receive the discounted rate."
  },
  {
    question: "How often is the news updated?",
    answer: "Our editorial team updates the site 24/7. Breaking news is published immediately, while deep-dive analysis articles are published daily."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-blue-50/50 py-16 md:py-24 border-y border-blue-100/50">
      <Reveal className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Support</span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl text-black">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${isOpen ? 'border-blue-200 shadow-lg shadow-blue-900/5' : 'border-gray-100 shadow-sm hover:border-blue-100'}`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-medium text-lg transition-colors pr-4 ${isOpen ? 'text-blue-600' : 'text-black'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
