import { useState } from "react";

export default function FAQSection() {
  function QuestionBox({ title, content }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        className="border-b border-[rgba(52,2,14,0.1)] cursor-pointer hover:bg-[rgba(52,2,14,0.04)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-row items-center justify-between px-5 py-6">
          <h4 className="font-serif text-lg text-[#34020E] font-medium">
            {title}
          </h4>

          <span className="text-xl text-[#C4A265] font-light flex-shrink-0 ml-4">
            {isOpen ? "−" : "+"}
          </span>
        </div>

        {isOpen && (
          <p className="px-5 pb-6 text-[rgba(26,5,8,0.5)] text-sm leading-relaxed font-light">
            {content}
          </p>
        )}
      </div>
    );
  }

  return (
    <div id="faqSection" className="py-20 bg-[#FDFAF7] flex justify-center">
      <div className="w-full max-w-3xl px-5 flex flex-col gap-5">
        <h2 className="font-serif text-3xl md:text-4xl text-[#34020E] font-semibold mb-12 text-center">
          Common questions
        </h2>

        <QuestionBox
          title="Is StyleSync free to use?"
          content="Yes, StyleSync is completely free. Create an account, upload your wardrobe, and start getting outfit suggestions at no cost."
        />

        <QuestionBox
          title="How does the AI choose outfits?"
          content="It considers your style profile, the weather, your occasion needs, and your outfit history to suggest combinations from your own wardrobe."
        />

        <QuestionBox
          title="Can I retake the style quiz?"
          content="Absolutely. You can update your style preferences as many times as you want from your dashboard."
        />

        <QuestionBox
          title="Does it work for all styles and genders?"
          content="StyleSync is built for everyone. The quiz covers aesthetics from minimalist to streetwear, formal to casual."
        />
      </div>
    </div>
  );
}
