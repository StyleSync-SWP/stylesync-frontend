import { useNavigate } from "react-router-dom";

type BoxImage = {
  src: string;
  x: number | string;
  y: number | string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  rotation?: number;
};

type BoxProps = {
  title?: string;
  children?: React.ReactNode;
  link?: string;
  className?: string;
  images?: BoxImage[];
};

export default function Box({
  title = "",
  children,
  link = "",
  className = "",
  images = [],
}: BoxProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative
        overflow-hidden  {/* <div> FIXED: Added this to clip the absolute-positioned images */}
        ${link ? "cursor-pointer" : ""}
        ${className ? className : ""}
        bg-[#1a0508]
        border border-[rgba(196,162,101,0.14)]
        rounded-2xl
        h-[37.5vh]
        flex
        flex-col
        justify-center
        items-center
        gap-10
        pb-15
        p-5
        hover:border-[rgba(196,162,101,0.35)]
        transition-colors
      `}
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={img.alt ?? ""}
          style={{
            position: "absolute",
            left: img.x,
            top: img.y,
            width: img.width ?? "auto",
            height: img.height ?? "auto",
            transform: `rotate(${img.rotation ?? 0}deg)`,
          }}
        />
      ))}
      <h1 className="text-2xl font-serif text-[#F5EDE3] font-medium">
        {title}
      </h1>
      {children}
    </div>
  );
}
