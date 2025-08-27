import Image from "next/image";

import team1 from "@/assets/images/team/team1.webp";
import team2 from "@/assets/images/team/team2.webp";
import team3 from "@/assets/images/team/team3.webp";
import team4 from "@/assets/images/team/team4.webp";

export default function Team() {
  return (
    <section className="container mx-auto space-y-10 py-10">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:items-stretch">
        {/* Team 1 */}

        <div className="border-secondary bg-card/50 text-card-foreground flex w-[300px] flex-col items-center gap-4 rounded-md border-2">
          <Image
            src={team1}
            alt="Imagen ilustrativa de samuel"
            className="border-secondary mt-8 rounded-md border-2"
          />
          <h3 className="text-primary text-3xl font-medium">Samuel</h3>
          <p className="bg-primary h-full p-6 text-white">
            Es nuestro veterinario de confianza y co-fundador de la fundación
            PELUDITOS, es el encargado de los tratamientos médicos que requieren
            nuestros amiguitos.
          </p>
        </div>

        {/* Team 2 */}

        <div className="border-secondary bg-card/50 text-card-foreground flex w-[300px] flex-col items-center gap-4 rounded-md border-2">
          <Image
            src={team2}
            alt="Imagen ilustrativa de samuel"
            className="border-secondary mt-8 rounded-md border-2"
          />
          <h3 className="text-primary text-3xl font-medium">Martha</h3>
          <p className="bg-primary h-full p-6 text-white">
            Lleva mas de 10 años vigilando el proceso de adopciones y los
            rescates de peluditos que se encuentren en vulnerabilidad.
          </p>
        </div>

        {/* Team 3 */}

        <div className="border-secondary bg-card/50 text-card-foreground flex w-[300px] flex-col items-center gap-4 rounded-md border-2">
          <Image
            src={team3}
            alt="Imagen ilustrativa de samuel"
            className="border-secondary mt-8 rounded-md border-2"
          />
          <h3 className="text-primary text-3xl font-medium">Carlos</h3>
          <p className="bg-primary h-full p-6 text-white">
            Es co-fundador de PELUDITOS, su amor por los menos favorecidos es
            tan grande que lucha día a día por darles un espacio lleno de amor y
            seguridad.
          </p>
        </div>

        {/* Team 4 */}

        <div className="border-secondary bg-card/50 text-card-foreground flex w-[300px] flex-col items-center gap-4 rounded-md border-2">
          <Image
            src={team4}
            alt="Imagen ilustrativa de samuel"
            className="border-secondary mt-8 rounded-md border-2"
          />
          <h3 className="text-primary text-3xl font-medium">Janet</h3>
          <p className="bg-primary h-full p-6 text-white">
            Es una de nuestras colaboradoras mas nuevas, lleva con nosotros 2
            años y es la encargada de velar por la seguridad de nuestros
            amiguitos en los hogares de paso.
          </p>
        </div>
      </div>
    </section>
  );
}
