import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function FAQSection() {
  function QuestionBox({ title, content }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div
        className="border border-white border-2 max-w-[708px] rounded-xl cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div
          className={`flex flex-row items-center px-5 ${
            isOpen ? "pt-5" : "py-5"
          }`}
        >
          <h1 className="text-sm font-bold md:text-lg text-white">{title}</h1>
          <IoIosArrowDown
            className={`ml-auto cursor-pointer transform transition-transform text-white duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
        {isOpen && <p className="px-5 pb-2 text-white">{content}</p>}
      </div>
    );
  }
  return (
    <div
      id="faqSection"
      className="py-10 lg:w-full lg:flex lg:items-start lg:py-15 lg:px-5 xl:p-20 bg-red-200"
    >
      <div className="flex-1 hidden lg:flex lg:flex-col">
        <div className="max-w-lg">
          <h1 className="mb-40 text-5xl font-bold text-white">
            Frequently Asked Questions
          </h1>
          <div className="relative flex items-center justify-center pb-20">
            <img
              src="./images/faq1.png"
              alt="cookingImage"
              className="w-[281px] h-auto absolute z-10 -translate-x-[38%] -translate-y-[46%] rounded-2xl shadow-gray-900 shadow-2xl"
              loading="lazy"
            />
            <div className="bg-[#34020E] w-[286px] h-[286px] rounded-full"></div>
            <img
              src="./images/faq2.png"
              alt="cookingImage2"
              className="w-[281px] h-auto absolute -translate-x-[-38%] -translate-y-[-46%] rounded-2xl shadow-gray-900 shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 md:pl-15 lg:pl-5 xl:p-5 md:flex-1 xl:mx-10 xl:pl-0">
        <h1 className="text-xl font-bold text-center md:hidden">
          Frequently Asked Questions
        </h1>
        <QuestionBox
          title="How do I add my clothes?"
          content="Upload a few clear photos of your wardrobe items using your camera."
        />
        {/* <QuestionBox
          title="Does it check the weather?"
          content="Yes, it auto-detects your local forecast to suggest appropriate layers or you could explicitly specify it."
        /> */}
        {/* <QuestionBox
          title="Can it help me pack for trips?"
          content="Absolutely. Enter your destination and duration for a custom packing list."
        /> */}
        <QuestionBox
          title="Will it suggest new things to buy?"
          content="Only if they bridge gaps in your current style or wardrobe."
        />
        <QuestionBox
          title="Does it track what I've worn?"
          content="It tracks the past outfits that you have saved."
        />
        <QuestionBox
          title="Can I define my style?"
          content="Yes, via a quick onboarding quiz and your personal preferences."
        />
        <QuestionBox
          title="Is it available on mobile?"
          content="It is fully optimized for both mobile and desktop web browsers, but not as a mobile app yet."
        />
      </div>
    </div>
  );
}
