import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <footer className="py-12 bg-white border-t border-[rgba(52,2,14,0.07)]">
      <div className="max-w-6xl mx-auto px-10 flex justify-between items-center">
        <span className="font-serif text-xl text-[#34020E] font-semibold">
          StyleSync
        </span>
        <div className="flex gap-8">
          <span
            className="text-sm text-[rgba(26,5,8,0.32)] cursor-pointer hover:text-[rgba(26,5,8,0.5)] transition-colors hidden sm:block"
            onClick={() =>
              document
                .getElementById("howItWorksSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How it works
          </span>
          <span className="text-sm text-[rgba(26,5,8,0.32)] cursor-pointer hover:text-[rgba(26,5,8,0.5)] transition-colors hidden sm:block">
            <Link to="/login">Log in</Link>
          </span>
          <span
            className="text-sm text-[rgba(26,5,8,0.32)] cursor-pointer hover:text-[rgba(26,5,8,0.5)] transition-colors hidden sm:block"
            onClick={() =>
              document
                .getElementById("faqSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            FAQ
          </span>
        </div>
        <p className="text-xs text-[rgba(26,5,8,0.22)]">© 2026 StyleSync</p>
      </div>
    </footer>
  );
}
