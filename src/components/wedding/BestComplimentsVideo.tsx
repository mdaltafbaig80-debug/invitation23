import { useEffect, useRef, useState } from "react";

/**
 * 5-vid: Best Compliments & Family Blessings section.
 * Positioned right before the WeddingClosing ("Thank You") section.
 * Plays automatically when scrolled into view, muted so background music continues uninterrupted.
 */
export function BestComplimentsVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [, setIsPaused] = useState(true);
  const hasPlayedRef = useRef(false);

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

        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          if (!hasPlayedRef.current) {
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
              }).catch(() => {
                setIsPaused(true);
              });
            }
          }
        } else if (entry.intersectionRatio < 0.2) {
          if (!hasEnded && !vid.paused) {
            vid.pause();
            setIsPaused(true);
          }
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasEnded]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

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
      className="relative flex h-[100dvh] w-full cursor-pointer items-center justify-center overflow-hidden bg-[#1D120B] select-none"
    >
      <video
        ref={videoRef}
        src="/invitations/5-vid.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={() => {
          setHasEnded(true);
          setIsPaused(true);
        }}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        aria-label="Best Compliments and Family Blessings"
        className="h-full w-full object-cover sm:object-contain"
      />
    </section>
  );
}
