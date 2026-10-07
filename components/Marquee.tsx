"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { marquee } from "@/lib/content";

function Row({ items, serif = false }: { items: string[]; serif?: boolean }) {
  // Two identical halves so a -50% translate loops seamlessly
  const half = (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className={serif ? "font-serif italic" : "uppercase tracking-[-0.03em]"}>{item}</span>
          <span className="mx-[0.45em] text-[0.5em] text-accent">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div data-marquee-track className="flex w-max whitespace-nowrap will-change-transform">
      {half}
      {half}
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);
  const tweens = useRef<gsap.core.Tween[]>([]);
  const direction = useRef(1);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-track]");
      tweens.current = tracks.map((t, i) =>
        gsap.fromTo(
          t,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 },
        ),
      );
      // Start deep into the infinite repeat so a negative timeScale never hits time 0
      tweens.current.forEach((t) => t.totalTime(t.duration() * 1000));

      // Subtle skew + rotate on enter
      gsap.from(root.current, {
        rotate: -2,
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 40%", scrub: true },
      });
    },
    { scope: root },
  );

  // Scroll velocity speeds the marquee up and flips its direction
  useLenis(({ velocity, direction: dir }) => {
    if (dir) direction.current = dir;
    const boost = 1 + Math.min(Math.abs(velocity) * 0.35, 8);
    tweens.current.forEach((t) => {
      gsap.to(t, { timeScale: boost * direction.current, duration: 0.4, overwrite: true });
    });
  });

  return (
    <section
      ref={root}
      aria-label="Skills"
      data-theme-section="light"
      className="relative overflow-hidden border-y border-line py-6 text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.05] md:py-10"
    >
      <Row items={marquee} />
      <div className="text-muted">
        <Row items={[...marquee].reverse()} serif />
      </div>
    </section>
  );
}
