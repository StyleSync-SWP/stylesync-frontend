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
          confirmButtonColor: "#C4A265",
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
          confirmButtonColor: "#C4A265",
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
          confirmButtonColor: "#C4A265",
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
          confirmButtonColor: "#C4A265",
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
        confirmButtonColor: "#C4A265",
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
          <div style="background: linear-gradient(135deg, #C4A265 0%, #e6c98a 100%);; 
                      padding: 20px; 
                      border-radius: 12px; 
                      margin: 20px 0;
                      box-shadow: 0 8px 32px rgba(196, 162, 101, 0.3);">
            <p style="color: #1a0508; font-size: 14px; margin: 0; font-weight: 600;">
              We'll now provide personalized outfit suggestions based on your unique style!
            </p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 15px;">
            Tip: You can retake this quiz anytime to update your preferences.
          </p>
        </div>
      `,
      icon: "success",
      iconColor: "#C4A265",
      background: "#1a050a",
      color: "#fff",
      confirmButtonColor: "#C4A265",
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
                      ? "bg-[#C4A265] text-[#1a0508] border-2 border-[#C4A265]"
                      : "bg-[#0f0204] text-[rgba(245,237,227,0.6)] border-2 border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)]"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={(value as string[])?.includes(option) || false}
                  onChange={() => handleMultiSelectToggle(question.id, option)}
                  className="w-5 h-5 rounded border-gray-500 accent-[#34020E] focus:ring-[#34020E] mr-3 flex-shrink-0"
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
                      ? "bg-[#C4A265] text-[#1a0508] border-2 border-[#C4A265]"
                      : "bg-[#0f0204] text-[rgba(245,237,227,0.6)] border-2 border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)]"
                  }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={value === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  className="w-5 h-5 rounded-full border-gray-500 accent-[#34020E] focus:ring-[#34020E] mr-3 flex-shrink-0"
                />
                <span className="font-medium text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-[rgba(245,237,227,0.4)]">
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
                          ? "bg-[#C4A265] text-[#1a0508]"
                          : "bg-[#0f0204] text-[rgba(245,237,227,0.6)] hover:bg-[#1a0508]"
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
                    ? "bg-[#C4A265] text-[#1a0508]"
                    : "bg-[#0f0204] text-[rgba(245,237,227,0.6)] hover:bg-[#1a0508]"
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswerChange(question.id, false)}
              className={`flex-1 py-4 rounded-xl font-bold transition-all
                ${
                  value === false
                    ? "bg-[#C4A265] text-[#1a0508]"
                    : "bg-[#0f0204] text-[rgba(245,237,227,0.6)] hover:bg-[#1a0508]"
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
            className="w-full p-4 rounded-xl bg-[#0f0204] text-[#F5EDE3] border-2 border-[rgba(196,162,101,0.14)] 
                     focus:border-[rgba(196,162,101,0.4)] focus:outline-none resize-none h-32"
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
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 bg-[#C4A265] text-[#1a0508] rounded-xl font-semibold 
                     hover:bg-[rgba(196,162,101,0.8)] transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleRetake}
            className="px-8 py-4 bg-[#0f0204] text-[#F5EDE3] rounded-xl font-semibold 
                     border-2 border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)] transition-all"
          >
            Retake Quiz
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#F5EDE3] font-medium mb-4">
            Your Style Profile
          </h1>
          <p className="text-[rgba(245,237,227,0.5)]">
            Here's a summary of your style preferences
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedAnswers).map(([section, items]) => (
            <div
              key={section}
              className="bg-[#1a0508] rounded-2xl p-6 border border-[rgba(196,162,101,0.14)]"
            >
              <h2 className="font-serif text-2xl text-[#C4A265] font-medium mb-4">
                {section}
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-b border-[rgba(196,162,101,0.12)] pb-3 last:border-0"
                  >
                    <p className="text-[rgba(245,237,227,0.6)] font-medium mb-1">
                      {item.question}
                    </p>
                    <p className="text-[#F5EDE3]">
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
      <div className="bg-[#0f0204] min-h-dvh">
        <Menu />
        <div className="px-6 py-8">{renderOverview()}</div>
      </div>
    );
  }

  const currentQuestions = getStepQuestions(currentStep);

  return (
    <div className="bg-[#0f0204] min-h-dvh">
      <Menu />
      <div className="max-w-4xl mx-auto px-10 py-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#F5EDE3] font-medium text-lg">
              Step {currentStep + 1}/{STEPS.length}
            </span>
            <span className="text-[#C4A265] font-medium tracking-widest text-xs uppercase">
              {STEPS[currentStep]}
            </span>
          </div>
          <div className="h-1 bg-[#1a0508] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C4A265] transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {currentQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-[#1a0508] rounded-2xl p-6 border border-[rgba(196,162,101,0.14)]"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#C4A265] font-medium tracking-widest uppercase">
                    {question.subsection}
                  </span>
                  {question.optional && (
                    <span className="text-xs text-[rgba(245,237,227,0.3)] bg-[#0f0204] px-2 py-1 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl text-[#F5EDE3] font-medium mt-2">
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
            className="px-8 py-4 bg-[#0f0204] text-[#F5EDE3] rounded-xl font-semibold 
                     border border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-[#C4A265] text-[#1a0508] rounded-xl font-semibold 
                     hover:bg-[rgba(196,162,101,0.8)] transition-all"
          >
            {currentStep === STEPS.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
