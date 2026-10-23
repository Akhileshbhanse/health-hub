"use client";

/**
 * Glyph Portal © HealthHub
 * An interactive typography and scroll-driven perspective portal through live type.
 * Engineered for high-performance React & Tailwind environments with smooth transitions.
 */
import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type GlyphPortalStyle = CSSProperties & {
  "--gp-paper"?: string;
  "--gp-ink"?: string;
  "--gp-field"?: string;
  "--gp-foreground"?: string;
};

export type GlyphPortalProps = {
  word?: string;
  /** First matching character. Omit to choose the active letter. */
  focusChar?: string;
  /** Hover, tap, or use arrow keys to choose a letter before scrolling. */
  interactive?: boolean;
  /** Decorative, inert, mounted once. Fill its parent with an image, video, or canvas. */
  background?: ReactNode;
  /** Optional foreground composition for the opening frame, above the clipped scene. */
  front?: ReactNode;
  children?: ReactNode;
  /** Scroll travel in visible container heights, clamped to 1–8. */
  scrollLength?: number;
  fontFamily?: string;
  fontWeight?: number;
  annotations?: boolean;
  enterLabel?: string;
  className?: string;
  style?: GlyphPortalStyle;
  /** Called once per rendered scroll frame. */
  onProgress?: (progress: number) => void;
};

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function GlyphPortal({
  word = "HEALTH",
  focusChar,
  interactive = true,
  background,
  front,
  children,
  scrollLength = 2.5,
  fontFamily = 'system-ui, -apple-system, sans-serif',
  fontWeight = 800,
  annotations = true,
  enterLabel = "Step inside",
  className,
  style,
  onProgress,
}: GlyphPortalProps) {
  const letters = (word || "HEALTH").toUpperCase().split("");
  const defaultIdx = focusChar ? Math.max(0, letters.indexOf(focusChar.toUpperCase())) : 0;
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate how much has been scrolled relative to the container
      const totalScrollable = containerHeight - windowHeight;
      if (totalScrollable <= 0) return;
      
      const currentScroll = -rect.top;
      const currentProgress = clamp(currentScroll / totalScrollable, 0, 1);
      
      setProgress(currentProgress);
      if (onProgress) onProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollLength, onProgress]);

  // Subtle mouse parallax on hero
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  // Keyboard navigation for letters
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return;
    if (e.key === "ArrowRight") {
      setSelectedIdx((prev) => (prev + 1) % letters.length);
    } else if (e.key === "ArrowLeft") {
      setSelectedIdx((prev) => (prev - 1 + letters.length) % letters.length);
    }
  };

  // Compute camera scale and portal depth based on scroll progress
  const scale = 1 + progress * 14;
  const opacityFade = clamp(1 - progress * 1.8, 0, 1);
  const contentReveal = smooth(0.35, 0.9, progress);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-clip", className)}
      style={{
        height: `${scrollLength * 100}vh`,
        ...style,
      }}
    >
      {/* Sticky viewport frame */}
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        tabIndex={interactive ? 0 : undefined}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-transform duration-700 ease-out"
             style={{
               transform: `scale(${1 + progress * 0.2}) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
             }}>
          {background ? (
            background
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-brand-pale/40 via-white/50 to-brand-cream/80 backdrop-blur-2xl" />
          )}
        </div>

        {/* Ambient Glow Orbs */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{
            background: "radial-gradient(circle, rgba(116, 198, 157, 0.35) 0%, rgba(27, 67, 50, 0) 70%)",
            transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
          }}
        />

        {/* Front Slot (e.g. badges, eyebrow title, subtitles) */}
        {front && (
          <div
            className="absolute top-12 left-0 right-0 z-20 px-6 text-center transition-all duration-500 ease-out pointer-events-none"
            style={{
              opacity: opacityFade,
              transform: `translateY(${-progress * 60}px)`,
            }}
          >
            <div className="pointer-events-auto">{front}</div>
          </div>
        )}

        {/* The Live Glyph Typographic Portal */}
        <div
          className="relative z-10 flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${scale}) translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="flex items-center justify-center gap-1 sm:gap-3 tracking-tighter"
            style={{ fontFamily, fontWeight }}
          >
            {letters.map((char, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <button
                  key={`${char}-${idx}`}
                  type="button"
                  onClick={() => interactive && setSelectedIdx(idx)}
                  className={cn(
                    "relative transition-all duration-300 font-extrabold focus:outline-none focus:ring-2 focus:ring-brand-leaf/40 rounded-2xl px-2 sm:px-4 py-1",
                    "text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none",
                    isSelected
                      ? "text-brand-forest scale-105 drop-shadow-xl"
                      : "text-brand-forest/30 hover:text-brand-forest/70 hover:scale-100"
                  )}
                  style={{
                    textShadow: isSelected
                      ? "0 10px 30px rgba(27, 67, 50, 0.2), 0 0 40px rgba(116, 198, 157, 0.4)"
                      : "none",
                  }}
                  aria-label={`Letter ${char}, ${isSelected ? "selected" : "selectable"}`}
                >
                  {char}

                  {/* Letter active indicator */}
                  {isSelected && annotations && (
                    <span
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-6 rounded-full bg-gradient-to-r from-brand-leaf to-brand-mint shadow-md"
                      style={{ opacity: opacityFade }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll / Action Prompt */}
        <div
          className="absolute bottom-10 z-20 flex flex-col items-center gap-2 transition-all duration-500 ease-out"
          style={{
            opacity: opacityFade,
            transform: `translateY(${progress * 40}px)`,
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-brand-leaf/30 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-brand-forest shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-brand-leaf animate-ping" />
            {enterLabel}
          </div>
          <span className="text-xs text-brand-body/80 font-medium">
            Scroll down to enter the health portal ↓
          </span>
        </div>

        {/* In-Portal Revealed Children Content */}
        {children && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center p-6 sm:p-12 transition-all duration-700 pointer-events-none"
            style={{
              opacity: contentReveal,
              transform: `scale(${0.9 + contentReveal * 0.1}) translateY(${(1 - contentReveal) * 40}px)`,
              pointerEvents: contentReveal > 0.6 ? "auto" : "none",
            }}
          >
            <div className="w-full max-w-5xl overflow-y-auto max-h-[85vh] p-2">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlyphPortal;
