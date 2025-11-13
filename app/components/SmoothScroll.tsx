// app/components/SmoothScroll.tsx
"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Respect users who prefer reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,        // smoothness (lower = smoother)
      smoothWheel: true,
    });

    // RAF loop
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Intercept internal anchor clicks and route through Lenis
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;

      e.preventDefault();

      // account for fixed header height
      const header = document.querySelector("header");
      const offset = header instanceof HTMLElement ? header.offsetHeight + 8 : 64;

      lenis.scrollTo(target, {
        offset: -offset,   // scroll a bit above the section
        duration: 1.0,     // seconds
        easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      // @ts-ignore
      lenis.destroy?.();
    };
  }, []);

  return null;
}
