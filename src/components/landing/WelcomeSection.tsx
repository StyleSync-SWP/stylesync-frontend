export default function WelcomeSection() {
  return (
    <>
      {/* MOBILE */}
      <div
        id="firstPart-mobile"
        className="flex flex-col justify-center items-center gap-8 h-[92.5vh] px-10 sm:hidden bg-[#34020E]"
      >
        <p className="text-xs tracking-widest text-[#C4A265] uppercase font-medium">
          Your personal style assistant
        </p>
        <h1 className="text-3xl font-serif text-center text-[#F5EDE3] font-medium leading-tight">
          Dress with intention,
          <br />
          <em className="font-serif italic">every single day</em>
        </h1>
        <p className="text-center text-[rgba(245,237,227,0.6)] text-sm leading-relaxed font-light max-w-xs">
          StyleSync learns your wardrobe and style, then suggests perfect
          outfits — every day, for free.
        </p>
        {/* <div className="flex flex-col gap-4 items-center mt-4">
          <button className="px-8 py-3 bg-[#F5EDE3] text-[#34020E] text-sm font-semibold rounded hover:bg-[rgba(245,237,227,0.9)] transition-colors">
            Get started free
          </button>
          <p className="text-xs text-[rgba(245,237,227,0.3)]">No credit card needed · Always free</p>
        </div> */}
      </div>

      {/* TABLET + DESKTOP */}
      <div
        id="firstPart-pc"
        className="hidden sm:flex flex-col lg:flex-row relative overflow-hidden h-[92.5vh] bg-[#34020E]"
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
          <p className="text-xs tracking-widest text-[#C4A265] uppercase font-medium">
            Your personal style assistant
          </p>
          <h1 className="text-4xl xl:text-[56px] font-serif text-[#F5EDE3] font-medium leading-tight xl:mb-4">
            Dress with intention,
            <br />
            <em className="font-serif italic">every single day</em>
          </h1>
          <p className="text-[rgba(245,237,227,0.6)] font-light text-lg xl:text-xl lg:pr-25 leading-relaxed">
            StyleSync learns your wardrobe and style, then suggests perfect
            outfits — every day, for free.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <button className="px-8 py-3 bg-[#F5EDE3] text-[#34020E] text-sm font-semibold rounded hover:bg-[rgba(245,237,227,0.9)] transition-colors">
              Get started free
            </button>
            <span className="text-sm text-[rgba(245,237,227,0.65)] cursor-pointer underline underline-offset-4">
              See how it works
            </span>
          </div> */}
          {/* <p className="text-xs text-[rgba(245,237,227,0.3)]">
            No credit card needed · Always free
          </p> */}
        </div>

        {/* IMAGE — centered horizontally + 30% bigger on sm/md, right-anchored on lg+ */}
        <div className="relative flex-1 lg:flex-none lg:w-1/2">
          <div
            className="absolute rounded-full bg-[#2a0a10] border border-[rgba(245,237,227,0.08)]
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
