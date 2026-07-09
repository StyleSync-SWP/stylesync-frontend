export default function HowItWorksSection() {
  function InfoCard({ number, title, text }) {
    return (
      <div className="bg-white flex flex-col items-center px-6 py-8 gap-4 rounded-xl relative w-full border-t-2 border-[#34020E] shadow-lg">
        <p className="font-serif text-5xl text-[rgba(52,2,14,0.12)] font-semibold leading-none mb-2">
          {number < 10 ? `0${number}` : number}
        </p>

        <h3 className="font-serif text-2xl text-[#34020E] font-medium text-center">
          {title}
        </h3>

        <p className="text-center text-[rgba(26,5,8,0.48)] text-lg leading-relaxed font-light">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div
      id="howItWorksSection"
      className="bg-[#f5ede8] px-10 lg:px-5 xl:px-10 py-20 flex flex-col items-center min-h-dvh"
    >
      <p className="text-md tracking-widest text-[#C4A265] uppercase mb-4 text-center">
        How it works
      </p>
      <h2 className="font-serif text-3xl md:text-5xl text-[#34020E] font-semibold mb-25 text-center">
        Three steps to a better wardrobe
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-9 w-full max-w-6xl xl:px-0 md:px-[10%] lg:px-[20%]">
        <InfoCard
          number={1}
          title="Upload your wardrobe"
          text="Add photos of your clothes and build your personal digital wardrobe in minutes."
        />

        <InfoCard
          number={2}
          title="Define your style"
          text="Take a quick style quiz to help our AI understand your preferences perfectly."
        />

        <InfoCard
          number={3}
          title="Get daily suggestions"
          text="Wake up to curated outfit ideas matched to your style and today's weather."
        />
      </div>
    </div>
  );
}
