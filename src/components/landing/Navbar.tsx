import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <nav className="flex justify-around bg-[#34020E] border-b border-[rgba(196,162,101,0.1)]">
      <Logo
        variant="white"
        className="w-[161px] h-[25px] mt-5 mb-3 mr-10"
        useDefault={false}
      />

      <div
        id="menuIcon"
        className="relative inline-block mt-3 mb-2 mr-6 md:hidden"
      >
        <IoMenu
          size={32}
          color="white"
          className={`transition-all duration-300 absolute transform sm:ml-20 ${
            isOpened
              ? "opacity-0 scale-75 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          onClick={() => setIsOpened(true)}
        />
        <RxCross1
          size={32}
          color="white"
          className={`transition-all duration-300 absolute transform sm:ml-20 ${
            isOpened
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none"
          }`}
          onClick={() => setIsOpened(false)}
        />
      </div>
      <div
        id="dropdownMenu"
        className={`absolute overflow-hidden transition-all duration-500 ease-in-out w-full ${
          isOpened ? "mt-[49px] max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-3 py-1 text-white bg-[#34020E]">
          <li
            className="hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors"
            onClick={() =>
              document
                .getElementById("howItWorksSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How it works
          </li>
          <li
            className="hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors"
            onClick={() =>
              document
                .getElementById("faqSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            FAQ
          </li>
          <li className="hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors">
            <Link to="/login">Log in</Link>
          </li>
          <li
            className="hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Create account
          </li>
        </ul>
      </div>
      <div id="horizontalLinks" className="hidden md:flex md:items-center">
        <ul className="flex text-white md:gap-4 lg:gap-8">
          <li
            className="px-6 py-2 text-sm hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors"
            onClick={() =>
              document
                .getElementById("howItWorksSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How it works
          </li>
          <li
            className="px-6 py-2 text-sm hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors"
            onClick={() =>
              document
                .getElementById("faqSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            FAQ
          </li>
          <li
            className="px-6 py-2 text-sm hover:cursor-pointer text-[rgba(245,237,227,0.5)] hover:text-[rgba(245,237,227,0.8)] transition-colors"
            onClick={() => {
              navigate("/login");
            }}
          >
            Log in
          </li>
          <li
            className="px-6 py-2 text-sm bg-[#F5EDE3] text-[#34020E] hover:cursor-pointer font-semibold hover:bg-[rgba(245,237,227,0.9)] transition-colors"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Create account
          </li>
        </ul>
      </div>
    </nav>
  );
}
