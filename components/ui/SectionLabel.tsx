"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** "(01) — About" style eyebrow with a line that draws in on scroll. */
export default function SectionLabel({ index, title }: { index: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } });
      tl.from("[data-sl-line]", { scaleX: 0, duration: 1.2, ease: "premium" }).from(
        "[data-sl-text]",
        { yPercent: 110, duration: 0.9, ease: "reveal", stagger: 0.06 },
        0.15,
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="w-full">
      <div className="label flex items-center justify-between overflow-hidden pb-3 text-muted">
        <span data-sl-text className="inline-block">({index})</span>
        <span data-sl-text className="inline-block">{title}</span>
      </div>
      <div data-sl-line className="h-px origin-left bg-line" />
    </div>
  );
}
