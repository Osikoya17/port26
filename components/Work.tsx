"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/lib/content";
import RevealText from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";

const domain = (href: string) => new URL(href).hostname;

/** Project screenshot with an editorial overlay. */
function Cover({
  project,
  sizes,
  className = "",
}: {
  project: Project;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: project.palette[2] }}>
      <Image
        src={project.image}
        alt={`${project.title} — ${project.category}`}
        fill
        sizes={sizes}
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(12_12_11/0.85),rgb(12_12_11/0.1)_55%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-paper">
        <div>
          <p className="label text-paper/60">{project.category}</p>
          <p className="mt-1 font-serif text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none italic">
            {project.title}
          </p>
        </div>
        <p className="font-mono text-[11px] text-paper/60">{domain(project.href)}</p>
      </div>
    </div>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });

      // Rows: draw rule, then slide the title up from a mask
      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } });
        tl.from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1.3, ease: "premium" }).from(
          row.querySelectorAll("[data-lift]"),
          { yPercent: 110, duration: 1.1, ease: "reveal", stagger: 0.05 },
          0.15,
        );
      });

      // Big heading words slide toward their resting place as the section arrives
      const converge = { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true };
      gsap.from("[data-work-word='a']", { xPercent: 12, ease: "none", scrollTrigger: converge });
      gsap.from("[data-work-word='b']", { xPercent: -12, ease: "none", scrollTrigger: converge });

      // Cursor-following preview (desktop only)
      const card = preview.current;
      const section = root.current;
      const ul = list.current;
      if (!card || !section || !ul || window.matchMedia("(hover: none)").matches) return;

      const x = gsap.quickTo(card, "x", { duration: 0.7, ease: "power3" });
      const y = gsap.quickTo(card, "y", { duration: 0.7, ease: "power3" });
      const r = gsap.quickTo(card, "rotate", { duration: 0.9, ease: "power3" });
      let lastX = 0;

      const enter = () => gsap.to(card, { scale: 1, opacity: 1, duration: 0.6, ease: "reveal" });
      const leave = () =>
        gsap.to(card, { scale: 0.6, opacity: 0, duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        x(e.clientX - rect.left);
        y(e.clientY - rect.top);
        r(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };

      ul.addEventListener("pointerenter", enter);
      ul.addEventListener("pointerleave", leave);
      ul.addEventListener("pointermove", move);
      return () => {
        ul.removeEventListener("pointerenter", enter);
        ul.removeEventListener("pointerleave", leave);
        ul.removeEventListener("pointermove", move);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="work"
      data-theme-section="dark"
      className="relative overflow-hidden px-6 pt-32 pb-32 md:px-10 md:pt-44 md:pb-44"
    >
      <SectionLabel index="02" title="Selected Work" />

      <div className="mt-14 mb-20 md:mt-20 md:mb-28">
        <h2 className="text-[clamp(3.5rem,13vw,13rem)] leading-[0.85] tracking-[-0.06em] uppercase">
          <span data-work-word="a" className="block">
            Selected
          </span>
          <span data-work-word="b" className="flex items-start justify-end gap-4">
            <span className="mt-[0.15em] font-serif text-[0.18em] tracking-normal text-accent normal-case italic">
              ({String(projects.length).padStart(2, "0")})
            </span>
            Work
          </span>
        </h2>
        <RevealText className="mt-10 max-w-md text-[15px] leading-relaxed text-muted md:ml-[25%]">
          A few things I&apos;ve built — projects where I got to design, build and ship, from
          rich interfaces to full web apps.
        </RevealText>
      </div>

      {/* Floating preview */}
      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-20 hidden aspect-[16/10] w-[420px] overflow-hidden rounded-sm opacity-0 shadow-2xl ring-1 ring-white/10 md:block lg:w-[500px]"
      >
        <div
          className="h-full transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)]"
          style={{ transform: `translateY(-${active * 100}%)` }}
        >
          {projects.map((p) => (
            <Cover key={p.title} project={p} sizes="500px" className="h-full w-full" />
          ))}
        </div>
      </div>

      <ul
        ref={list}
        className="relative [&:hover>li]:opacity-35 [&>li]:transition-opacity [&>li]:duration-500 [&>li:hover]:opacity-100"
      >
        {projects.map((p, i) => (
          <li key={p.title} data-project onPointerEnter={() => setActive(i)} className="group">
            <div data-rule className="h-px origin-left bg-line" />
            <a href={p.href} target="_blank" rel="noreferrer" className="block py-8 md:py-10">
              <Cover project={p} sizes="100vw" className="mb-6 aspect-[16/10] w-full rounded-sm md:hidden" />
              <div className="grid grid-cols-12 items-center gap-4">
                <span className="col-span-2 overflow-hidden font-mono text-xs text-muted md:col-span-1">
                  <span data-lift className="inline-block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3 className="col-span-10 overflow-hidden md:col-span-6">
                  <span
                    data-lift
                    className="inline-block text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.045em]"
                  >
                    <span className="inline-block transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-4 md:group-hover:translate-x-8">
                      {p.title}
                    </span>
                  </span>
                </h3>
                <div className="col-span-10 col-start-3 overflow-hidden md:col-span-3 md:col-start-auto">
                  <div data-lift>
                    <p className="text-sm">{p.category}</p>
                    <p className="mt-1 text-sm text-muted">{p.stack.join(" · ")}</p>
                  </div>
                </div>
                <div className="col-span-12 hidden items-center justify-end gap-6 overflow-hidden md:col-span-2 md:flex">
                  <span data-lift className="label text-muted">
                    Live
                  </span>
                  <span data-lift className="inline-block">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
        <li aria-hidden="true" className="h-px bg-line" />
      </ul>
    </section>
  );
}
