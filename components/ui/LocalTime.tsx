"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/lib/content";

function format() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const zone =
    new Intl.DateTimeFormat("en-GB", { timeZone: profile.timeZone, timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${time} ${zone}`;
}

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 15_000);
  return () => clearInterval(id);
}

/** Live clock in the owner's time zone. Renders a placeholder on the server to avoid hydration drift. */
export default function LocalTime({ prefix = "Local time" }: { prefix?: string }) {
  const time = useSyncExternalStore(subscribe, format, () => null);

  return (
    <span>
      {prefix && `${prefix} — `}
      <span className="tabular-nums">{time ?? "--:--"}</span>
    </span>
  );
}
