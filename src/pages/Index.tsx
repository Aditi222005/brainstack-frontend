import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingVisualBoard from "@/components/landing/LandingVisualBoard";
import LandingWorkflow from "@/components/landing/LandingWorkflow";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="bg-background min-h-screen font-sans antialiased text-foreground selection:bg-primary/30">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingVisualBoard />
      <LandingWorkflow />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

export default Index;
