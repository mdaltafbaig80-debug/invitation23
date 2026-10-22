import { useEffect, useRef, useState } from "react";
import { INVITATIONS } from "./wedding-data";

type InvitationViewerProps = {
  /** Index of the open invitation, or null when closed. */
  openIndex: number | null;
  onClose: () => void;
  /** Moves to another invitation (wrap-around). */
  onNavigate: (index: number) => void;
};

const TAB_NAMES = ["1. Cover", "2. Introduction", "3. Reception", "4. Muhurtham"];
const SWIPE_THRESHOLD = 48;

/** Full-screen image viewer with tabs, keyboard arrows, Escape, and mobile swipe. */
export function InvitationViewer({ openIndex, onClose, onNavigate }: InvitationViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const isOpen = openIndex !== null;
  const invitation = openIndex === null ? undefined : INVITATIONS[openIndex];
  const count = INVITATIONS.length;

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((openIndex + 1) % count);
      if (event.key === "ArrowLeft") onNavigate((openIndex - 1 + count) % count);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, openIndex, count, onClose, onNavigate]);

  // Reset the fade-in whenever a different card is shown.
  useEffect(() => setLoaded(false), [openIndex]);

  if (!isOpen || !invitation) return null;

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined) return;
    const delta = end - start;
    if (delta <= -SWIPE_THRESHOLD) onNavigate((openIndex + 1) % count);
    if (delta >= SWIPE_THRESHOLD) onNavigate((openIndex - 1 + count) % count);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${invitation.title} invitation viewer`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#2B1D12]/95 p-3 backdrop-blur-md sm:p-4"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Bar with Title and Close Button */}
      <div
        className="flex w-full max-w-4xl items-center justify-between pt-1 sm:pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left">
          <p className="font-heading text-xs tracking-[0.25em] text-wedding-gold uppercase">
            Card {openIndex + 1} of {count}
          </p>
          <h2 className="font-heading text-sm font-semibold tracking-wider text-wedding-cream uppercase sm:text-base">
            {invitation.title}
          </h2>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-wedding-gold bg-wedding-cream/95 text-wedding-red shadow-lg transition-colors hover:bg-wedding-peach focus-visible:ring-2 focus-visible:ring-wedding-gold focus-visible:outline-none"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M5 5 L15 15 M15 5 L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main Artwork with Prev/Next Controls */}
      <div
        className="relative my-auto flex max-h-[74vh] max-w-full items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate((openIndex - 1 + count) % count);
          }}
          aria-label="Previous invitation"
          className="absolute -left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-wedding-gold bg-wedding-cream/95 text-wedding-red shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-wedding-gold focus-visible:outline-none sm:-left-8 md:-left-16"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M12.5 4 L6.5 10 L12.5 16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <video
          key={invitation.src}
          src={invitation.src}
          poster={invitation.poster}
          controls
          autoPlay
          muted
          playsInline
          className="max-h-[72vh] w-auto max-w-[85vw] rounded-md border border-wedding-gold object-contain shadow-2xl"
        />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate((openIndex + 1) % count);
          }}
          aria-label="Next invitation"
          className="absolute -right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-wedding-gold bg-wedding-cream/95 text-wedding-red shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-wedding-gold focus-visible:outline-none sm:-right-8 md:-right-16"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M7.5 4 L13.5 10 L7.5 16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Caption & Counter */}
      <div className="pb-2 text-center" onClick={(event) => event.stopPropagation()}>
        <p className="font-heading text-xs tracking-[0.3em] text-wedding-gold uppercase sm:text-sm">
          {invitation.title} · {openIndex + 1} of {count}
        </p>
      </div>
    </div>
  );
}
