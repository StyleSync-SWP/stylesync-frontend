import Menu from "../components/Menu";
import Box from "../components/ContentBox";
import WeatherWidget from "../components/WeatherWidget";
import AnalyticsWidget from "../components/AnalyticsWidget";

export default function Dashboard() {
  return (
    <div className="bg-[#0f0204] min-h-dvh">
      <Menu />
      <div className="sm:px-10 px-4 py-10 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px]">
          <Box
            title="Outfit Suggestions"
            link="/suggestions"
            className="text-[#F5EDE3]"
            images={[
              {
                src: "../images/dash1.png",
                x: "5%",
                y: "52%",
                width: "36%",
                height: "47%",
                rotation: -12,
              },
              {
                src: "../images/dash22.png",
                x: "62%",
                y: "55%",
                width: "32%",
                height: "42%",
                rotation: 5,
              },
            ]}
          >
            <p className="text-center text-[rgba(245,237,227,0.38)] font-light text-sm">
              AI-powered outfit ideas tailored to today's weather and your style
              profile.
            </p>
          </Box>
          <Box
            title="Wardrobe"
            link="/wardrobe"
            className="text-[#F5EDE3]"
            images={[
              {
                src: "../images/dash21.png",
                x: "48%",
                y: "50%",
                width: "52%",
                height: "62%",
              },
            ]}
          >
            <p className="text-center text-[rgba(245,237,227,0.38)] font-light text-sm">
              Manage and grow your digital wardrobe. Add pieces, see what you
              own.
            </p>
          </Box>
          <Box
            title="Outfit History"
            link="/past-outfits"
            className="text-[#F5EDE3]"
            images={[
              {
                src: "../images/dash31.png",
                x: "2%",
                y: "52%",
                width: "36%",
                height: "47%",
                rotation: 30,
              },
              {
                src: "../images/dash32.png",
                x: "71%",
                y: "2%",
                width: "31%",
                height: "41%",
                rotation: -35,
              },
            ]}
          >
            <p className="text-center text-[rgba(245,237,227,0.38)] font-light text-sm">
              Review past looks, track ratings, and build your personal style
              story.
            </p>
          </Box>

          <Box
            title="Style Quiz"
            link="/style-preference-onboarding"
            className="text-[#F5EDE3]"
            images={[
              {
                src: "../images/dash4.png",
                x: "4%",
                y: "5%",
                width: "31%",
                height: "41%",
                rotation: -30,
              },
            ]}
          >
            <p className="text-center text-[rgba(245,237,227,0.38)] font-light text-sm">
              Refine AI suggestions with a quick style profile.
            </p>
          </Box>
          <Box className="text-[#F5EDE3] p-1! pb-5! m-0!">
            <AnalyticsWidget />
          </Box>
          <Box className="text-[#F5EDE3]">
            <WeatherWidget />
          </Box>
        </div>
      </div>
    </div>
  );
}
