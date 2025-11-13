// app/components/anim.tsx
"use client";

import { MotionConfig, motion, useReducedMotion, useAnimation, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

/** Config global de animaciones (timing/ease unificados) */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}

/** Sección que hace fade+slide y REPLAY en cada entrada/salida del viewport */
export function SectionReveal({
  children,
  amount = 0.2,
  offsetY = 16,
}: {
  children: ReactNode;
  amount?: number; // qué fracción debe ser visible para activar
  offsetY?: number; // desplazamiento inicial hacia abajo
}) {
  const rm = useReducedMotion();
  const controls = useAnimation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount, margin: "0px", once: false });

  useEffect(() => {
    if (rm) return; // respeta reduced motion
    if (inView) controls.start("show");
    else controls.start("hidden");
  }, [inView, controls, rm]);

  return (
    <motion.section
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: rm ? 0 : offsetY },
        show: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.section>
  );
}

/** Contenedor con STAGGER que también hace replay */
export function Stagger({
  children,
  delay = 0.08,
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  amount?: number;
}) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once: false });

  useEffect(() => {
    if (inView) controls.start("show");
    else controls.start("hidden");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay } },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

/** Item con fade-up corto que hace replay dentro de Stagger/SectionReveal */
export function FadeUp({
  children,
  y = 12,
}: {
  children: ReactNode;
  y?: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: rm ? 0 : y },
        show: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
