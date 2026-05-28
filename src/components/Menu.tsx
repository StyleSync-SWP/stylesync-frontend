import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import useAuthStore from "../stores/authStore";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isOpened, setIsOpened] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 lg:px-16 bg-[#34020E] py-5">
      <Logo
        variant="white"
        className="w-[161px] h-[25px] mt-4 md:mt-2 mb-2 justify-start"
        useDefault={false}
      />

      <div
        id="menuIcon"
        className="relative w-8 h-8 mt-4 md:hidden flex items-center justify-center"
      >
        <IoMenu
          size={32}
          color="white"
          className={`transition-all duration-300 absolute ${
            isOpened
              ? "opacity-0 scale-75 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          onClick={() => setIsOpened(true)}
        />
        <RxCross1
          size={32}
          color="white"
          className={`transition-all duration-300 absolute ${
            isOpened
              ? "opacity-100 scale-100 z-10"
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
          <li className="hover:cursor-pointer">
            <Link to="/settings">Settings</Link>
          </li>
          <li className="hover:cursor-pointer" onClick={handleLogout}>
            Log out
          </li>
        </ul>
      </div>
      <div id="horizontalLinks" className="hidden md:flex md:items-center">
        <ul className="flex text-white md:gap-4 lg:gap-8">
          <li
            className="px-8 py-0.5 mr-1 border-2 border-collapse border-white rounded-r-lg rounded-l-lg font-bold hover:cursor-pointer"
            onClick={() => {
              navigate("/settings");
            }}
          >
            Settings
          </li>
          <li
            className="px-8 py-0.5 text-black bg-white hover:cursor-pointer rounded-r-lg rounded-l-lg font-bold"
            onClick={handleLogout}
          >
            Log out
          </li>
        </ul>
      </div>
    </nav>
  );
}
