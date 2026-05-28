import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LuYoutube } from "react-icons/lu";
import { TbBrandFacebook } from "react-icons/tb";
import Logo from "../Logo";

export default function Footer() {
  return (
    <div className="bg-red-200">
      <div className="flex flex-col gap-10 p-5 text-white bg-[#34020E] rounded-t-4xl md:rounded-t-none md:flex-row md:py-10">
        {/* Mobile Branding */}
        <div
          id="containerMobile"
          className="flex flex-col gap-3 mt-5 md:hidden"
        >
          <Logo
            variant="white"
            useDefault={false}
            className="w-[161px] h-[25px] relative left-[25%] sm:left-[38%] ml-10 sm:ml-0"
          />
          <p className="text-center">Simply saving your wardrobe!</p>
        </div>

        {/* Desktop Branding & Socials */}
        <div
          id="containerDesktop"
          className="hidden p-5 md:flex md:flex-col md:basis-2/5 md:gap-5"
        >
          <Logo
            variant="white"
            useDefault={false}
            className="w-[161px] h-[25px]"
          />
          <p className="font-normal sm:pr-5 lg:pr-20 xl:pr-40">
            Your AI-powered personal stylist and closet manager.
          </p>
          <div className="flex gap-5">
            <a
              href="https://www.instagram.com"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6 hover:cursor-pointer" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              aria-label="Youtube"
            >
              <LuYoutube className="w-6 h-6 hover:cursor-pointer" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              aria-label="Facebook"
            >
              <TbBrandFacebook className="w-6 h-6 hover:cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap md:flex-row md:gap-15 lg:gap-10 md:basis-3/5 xl:px-20">
          {/* Features Column */}
          <ol
            id="features"
            className="flex flex-col gap-2 basis-1/2 md:basis-auto md:order-1"
          >
            <li className="mb-1 font-bold">Features</li>
            <li className="md:hover:cursor-pointer">Outfit Combinations</li>
            <li className="md:hover:cursor-pointer">Closet Optimization</li>
            <li className="md:hover:cursor-pointer">Packing Assistant</li>
            <li className="md:hover:cursor-pointer">Style Evolution</li>
          </ol>

          {/* Support Column */}
          <ol
            id="support"
            className="flex flex-col gap-2 basis-1/2 md:basis-auto md:order-3"
          >
            <li className="mb-1 font-bold">Support</li>
            <li className="md:hover:cursor-pointer">
              <Link to="/faq">FAQ</Link>
            </li>
            <li className="md:hover:cursor-pointer">
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li className="md:hover:cursor-pointer">
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="md:hover:cursor-pointer">
              <Link to="/terms-of-service">Terms of Service</Link>
            </li>
          </ol>

          {/* Community/Tools Column */}
          <ol
            id="tools"
            className="flex flex-col gap-2 mt-5 basis-1/2 md:basis-auto md:mt-0 md:order-2"
          >
            <li className="mb-1 font-bold">Smart Tools</li>
            <li className="md:hover:cursor-pointer">Weather Integration</li>
            <li className="md:hover:cursor-pointer">
              <Link to="/pricing">Premium Plans</Link>
            </li>
            <li className="md:hover:cursor-pointer">Outfit Rating</li>
            <li className="md:hover:cursor-pointer">Shopping Links</li>
          </ol>
        </div>

        {/* Mobile Socials */}
        <div id="iconsMobile" className="md:hidden">
          <h1 className="mb-2 font-bold">Follow Us</h1>
          <div className="flex gap-5">
            <a
              href="https://www.instagram.com"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              aria-label="Youtube"
            >
              <LuYoutube className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              aria-label="Facebook"
            >
              <TbBrandFacebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
