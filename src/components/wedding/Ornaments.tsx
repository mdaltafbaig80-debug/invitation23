import { useMemo } from "react";

import { cn } from "@/lib/utils";

/** Fine antique-gold ornamental divider with a lotus centerpiece. */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 24"
      className={cn("h-5 w-44 text-wedding-gold", className)}
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <line x1="0" y1="12" x2="70" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="130" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="1" />
      <path d="M100 3 L104 12 L100 21 L96 12 Z" stroke="currentColor" strokeWidth="1" />
      <path
        d="M100 6 C 95 9 93 13 94 17 C 97 15 99 11 100 6 Z M100 6 C 105 9 107 13 106 17 C 103 15 101 11 100 6 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="70" cy="12" r="1.6" fill="currentColor" />
      <circle cx="130" cy="12" r="1.6" fill="currentColor" />
      <circle cx="82" cy="12" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="118" cy="12" r="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Small hanging floral ornament used beneath headings. */
export function FloralDangle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 34"
      className={cn("h-6 w-8 text-wedding-gold", className)}
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <line x1="20" y1="0" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="15" r="4.5" fill="currentColor" opacity="0.9" />
      <circle cx="20" cy="15" r="1.6" fill="#FFF9F0" />
      <path
        d="M20 19 C 17 23 17 27 20 30 C 23 27 23 23 20 19 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

type ToranCornerProps = {
  className?: string;
  /** Mirrors the garland so the same component serves both top corners. */
  mirrored?: boolean;
};

const LEAF_COLORS = ["#5C7423", "#6E8A2E", "#7FA03C"];
const FLOWER_COLORS = ["#E9A23B", "#F3C77E", "#AD382F", "#FFF9F0"];

/** Traditional mango-leaf and marigold toran draping from a top corner. */
export function ToranCorner({ className, mirrored }: ToranCornerProps) {
  const garland = useMemo(() => {
    // Quadratic bezier from the top edge down toward the corner.
    const p0 = { x: 0, y: 10 };
    const p1 = { x: 130, y: 16 };
    const p2 = { x: 218, y: 96 };

    const point = (t: number) => ({
      x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
      y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
    });
    const tangent = (t: number) => ({
      x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
      y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y),
    });

    const leaves = Array.from({ length: 10 }, (_, i) => {
      const t = i / 9;
      const { x, y } = point(t);
      const { x: dx, y: dy } = tangent(t);
      return {
        x,
        y,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90,
        color: LEAF_COLORS[i % LEAF_COLORS.length],
      };
    });

    const dangles = [0.3, 0.5, 0.68, 0.84].map((t, i) => {
      const { x, y } = point(t);
      return {
        x,
        y,
        length: 16 + i * 9,
        color: FLOWER_COLORS[(i * 2 + 1) % FLOWER_COLORS.length],
        isFlower: i % 2 === 0,
      };
    });

    return { leaves, dangles, path: `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}` };
  }, []);

  return (
    <svg
      viewBox="0 0 220 150"
      className={cn(className, mirrored && "-scale-x-100")}
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <path d={garland.path} stroke="#C49A45" strokeWidth="1.5" />
      {garland.leaves.map((leaf, i) => (
        <g key={`leaf-${i}`} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}>
          <path
            d="M0 -14 C 5.5 -9 5.5 2 0 5 C -5.5 2 -5.5 -9 0 -14 Z"
            fill={leaf.color}
            stroke="#4C611C"
            strokeWidth="0.5"
          />
        </g>
      ))}
      {garland.dangles.map((d, i) => (
        <g key={`dangle-${i}`}>
          <line x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.length} stroke="#C49A45" strokeWidth="1" />
          {d.isFlower ? (
            <circle cx={d.x} cy={d.y + d.length + 3.5} r="4" fill={d.color} />
          ) : (
            <path
              d={`M${d.x} ${d.y + d.length} C ${d.x - 3.5} ${d.y + d.length + 4} ${d.x - 3.5} ${d.y + d.length + 9} ${d.x} ${d.y + d.length + 12} C ${d.x + 3.5} ${d.y + d.length + 9} ${d.x + 3.5} ${d.y + d.length + 4} ${d.x} ${d.y + d.length} Z`}
              fill={d.color}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
