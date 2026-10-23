import { useEffect, useRef, useState } from "react";
import { INVITATIONS } from "./wedding-data";

type InvitationGalleryProps = {
  /** Optional callback if parent needs notification. */
  onOpen?: (index: number) => void;
};

/**
 * Individual full-screen video section:
 * - Plays automatically when the guest scrolls to it.
 * - Multi-threshold observer ensures reliable autoplay on mobile devices (e.g. 4-vid).
 * - Completely silent (muted).
 * - Map button at bottom directing to Reception / Marriage venue map.
 */
function FullscreenVideoItem({
  src,
  poster,
  title,
  alt,
  mapUrl,
  mapLabel,
}: {
  src: string;
  poster?: string | undefined;
  title: string;
  alt: string;
  mapUrl?: string | undefined;
  mapLabel?: string | undefined;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const hasPlayedRef = useRef(false);

  // Enforce DOM muted property for mobile autoplay policy compliance
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.load();
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const vid = videoRef.current;
        if (!entry || !vid) return;

        // When video is sufficiently visible in viewport (at least 25% visible)
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          if (!hasPlayedRef.current) {
            // Pause any other playing videos so mobile hardware decoder is free for this video
            document.querySelectorAll("video").forEach((otherVid) => {
              if (otherVid !== vid && !otherVid.paused) {
                otherVid.pause();
              }
            });

            vid.defaultMuted = true;
            vid.muted = true;
            try {
              if (vid.readyState >= 1) {
                vid.currentTime = 0;
              }
            } catch {
              // ignore
            }
            const p = vid.play();
            if (p !== undefined) {
              p.then(() => {
                hasPlayedRef.current = true;
                setIsPaused(false);
              }).catch((err) => {
                console.warn("Autoplay deferred or blocked:", err);
                // Keep hasPlayedRef false so next intersection threshold or scroll retries!
                setIsPaused(true);
              });
            }
          }
        } else if (entry.intersectionRatio < 0.2) {
          // Pause when scrolled out of view to save resources
          if (!hasEnded && !vid.paused) {
            vid.pause();
            setIsPaused(true);
          }
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75], // Multiple checkpoints for reliable triggering
      },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasEnded]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    // Pause any other playing videos
    document.querySelectorAll("video").forEach((otherVid) => {
      if (otherVid !== vid && !otherVid.paused) {
        otherVid.pause();
      }
    });

    vid.defaultMuted = true;
    vid.muted = true;
    if (vid.paused || hasEnded) {
      if (hasEnded) {
        try {
          vid.currentTime = 0;
        } catch {
          // ignore
        }
        setHasEnded(false);
      }
      vid
        .play()
        .then(() => {
          hasPlayedRef.current = true;
          setIsPaused(false);
        })
        .catch(() => {});
    } else {
      vid.pause();
      setIsPaused(true);
    }
  };

  return (
    <section
      ref={containerRef}
      onClick={togglePlay}
      className="relative flex h-[100dvh] w-full cursor-pointer items-center justify-center overflow-hidden bg-[#1D120B]"
    >
      {/* Full-screen video element - plays on scroll into view or on tap */}
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        muted
        playsInline
        preload="auto"
        onEnded={() => {
          setHasEnded(true);
          setIsPaused(true);
        }}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        aria-label={alt}
        className="h-full w-full object-cover sm:object-contain"
      />

      {/* Map button directing to Reception / Marriage venue */}
      {mapUrl && (
        <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center px-4">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={mapLabel || `View ${title} Venue Map`}
            className="group flex items-center gap-2.5 rounded-full border border-wedding-gold/90 bg-black/80 px-6 py-2.5 text-wedding-cream shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/95 hover:border-wedding-cream active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-wedding-gold transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.5" fill="currentColor" />
            </svg>
            <span className="font-heading text-xs sm:text-sm font-bold tracking-[0.2em] text-wedding-gold uppercase group-hover:text-wedding-cream">
              {mapLabel || "View Venue Map"}
            </span>
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 text-wedding-gold/80 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
}

/**
 * Full-Screen Foot Image Section:
 * Displays footimg.jpeg fitted cleanly to mobile/desktop screens.
 * Features a simple minimalist bouncing scroll animation without a button.
 */
function FootImageSection() {
  const scrollToVideos = () => {
    document.getElementById("video-first")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="footimg-section"
      onClick={scrollToVideos}
      className="relative flex h-[100dvh] w-full cursor-pointer items-center justify-center overflow-hidden bg-[#241710] select-none"
    >
      <img
        src="/invitations/footimg.jpeg"
        alt="Wedding Invitation of Niharika & Likith"
        className="h-full w-full max-h-[100dvh] max-w-full object-contain drop-shadow-2xl"
      />

      {/* Simple Minimalist Scroll Animation */}
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-30 flex flex-col items-center pointer-events-none">
        <div className="flex flex-col items-center gap-1 text-wedding-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-bounce">
          <span className="font-heading text-[11px] sm:text-xs tracking-[0.28em] uppercase text-wedding-gold/90 font-medium">
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-wedding-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

/**
 * Sequential Full-Screen Vertical Scroll Gallery:
 * Displays footimg.jpeg first, followed by 3-vid.mp4 (Reception) and 4-vid.mp4 (Muhurtham).
 * Each video plays automatically when the guest scrolls to it.
 */
export function InvitationGallery({ onOpen }: InvitationGalleryProps = {}) {
  // Videos 3, 4 (indices 1, 2 from INVITATIONS)
  const scrollVideos = INVITATIONS.slice(1);

  return (
    <div id="invitations" className="relative z-10 w-full">
      {/* 1. Foot Image Card */}
      <FootImageSection />

      {/* 2. Invitation Videos: 3-vid (Reception) & 4-vid (Muhurtham) that appear while scrolling */}
      <div id="video-first">
        {scrollVideos.map((invitation) => {
          return (
            <FullscreenVideoItem
              key={invitation.src}
              src={invitation.src}
              poster={invitation.poster}
              title={invitation.title}
              alt={invitation.alt}
              mapUrl={invitation.mapUrl}
              mapLabel={invitation.mapLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
