import Header from "@/components/header";
import HeroCarousel from "./_components/hero-carousel";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="relative">
        <HeroCarousel />
        <div className="absolute top-0 flex h-full w-full items-center bg-black/50 px-50">
          <div className="space-y-15 text-white text-shadow-lg">
            <p className="text-4xl">
              PELUDITOS! Es un proyecto que consiste en apoyar fundaciónes dónde
              se impulse la adopción de perros o gatos.
            </p>
            <p className="text-3xl uppercase">
              Dedicados al cuidado de los animales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
