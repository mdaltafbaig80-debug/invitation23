import { useEffect, useRef, useState, useCallback } from "react";

type ScratchCardProps = {
  /** Called when the 5-second viewing period completes after scratching */
  onComplete: () => void;
};

export function ScratchCard({ onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isDrawingRef = useRef(false);
  const hasTriggeredRevealRef = useRef(false);
  const scratchedPointsRef = useRef<number>(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Entrance blur animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Canvas with Gold Luxury Foil
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Metallic shimmering gold gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#C59A45");
    grad.addColorStop(0.2, "#E9D28B");
    grad.addColorStop(0.4, "#B88628");
    grad.addColorStop(0.6, "#F7E8A4");
    grad.addColorStop(0.8, "#C59A45");
    grad.addColorStop(1, "#8A641A");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle decorative border inside canvas
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.strokeStyle = "rgba(138, 100, 26, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, w - 28, h - 28);

    // Subtle sparkle stars pattern
    const sparkles = [
      { x: w * 0.15, y: h * 0.25 },
      { x: w * 0.85, y: h * 0.22 },
      { x: w * 0.18, y: h * 0.78 },
      { x: w * 0.82, y: h * 0.75 },
      { x: w * 0.5, y: h * 0.2 },
    ];
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    sparkles.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Center Banner for text
    const bannerW = Math.min(260, w - 40);
    const bannerH = 50;
    const bx = (w - bannerW) / 2;
    const by = (h - bannerH) / 2;

    ctx.fillStyle = "rgba(56, 34, 14, 0.85)";
    ctx.beginPath();
    ctx.roundRect(bx, by, bannerW, bannerH, 25);
    ctx.fill();

    ctx.strokeStyle = "#F5D77F";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text on canvas
    ctx.fillStyle = "#FFF9ED";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH TO REVEAL ✨", w / 2, h / 2 - 2);

    ctx.fillStyle = "rgba(255, 249, 237, 0.75)";
    ctx.font = "10px sans-serif";
    ctx.fillText("Rub with finger or mouse", w / 2, h / 2 + 14);
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!hasTriggeredRevealRef.current) {
        initCanvas();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  // Check scratch percentage
  const checkScratchCompletion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredRevealRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      const totalPixels = data.length / 4;
      // Sample every 16th pixel for high performance
      for (let i = 3; i < data.length; i += 64) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }
      const sampledTotal = totalPixels / 16;
      const percent = (transparentPixels / sampledTotal) * 100;

      // When over 30% cleared or enough points scratched
      if (percent > 30 || scratchedPointsRef.current > 45) {
        hasTriggeredRevealRef.current = true;
        setIsRevealing(true);

        // Smoothly fade canvas out completely
        if (canvas) {
          canvas.style.transition = "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
          canvas.style.opacity = "0";
        }

        setTimeout(() => {
          setIsScratched(true);
        }, 700);
      }
    } catch {
      // In case of canvas security or context error, auto-reveal
      if (scratchedPointsRef.current > 30) {
        hasTriggeredRevealRef.current = true;
        setIsScratched(true);
      }
    }
  }, []);

  // Scratch action (scratch off layer)
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredRevealRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 48; // Generous brush size for quick, satisfying scratch
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    if (lastPosRef.current) {
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    lastPosRef.current = { x, y };
    scratchedPointsRef.current += 1;

    // Check completion occasionally
    if (scratchedPointsRef.current % 5 === 0) {
      checkScratchCompletion();
    }
  };

  // Touch Events
  const handleTouchStart = (e: React.TouchEvent) => {
    isDrawingRef.current = true;
    const touch = e.touches[0];
    if (touch) {
      lastPosRef.current = null;
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    if (touch) {
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    checkScratchCompletion();
  };

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawingRef.current = true;
    lastPosRef.current = null;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    checkScratchCompletion();
  };

  // 5-second countdown timer once scratched
  useEffect(() => {
    if (!isScratched) return;

    setSecondsRemaining(5);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTransitionOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isScratched]);

  // Trigger blur animation then onComplete
  const handleTransitionOut = () => {
    setIsExiting(true);
    // After blur animation runs for 1000ms, notify parent
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#1C110A]/95 via-[#25170F]/95 to-[#1C110A]/95 backdrop-blur-md transition-all duration-1000 ease-out ${
        isExiting
          ? "filter blur-2xl opacity-0 scale-105 pointer-events-none"
          : isMounted
            ? "filter blur-0 opacity-100 scale-100"
            : "filter blur-xl opacity-0 scale-95"
      }`}
    >
      {/* Decorative Gold Glow in background */}
      <div className="absolute h-96 w-96 rounded-full bg-wedding-gold/15 blur-3xl pointer-events-none" />

      {/* Royal Wedding Card Container */}
      <div className="relative w-full max-w-md rounded-2xl border-2 border-wedding-gold bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FCECDC] p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col items-center">
        {/* Ornate Inner Border Line */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-xl border border-wedding-gold/40 pointer-events-none" />

        {/* Auspicious Top Header Motif */}
        <div className="relative z-10 flex flex-col items-center text-center mb-4">
          <div className="flex items-center gap-2 text-wedding-gold">
            <span className="h-[1px] w-8 sm:w-12 bg-wedding-gold/60" />
            <span className="text-xl">✨ 🪔 ✨</span>
            <span className="h-[1px] w-8 sm:w-12 bg-wedding-gold/60" />
          </div>

          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-wide text-[#8E251E] drop-shadow-xs">
            A Special Note For You
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm tracking-wider uppercase text-wedding-brown/80 font-medium">
            {isScratched
              ? "✨ Unlocked with Love & Blessings ✨"
              : "Scratch the card to reveal our message"}
          </p>
        </div>

        {/* The Scratch Box (Message behind, Canvas on top) */}
        <div className="relative w-full h-[220px] sm:h-[240px] rounded-xl overflow-hidden border-2 border-wedding-gold shadow-inner bg-gradient-to-b from-[#FFFDF9] to-[#FBF1E4] select-none">
          {/* Inner Message Layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 sm:p-6 text-center select-none z-10">
            <p className="font-heading text-base sm:text-lg font-semibold leading-relaxed text-[#8E251E] drop-shadow-xs">
              Every beautiful journey begins with love, laughter, and blessings. ❤️
            </p>
            <p className="mt-3 font-heading text-sm sm:text-base font-normal leading-relaxed text-wedding-brown/95">
              As we step into a wonderful new chapter of our lives, we would love to have you by our side.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[1px] w-6 bg-wedding-gold/60" />
              <span className="font-calligraphy text-2xl text-[#AD382F]">
                Niharika & Likith
              </span>
              <span className="h-[1px] w-6 bg-wedding-gold/60" />
            </div>
          </div>

          {/* Canvas Scratch Overlay */}
          {!isScratched && (
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "none" }}
              className="absolute inset-0 w-full h-full cursor-pointer z-20 transition-opacity duration-500 select-none"
            />
          )}
        </div>

        {/* Bottom Status / 5-Second Transition Area */}
        <div className="relative z-10 mt-5 w-full flex flex-col items-center">
          {isScratched ? (
            <div className="flex flex-col items-center w-full gap-2.5 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between w-full px-2 text-xs font-sans text-wedding-brown">
                <span className="font-medium text-[#8E251E] flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#8E251E] animate-ping" />
                  Opening Invitation in {secondsRemaining}s...
                </span>
                <button
                  type="button"
                  onClick={handleTransitionOut}
                  className="font-bold text-[#8E251E] hover:text-wedding-gold transition-colors underline cursor-pointer text-xs"
                >
                  Continue Now →
                </button>
              </div>

              {/* Progress bar filling over 5s */}
              <div className="w-full h-1.5 bg-wedding-gold/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-wedding-gold via-[#B83D32] to-[#8E251E] transition-all ease-linear"
                  style={{
                    width: `${((5 - secondsRemaining) / 5) * 100}%`,
                    transitionDuration: "1000ms",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-sans text-wedding-brown/70 italic">
              <span>👉</span>
              <span>Use your finger or mouse cursor to scratch the box above</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
