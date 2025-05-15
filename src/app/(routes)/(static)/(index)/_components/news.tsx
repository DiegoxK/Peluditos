import Image from "next/image";

import news1 from "@/assets/images/news/newscat1.webp";
import news2 from "@/assets/images/news/newscat2.webp";
import news3 from "@/assets/images/news/newsdog1.webp";
import Link from "next/link";

export default function News() {
  return (
    <section className="bg-primary mt-4">
      <div className="container mx-auto flex items-center justify-center space-y-10 py-10">
        <div className="flex">
          {/* New 1 */}
          <Link
            href="https://www.univision.com/local/houston-kxln/mascotas-adopcion-houston-fotos"
            target="_blank"
            className="group relative"
          >
            <Image width={330} src={news1} alt="" />
            <div className="absolute top-0 flex h-full items-center bg-black/70 opacity-0 transition-all duration-600 group-hover:opacity-100">
              <div className="space-y-8 p-8 text-center text-white">
                <h3 className="text-lg font-bold">
                  ¿Podrías darles un hogar? Ofrecen 50% en tarifas de adopción
                  de mascotas adultas en Houston
                </h3>
                <p>
                  Perros y gatos adultos buscan dónde vivir, por lo que en
                  Houston Humane Society están listos para ayudarles a encontrar
                  a su nuevo mejor amigo en noviembre, que es el Mes Nacional de
                  Adopción de Mascotas adultas.
                </p>
              </div>
            </div>
          </Link>

          {/* New 2 */}

          <Link
            href="https://www.eltiempo.com/bogota/adopcion-de-perros-y-gatos-en-bogota-una-tendencia-que-crece-desde-2020-598818"
            target="_blank"
            className="group relative"
          >
            <Image width={330} src={news2} alt="" />
            <div className="absolute top-0 flex h-full items-center bg-black/70 opacity-0 transition-all duration-600 group-hover:opacity-100">
              <div className="space-y-8 p-8 text-center text-white">
                <h3 className="text-lg font-bold">
                  Adopción de perros y gatos en Bogotá, tendencia que crece
                  desde 2020
                </h3>
                <p>
                  Desde 2020 hasta la fecha, se ha incrementado la adopción de
                  perros y gatos en Bogotá, según datos de la investigación
                  Ampliar el horizonte ideas para la adopción de animales de
                  compañía en Bogotá del Instituto de Protección y Bienestar
                  Animal (IDPYBA).
                </p>
              </div>
            </div>
          </Link>

          {/* New 3 */}

          <Link
            href="https://cnnespanol.cnn.com/2019/12/23/navidad-regalo-perfecto-mascota-porque-animales-no/"
            target="_blank"
            className="group relative"
          >
            <Image width={330} src={news3} alt="" />
            <div className="absolute top-0 flex h-full items-center bg-black/70 opacity-0 transition-all duration-600 group-hover:opacity-100">
              <div className="space-y-8 p-8 text-center text-white">
                <h3 className="text-lg font-bold">
                  ¿Por qué los animales no son el regalo perfecto de Navidad?
                </h3>
                <p>
                  Cada año cuando se acerca la Navidad, la gente hace una lluvia
                  de ideas para pensar en el regalo perfecto. La comodidad y la
                  alegría de una mascota pueden parecer una gran opción, pero
                  los refugios de mascotas y las organizaciones de bienestar
                  animal no lo aconsejan.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
