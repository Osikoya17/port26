"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about } from "@/lib/content";
import RevealText from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import Portrait from "@/components/ui/Portrait";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Count-up stats
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        });
      });

      // Service rows: draw the rule, then lift the content
      gsap.utils.toArray<HTMLElement>("[data-service]").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
        tl.from(row.querySelector("[data-rule]"), {
          scaleX: 0,
          duration: 1.2,
          ease: "premium",
        }).from(
          row.querySelectorAll("[data-lift]"),
          { yPercent: 100, opacity: 0, duration: 1, ease: "reveal", stagger: 0.06 },
          0.2,
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      data-theme-section="light"
      className="relative px-6 pt-32 pb-32 md:px-10 md:pt-44 md:pb-44"
    >
      <SectionLabel index="01" title="About" />

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="label text-muted">Who I am</p>
        </div>
        <RevealText
          as="p"
          mode="words"
          className="text-[clamp(1.75rem,3.7vw,3.6rem)] leading-[1.08] tracking-[-0.03em] md:col-span-9"
        >
          {about.statement}
        </RevealText>
      </div>

      <div className="mt-24 grid gap-16 md:mt-36 md:grid-cols-12">
        <Portrait className="self-start md:sticky md:top-24 md:col-span-4" />

        <div className="md:col-span-7 md:col-start-6">
          <div className="grid gap-20">
            <div>
              <RevealText className="max-w-md text-[15px] leading-relaxed text-muted">
                {about.body}
              </RevealText>

              <dl className="mt-14 grid grid-cols-3 gap-6">
                {about.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.05em]">
                      <span data-count={s.value}>0</span>
                      <span className="font-serif text-accent italic">{s.suffix}</span>
                    </dd>
                    <dd aria-hidden="true" className="label mt-3 leading-snug text-muted">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul>
              <li className="label mb-6 text-muted">What I do</li>
              {about.services.map((s, i) => (
                <li key={s.title} data-service className="group relative">
                  <div data-rule className="h-px origin-left bg-line" />
                  <div className="grid grid-cols-12 items-baseline gap-4 overflow-hidden py-7">
                    <span data-lift className="col-span-2 font-mono text-xs text-muted">
                      0{i + 1}
                    </span>
                    <h3
                      data-lift
                      className="col-span-10 text-[clamp(1.3rem,1.9vw,1.75rem)] leading-tight tracking-[-0.02em]"
                    >
                      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-2">
                        {s.title}
                      </span>
                    </h3>
                    <p
                      data-lift
                      className="col-span-10 col-start-3 text-sm leading-relaxed text-muted"
                    >
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
              <li aria-hidden="true" className="h-px bg-line" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
