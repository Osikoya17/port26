"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "ABOUT", href: "/#about" },
  { label: "WORK", href: "/#work" },
  { label: "EXP", href: "/#experience" },
  { label: "CERTIFICATIONS", href: "/#certifications" },
];

function isActive(href: string, activeHash: string) {
  const hash = href.split("#")[1];
  return hash ? `#${hash}` === activeHash : false;
}

export default function Navbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setActiveHash(window.location.hash);

    const onHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 h-15 border-b border-neutral-200 bg-white/80 backdrop-blur-xl"
      role="banner"
    >
      <nav
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 font-supreme md:px-10"
        aria-label="Primary"
      >
        {/* Left — Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-neutral-900 uppercase transition-colors duration-300 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          RANMI
        </Link>

        {/* Center — Navigation */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href, activeHash);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`group relative text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                    active
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 right-full mr-1 -translate-x-1 -translate-y-1/2 text-green-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
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
                      <path d="M4.5 2.5 8.5 6l-4 3.5" />
                    </svg>
                  </span>
                  {link.label}
                </Link>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-5.25 left-0 h-px w-full bg-neutral-900"
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right — Status + Actions */}
        <div className="flex items-center gap-5">
          

          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              download
              className="group relative text-[10px] tracking-[0.15em] text-neutral-500 uppercase transition-colors duration-300 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <span
                aria-hidden="true"
                className="absolute top-1/2 right-full mr-1 -translate-x-1 -translate-y-1/2 text-green-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
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

            <a
              href="mailto:osikoyaolaoluwa2021@gmail.com"
              className="border border-neutral-900 px-4 py-1.5 text-[10px] tracking-[0.15em] text-neutral-900 uppercase transition-colors duration-300 hover:bg-neutral-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
