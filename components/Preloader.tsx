"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useIntro } from "@/components/providers/Providers";
import { profile } from "@/lib/content";

const WORDS = ["Design", "Engineer", "Animate", "Ship"];

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const { setDone } = useIntro();
  const lenis = useLenis();

  // Keep the page locked at the top while the loader is up.
  useEffect(() => {
    if (!lenis) return;
    if (gone) lenis.start();
    else {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    }
  }, [lenis, gone]);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const count = { v: 0 };
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");

      const tl = gsap.timeline({ paused: true });

      tl.from("[data-pl-char]", {
        yPercent: 120,
        duration: 1.1,
        ease: "reveal",
        stagger: 0.025,
      })
        .from("[data-pl-meta]", { opacity: 0, y: 10, duration: 0.8, stagger: 0.1 }, 0.2)
        .to(
          count,
          {
            v: 100,
            duration: reduced ? 0.3 : 2.4,
            ease: "power3.inOut",
            onUpdate: () => {
              if (counter.current)
                counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0.1,
        )
        .fromTo(
          "[data-pl-bar]",
          { scaleX: 0 },
          { scaleX: 1, duration: reduced ? 0.3 : 2.4, ease: "power3.inOut" },
          0.1,
        );

      // Cycle words while counting
      words.forEach((w, i) => {
        const at = 0.25 + i * 0.55;
        tl.fromTo(w, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "reveal" }, at);
        if (i < words.length - 1)
          tl.to(w, { yPercent: -100, duration: 0.5, ease: "premium" }, at + 0.5);
      });

      // Exit
      tl.to("[data-pl-content]", {
        yPercent: -30,
        opacity: 0,
        duration: 0.8,
        ease: "premium",
      })
        .add(() => setDone(true), "-=0.3")
        .to(
          root.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: reduced ? 0.4 : 1.2,
            ease: "premium",
          },
          "<",
        )
        .add(() => setGone(true));

      // Don't start until fonts are ready so the split text is measured correctly.
      document.fonts.ready.then(() => tl.play());
    },
    { scope: root },
  );

  if (gone) return null;

  const name = `${profile.firstName} ${profile.lastName}`;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-100 flex flex-col justify-between bg-ink px-6 py-6 text-paper md:px-10 md:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div data-pl-content className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <span data-pl-meta className="label text-paper/60">
            {profile.nickname} ©{new Date().getFullYear()}
          </span>
          <span data-pl-meta className="label text-right text-paper/60">
            Portfolio — Loading
          </span>
        </div>

        <div>
          <p className="overflow-hidden font-serif text-[clamp(2.5rem,7vw,6rem)] leading-none italic">
            {name.split(" ").map((word, w) => (
              <span key={w} className="inline-block whitespace-nowrap">
                {word.split("").map((c, i) => (
                  <span key={i} data-pl-char className="inline-block">
                    {c}
                  </span>
                ))}
                {w < name.split(" ").length - 1 && " "}
              </span>
            ))}
          </p>
          <div className="relative mt-4 h-[1.2em] overflow-hidden text-[clamp(1rem,1.6vw,1.4rem)] text-paper/70">
            {WORDS.map((w) => (
              <span
                key={w}
                data-word
                className="absolute inset-0 translate-y-full"
              >
                <span className="text-accent">↳</span> {w}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="relative mb-4 h-px flex-1 bg-paper/15">
            <span
              data-pl-bar
              className="absolute inset-0 origin-left scale-x-0 bg-accent"
            />
          </div>
          <span
            ref={counter}
            className="font-sans text-[clamp(5rem,16vw,15rem)] leading-[0.8] tracking-tighter tabular-nums"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
