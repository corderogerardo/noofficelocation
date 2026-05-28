"use client";

import { useEffect, useRef } from "react";

import type { HeroScene } from "@/lib/three/hero-scene";
import { cn } from "@/lib/utils";

/**
 * Mounts the low-poly sun/ocean hero scene onto a canvas. Three.js and the
 * scene module are imported lazily so they stay out of the initial bundle and
 * never run on the server.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: HeroScene | undefined;
    let cancelled = false;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    void import("@/lib/three/hero-scene")
      .then(({ HeroScene }) => {
        if (cancelled || !canvasRef.current) return;
        try {
          scene = new HeroScene();
          scene.init(canvasRef.current, {
            preset: "horizon",
            accent: "sun",
            waveIntensity: 1,
            reduceMotion: prefersReduced,
          });
        } catch (error) {
          // WebGL may be unavailable/blocked — degrade gracefully to the
          // static sky gradient behind the hero content.
          console.warn("Hero scene unavailable:", error);
          scene?.destroy();
          scene = undefined;
        }
      })
      .catch(() => {
        /* dynamic import failed; the static hero remains */
      });

    return () => {
      cancelled = true;
      scene?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 block size-full", className)}
    />
  );
}
