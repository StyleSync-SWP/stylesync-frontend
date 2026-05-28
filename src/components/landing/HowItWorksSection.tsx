import React from "react";

export default function HowItWorksSection() {
  function InfoCard({ number, image, title, text }) {
    return (
      <div className="bg-white flex flex-col items-center px-3 py-5 gap-5 rounded-xl relative w-full">
        <div className="bg-red-400 rounded-full absolute z-10 w-[37px] h-[37px] flex items-center justify-center -top-4">
          <p className="font-bold text-white">{number}</p>
        </div>

        <img
          src={image}
          alt={title}
          className="w-full h-[220px] object-cover rounded-lg mt-2"
          loading="lazy"
        />

        <h1 className="text-sm text-[#34020E] font-medium md:text-2xl text-center">
          {title}
        </h1>

        <p className="mb-4 text-center text-red-400">{text}</p>
      </div>
    );
  }

  return (
    <div
      id="howItWorksSection"
      className="bg-[#34020E] px-10 lg:px-5 xl:px-10 py-20 flex flex-col items-center min-h-dvh"
    >
      <h1 className="mb-15 text-2xl font-bold md:text-5xl md:mb-17 text-white text-center">
        How your assistant works
      </h1>

      {/* <p className="text-red-100 text-sm md:text-lg mb-15 px-5 text-center max-w-2xl">
        Our assistant offers a wide range of features that will revolutionize
        and optimize your wardrobe.
      </p> */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full max-w-7xl">
        <InfoCard
          number={1}
          image="./images/landing1.jpeg"
          title="Snap & Upload"
          text="Create your digital closet in seconds! Just snap a photo of your clothes."
        />

        <InfoCard
          number={2}
          image="./images/landing2.jpg"
          title="Match Your Vibe"
          text="Feeling energetic or going for effortless chic? Write down your mood or today's plan."
        />

        <InfoCard
          number={3}
          image="./images/landing3.jpg"
          title="AI Magic Is On!"
          text="Sit back and relax. Let your assistant to do the magic."
        />

        <InfoCard
          number={4}
          image="./images/landing4.jpeg"
          title="Pick & Shine"
          text="Your look is ready! Step out the door and get ready to be the center of attention."
        />
      </div>
    </div>
  );
}
