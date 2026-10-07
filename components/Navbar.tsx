"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/providers/Providers";
import { profile } from "@/lib/content";

const NAV_LINKS = [
  { label: "ABOUT", href: "/#about" },
  { label: "WORK", href: "/#work" },
  { label: "EXP", href: "/#experience" },
  { label: "CERTIFICATIONS", href: "/#certifications" },
];

const hashOf = (href: string) => `#${href.split("#")[1]}`;

function Chevron() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 2.5 8.5 6l-4 3.5" />
    </svg>
  );
}

export default function Navbar() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [activeHash, setActiveHash] = useState("");
  const [open, setOpen] = useState(false);
  const { done } = useIntro();
  const hidden = useRef(false);

  const lenis = useLenis(({ scroll, direction }) => {
    if (open) return;
    const shouldHide = direction === 1 && scroll > 240;
    if (shouldHide !== hidden.current) {
      hidden.current = shouldHide;
      gsap.to(header.current, { yPercent: shouldHide ? -110 : 0, duration: 0.7, ease: "premium" });
    }
  }, [open]);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const triggers = NAV_LINKS.map((link) => {
      const el = document.querySelector(hashOf(link.href));
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setActiveHash(hashOf(link.href));
          else setActiveHash((h) => (h === hashOf(link.href) ? "" : h));
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  // Intro: slide in after the preloader
  useGSAP(
    () => {
      if (!done) {
        gsap.set("[data-nav-item]", { yPercent: 120, opacity: 0 });
        return;
      }
      gsap.to("[data-nav-item]", {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "reveal",
        stagger: 0.05,
        delay: 0.5,
      });
    },
    { scope: header, dependencies: [done] },
  );

  // Mobile menu open/close
  useGSAP(
    () => {
      if (!menu.current) return;
      if (open) {
        lenis?.stop();
        gsap
          .timeline()
          .set(menu.current, { display: "flex" })
          .fromTo(
            menu.current,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "premium" },
          )
          .fromTo(
            "[data-menu-link]",
            { yPercent: 110 },
            { yPercent: 0, duration: 0.9, ease: "reveal", stagger: 0.06 },
            "-=0.45",
          );
      } else {
        lenis?.start();
        gsap
          .timeline()
          .to(menu.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "premium" })
          .set(menu.current, { display: "none" });
      }
    },
    { dependencies: [open] },
  );

  const goTo = (e: React.MouseEvent, href: string) => {
    const target = hashOf(href);
    if (!document.querySelector(target)) return;
    e.preventDefault();
    setOpen(false);
    lenis?.scrollTo(target, { offset: -20, duration: 1.6 });
    history.replaceState(null, "", target);
  };

  return (
    <>
      <header
        ref={header}
        className="fixed inset-x-0 top-0 z-50 h-15 border-b border-line bg-bg/75 backdrop-blur-xl"
        role="banner"
      >
        <nav
          className="mx-auto flex h-full items-center justify-between overflow-hidden px-6 font-supreme md:px-10"
          aria-label="Primary"
        >
          {/* Left — Wordmark */}
          <Link
            href="/"
            data-nav-item
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              lenis?.scrollTo(0, { duration: 1.6 });
            }}
            className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-fg uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
          >
            {profile.nickname}
            <span className="font-serif text-[13px] tracking-normal text-muted normal-case italic">
              ©{String(new Date().getFullYear()).slice(2)}
            </span>
          </Link>

          {/* Center — Navigation */}
          <ul className="hidden h-full items-center gap-8 md:flex" role="list">
            {NAV_LINKS.map((link) => {
              const active = activeHash === hashOf(link.href);
              return (
                <li key={link.href} className="relative flex h-full items-center">
                  <Link
                    href={link.href}
                    data-nav-item
                    onClick={(e) => goTo(e, link.href)}
                    aria-current={active ? "location" : undefined}
                    className={`group relative text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ${
                      active ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-1/2 right-full mr-1 -translate-y-1/2 text-accent transition-all duration-300 ${
                        active
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    >
                      <Chevron />
                    </span>
                    {link.label}
                  </Link>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-px w-full origin-left bg-fg transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* Right — Status + Actions */}
          <div className="flex items-center gap-5">
            {profile.available && (
              <span data-nav-item className="hidden items-center gap-2 text-[10px] tracking-[0.15em] text-muted uppercase lg:flex">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                Available
              </span>
            )}

            <div className="hidden items-center gap-4 md:flex">
              <a
                href={profile.resume}
                download
                data-nav-item
                className="group relative text-[10px] tracking-[0.15em] text-muted uppercase transition-colors duration-300 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 right-full mr-1 -translate-x-1 -translate-y-1/2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 1.5v5.6" />
                    <path d="m3.5 4.8 2.5 2.4 2.5-2.4" />
                    <path d="M2 10.4h8" />
                  </svg>
                </span>
                Resume
              </a>

              <Link
                href="/#contact"
                data-nav-item
                onClick={(e) => goTo(e, "/#contact")}
                className="group relative overflow-hidden border border-fg px-4 py-1.5 text-[10px] tracking-[0.15em] text-fg uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
              >
                <span className="absolute inset-0 translate-y-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-bg">Contact</span>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              data-nav-item
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span
                className={`block h-px w-5 bg-fg transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-fg transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-bg px-6 pt-28 pb-10 md:hidden"
      >
        <ul className="space-y-2">
          {[...NAV_LINKS, { label: "CONTACT", href: "/#contact" }].map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <Link
                href={link.href}
                data-menu-link
                onClick={(e) => goTo(e, link.href)}
                className="flex items-baseline gap-4 text-[13vw] leading-[1.05] tracking-[-0.04em]"
              >
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
        <div className="label flex items-center justify-between text-muted">
          <a href={`mailto:${profile.email}`} className="link-underline">
            Email me
          </a>
          <a href={profile.resume} download className="link-underline">
            Resume ↓
          </a>
        </div>
      </div>
    </>
  );
}
