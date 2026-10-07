"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience, profile } from "@/lib/content";
import RevealText from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Timeline fill tracks scroll through the list
      gsap.fromTo(
        "[data-progress]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 65%", scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-job]").forEach((job) => {
        const dot = job.querySelector("[data-dot]");
        gsap.from(job.querySelectorAll("[data-lift]"), {
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: "reveal",
          stagger: 0.08,
          scrollTrigger: { trigger: job, start: "top 82%", once: true },
        });
        gsap.to(dot, {
          backgroundColor: "#1fc85a",
          borderColor: "#1fc85a",
          scale: 1.25,
          duration: 0.4,
          scrollTrigger: { trigger: job, start: "top 65%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="experience"
      data-theme-section="light"
      className="relative px-6 pt-32 pb-32 md:px-10 md:pt-44 md:pb-44"
    >
      <SectionLabel index="03" title="Experience" />

      <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <RevealText
              as="h2"
              className="text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.045em]"
            >
              Where I&apos;ve been <span className="font-serif text-accent italic">building</span>.
            </RevealText>
            <RevealText className="mt-8 max-w-sm text-[15px] leading-relaxed text-muted" delay={0.15}>
              The path so far — the roles I&apos;ve grown in and where I built my foundations.
            </RevealText>
            <a
              href={profile.resume}
              download
              className="link-underline label mt-10 inline-flex items-center gap-2 pb-1"
            >
              Download résumé <span className="text-accent">↓</span>
            </a>
          </div>
        </div>

        <ol data-timeline className="relative md:col-span-7">
          {/* Track + scroll-driven fill */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
          <span
            aria-hidden="true"
            data-progress
            className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-accent"
          />

          {experience.map((job) => (
            <li key={job.company + job.period} data-job className="relative pb-16 pl-12 last:pb-0 md:pb-20">
              <span
                data-dot
                aria-hidden="true"
                className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border border-line bg-bg"
              />
              <p data-lift className="label flex items-center gap-3 text-muted">
                <span>{job.period}</span>
                <span className="h-px w-6 bg-line" />
                <span className={job.type === "Work" ? "text-accent" : ""}>{job.type}</span>
              </p>
              <h3 data-lift className="mt-4 text-[clamp(1.6rem,2.8vw,2.5rem)] leading-tight tracking-[-0.03em]">
                {job.role}
              </h3>
              <p data-lift className="mt-1 font-serif text-[clamp(1.25rem,2vw,1.75rem)] text-muted italic">
                {job.company}
              </p>
              <p data-lift className="mt-5 max-w-xl text-[15px] leading-relaxed text-fg/75">
                {job.description}
              </p>
              <ul data-lift className="mt-6 flex flex-wrap gap-2">
                {job.stack.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
