import Header from "@/components/header";
import HeroCarousel from "./_components/hero-carousel";
import Services from "./_components/services";
import News from "./_components/news";
import Team from "./_components/team";

export default function Home() {
  return (
    <main>
      <section className="relative">
        <HeroCarousel />
        <div className="absolute top-0 flex h-full w-full items-center bg-black/50 px-8 md:px-50">
          <div className="space-y-4 font-medium text-white text-shadow-lg md:space-y-15">
            <h1 className="md:text-4xl">
              PELUDITOS! Es un proyecto que consiste en apoyar fundaciónes dónde
              se impulse la adopción de perros o gatos.
            </h1>
            <p className="text-sm uppercase md:text-3xl">
              Dedicados al cuidado de los animales
            </p>
          </div>
        </div>
      </section>
      <h2 className="bg-primary mt-2 w-full py-8 text-center text-3xl font-medium text-white">
        NUESTROS SERVICIOS!
      </h2>
      <Services />
      <h2 className="bg-primary mb-2 w-full py-8 text-center text-3xl font-medium text-white">
        NOTICIAS!
      </h2>
      <News />
      <h2 className="bg-primary mt-2 w-full py-8 text-center text-3xl font-medium text-white">
        EQUIPO!
      </h2>
      <Team />
    </main>
  );
}
