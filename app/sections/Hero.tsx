"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Home, ShieldCheck, Star, Paintbrush, Hammer } from "lucide-react";
import AnimatedHouse from "../components/AnimatedHouse";

// 🔒 Cambia esto a true cuando ya tengas la licencia
const SHOW_LICENSE = false;

/* Variants del H1 “assembling” */
const container = (rm: boolean) => ({
  hidden: {},
  show: {
    transition: rm
      ? { staggerChildren: 0 }
      : { staggerChildren: 0.09, delayChildren: 0.1 },
  },
});

const word = (rm: boolean) => ({
  hidden: { opacity: 0, x: rm ? 0 : -28 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: rm ? 0 : 0.6,
    },
  },
});

export default function Hero() {
  const [animKey, setAnimKey] = useState(0);
  const rm = useReducedMotion() ?? false;

  useEffect(() => {
    const el = document.getElementById("home");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setAnimKey((k) => k + 1),
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const line1 = ["Welcome", "to", "P&P"];
  const line2 = ["Remodeling"];

  return (
    <section
      id="home"
      className="px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-28 lg:py-36 bg-white text-[#1F2937]"
    >
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        
        {/* Texto */}
        <div>
          <motion.h1
            key={animKey}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2E7D32] leading-tight tracking-[-0.02em]"
            variants={container(rm)}
            initial="hidden"
            animate="show"
          >
            <span className="mr-2 inline-flex flex-wrap gap-x-2">
              {line1.map((w) => (
                <motion.span key={w} className="inline-block" variants={word(rm)}>
                  {w}
                </motion.span>
              ))}
            </span>

            <br className="hidden md:block" />

            <motion.span
              className="inline-flex flex-wrap gap-x-2"
              variants={{
                hidden: {},
                show: {
                  transition: rm
                    ? { staggerChildren: 0 }
                    : { delayChildren: 0.22, staggerChildren: 0.09 },
                },
              }}
            >
              {line2.map((w) => (
                <motion.span key={w} className="inline-block" variants={word(rm)}>
                  {w}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: rm ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              delay: rm ? 0 : 0.55,
              duration: rm ? 0 : 0.55,
            }}
          >
            Quality remodeling services in Maryland — built with care,
            precision, and years of experience.
          </motion.p>

          <motion.div
            className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"
            initial={{ opacity: 0, y: rm ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              delay: rm ? 0 : 0.75,
              duration: rm ? 0 : 0.55,
            }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-white bg-[#2E7D32] hover:bg-[#256428] hover:scale-[1.03] shadow-sm transition-all"
            >
              <Hammer className="w-5 h-5" /> Get a Free Estimate
            </a>

            <a
              href="#services"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-[#1F2937] bg-amber-400/90 hover:bg-amber-400 hover:scale-[1.03] shadow-sm transition-all"
            >
              <Paintbrush className="w-5 h-5" /> View Services
            </a>
          </motion.div>

          {/* Badges */}
          <ul className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 text-[0.9rem] sm:text-sm">

            {/* Locally Owned */}
            <li className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
              <Home className="w-4 h-4 text-[#2E7D32]" /> Locally Owned
            </li>

            {/* Licensed & Insured (solo si SHOW_LICENSE es true) */}
            {SHOW_LICENSE && (
              <li className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Licensed & Insured
              </li>
            )}

            {/* 15+ Years Experience */}
            <li className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
              <Star className="w-4 h-4 text-[#2E7D32]" /> 15+ Years Experience
            </li>

          </ul>
        </div>

        {/* Ilustración */}
        <div className="flex justify-center md:justify-end">
          <AnimatedHouse key={animKey} />
        </div>

      </div>
    </section>
  );
}
