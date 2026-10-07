"use client";

import { useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { profile, socials } from "@/lib/content";
import LocalTime from "@/components/ui/LocalTime";
import Magnetic from "@/components/ui/Magnetic";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      // Headline: chars rise from a mask
      SplitText.create("[data-contact-title]", {
        type: "lines,chars",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: 1.2,
            ease: "reveal",
            stagger: 0.018,
            scrollTrigger: { trigger: "[data-contact-title]", start: "top 80%", once: true },
          }),
      });

      gsap.from("[data-contact-fade]", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "reveal",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-contact-grid]", start: "top 88%", once: true },
      });

      gsap.from("[data-cta]", {
        scale: 0,
        rotate: -90,
        duration: 1.6,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: { trigger: "[data-cta]", start: "top 90%", once: true },
      });

      // Giant wordmark: letters scrub up as the footer arrives
      gsap.fromTo(
        "[data-wordmark] span",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-wordmark]", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer
      ref={root}
      id="contact"
      data-theme-section="dark"
      className="relative overflow-hidden px-6 pt-32 md:px-10 md:pt-44"
    >
      <SectionLabel index="05" title="Contact" />

      <div className="relative mt-14 md:mt-20">
        <h2
          data-contact-title
          className="max-w-[14ch] text-[clamp(3.25rem,9.5vw,10rem)] leading-[0.9] tracking-[-0.055em]"
        >
          Let&apos;s build something <span className="font-serif text-accent italic">remarkable</span>.
        </h2>

        <div data-cta className="mt-12 md:absolute md:right-[6%] md:bottom-0 md:mt-0">
          <Magnetic strength={0.45}>
            <a
              href={`mailto:${profile.email}`}
              className="group relative grid h-36 w-36 place-items-center overflow-hidden rounded-full bg-accent text-ink md:h-48 md:w-48"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-paper transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-100" />
              <span className="relative text-center text-[11px] tracking-[0.18em] uppercase">
                Get in
                <br />
                touch ↗
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div data-contact-grid className="mt-24 grid gap-12 border-t border-line pt-12 md:mt-32 md:grid-cols-12">
        <div data-contact-fade className="md:col-span-6">
          <p className="label text-muted">Email</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="link-underline pb-1 text-[clamp(1.25rem,2.4vw,2.25rem)] tracking-[-0.02em] break-all"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="label rounded-full border border-line px-3 py-1.5 text-muted transition-colors duration-300 hover:border-accent hover:text-fg"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>

        <div data-contact-fade className="md:col-span-3">
          <p className="label text-muted">Socials</p>
          <ul className="mt-4 space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-lg"
                >
                  <span className="link-underline pb-0.5">{s.label}</span>
                  <span className="text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div data-contact-fade className="md:col-span-3">
          <p className="label text-muted">Based in</p>
          <p className="mt-4 text-lg">{profile.location}</p>
          <p className="mt-1 text-sm text-muted">
            <LocalTime />
          </p>
        </div>
      </div>

      <div className="label mt-20 flex flex-wrap items-center justify-between gap-4 text-muted">
        <span>
          © {new Date().getFullYear()} {profile.fullName}
        </span>
        <span className="hidden md:inline">Designed &amp; built with care</span>
        <button
          type="button"
          onClick={() => lenis?.scrollTo(0, { duration: 2.2 })}
          className="group flex items-center gap-2 transition-colors hover:text-fg"
        >
          Back to top
          <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">↑</span>
        </button>
      </div>

      <div
        data-wordmark
        aria-hidden="true"
        className="mt-6 flex justify-between overflow-hidden text-[29vw] leading-[0.78] tracking-[-0.07em] uppercase select-none"
      >
        {profile.nickname.split("").map((c, i) => (
          <span key={i} className="inline-block">
            {c}
          </span>
        ))}
      </div>
    </footer>
  );
}
