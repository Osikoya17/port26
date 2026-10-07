"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/lib/content";

/** Portrait with a curtain reveal, settle-in scale and scroll parallax. */
export default function Portrait({ className = "" }: { className?: string }) {
  const root = useRef<HTMLElement>(null);
  const [missing, setMissing] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
      tl.fromTo(
        "[data-frame]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "premium" },
      )
        .from("[data-zoom]", { scale: 1.4, duration: 2, ease: "reveal" }, 0)
        .from("[data-caption]", { yPercent: 110, duration: 1, ease: "reveal", stagger: 0.08 }, 0.6);

      // Inner image drifts against the scroll
      gsap.fromTo(
        "[data-parallax]",
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <figure ref={root} className={`group ${className}`}>
      <div data-frame className="relative aspect-4/5 overflow-hidden rounded-sm bg-ink">
        <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
          <div data-zoom className="relative h-full w-full">
            {missing ? (
              <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_35%,#2a2a28,#0c0c0b_70%)]">
                <span className="font-serif text-7xl text-paper/80 italic">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </span>
              </div>
            ) : (
              <Image
                src="/portrait.jpg"
                alt={`Portrait of ${profile.fullName}`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-[50%_20%] grayscale transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                onError={() => setMissing(true)}
                priority={false}
              />
            )}
          </div>
        </div>
        {/* Soft vignette + accent sheen on hover */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(12_12_11/0.55),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(31_200_90/0.18),transparent_55%)] opacity-0 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100" />
        <div className="label absolute inset-x-0 bottom-0 flex justify-between overflow-hidden p-4 text-paper/80">
          <span data-caption className="inline-block">
            {profile.fullName}
          </span>
          <span data-caption className="inline-block">
            {profile.location.split(",")[0]}
          </span>
        </div>
      </div>
      <figcaption className="label mt-3 flex items-center gap-2 overflow-hidden text-muted">
        <span data-caption className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          That&apos;s me — say hi
        </span>
      </figcaption>
    </figure>
  );
}
