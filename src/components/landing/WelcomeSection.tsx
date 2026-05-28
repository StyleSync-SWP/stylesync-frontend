import React from "react";

export default function WelcomeSection() {
  return (
    <>
      {/* MOBILE */}
      <div
        id="firstPart-mobile"
        className="flex flex-col justify-center items-center gap-10 h-[92.5vh] px-10 sm:hidden bg-red-300"
      >
        <h1 className="text-2xl font-bold text-center">
          Welcome to <span className="text-white">StyleSync</span>
        </h1>
        <p className="text-center text-[#273F4F]">
          The right platform to organize, style and simplify your fashion life.
        </p>
        <p className="text-center text-[#273F4F]">
          Tired of staring at a full closet, but still feeling like you have
          nothing to wear?
        </p>
        <p className="text-center text-[#273F4F]">
          Our Virtual Wardrobe Planner is here to revolutionize the way you
          approach fashion. Imagine having an assistant to help you pick the
          best outfits for any kind of occasion.
        </p>
      </div>

      {/* TABLET + DESKTOP */}
      <div
        id="firstPart-pc"
        className="hidden sm:flex flex-col lg:flex-row relative overflow-hidden h-[92.5vh] bg-red-300"
      >
        {/* TEXT — centered on sm/md, left-aligned on lg+ */}
        <div
          className="relative z-10 flex flex-col justify-center gap-6
                      px-10 py-20 min-h-[60%]
                      items-center text-center
                      lg:items-start lg:text-left lg:min-h-0
                      lg:w-1/2 xl:w-2/5 lg:mb-20 lg:py-0
                      lg:ml-[5%] xl:ml-[7%] lg:mr-15 xl:mr-5"
        >
          <h1 className="text-4xl xl:text-[40px] font-bold text-white xl:mb-5">
            Welcome to <span className="text-[#34020E]">StyleSync</span>
          </h1>
          <p className="text-white font-medium text-xl xl:text-2xl lg:pr-35">
            The right platform to organize, style and simplify your fashion
            life.
          </p>
          <p className="text-[#273F4F] text-lg xl:text-xl lg:pr-20">
            Tired of staring at a full closet, but still feeling like you have
            nothing to wear?
          </p>
          <p className="text-[#273F4F] text-lg xl:text-xl lg:pr-20">
            Our Virtual Wardrobe Planner is here to revolutionize the way you
            approach fashion. Imagine having an assistant to help you pick the
            best outfits for any kind of occasion.
          </p>
        </div>

        {/* IMAGE — centered horizontally + 30% bigger on sm/md, right-anchored on lg+ */}
        <div className="relative flex-1 lg:flex-none lg:w-1/2">
          <div
            className="absolute rounded-full bg-[#34020E]
                        w-[63vw] h-[60vw] bottom-[-12vw] left-1/2 -translate-x-1/2
                        lg:w-[42vw] lg:h-[40vw] lg:bottom-[-8vw] lg:left-auto lg:translate-x-0 lg:right-[7%]"
          >
            <img
              className="absolute bottom-0 left-[5%] max-w-[700px] h-[130%] object-contain
                          w-[56vw]
                          lg:w-[37vw]"
              src="/images/girl.png"
              alt="girl"
            />
          </div>
        </div>
      </div>
    </>
  );
}
