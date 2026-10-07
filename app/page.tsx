import Hero from "@/components/hero/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Certifications />
      </main>
      <Contact />
    </>
  );
}
