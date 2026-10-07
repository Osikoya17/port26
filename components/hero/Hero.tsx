"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { heroState } from "@/lib/heroState";
import { useIntro } from "@/components/providers/Providers";
import { profile } from "@/lib/content";
import LocalTime from "@/components/ui/LocalTime";
import Magnetic from "@/components/ui/Magnetic";

const BlobScene = dynamic(() => import("./BlobScene"), { ssr: false });

function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`} aria-hidden="true">
      {text.split("").map((c, i) => (
        <span key={i} data-hero-char className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { done } = useIntro();
  const [inView, setInView] = useState(true);

  // Pause the WebGL loop whenever the hero is off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Size the name so the longest line spans the full content width on any screen.
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const fit = () => {
      const lines = Array.from(title.querySelectorAll<HTMLElement>("[data-fit]"));
      const container = title.clientWidth;
      if (!container || !lines.length) return;
      title.style.fontSize = "100px";
      const widest = Math.max(...lines.map((l) => l.scrollWidth));
      title.style.fontSize = `${(100 * container) / widest}px`;
    };
    fit();
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(title);
    return () => ro.disconnect();
  }, []);

  // Scroll-linked parallax
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (s) => (heroState.progress = s.progress),
      });

      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-title]", { yPercent: -18, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-hero-line='1']", { xPercent: -6, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-hero-line='2']", { xPercent: 6, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-hero-bottom]", { opacity: 0, y: -40, ease: "none", scrollTrigger: { ...scrub, end: "40% top" } });
    },
    { scope: root },
  );

  // Intro choreography, fired as the preloader lifts
  useGSAP(
    () => {
      if (!done) {
        gsap.set("[data-hero-char]", { yPercent: 115 });
        gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
        gsap.set("[data-hero-rule]", { scaleX: 0 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to("[data-hero-char]", {
        yPercent: 0,
        duration: 1.6,
        ease: "reveal",
        stagger: { each: 0.04, from: "start" },
      })
        .to(heroState, { intro: 1, duration: 2.4, ease: "elastic.out(1, 0.55)" }, 0.1)
        .to("[data-hero-rule]", { scaleX: 1, duration: 1.4, ease: "premium" }, 0.3)
        .to(
          "[data-hero-fade]",
          { opacity: 1, y: 0, duration: 1.1, ease: "reveal", stagger: 0.08 },
          0.5,
        );
    },
    { scope: root, dependencies: [done] },
  );

  return (
    <section
      ref={root}
      id="top"
      data-theme-section="light"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* WebGL + glow (no z-index so the title can blend with the canvas) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_200_90/0.16),transparent_65%)] blur-2xl" />
        <BlobScene active={inView} />
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-6 pt-24 pb-8 md:px-10 md:pt-28">
        {/* Top meta row */}
        <div className="grid grid-cols-2 gap-6 text-muted md:grid-cols-4">
          <p data-hero-fade className="label">(Portfolio) ©{new Date().getFullYear()}</p>
          <p data-hero-fade className="label hidden md:block">{profile.role}</p>
          <p data-hero-fade className="label hidden md:block">
            {profile.location}
          </p>
          <p data-hero-fade className="label text-right">
            <LocalTime />
          </p>
        </div>

        {/* Name */}
        <h1
          ref={titleRef}
          data-hero-title
          aria-label={`${profile.firstName} ${profile.lastName}`}
          className="my-12 font-sans text-[15vw] leading-[0.82] tracking-[-0.055em] whitespace-nowrap text-paper uppercase mix-blend-difference select-none"
        >
          <span data-hero-line="1" className="block">
            <span data-fit className="inline-block">
              <Chars text={profile.firstName} />
            </span>
          </span>
          <span data-hero-line="2" className="flex items-end justify-end gap-[0.2em]">
            <span
              data-hero-fade
              className="self-center hidden font-serif text-[0.2em] tracking-normal normal-case italic md:inline"
            >
              (aka {profile.nickname})
            </span>
            <span data-fit className="inline-block">
              <Chars text={profile.lastName} />
            </span>
          </span>
        </h1>

        {/* Bottom row */}
        <div data-hero-bottom>
          <div data-hero-rule className="mb-6 h-px origin-left bg-line" />
          <div className="grid items-end gap-8 md:grid-cols-12">
            <p
              data-hero-fade
              className="max-w-md text-[15px] leading-relaxed text-fg/80 md:col-span-5"
            >
              {profile.intro}
            </p>

            <div data-hero-fade className="hidden items-center gap-3 md:col-span-3 md:flex">
              <span className="relative block h-10 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(.76,0,.24,1)_infinite] bg-fg" />
              </span>
              <span className="label text-muted">Scroll to explore</span>
            </div>

            <div data-hero-fade className="flex items-center justify-between gap-6 md:col-span-4 md:justify-end">
              {profile.available && (
                <span className="label flex items-center gap-2 text-muted">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                  Available for work
                </span>
              )}
              <Magnetic strength={0.35}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-fg px-6 text-[11px] tracking-[0.18em] text-bg uppercase"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-ink">
                    Let&apos;s talk
                  </span>
                  <span className="relative transition-transform duration-500 group-hover:translate-x-1 group-hover:text-ink">
                    →
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
