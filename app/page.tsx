import Hero from "./sections/Hero";
import Why from "./sections/Why";
import Services from "./sections/Services";
import WorkInAction from "./sections/WorkinAction"; // 👈
import Process from "./sections/Process";
import Contact from "./sections/Contact";

export default function Page() {
  return (
    <>
      <section id="home" className="scroll-mt-24"><Hero /></section>
      <section id="why" className="scroll-mt-24"><Why /></section>
      <section id="services" className="scroll-mt-24"><Services /></section>
      <section id="work" className="scroll-mt-24"><WorkInAction /></section> {/* 👈 */}
      <section id="process" className="scroll-mt-24"><Process /></section>
      <section id="contact" className="scroll-mt-24"><Contact /></section>
    </>
  );
}
