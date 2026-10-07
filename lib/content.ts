/**
 * All portfolio copy lives here — edit this file to update the site.
 */

export const profile = {
  firstName: "Olaoluwa",
  lastName: "Osikoya",
  nickname: "Ranmi",
  fullName: "Olaoluwa David Osikoya",
  role: "Frontend Software Engineer",
  location: "Nigeria",
  timeZone: "Africa/Lagos",
  email: "osikoyaolaoluwa2021@gmail.com",
  resume: "/resume.pdf",
  available: true,
  intro:
    "A frontend-focused software engineer building modern web experiences with Next.js, React & TypeScript — turning ideas into fast, accessible, reliable products people love to use.",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/osikoya17" },
  { label: "LinkedIn", href: "https://linkedin.com/in/olaoluwa-osikoya" },
  { label: "X / Twitter", href: "https://x.com/_Kyosi" },
];

export const marquee = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Three.js",
  "GSAP",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "Python",
  "Git",
];

export const about = {
  statement:
    "I'm a software engineer who loves turning ideas into reliable products. I design and build web applications end to end — with a soft spot for clean architecture, thoughtful UX, and the small details that make a product a pleasure to use.",
  body: "Currently going deeper on 3D for the web, motion design and polished full-stack apps. I work in WAT (UTC+1) and I'm comfortable collaborating across time zones. My approach is simple: clean, maintainable architecture, accessible interfaces — ship reliably, then iterate.",
  stats: [
    { value: 6, suffix: "+", label: "Live projects shipped" },
    { value: 3, suffix: "+", label: "Years in industry" },
    { value: 2, suffix: "", label: "Verified certifications" },
  ],
  services: [
    {
      title: "Frontend Engineering",
      text: "Responsive, accessible apps in Next.js, React & TypeScript — optimised for every screen.",
    },
    {
      title: "Full-stack Development",
      text: "End-to-end products with Node.js, Express, MongoDB and SQL behind clean interfaces.",
    },
    {
      title: "UI Engineering & Motion",
      text: "Interfaces brought to life with GSAP, Three.js and the details people feel.",
    },
    {
      title: "Networking & IT",
      text: "CCNA and Network+ certified — I understand the infrastructure my code runs on.",
    },
  ],
};

export type Project = {
  title: string;
  category: string;
  stack: string[];
  description: string;
  href: string;
  /** Screenshot in /public/projects. */
  image: string;
  /** Three colours used to paint the generative cover art. */
  palette: [string, string, string];
};

export const projects: Project[] = [
  {
    title: "Zentry Clone",
    category: "3D Landing Page",
    stack: ["React", "GSAP", "Tailwind CSS"],
    description:
      "A recreation of Zentry's landing page, rebuilt with smooth 3D transitions and a bold, game-focused layout.",
    href: "https://zentry-clone-ochre.vercel.app/",
    image: "/projects/zentry-clone.png",
    palette: ["#7aa2ff", "#2a2f8f", "#070a1f"],
  },
  {
    title: "Ìwòran",
    category: "Cinema Booking",
    stack: ["React", "Tailwind CSS", "TMDB API"],
    description: "A seat and ticket booking app that lets users reserve seats at the cinema.",
    href: "https://iworan.vercel.app/",
    image: "/projects/iworan.png",
    palette: ["#f0b46a", "#7a2e1d", "#1a0b07"],
  },
  {
    title: "Ìdánwò",
    category: "CBT Exam Platform",
    stack: ["Question banks", "Timed exams", "Results"],
    description:
      "A computer-based testing platform — build question banks, assemble practice exams, sit them under timed conditions and review detailed results.",
    href: "https://idanwo.vercel.app/",
    image: "/projects/idanwo.png",
    palette: ["#1fc85a", "#0b3d2c", "#05110c"],
  },
  {
    title: "Fyb Spotlight",
    category: "Digital Yearbook",
    stack: ["React", "Tailwind CSS", "Vite"],
    description:
      "A digital yearbook of my classmates at Obafemi Awolowo University, with profiles downloadable as JPEG or PNG.",
    href: "https://uncharted-fyb-spotlight.vercel.app/",
    image: "/projects/fyb-spotlight.png",
    palette: ["#ff6b8b", "#5b1a46", "#14060f"],
  },
  {
    title: "Ọjà",
    category: "E-commerce",
    stack: ["React", "Tailwind CSS"],
    description: "A simple e-commerce app — add items to your cart and check out.",
    href: "https://oja-three.vercel.app/",
    image: "/projects/oja.png",
    palette: ["#e9e6dd", "#8c8778", "#1b1a17"],
  },
  {
    title: "Finance Logger",
    category: "Personal Finance",
    stack: ["React", "Tailwind CSS"],
    description: "A finance logger for tracking income and expenses.",
    href: "https://financelogger-v2.vercel.app/",
    image: "/projects/finance-logger.png",
    palette: ["#c9f36a", "#3d5a12", "#0e1505"],
  },
];

export const experience = [
  {
    type: "Work",
    period: "2024 — 2025",
    role: "Frontend Developer",
    company: "Dexter Inc",
    description:
      "Developed and deployed a responsive Learning Management System with Next.js and Tailwind CSS, optimised for mobile, tablet and desktop users.",
    stack: ["Next.js", "React", "Tailwind CSS", "JavaScript", "Git"],
  },
  {
    type: "Work",
    period: "2022 — 2023",
    role: "Junior Frontend Developer",
    company: "Vivmed Pharmaceuticals",
    description:
      "Developed responsive, accessible interfaces and improved performance across key user flows.",
    stack: ["React", "Next.js", "Tailwind CSS", "JavaScript", "Git"],
  },
  {
    type: "Education",
    period: "2019 — 2026",
    role: "B.Sc. Computer Engineering",
    company: "Obafemi Awolowo University",
    description:
      "Algorithms, data structures and software engineering fundamentals — building projects along the way. Graduating 2026.",
    stack: ["Algorithms", "Data Structures", "OOP"],
  },
  {
    type: "Education",
    period: "2020 — 2022",
    role: "Full-Stack Web Development",
    company: "SQI Academy",
    description: "Intensive program covering modern JavaScript, React and backend fundamentals.",
    stack: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Python"],
  },
];

export const certifications = [
  {
    name: "CCNA",
    fullName: "Cisco Certified Network Associate",
    issuer: "Cisco",
    description:
      "Validates skills across network fundamentals, IP connectivity, routing & switching, security fundamentals and automation.",
    skills: ["Networking", "Routing & Switching", "IP Connectivity", "Network Security"],
    href: "https://www.credly.com/badges/e36a6f4c-ec55-4a16-9d5a-bcb7cd9c61b0/public_url",
  },
  {
    name: "Network+",
    fullName: "CompTIA Network+",
    issuer: "CompTIA",
    description:
      "Validates the core skills to design, configure, manage and troubleshoot wired and wireless networks across modern infrastructures.",
    skills: ["Network Architecture", "Troubleshooting", "Network Security", "Operations"],
    href: "https://www.credly.com/badges/08d2c802-46cd-411e-b6d4-e7ae682b9f1c/public_url",
  },
];
