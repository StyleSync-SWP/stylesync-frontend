import { useNavigate } from "react-router-dom";

export default function Logo({
  variant = "black",
  className = "",
  useDefault = true,
}) {
  const navigate = useNavigate();
  const textColor = variant === "white" ? "text-[#F5EDE3]" : "text-[#34020E]";

  const defaultClasses =
    "absolute top-0 z-50 my-16 transform -translate-x-1/2 left-1/2 sm:left-0 sm:translate-x-0 sm:m-12";

  return (
    <div
      className={`hover:cursor-pointer font-['Dancing_Script'] font-semibold text-3xl ${textColor} ${
        useDefault ? `${defaultClasses} ${className}` : className
      }`}
      onClick={() => navigate("/")}
    >
      StyleSync
    </div>
  );
}
