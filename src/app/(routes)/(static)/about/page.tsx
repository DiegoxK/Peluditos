export default function About() {
  return (
    <main className="space-y-6">
      <h1 className="bg-primary mt-2 w-full py-8 text-center text-3xl font-medium text-white">
        Acerca de este proyecto
      </h1>

      <div className="mx-auto max-w-prose space-y-6">
        <p>
          Este sitio web fue creado como parte de un proyecto de portafolio con
          fines educativos y demostrativos. Su propósito es ilustrar el diseño y
          desarrollo de una plataforma para la adopción de mascotas,
          específicamente gatos y perros.
        </p>

        <p className="border-secondary bg-card/50 text-card-foreground flex gap-5 rounded-md border-2 p-5">
          ⚠️ Importante Toda la información mostrada en esta página es
          completamente ficticia. No representamos a ninguna organización real
          de adopción ni estamos ofreciendo animales en adopción actualmente.
        </p>
      </div>

      <h2 className="bg-primary mt-2 w-full py-8 text-center text-3xl font-medium text-white">
        Objetivo del proyecto
      </h2>

      <div className="mx-auto max-w-prose space-y-6">
        <p>
          El objetivo principal es demostrar habilidades técnicas en desarrollo
          web utilizando tecnologías modernas como React, Tailwind CSS y
          mongodb, así como buenas prácticas de diseño, accesibilidad y
          estructura semántica.
        </p>

        <h3 className="text-primary text-2xl font-medium">
          ¿Te interesa colaborar o llevar esta idea a la realidad?
        </h3>

        <p>
          Si este proyecto te parece interesante y quisieras adaptarlo a una
          aplicación funcional para una organización real de adopción de
          mascotas, ¡contáctame! Estoy abierto a propuestas de colaboración o
          comisiones.
        </p>
        <div className="border-secondary bg-card/50 text-card-foreground mb-8 rounded-md border-2 p-5">
          <p className="mb-1 font-semibold">
            Puedes ver el código fuente en GitHub o visitar mi portafolio para
            más información:
          </p>
          <p>
            GitHub:{" "}
            <a
              className="text-primary font-bold hover:underline"
              target="_blank"
              href="https://github.com/DiegoxK/Peluditos"
            >
              Repositorio
            </a>
            .
          </p>
          <p>
            Sobre el projecto:{" "}
            <a
              className="text-primary font-bold hover:underline"
              target="_blank"
              href="https://www.synthcode.net/projects/peluditos"
            >
              Peluditos
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
