"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type IntroContextValue = { done: boolean; setDone: (done: boolean) => void };

const IntroContext = createContext<IntroContextValue>({
  done: false,
  setDone: () => {},
});

export const useIntro = () => useContext(IntroContext);

/** Drives Lenis from GSAP's ticker so ScrollTrigger and smooth scroll share one clock. */
function LenisGsapBridge() {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [lenis]);

  // Late layout shifts (font loading, fitted type, split text) move every trigger,
  // so re-measure whenever the document height actually changes.
  useEffect(() => {
    let height = document.body.scrollHeight;
    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      const next = document.body.scrollHeight;
      if (next === height) return;
      height = next;
      clearTimeout(timer);
      timer = setTimeout(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      }, 150);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [lenis]);

  return null;
}

/** Fades the page between light and dark as `[data-theme-section]` blocks cross the viewport centre. */
function ThemeObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = gsap.utils.toArray<HTMLElement>("[data-theme-section]");
    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) root.dataset.theme = el.dataset.themeSection;
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  return (
    <IntroContext.Provider value={{ done, setDone }}>
      <ReactLenis
        root
        options={{
          autoRaf: false,
          lerp: reduced ? 1 : 0.085,
          smoothWheel: !reduced,
          wheelMultiplier: 1,
        }}
      >
        <LenisGsapBridge />
        <ThemeObserver />
        {children}
      </ReactLenis>
    </IntroContext.Provider>
  );
}
