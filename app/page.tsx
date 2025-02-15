import Hero from "@/app/components/Hero";
import Projects from "@/app/components/Projects";
import Metrics from "@/app/components/Metrics";
import Pricing from "@/app/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Metrics />
      <Projects />
      <Pricing />
    </main>
  );
}
