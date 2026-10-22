import type { CSSProperties } from "react";

type PetalVariation = "straight" | "curved" | "slender";

type PetalSpec = {
  left: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
  drift: number;
  sway: number;
  initialRotate: number;
  spin: number;
  opacity: number;
  variation: PetalVariation;
  primaryColor: string;
  gradientColor: string;
};

/**
 * Authentic vibrant pink rose petals matching the reference wedding invite:
 * Saturated magenta, rose pink, bright carmine, and warm fuchsia.
 */
const PETAL_COLORS = [
  { primary: "#DF3A77", gradient: "#F06292" }, // Bright Rose Pink (matches image exactly)
  { primary: "#E91E63", gradient: "#FF80AB" }, // Vivid Deep Pink
  { primary: "#D81B60", gradient: "#F48FB1" }, // Classic Royal Rose
  { primary: "#C2185B", gradient: "#EC407A" }, // Rich Velvet Magenta
  { primary: "#E0407B", gradient: "#FFA4B6" }, // Soft Luminous Rose
];

function makePetals(count: number): PetalSpec[] {
  let seed = 108;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const variations: PetalVariation[] = ["straight", "curved", "slender", "straight", "curved"];

  return Array.from({ length: count }, (_, i) => {
    const color = PETAL_COLORS[i % PETAL_COLORS.length]!;
    const variation = variations[i % variations.length]!;

    // Reduced, delicate size matching user preference
    const baseW =
      variation === "straight"
        ? 11 + rand() * 4
        : variation === "curved"
          ? 12 + rand() * 4
          : 9 + rand() * 3;
    const baseH = Math.round(baseW * 1.8);

    return {
      left: rand() * 95,
      width: Math.round(baseW),
      height: baseH,
      duration: 7 + rand() * 5, // Smooth natural floating speed
      delay: Math.round(((i * 0.18) + rand() * 0.3) * 100) / 100, // Positive staggered delays: falls from the top from the beginning
      drift: (rand() * 14 - 7) * (i % 2 === 0 ? 1 : -1),
      sway: 2.2 + rand() * 2,
      initialRotate: Math.round(-45 + rand() * 90),
      spin: (rand() > 0.5 ? 1 : -1) * (120 + rand() * 180),
      opacity: 0.85 + rand() * 0.15,
      variation,
      primaryColor: color.primary,
      gradientColor: color.gradient,
    };
  });
}

const PETALS = makePetals(30);

/**
 * Exact pointed oval / almond petal SVG matching user reference photo:
 * Plump center, tapered pointed tips, clean vibrant pink color.
 */
function AlmondPetalSvg({
  index,
  variation,
  primaryColor,
  gradientColor,
}: {
  index: number;
  variation: PetalVariation;
  primaryColor: string;
  gradientColor: string;
}) {
  const gradId = `petal-grad-${index}-${variation}`;

  if (variation === "curved") {
    // Gently curved aerodynamic almond petal
    return (
      <svg
        viewBox="0 0 50 90"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 3px 6px rgba(194, 24, 91, 0.42))" }}
      >
        <defs>
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={gradientColor} />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#880e4f" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M 25 3 C 45 22, 44 65, 21 87 C 4 64, 7 24, 25 3 Z"
          fill={`url(#${gradId})`}
        />
      </svg>
    );
  }

  if (variation === "slender") {
    // Slender pointed almond petal
    return (
      <svg
        viewBox="0 0 40 85"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 2px 5px rgba(194, 24, 91, 0.38))" }}
      >
        <defs>
          <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={gradientColor} />
            <stop offset="70%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#ad1457" />
          </linearGradient>
        </defs>
        <path
          d="M 20 3 C 36 24, 36 61, 20 82 C 4 61, 4 24, 20 3 Z"
          fill={`url(#${gradId})`}
        />
      </svg>
    );
  }

  // Classic symmetrical almond / pointed oval petal (identical to user screenshot)
  return (
    <svg
      viewBox="0 0 45 80"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 3px 6px rgba(194, 24, 91, 0.45))" }}
    >
      <defs>
        <linearGradient id={gradId} x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor={gradientColor} />
          <stop offset="55%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#9c0946" />
        </linearGradient>
      </defs>
      <path
        d="M 22.5 3 C 41 22, 41 58, 22.5 77 C 4 58, 4 22, 22.5 3 Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

/**
 * Authentic Wedding Falling Rose Petals:
 * Exact pointed almond shape, prominent size, and vibrant pink tone from reference image.
 * Floats in front of all videos (z-30) after clicking 'Tap to Open'.
 */
export function FallingPetals() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {PETALS.map((petal, index) => (
        <span
          key={index}
          className="almond-petal"
          style={
            {
              left: `${petal.left}%`,
              width: `${petal.width}px`,
              height: `${petal.height}px`,
              "--duration": `${petal.duration}s`,
              "--delay": `${petal.delay}s`,
              "--drift": `${petal.drift}vw`,
              "--sway": `${petal.sway}s`,
              "--initial-rot": `${petal.initialRotate}deg`,
              "--spin": `${petal.spin}deg`,
              opacity: petal.opacity,
            } as CSSProperties
          }
        >
          <span className="almond-petal-inner">
            <AlmondPetalSvg
              index={index}
              variation={petal.variation}
              primaryColor={petal.primaryColor}
              gradientColor={petal.gradientColor}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
