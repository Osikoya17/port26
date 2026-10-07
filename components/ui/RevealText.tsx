"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  children: React.ReactNode;
  className?: string;
  /** "lines" slides masked lines up; "words" scrubs word opacity with scroll. */
  mode?: "lines" | "words";
  delay?: number;
};

export default function RevealText({
  as = "p",
  children,
  className = "",
  mode = "lines",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const Tag = as as "p";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      if (mode === "words") {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
              },
            ),
        });
        return;
      }

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.3,
            ease: "reveal",
            stagger: 0.09,
            delay,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
