import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { ExperienceTiles } from "@/components/experience-tiles";
import { ServiceScroller } from "@/components/service-scroller";
import { Testimonials } from "@/components/testimonials";
import { AboutTherapist } from "@/components/about-therapist";
import { AreasServed } from "@/components/areas-served";
import { BookingJourney } from "@/components/booking-journey";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col gap-4">
        <Hero />
        <ExperienceTiles />
        <ServiceScroller />
        <Testimonials />
        <AboutTherapist />
        <AreasServed />
        <BookingJourney />
      </main>
      <Footer />
    </>
  );
}

