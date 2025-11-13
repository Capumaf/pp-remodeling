import { ShieldCheck, Handshake, Star, Clock, Hammer, Home } from "lucide-react";
import { SectionReveal, Stagger, FadeUp } from "../components/anim";

export default function Why() {
  const reasons = [
    { icon: <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E7D32]" />, title: "Licensed & Insured",
      text: "Fully licensed and insured. We comply with Maryland building standards on every project." },
    { icon: <Handshake className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E7D32]" />, title: "Customer-Focused",
      text: "Your goals lead the way. Clear communication from first call to final walkthrough." },
    { icon: <Hammer className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E7D32]" />, title: "Quality Craftsmanship",
      text: "Clean lines, durable finishes, and precise installation that stands the test of time." },
    { icon: <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E7D32]" />, title: "On-Time & On-Budget",
      text: "Reliable planning and consistent updates keep timelines and budgets on track." },
    { icon: <Star className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E7D32]" />, title: "Proven Experience",
      text: "15+ years remodeling homes across Maryland with repeat clients and referrals." },
    { icon: <Home className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E7D32]" />, title: "Comprehensive Solutions",
      text: "Kitchens, baths, decks, painting, flooring—interior and exterior handled end-to-end." },
  ];

  return (
    <SectionReveal>
      <section id="why" className="py-20 sm:py-24 md:py-28 lg:py-32 bg-[#FAFAF9] text-[#1F2937]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2E7D32] mb-4 sm:mb-6">
              Why Choose P&amp;P Remodeling?
            </h2>
          </FadeUp>

          <FadeUp>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 sm:mb-14 md:mb-16">
              Family-owned, Maryland-based, and committed to excellent work and honest service. We deliver
              thoughtful design, reliable timelines, and results that last.
            </p>
          </FadeUp>

          <Stagger delay={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {reasons.map((r) => (
                <FadeUp key={r.title}>
                  <div className="p-5 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
                    <div className="mb-3">{r.icon}</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#2E7D32] mb-1.5">{r.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{r.text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Stagger>
        </div>
      </section>
    </SectionReveal>
  );
}
