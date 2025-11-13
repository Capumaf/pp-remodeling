import ServiceCard from "../components/ServiceCard";
import { SectionReveal, Stagger, FadeUp } from "../components/anim";

export default function Services() {
  return (
    <SectionReveal>
      <section id="services" className="py-20 sm:py-24 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-8">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] tracking-[-0.01em]">
                Our Services
              </h2>
            </FadeUp>
            <FadeUp>
              <a href="#contact" className="text-[#2E7D32] font-semibold hover:underline text-sm sm:text-base">
                Get a Quote
              </a>
            </FadeUp>
          </div>

          <Stagger delay={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <FadeUp>
                <ServiceCard
                  title="Remodeling"
                  summary="Modern, functional updates to kitchens, bathrooms, and interiors."
                  bullets={["Custom layouts & finishes", "Quality materials", "Full project coordination"]}
                />
              </FadeUp>
              <FadeUp>
                <ServiceCard
                  title="Repairs"
                  summary="Practical fixes to keep your space safe and functional."
                  bullets={["Drywall & leaks", "Doors & windows", "Light carpentry & electrical"]}
                />
              </FadeUp>
              <FadeUp>
                <ServiceCard
                  title="Painting — Interior & Exterior"
                  summary="Detailed prep, smooth finishes, and weather-resistant coatings."
                  bullets={["Walls, ceilings & trim", "Exterior protection", "Surface prep & patching"]}
                />
              </FadeUp>
              <FadeUp>
                <ServiceCard
                  title="Flooring & Trim"
                  summary="Clean transitions and durable installation."
                  bullets={["Hardwood, vinyl, laminate, tile", "Baseboards & moldings", "Leveling & underlayment"]}
                />
              </FadeUp>
              <FadeUp>
                <ServiceCard
                  title="Decks & Outdoor"
                  summary="Build and renew outdoor spaces for everyday living."
                  bullets={["Wood or composite decks", "Railings & stairs", "Sealing & maintenance"]}
                />
              </FadeUp>
              <FadeUp>
                <ServiceCard
                  title="Maintenance & Upgrades"
                  summary="Small changes that add comfort, safety, and value."
                  bullets={["Preventive checks", "Cosmetic touch-ups", "Post-service support"]}
                />
              </FadeUp>
            </div>
          </Stagger>

          <FadeUp>
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-white
                           bg-[#2E7D32] hover:bg-[#256428] hover:scale-[1.03] shadow-sm transition-all"
              >
                Get a Free Estimate
              </a>
              <span className="text-[#6B7280] text-sm sm:text-base">
                Or call us: <strong className="text-[#1F2937]">(240) 418-4590</strong>
              </span>
            </div>
          </FadeUp>
        </div>
      </section>
    </SectionReveal>
  );
}
