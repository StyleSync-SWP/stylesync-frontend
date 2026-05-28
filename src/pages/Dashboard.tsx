import Menu from "../components/Menu";
import Box from "../components/ContentBox";
import WeatherWidget from "../components/WeatherWidget";
import AnalyticsWidget from "../components/AnalyticsWidget";

export default function Dashboard() {
  return (
    <div className="bg-[#34020E] min-h-dvh">
      <Menu />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 px-6 sm:px-6 md:px-10 py-7">
        <Box
          title="Suggestions"
          link="/suggestions"
          className="xl:order-first text-white bold-700"
          images={[
            {
              src: "../images/dash1.png",
              x: 0,
              y: 130,
              width: 150,
              height: 150,
            },
          ]}
        >
          <p className="text-center text-white font-medium">
            Get suggestions for the outfit of the day.
          </p>
        </Box>
        <Box
          title="Wardrobe"
          link="/wardrobe"
          className="xl:order-first text-white bold-700"
          images={[
            {
              src: "../images/dash21.png",
              x: 0,
              y: 130,
              width: 150,
              height: 150,
            },
            {
              src: "../images/dash22.png",
              x: 280,
              y: 110,
              width: 150,
              height: 150,
            },
          ]}
        >
          <p className="text-center text-white font-medium">
            Create your wardrobe.
          </p>
        </Box>
        <Box
          title="Outfit History"
          link="/past-outfits"
          className=" text-white bold-700"
          images={[
            {
              src: "../images/dash31.png",
              x: -10,
              y: 110,
              width: 150,
              height: 150,
            },
            {
              src: "../images/dash32.png",
              x: 300,
              y: 30,
              width: 150,
              height: 150,
              rotation: -15,
            },
          ]}
        >
          <p className="text-center text-white font-medium">
            See your previous outfits.
          </p>
        </Box>

        <Box
          title="Onboarding Quiz"
          link="/style-preference-onboarding"
          className=" text-white bold-700"
          images={[
            {
              src: "../images/dash4.png",
              x: 10,
              y: 10,
              width: 100,
              height: 100,
              rotation: -30,
            },
          ]}
        >
          <p className="text-center text-white font-medium">
            Want more accurate suggestions? Take this quick quiz, you can take
            it as many times as you want.
          </p>
        </Box>
        <Box className="xl:order-first text-white] bold-700 p-1! pb-5! m-0!">
          <AnalyticsWidget />
        </Box>
        <Box className="text-white bold-700">
          <WeatherWidget />
        </Box>
      </div>
    </div>
  );
}
