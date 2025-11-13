import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="bg-[#F7F5F0] py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">Contact</h2>
        <p className="text-gray-600 text-base sm:text-lg mb-8">
          Tell us about your project. We’ll get back to you promptly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <ContactForm />

          <div className="p-5 sm:p-6 rounded-xl border border-[#E5E7EB] bg-white">
            <h3 className="font-semibold text-[#1F2937] text-lg sm:text-xl mb-4">Get In Touch</h3>
            <p className="mb-3 text-sm sm:text-base"><strong>Phone:</strong> (240) 418-4590</p>
            <p className="mb-3 text-sm sm:text-base"><strong>Email:</strong> contact@ppremodeling.com</p>
            <p className="mb-3 text-sm sm:text-base"><strong>Location:</strong> Serving Maryland and surrounding areas</p>
            <p className="mt-6 text-[#6B7280] text-xs sm:text-sm bg-[#F9FAFB] p-4 rounded">
              We’re available Monday–Friday from 8 AM – 6 PM. Send us a message anytime — we’ll respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
