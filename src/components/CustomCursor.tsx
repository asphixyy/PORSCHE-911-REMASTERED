/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

export default function CustomCursor() {
  const [hoveredType, setHoveredType] = useState<"default" | "button" | "image" | "heading">("default");
  const [isVisible, setIsVisible] = useState(false);

  // High performance hardware-accelerated motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Highly responsive trailing outer ring (snappy, low mass)
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 480, mass: 0.18 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 480, mass: 0.18 });

  // Ultra-fast pinpoint inner dot (near-zero delay)
  const dotX = useSpring(mouseX, { damping: 32, stiffness: 850, mass: 0.03 });
  const dotY = useSpring(mouseY, { damping: 32, stiffness: 850, mass: 0.03 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check for buttons, interactive links, custom cards, and sidebar items
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".sidebar-item") ||
        target.closest(".clickable") ||
        target.closest("[role='button']")
      ) {
        setHoveredType("button");
      }
      // Check for images and media showcases
      else if (
        target.closest("img") ||
        target.closest("video") ||
        target.closest(".aspect-video")
      ) {
        setHoveredType("image");
      }
      // Check for main headings and titles
      else if (
        target.closest("h1") ||
        target.closest("h2") ||
        target.closest("h3") ||
        target.closest(".font-heading")
      ) {
        setHoveredType("heading");
      } 
      else {
        setHoveredType("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Outer Adaptive Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hoveredType === "button" ? 64 : hoveredType === "image" ? 96 : hoveredType === "heading" ? 48 : 36,
          height: hoveredType === "button" ? 64 : hoveredType === "image" ? 96 : hoveredType === "heading" ? 48 : 36,
          borderColor: hoveredType === "button" ? "#fbbf24" : hoveredType === "image" ? "#ffffff" : hoveredType === "heading" ? "rgba(255,255,255,0.8)" : "rgba(255, 255, 255, 0.3)",
          borderWidth: hoveredType === "heading" ? "1px" : "1.5px",
          borderStyle: hoveredType === "image" ? "dashed" : "solid",
          rotate: hoveredType === "image" ? 360 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 25 },
          height: { type: "spring", stiffness: 300, damping: 25 },
          rotate: hoveredType === "image" ? { repeat: Infinity, duration: 8, ease: "linear" } : { duration: 0.3 },
          borderColor: { duration: 0.2 },
        }}
        className="absolute rounded-full border border-white/30 flex items-center justify-center backdrop-blur-[0.5px]"
      >
        {/* Dynamic Inner details based on hovered state */}
        <AnimatePresence>
          {hoveredType === "image" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[9px] font-mono tracking-widest font-bold text-white uppercase"
            >
              VIEW
            </motion.span>
          )}
          {hoveredType === "button" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner Pinpoint Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hoveredType === "button" ? 0.3 : hoveredType === "image" ? 0 : hoveredType === "heading" ? 3 : 1,
          backgroundColor: hoveredType === "button" ? "#fbbf24" : hoveredType === "heading" ? "rgba(251, 191, 36, 0.4)" : "#fbbf24",
          mixBlendMode: hoveredType === "heading" ? "difference" : "normal",
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 20 },
        }}
        className="absolute w-2.5 h-2.5 rounded-full z-10 shadow-lg shadow-yellow-500/20"
      />

      {/* Cyberpunk grid indicators (Only when hovering images for cinematic feel) */}
      <AnimatePresence>
        {hoveredType === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              x: dotX,
              y: dotY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="absolute flex items-center justify-center w-36 h-36"
          >
            {/* Tiny retro-tech corner ticks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
