import { useRef, useEffect, useCallback, useState } from "react";
import { animate } from "motion/react";
import { cn } from "../lib/utils";

export function GlowingEffect({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = "default",
  glow = false,
  disabled = true,
  className = "",
  movementDuration = 2,
  borderWidth = 1,
  children,
}) {
  const containerRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [angleValue, setAngleValue] = useState(0);

  const getVariantColors = useCallback(() => {
    if (variant === "white") {
      return [
        "rgba(0, 0, 0,0.9)",
        "rgba(200,200,220,0.7)",
        "rgba(0, 0, 0,0.5)",
        "transparent",
      ];
    }
    // default - colorful gradient
    return [
      "rgba(59,130,246,0.9)",   // blue
      "rgba(139,92,246,0.8)",   // purple
      "rgba(236,72,153,0.7)",   // pink
      "rgba(34,211,238,0.8)",   // cyan
      "transparent",
    ];
  }, [variant]);

  const handlePointerMove = useCallback(
    (e) => {
      if (disabled || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      const maxDist = Math.max(rect.width, rect.height) / 2;
      const normalizedDist = distance / maxDist;

      lastPosition.current = { x: e.clientX, y: e.clientY };

      if (normalizedDist < inactiveZone && !glow) {
        setIsActive(false);
        return;
      }

      // Check proximity
      const extendedRect = {
        left: rect.left - proximity,
        right: rect.right + proximity,
        top: rect.top - proximity,
        bottom: rect.bottom + proximity,
      };

      if (
        e.clientX < extendedRect.left ||
        e.clientX > extendedRect.right ||
        e.clientY < extendedRect.top ||
        e.clientY > extendedRect.bottom
      ) {
        if (!glow) {
          setIsActive(false);
          return;
        }
      }

      setIsActive(true);
    },
    [disabled, inactiveZone, proximity, glow]
  );

  const handleScroll = useCallback(() => {
    if (disabled || !containerRef.current) return;
    // Re-trigger with last known position
    handlePointerMove({
      clientX: lastPosition.current.x,
      clientY: lastPosition.current.y,
    });
  }, [disabled, handlePointerMove]);

  // Continuous angle rotation animation
  useEffect(() => {
    if (disabled) return;

    const controls = animate(0, 360, {
      duration: movementDuration,
      repeat: Infinity,
      ease: "linear",
      onUpdate: (value) => {
        setAngleValue(value);
      },
    });

    return () => controls.stop();
  }, [disabled, movementDuration]);

  // Global listeners
  useEffect(() => {
    if (disabled) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleScroll, true);

    // If glow prop is true, always active
    if (glow) {
      setIsActive(true);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll, true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [disabled, glow, handlePointerMove, handleScroll]);

  const colors = getVariantColors();
  const colorStops = colors
    .map((c, i) => `${c} ${(i * spread) / colors.length}deg`)
    .join(", ");

  const gradient =
    isActive || glow
      ? `repeating-conic-gradient(from ${angleValue}deg, ${colorStops})`
      : "none";

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        "--glowingeffect-border-width": `${borderWidth}px`,
        "--blur": `${blur}px`,
        "--spread": `${spread}deg`,
        "--start": `${angleValue}deg`,
        "--active": isActive || glow ? "1" : "0",
      }}
    >
      {/* Hidden border placeholder */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0"
        style={{ borderWidth: `${borderWidth}px` }}
      />

      {/* Glow container */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300",
          isActive || glow ? "opacity-100" : "opacity-0"
        )}
        style={{
          overflow: "hidden",
        }}
      >
        {/* The glow itself */}
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background: gradient,
            filter: `blur(${blur}px)`,
            transform: "scale(1.1)",
          }}
        />
      </div>

      {/* Inner content area that sits above glow */}
      <div className="relative z-10 rounded-[inherit]">{children}</div>
    </div>
  );
}

export default GlowingEffect;
