/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface LiquidGlassProps {
  ior?: number; // Index of Refraction (controls displacement scale)
  thickness?: number; // Glass thickness (controls blur depth)
  chromaticAberration?: number; // Chromatic aberration simulation
}

export default function LiquidGlass({
  ior = 1.15,
  thickness = 8,
  chromaticAberration = 0.1,
}: LiquidGlassProps) {
  const [baseFrequency, setBaseFrequency] = useState("0.008 0.012");
  
  // Calculate blur and scale offsets inspired by component props
  const blurValue = thickness * 3; // e.g. thickness 8 = 24px blur
  const displacementScale = (ior - 1.0) * 350; // e.g. ior 1.15 = scale of 52.5px distortion

  // Continuous fluid movement animation
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Gentle ocean-wave fluid movement
      const xFreq = 0.006 + Math.sin(elapsed * 0.15) * 0.0015;
      const yFreq = 0.009 + Math.cos(elapsed * 0.22) * 0.002;
      
      setBaseFrequency(`${xFreq.toFixed(6)} ${yFreq.toFixed(6)}`);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const { scrollYProgress } = useScroll();
  
  // Scroll-linked dynamic glass changes
  const dynamicBlur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [`${blurValue}px`, `${blurValue * 1.5}px`, `${blurValue * 0.8}px`]
  );
  
  const dynamicScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [displacementScale, displacementScale * 1.3, displacementScale * 0.7]
  );

  return (
    <>
      {/* SVG Liquid Refraction Filters */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* Main refraction filter */}
          <filter id="liquid-glass-distortion">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="3"
              result="noise"
            />
            {/* Map the noise to displacement to distort background video pixels */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
          
          {/* Subtle color split filter simulating Chromatic Aberration */}
          <filter id="chromatic-aberration" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementScale * chromaticAberration * 4} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            
            {/* Color channel splits */}
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="displaced" result="red" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="displaced" result="green" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="SourceGraphic" result="blue" />
            
            {/* Recombine channels with slight chromatic displacement */}
            <feOffset dx="-1.5" dy="-0.5" in="red" result="red-offset" />
            <feOffset dx="1.5" dy="0.5" in="green" result="green-offset" />
            <feBlend mode="screen" in="red-offset" in2="blue" result="red-blue" />
            <feBlend mode="screen" in="green-offset" in2="red-blue" />
          </filter>
        </defs>
      </svg>

      {/* The Liquid Glass Refractive Backdrop Panel */}
      <motion.div
        style={{
          backdropFilter: `blur(${blurValue}px) saturate(125%) contrast(105%)`,
          WebkitBackdropFilter: `blur(${blurValue}px) saturate(125%) contrast(105%)`,
          filter: "url(#liquid-glass-distortion)",
        }}
        className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
      />

      {/* Specular reflection overlay for high-gloss, liquid-sheen appearance */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.0) 50%, rgba(255, 255, 255, 0.05) 100%)",
        }}
      />

      {/* Chromatic aberration fringe layer */}
      <div
        className="absolute inset-0 z-15 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          filter: "url(#chromatic-aberration)",
        }}
      />
    </>
  );
}
