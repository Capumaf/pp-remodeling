// app/sections/Process.tsx
"use client";

import { ClipboardList, Wrench, Hammer, CheckCircle } from "lucide-react";
import { SectionReveal, Stagger, FadeUp } from "../components/anim";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

type StepDef = {
  icon: ReactNode;
  title: string;
  description: string;
};

function Step({
  icon,
  title,
  description,
  showLine = false,
}: StepDef & { showLine?: boolean }) {
  const controls = useAnimation();
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { amount: 0.6, once: false });

  useEffect(() => {
    if (!showLine) return;
    controls.start({ width: lineInView ? "8rem" : 0 });
  }, [lineInView, controls, showLine]);

  return (
    <FadeUp>
      {/* width tuned so 4 items + gaps fit in one row inside max-w-6xl */}
      <div className="relative flex flex-col items-center text-center w-full sm:max-w-md md:basis-[220px] lg:basis-[230px]">
        <div
          className="mb-4 sm:mb-5 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300 bg-gray-50 text-[#2E7D32]"
          aria-hidden="true"
        >
          {icon}
        </div>

        <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h4>

        {/* text takes full width of the step */}
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed w-full">
          {description}
        </p>

        {showLine && (
          <motion.div
            ref={lineRef}
            className="hidden md:block absolute top-[32px] right-[-8rem] h-px bg-gray-200"
            initial={{ width: 0 }}
            animate={controls}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </div>
    </FadeUp>
  );
}

const STEPS: StepDef[] = [
  {
    icon: <ClipboardList size={24} strokeWidth={1.5} />,
    title: "Consult",
    description:
      "We meet on-site, understand your goals, and align on scope and budget.",
  },
  {
    icon: <Wrench size={24} strokeWidth={1.5} />,
    title: "Plan",
    description: "Clear proposal with timeline, materials, and milestones.",
  },
  {
    icon: <Hammer size={24} strokeWidth={1.5} />,
    title: "Build",
    description: "Clean, precise work with regular updates and site care.",
  },
  {
    icon: <CheckCircle size={24} strokeWidth={1.5} />,
    title: "Deliver",
    description: "Final walkthrough, punch-list completion, and handoff.",
  },
];

export default function Process() {
  return (
    <SectionReveal>
      <section id="process" className="py-20 sm:py-24 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Our Process
            </h2>
          </FadeUp>

          <FadeUp>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Structured, transparent, and efficient — so you always know what’s
              next.
            </p>
          </FadeUp>

          <Stagger delay={0.1}>
            {/* one column on mobile, one row (no wrap) on md+ */}
            <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col md:flex-row md:flex-nowrap justify-center items-center md:items-start gap-10 lg:gap-12">
              {STEPS.map((s, i) => (
                <Step
                  key={s.title}
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                  showLine={i < STEPS.length - 1}
                />
              ))}
            </div>
          </Stagger>
        </div>
      </section>
    </SectionReveal>
  );
}
