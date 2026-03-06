import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { ExperienceTiles } from "@/components/experience-tiles";
import { ServiceScroller } from "@/components/service-scroller";
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
        <AreasServed />
        <BookingJourney />
      </main>
      <Footer />
    </>
  );
}

