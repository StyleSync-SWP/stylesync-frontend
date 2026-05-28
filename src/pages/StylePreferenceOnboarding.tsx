import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Menu from "../components/Menu";

type QuestionType =
  | "multi-select"
  | "one-choice"
  | "scale"
  | "toggle"
  | "text"
  | "ranking";

interface Question {
  id: string;
  section: string;
  subsection: string;
  question: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
  optional?: boolean;
}

interface Answers {
  [key: string]: string | string[] | number | boolean;
}

const STYLE_OPTIONS = [
  "Minimalist",
  "Streetwear",
  "Business casual",
  "Old money",
  "Sporty",
  "Casual",
  "Smart casual",
  "Vintage",
  "Y2K",
  "Formal",
  "Elegant",
  "Scandinavian",
  "Korean fashion",
  "Techwear",
  "Oversized fashion",
  "Alternative / edgy",
  "Other",
];

const FIT_OPTIONS = [
  "Oversized",
  "Relaxed",
  "Regular fit",
  "Slim fit",
  "Skinny fit",
  "Mixed depending on outfit",
];

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Gray",
  "Beige",
  "Brown",
  "Blue",
  "Green",
  "Red",
  "Pastel colors",
  "Bright colors",
  "Neutral colors",
];

const OUTFIT_NEEDS_OPTIONS = [
  "University / school",
  "Office / work",
  "Gym",
  "Daily casual wear",
  "Parties",
  "Dates",
  "Formal events",
  "Travel",
  "Walking a lot",
  "Cold weather",
  "Hot weather",
];

const OUTFIT_PRIORITY_OPTIONS = [
  "Comfort",
  "Looking attractive",
  "Looking professional",
  "Standing out",
  "Simplicity",
  "Practicality",
  "Trendiness",
];

const SHOPPING_PROBLEM_OPTIONS = [
  "Don't know how to combine clothes",
  "Too many clothes but nothing fits together",
  "Repeat outfits too often",
  "Don't know what suits me",
  "Buy clothes impulsively",
  "Hard to dress for occasions",
  "Packing for trips",
  "Matching colors",
];

const RECOMMENDATION_TYPE_OPTIONS = [
  "Safe/basic outfits",
  "Trendy outfits",
  "Creative outfits",
  "Minimal outfits",
  "Comfortable outfits",
  "Professional outfits",
];

const BRAND_OPTIONS = [
  "Zara",
  "Uniqlo",
  "H&M",
  "Bershka",
  "COS",
  "Nike",
  "Adidas",
  "Ralph Lauren",
  "Carhartt",
  "Thrifted / vintage",
  "Other",
];

const WARDROBE_GOAL_OPTIONS = [
  "Build confidence",
  "Look more mature",
  "Dress more stylishly",
  "Simplify wardrobe",
  "Build a capsule wardrobe",
  "Improve professional appearance",
  "Develop a unique identity",
];

const QUESTIONS: Question[] = [
  // Section 1: General Style Identity
  {
    id: "1.1",
    section: "Style",
    subsection: "General Style Identity",
    question: "Which styles do you like the most?",
    type: "multi-select",
    options: STYLE_OPTIONS,
  },
  {
    id: "1.2",
    section: "Style",
    subsection: "General Style Identity",
    question: "Which styles do you dislike?",
    type: "multi-select",
    options: STYLE_OPTIONS,
  },
  {
    id: "1.3",
    section: "Style",
    subsection: "General Style Identity",
    question: "How would you describe your current style?",
    type: "one-choice",
    options: [
      "I already know my style",
      "I'm experimenting",
      "I want to improve my style",
      "I have no idea what suits me",
    ],
  },
  // Section 2: Fit Preferences
  {
    id: "2.1",
    section: "Colors & Fit",
    subsection: "Fit Preferences",
    question: "What fit do you prefer?",
    type: "multi-select",
    options: FIT_OPTIONS,
  },
  // Section 3: Color Preferences
  {
    id: "3.1",
    section: "Colors & Fit",
    subsection: "Color Preferences",
    question: "Which colors do you wear most?",
    type: "multi-select",
    options: COLOR_OPTIONS,
  },
  {
    id: "3.2",
    section: "Colors & Fit",
    subsection: "Color Preferences",
    question: "Which colors do you avoid?",
    type: "multi-select",
    options: COLOR_OPTIONS,
  },
  {
    id: "3.3",
    section: "Colors & Fit",
    subsection: "Color Preferences",
    question: "Do you prefer neutral or bold outfits?",
    type: "one-choice",
    options: ["Mostly neutral", "Balanced", "Bold / standout"],
  },
  // Section 4: Lifestyle & Usage
  {
    id: "4.1",
    section: "Lifestyle",
    subsection: "Lifestyle & Usage",
    question: "What outfits do you need most often?",
    type: "multi-select",
    options: OUTFIT_NEEDS_OPTIONS,
  },
  {
    id: "4.2",
    section: "Lifestyle",
    subsection: "Lifestyle & Usage",
    question: "How often do you dress formally?",
    type: "one-choice",
    options: ["Almost never", "Sometimes", "Frequently", "Almost every day"],
  },
  {
    id: "4.3",
    section: "Lifestyle",
    subsection: "Lifestyle & Usage",
    question: "What matters most when choosing an outfit?",
    type: "multi-select",
    options: OUTFIT_PRIORITY_OPTIONS,
  },
  // Section 5: Shopping & Wardrobe Habits
  {
    id: "5.1",
    section: "Lifestyle",
    subsection: "Shopping & Wardrobe Habits",
    question: "How often do you buy clothes?",
    type: "one-choice",
    options: ["Rarely", "Every few months", "Monthly", "Frequently"],
  },
  {
    id: "5.2",
    section: "Lifestyle",
    subsection: "Shopping & Wardrobe Habits",
    question: "What problem do you struggle with most?",
    type: "multi-select",
    options: SHOPPING_PROBLEM_OPTIONS,
  },
  // Section 6: Recommendation Personalization
  {
    id: "6.1",
    section: "Recommendation Preferences",
    subsection: "Recommendation Personalization",
    question: "What kind of recommendations do you want?",
    type: "multi-select",
    options: RECOMMENDATION_TYPE_OPTIONS,
  },
  {
    id: "6.2",
    section: "Recommendation Preferences",
    subsection: "Recommendation Personalization",
    question: "How experimental should suggestions be?",
    type: "scale",
    min: 1,
    max: 5,
  },
  {
    id: "6.3",
    section: "Recommendation Preferences",
    subsection: "Recommendation Personalization",
    question: "Should the AI prioritize reusing clothes?",
    type: "toggle",
  },
  // Section 7: Inspiration & References
  {
    id: "7.2",
    section: "Recommendation Preferences",
    subsection: "Inspiration & References",
    question: "Which brands match your taste?",
    type: "multi-select",
    options: BRAND_OPTIONS,
  },
  // Section 8: Wardrobe Goals
  {
    id: "8.1",
    section: "Optional Advanced",
    subsection: "Wardrobe Goals",
    question: "What are you trying to improve?",
    type: "multi-select",
    options: WARDROBE_GOAL_OPTIONS,
    optional: true,
  },
  {
    id: "8.2",
    section: "Optional Advanced",
    subsection: "Wardrobe Goals",
    question: "What best describes your goal?",
    type: "one-choice",
    options: [
      "Improve my current style",
      "Completely change my style",
      "Organize my wardrobe better",
      "Get faster outfit suggestions",
    ],
    optional: true,
  },
  // Section 9: Optional Advanced Inputs
  {
    id: "9.1",
    section: "Optional Advanced",
    subsection: "Optional Advanced Inputs",
    question: "Budget range for shopping suggestions",
    type: "one-choice",
    options: ["Budget-friendly", "Mid-range", "Premium", "No preference"],
    optional: true,
  },
  {
    id: "9.2",
    section: "Optional Advanced",
    subsection: "Optional Advanced Inputs",
    question: "How much do you mind dressing for the weather?",
    type: "one-choice",
    options: [
      "I always dress for the weather",
      "I sometimes consider the weather",
      "I rarely let weather affect my outfit",
      "I never care about the weather",
    ],
    optional: true,
  },
  {
    id: "9.3",
    section: "Optional Advanced",
    subsection: "Optional Advanced Inputs",
    question: "How much time do you spend choosing outfits?",
    type: "one-choice",
    options: ["<5 min", "5–15 min", "15–30 min", "Too long honestly"],
    optional: true,
  },
];

const STEPS = [
  "Style",
  "Colors & Fit",
  "Lifestyle",
  "Recommendation Preferences",
  "Optional Advanced",
];

export default function StylePreferenceOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("stylePreferenceAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      setShowOverview(true);
    }
  }, []);

  const getStepQuestions = (step: number) => {
    return QUESTIONS.filter((q) => q.section === STEPS[step]);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelectToggle = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];

      if (
        questionId === "1.1" &&
        prev["1.2"] &&
        (prev["1.2"] as string[]).includes(option)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Contradiction detected",
          text: "You cannot like and dislike the same style. Please remove it from your dislikes first.",
          confirmButtonColor: "#fca5a5",
          background: "#1a050a",
          color: "#fff",
        });
        return prev;
      }

      if (
        questionId === "1.2" &&
        prev["1.1"] &&
        (prev["1.1"] as string[]).includes(option)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Contradiction detected",
          text: "You cannot like and dislike the same style. Please remove it from your likes first.",
          confirmButtonColor: "#fca5a5",
          background: "#1a050a",
          color: "#fff",
        });
        return prev;
      }

      if (
        questionId === "3.1" &&
        prev["3.2"] &&
        (prev["3.2"] as string[]).includes(option)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Contradiction detected",
          text: "You cannot wear and avoid the same color. Please remove it from your avoid list first.",
          confirmButtonColor: "#fca5a5",
          background: "#1a050a",
          color: "#fff",
        });
        return prev;
      }

      if (
        questionId === "3.2" &&
        prev["3.1"] &&
        (prev["3.1"] as string[]).includes(option)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Contradiction detected",
          text: "You cannot wear and avoid the same color. Please remove it from your wear most list first.",
          confirmButtonColor: "#fca5a5",
          background: "#1a050a",
          color: "#fff",
        });
        return prev;
      }

      if (current.includes(option)) {
        return {
          ...prev,
          [questionId]: current.filter((item) => item !== option),
        };
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const validateStep = (step: number): boolean => {
    const stepQuestions = getStepQuestions(step);
    for (const question of stepQuestions) {
      if (question.optional) continue;

      const value = answers[question.id];
      const isUnanswered =
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "");

      if (isUnanswered) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Swal.fire({
        icon: "warning",
        title: "Please answer all questions",
        text: "You need to answer all required questions before proceeding to the next step.",
        confirmButtonColor: "#fca5a5",
        background: "#1a050a",
        color: "#fff",
      });
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    localStorage.setItem("stylePreferenceAnswers", JSON.stringify(answers));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    Swal.fire({
      title: "Style Profile Complete!",
      html: `
        <div style="text-align: center;">
          <p style="color: #666; margin-bottom: 20px;">
            Your style preferences have been saved successfully.
          </p>
          <div style="background: linear-gradient(135deg, #fca5a5 0%, #f9a8d4 100%); 
                      padding: 20px; 
                      border-radius: 12px; 
                      margin: 20px 0;
                      box-shadow: 0 8px 32px rgba(252, 165, 165, 0.3);">
            <p style="color: #34020E; font-size: 14px; margin: 0; font-weight: 600;">
              We'll now provide personalized outfit suggestions based on your unique style!
            </p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 15px;">
            Tip: You can retake this quiz anytime to update your preferences.
          </p>
        </div>
      `,
      icon: "success",
      iconColor: "#fca5a5",
      background: "#1a050a",
      color: "#fff",
      confirmButtonColor: "#fca5a5",
      confirmButtonText: "Go to Dashboard",
      customClass: {
        popup: "styled-popup",
        title: "styled-title",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/dashboard");
      }
    });
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowOverview(false);
    localStorage.removeItem("stylePreferenceAnswers");
  };

  const renderQuestion = (question: Question) => {
    const value = answers[question.id];

    switch (question.type) {
      case "multi-select":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all
                  ${
                    (value as string[])?.includes(option)
                      ? "bg-[#fca5a5] text-[#34020E] border-2 border-[#fca5a5]"
                      : "bg-[#1a050a] text-gray-300 border-2 border-[#34020E] hover:border-[#fca5a5]"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={(value as string[])?.includes(option) || false}
                  onChange={() => handleMultiSelectToggle(question.id, option)}
                  className="w-5 h-5 rounded border-gray-500 text-[#fca5a5] focus:ring-[#fca5a5] mr-3 flex-shrink-0"
                />
                <span className="font-medium text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case "one-choice":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all
                  ${
                    value === option
                      ? "bg-[#fca5a5] text-[#34020E] border-2 border-[#fca5a5]"
                      : "bg-[#1a050a] text-gray-300 border-2 border-[#34020E] hover:border-[#fca5a5]"
                  }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={value === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  className="w-5 h-5 rounded-full border-gray-500 text-[#fca5a5] focus:ring-[#fca5a5] mr-3 flex-shrink-0"
                />
                <span className="font-medium text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Style over comfort</span>
              <span>Comfort is most important</span>
            </div>
            <div className="flex justify-between gap-2">
              {Array.from(
                { length: (question.max || 5) - (question.min || 1) + 1 },
                (_, i) => {
                  const num = (question.min || 1) + i;
                  return (
                    <button
                      key={num}
                      onClick={() => handleAnswerChange(question.id, num)}
                      className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all
                      ${
                        value === num
                          ? "bg-[#fca5a5] text-[#34020E]"
                          : "bg-[#1a050a] text-gray-300 hover:bg-[#2a0a10]"
                      }`}
                    >
                      {num}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        );

      case "toggle":
        return (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswerChange(question.id, true)}
              className={`flex-1 py-4 rounded-xl font-bold transition-all
                ${
                  value === true
                    ? "bg-[#fca5a5] text-[#34020E]"
                    : "bg-[#1a050a] text-gray-300 hover:bg-[#2a0a10]"
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswerChange(question.id, false)}
              className={`flex-1 py-4 rounded-xl font-bold transition-all
                ${
                  value === false
                    ? "bg-[#fca5a5] text-[#34020E]"
                    : "bg-[#1a050a] text-gray-300 hover:bg-[#2a0a10]"
                }`}
            >
              No
            </button>
          </div>
        );

      case "text":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 rounded-xl bg-[#1a050a] text-white border-2 border-[#34020E] 
                     focus:border-[#fca5a5] focus:outline-none resize-none h-32"
          />
        );

      default:
        return null;
    }
  };

  const renderOverview = () => {
    const groupedAnswers = QUESTIONS.reduce(
      (acc, q) => {
        if (!acc[q.section]) {
          acc[q.section] = [];
        }
        if (answers[q.id]) {
          acc[q.section].push({ question: q.question, answer: answers[q.id] });
        }
        return acc;
      },
      {} as Record<string, { question: string; answer: any }[]>,
    );

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8 justify-between">
          <button
            onClick={handleRetake}
            className="px-8 py-4 bg-[#1a050a] text-white rounded-xl font-bold 
                     border-2 border-[#34020E] hover:border-[#fca5a5] transition-all"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 bg-[#fca5a5] text-[#34020E] rounded-xl font-bold 
                     hover:bg-[#f87171] transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Style Profile
          </h1>
          <p className="text-gray-400">
            Here's a summary of your style preferences
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedAnswers).map(([section, items]) => (
            <div
              key={section}
              className="bg-[#1a050a] rounded-2xl p-6 border-2 border-[#34020E]"
            >
              <h2 className="text-2xl font-bold text-[#fca5a5] mb-4">
                {section}
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-b border-[#34020E] pb-3 last:border-0"
                  >
                    <p className="text-gray-300 font-medium mb-1">
                      {item.question}
                    </p>
                    <p className="text-white">
                      {Array.isArray(item.answer)
                        ? item.answer.join(", ")
                        : typeof item.answer === "boolean"
                          ? item.answer
                            ? "Yes"
                            : "No"
                          : String(item.answer)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (showOverview) {
    return (
      <div className="bg-[#34020E] min-h-dvh">
        <Menu />
        <div className="px-6 py-8">{renderOverview()}</div>
      </div>
    );
  }

  const currentQuestions = getStepQuestions(currentStep);

  return (
    <div className="bg-[#34020E] min-h-dvh">
      <Menu />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold text-lg">
              Step {currentStep + 1}/{STEPS.length}
            </span>
            <span className="text-[#fca5a5] font-medium">
              {STEPS[currentStep]}
            </span>
          </div>
          <div className="h-2 bg-[#1a050a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#fca5a5] to-[#f9a8d4] transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-[#1a050a] rounded-2xl p-6 border-2 border-[#34020E]"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#fca5a5] font-medium">
                    {question.subsection}
                  </span>
                  {question.optional && (
                    <span className="text-xs text-gray-500 bg-[#1a050a] px-2 py-1 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {question.question}
                </h3>
              </div>
              {renderQuestion(question)}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-8 py-4 bg-[#1a050a] text-white rounded-xl font-bold 
                     border-2 border-[#34020E] hover:border-[#fca5a5] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-[#fca5a5] text-[#34020E] rounded-xl font-bold 
                     hover:bg-[#f87171] transition-all"
          >
            {currentStep === STEPS.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
