import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Providers from "@/components/providers/Providers";
import { profile } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const supreme = localFont({
  src: "../public/Fonts/supreme-regular.woff2",
  variable: "--font-supreme",
  weight: "400",
});

export const metadata: Metadata = {
  title: `${profile.firstName} ${profile.lastName} — ${profile.role}`,
  description: profile.intro,
  openGraph: {
    title: `${profile.firstName} ${profile.lastName} — ${profile.role}`,
    description: profile.intro,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f1ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${supreme.variable} antialiased`}
    >
      <body className="font-sans" suppressHydrationWarning>
        <Providers>
          <Preloader />
          <Navbar />
          {children}
        </Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
