"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { certifications } from "@/lib/content";
import RevealText from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Certifications() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-cert]", {
        y: 100,
        opacity: 0,
        rotateX: -14,
        duration: 1.3,
        ease: "reveal",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-cert-grid]", start: "top 82%", once: true },
      });

      if (window.matchMedia("(hover: none)").matches) return;

      // 3D tilt + spotlight that follows the cursor
      const cleanups = gsap.utils.toArray<HTMLElement>("[data-cert]").map((card) => {
        const inner = card.querySelector<HTMLElement>("[data-cert-inner]")!;
        const rx = gsap.quickTo(inner, "rotateX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(inner, "rotateY", { duration: 0.6, ease: "power3" });

        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 10);
          rx((0.5 - py) * 10);
          inner.style.setProperty("--x", `${px * 100}%`);
          inner.style.setProperty("--y", `${py * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="certifications"
      data-theme-section="light"
      className="relative px-6 pt-16 pb-32 md:px-10 md:pb-44"
    >
      <SectionLabel index="04" title="Certifications" />

      <div className="mt-14 mb-16 grid gap-8 md:mt-20 md:mb-24 md:grid-cols-12">
        <RevealText
          as="h2"
          className="text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.045em] md:col-span-7"
        >
          Credentials, <span className="font-serif italic">verified</span>.
        </RevealText>
        <RevealText
          className="self-end text-[15px] leading-relaxed text-muted md:col-span-4 md:col-start-9"
          delay={0.15}
        >
          Industry certifications backing my networking and IT foundations — each one verifiable on
          Credly.
        </RevealText>
      </div>

      <ul data-cert-grid className="grid gap-4 perspective-[1400px] lg:grid-cols-2">
        {certifications.map((c, i) => (
          <li key={c.name} data-cert className="group">
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Verify ${c.fullName} on Credly`}
              data-cert-inner
              className="relative flex h-full min-h-[26rem] flex-col justify-between overflow-hidden rounded-md border border-line bg-bg p-7 transition-colors duration-500 transform-3d hover:border-fg/30 md:p-10"
            >
              {/* Spotlight */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(520px circle at var(--x,50%) var(--y,50%), rgb(31 200 90 / 0.14), transparent 45%)",
                }}
              />

              <div className="relative flex items-start justify-between">
                <span className="label flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Verified
                </span>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")} / {String(certifications.length).padStart(2, "0")}
                </span>
              </div>

              <div className="relative mt-12 translate-z-[40px]">
                <p className="label text-muted">{c.issuer}</p>
                <h3 className="mt-3 text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.85] tracking-[-0.06em]">
                  {c.name}
                </h3>
                <p className="mt-3 font-serif text-xl text-muted italic">{c.fullName}</p>
              </div>

              <div className="relative mt-10">
                <p className="max-w-lg text-[15px] leading-relaxed text-fg/75">{c.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <li key={s} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                  <span className="label text-muted transition-colors duration-300 group-hover:text-fg">
                    Verify on Credly
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                    ↑
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
