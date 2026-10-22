import { useEffect, useState } from "react";

import { MUHURTHAM_ISO, VENUE_NAME, VENUE_LINES } from "./wedding-data";
import { GoldDivider } from "./Ornaments";
import { Reveal } from "./Reveal";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function split(remainingMs: number): Remaining {
  const clamped = Math.max(0, remainingMs);
  return {
    days: Math.floor(clamped / DAY_MS),
    hours: Math.floor((clamped % DAY_MS) / HOUR_MS),
    minutes: Math.floor((clamped % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((clamped % MINUTE_MS) / 1000),
  };
}

const UNITS: Array<{ key: keyof Remaining; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

/** Live countdown to the Muhurtham: 22 November 2026, 9:00 AM IST. */
export function MuhurthamCountdown() {
  const target = MUHURTHAM_ISO;
  // Null until mounted: the server cannot know the guest's "now", so boxes
  // render with placeholders first and never hydration-mismatch.
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const targetMs = new Date(target).getTime();
    const tick = () => setRemainingMs(targetMs - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const complete = remainingMs !== null && remainingMs <= 0;
  const time = remainingMs === null ? null : split(remainingMs);

  return (
    <section className="relative z-10 px-4 py-16 text-center md:py-24">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="font-calligraphy text-5xl text-wedding-red md:text-6xl">
          Countdown to the Muhurtham
        </h2>
        <GoldDivider className="mx-auto mt-4" />
        <p className="mt-6 font-heading text-xl text-wedding-olive md:text-2xl">
          Sunday, 22 November 2026 · 9:00 AM IST
        </p>
      </Reveal>

      <Reveal delay={120} className="mx-auto mt-10 max-w-2xl">
        {complete ? (
          <div className="wedding-card px-6 py-10">
            <p className="font-calligraphy text-4xl text-wedding-red md:text-5xl">
              The Muhurtham Day Is Here!
            </p>
            <p className="mt-4 font-heading text-lg text-wedding-olive md:text-xl">
              With love and blessings, thank you for being part of our celebration.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-4 gap-2 sm:gap-4"
            role="timer"
            aria-label="Time remaining until the Muhurtham"
          >
            {UNITS.map((unit) => (
              <div
                key={unit.key}
                className="rounded-lg border border-wedding-gold bg-wedding-cream/85 px-1 py-4 shadow-[0_18px_40px_-28px_rgba(120,91,66,0.45)] sm:py-6"
              >
                <p className="font-heading text-3xl font-semibold tabular-nums text-wedding-olive sm:text-5xl">
                  {time === null ? "–" : String(time[unit.key]).padStart(2, "0")}
                </p>
                <p className="mt-1 font-heading text-[10px] tracking-[0.25em] text-wedding-brown uppercase sm:text-xs">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-8 font-heading text-base text-wedding-brown md:text-lg">
          {VENUE_NAME} · {VENUE_LINES.join(" ")}
        </p>
      </Reveal>
    </section>
  );
}
