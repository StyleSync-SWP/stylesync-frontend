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
    <nav className="flex justify-around bg-[#34020E]">
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
        <ul className="flex flex-col items-center gap-3 py-2 text-white bg-[#34020E]">
          <li
            className="hover:cursor-pointer"
            onClick={() =>
              document
                .getElementById("howItWorksSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Features and uses
          </li>
          <li
            className="hover:cursor-pointer"
            onClick={() =>
              document
                .getElementById("faqSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            More Information
          </li>
          <li className="hover:cursor-pointer">
            <Link to="/login">Login</Link>
          </li>
          <li
            className="hover:cursor-pointer"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign up
          </li>
        </ul>
      </div>
      <div id="horizontalLinks" className="hidden md:flex md:items-center">
        <ul className="flex text-white md:gap-4 lg:gap-8">
          <li
            className="pb-0.5 pt-1 hover:cursor-pointer"
            onClick={() =>
              document
                .getElementById("howItWorksSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Features and uses
          </li>
          <li
            className="pb-0.5 pt-1 hover:cursor-pointer"
            onClick={() =>
              document
                .getElementById("faqSection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            More Information
          </li>
          <li
            className="px-8 py-0.5 mr-2 border-2 border-collapse border-white rounded-r-lg rounded-l-lg font-bold hover:cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </li>
          <li
            className="px-8 py-0.5 text-black bg-white hover:cursor-pointer rounded-r-lg rounded-l-lg font-bold"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign up
          </li>
        </ul>
      </div>
    </nav>
  );
}
