import { useNavigate } from "react-router-dom";

type BoxImage = {
  src: string;
  x: number;
  y: number;
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
        ${link ? "cursor-pointer" : ""}
        ${className ? className : ""}
        bg-cover
        bg-center
        bg-red-400
        rounded-2xl
        h-[37.5vh]
        flex
        flex-col
        justify-center
        items-center
        gap-10
        pb-15
        p-5
        contrast-90
        brightness-65
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
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
