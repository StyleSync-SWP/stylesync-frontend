import { Suspense, lazy } from "react";

import Navbar from "../components/landing/Navbar";
import WelcomeSection from "../components/landing/WelcomeSection";
import LoadingOverlay from "../components/LoadingOverlay";

const HowItWorksSection = lazy(
  () => import("../components/landing/HowItWorksSection"),
);
const FAQSection = lazy(() => import("../components/landing/FAQSection"));
const Footer = lazy(() => import("../components/landing/Footer"));

export default function Landing() {
  return (
    <>
      <Navbar />
      <WelcomeSection />
      <Suspense fallback={<LoadingOverlay />}>
        <HowItWorksSection />
        <FAQSection />
        <Footer />
      </Suspense>
    </>
  );
}
