import { useEffect, useRef, useState } from "react";
import { INVITATIONS } from "./wedding-data";

type WeddingCoverPageProps = {
  /** Called as soon as guest clicks 'Tap to Open'. */
  onTapOpen?: () => void;
  /** Called when 1-vid has completed playing, enabling page scroll. */
  onComplete?: () => void;
};

/**
 * Top Cover Section:
 * Displays full-screen initial image with 'Tap to Open'.
 * On tap: triggers marigold flower shower, plays 1-vid.mp4 full screen (silent).
 * Does NOT disappear when finished — pauses on the final frame!
 * When finished, signals onComplete to unlock scrolling and shows animated Scroll Down prompt.
 */
export function WeddingCoverPage({ onTapOpen, onComplete }: WeddingCoverPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const coverCard = INVITATIONS[0];

  // Ensure DOM properties are set for mobile autoplay/play compliance
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.load();
    }
  }, []);

  if (!coverCard) return null;

  const handleTapToOpen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(true);
    onTapOpen?.();

    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      try {
        if (vid.readyState >= 1) {
          vid.currentTime = 0;
        }
      } catch {
        // ignore readyState error
      }
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Cover video play interrupted or delayed:", err);
        });
      }
    }
  };

  const handleVideoEnded = () => {
    setHasEnded(true);
    onComplete?.(); // Unlocks scrolling on page
  };

  const scrollToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete?.();
    document.getElementById("invitations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="cover"
      className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#241710]"
    >
      {/* Full-screen cover container */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleTapToOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleTapToOpen();
        }}
        aria-label={isPlaying ? "Wedding invitation video" : "Tap to open wedding invitation"}
        className="relative h-full w-full cursor-pointer outline-none flex items-center justify-center"
      >
        {/* Full-screen initial cover image: fades out smoothly when video plays */}
        <img
          src={coverCard.poster}
          alt="Wedding Invitation Cover"
          className={`absolute inset-0 h-full w-full object-cover sm:object-contain transition-opacity duration-300 ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Video: preloaded full-screen, stops at last frame when done */}
        <video
          ref={videoRef}
          src={coverCard.src}
          playsInline
          muted
          autoPlay={false}
          preload="auto"
          onEnded={handleVideoEnded}
          className={`h-full w-full object-cover sm:object-contain transition-opacity duration-300 ${
            isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Bottom Action Area */}
        <div className="absolute inset-x-0 bottom-10 z-40 flex flex-col items-center gap-3 px-4 sm:bottom-12">
          {!isPlaying && (
            /* 'Tap to Open' banner */
            <div className="animate-tap-pulse flex items-center gap-2.5 rounded-full border-2 border-wedding-gold bg-gradient-to-r from-wedding-red via-[#B83D32] to-[#8E251E] px-7 py-3 text-wedding-cream shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-300 group-hover:scale-105">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wedding-cream/20 text-xs">
                ✨
              </span>
              <span className="font-heading text-base font-bold tracking-[0.22em] text-wedding-cream uppercase sm:text-lg">
                Tap to Open
              </span>
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 animate-bounce text-wedding-cream"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M10 4 L10 14 M6 10 L10 14 L14 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* When 1-vid has ended: stops at last frame and displays animated Scroll Down message */}
          {hasEnded && (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={scrollToNext}
                className="group flex flex-col items-center gap-1.5 cursor-pointer outline-none transition-transform hover:scale-105 active:scale-95 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              >
                <div className="text-center font-sans font-medium text-xs sm:text-sm tracking-[0.28em] uppercase leading-relaxed text-white drop-shadow-md">
                  <div>SCROLL TO BEGIN</div>
                  <div>OUR STORY</div>
                </div>
                <div className="flex flex-col items-center pt-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 animate-bounce text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      d="M12 4v15m0 0l-5-5m5 5l5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
