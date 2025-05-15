import { Github, Mail, Info, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary px-6 py-14 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-4">
        {/* Disclaimer */}
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
            <Info className="h-5 w-5" /> Disclaimer
          </h2>
          <p className="text-sm">
            This website is a portfolio project. All pet adoption data shown is
            fictional and not part of a real service.
          </p>
        </div>
        {/* Contributors */}
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
            <Mail className="h-5 w-5" /> Team
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <p>Scrum master</p>
              <a
                href="mailto:diego.synthcode@gmail.com"
                className="text-secondary hover:text-white hover:underline"
              >
                Diego Steven Suarez Salgado
              </a>{" "}
            </li>
            <li>
              <p>Product Owner</p>
              <a
                href="mailto:lala9086@hotmail.com"
                className="text-secondary hover:text-white hover:underline"
              >
                Laura Mantilla Jaimes
              </a>
            </li>
            <li>
              <p>Backend developer</p>
              <a
                href="mailto:jcgrrincon@hotmail.com "
                className="text-secondary hover:text-white hover:underline"
              >
                Julián Camilo García Rincón
              </a>
            </li>
            <li>
              <p>Frontend design</p>
              <a
                href="mailto:lgugi21@hotmail.com"
                className="text-secondary hover:text-white hover:underline"
              >
                Lorena Gutiérrez Giraldo
              </a>
            </li>
            <li>
              <p>Content and images</p>
              <a
                href="mailto:jhongaspar2021@hotmail.com"
                className="text-secondary hover:text-white hover:underline"
              >
                Jhon Alejandro Gaspar
              </a>
            </li>
          </ul>
        </div>

        {/* GitHub */}
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
            <Github className="h-5 w-5" /> GitHub
          </h2>
          <a
            href="https://github.com/DiegoxK/G11_ProyectoG7_Ciclo4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary text-sm hover:underline"
          >
            G11_ProyectoG7_Ciclo4
          </a>
        </div>

        {/* Portfolio Contact */}
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
            <Globe className="h-5 w-5" /> Hire Me
          </h2>
          <p className="mb-1 text-sm">Interested in making this real?</p>
          <a
            href="https://www.synthcode.net/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary text-sm hover:underline"
          >
            synthcode.net/contact
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t pt-10 text-center text-sm text-white">
        © {new Date().getFullYear()} Proyecto Peluditos.
      </div>
    </footer>
  );
};

export default Footer;
