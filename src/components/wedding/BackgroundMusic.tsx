import { useEffect, useRef, useState } from "react";

type BackgroundMusicProps = {
  src?: string;
  autoPlayTrigger?: boolean;
};

/**
 * Background Music Player:
 * - Compatible with all mobile devices including iOS / iPhone.
 * - Starts playback upon user interaction ("Tap to Open").
 * - Displays an elegant floating gold music toggle button in the top corner.
 * - Fails silently if no audio file is provided.
 */
export function BackgroundMusic({
  src = "/music.mp3",
  autoPlayTrigger = false,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check if music file exists
  useEffect(() => {
    if (!src) return;

    const audio = new Audio();
    audio.src = src;
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsAvailable(true);
    };

    const handleError = () => {
      setIsAvailable(false);
    };

    audio.addEventListener("canplaythrough", handleCanPlay, { once: true });
    audio.addEventListener("error", handleError, { once: true });

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  // When user clicks 'Tap to Open', start music
  useEffect(() => {
    if (autoPlayTrigger && isAvailable && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Audio autoplay prevented or file absent:", err);
        });
    }
  }, [autoPlayTrigger, isAvailable]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
        className="group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-wedding-gold/80 bg-black/70 text-wedding-gold shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all hover:scale-110 active:scale-95"
      >
        {isPlaying ? (
          <span className="flex items-center justify-center animate-spin [animation-duration:5s]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-wedding-gold"
              fill="currentColor"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </span>
        ) : (
          <span className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-stone-400"
              fill="currentColor"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="absolute h-0.5 w-6 rotate-45 bg-rose-500 rounded" />
          </span>
        )}
      </button>
    </div>
  );
}
