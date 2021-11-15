import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer-section pt-3 pb-3 mt-5 bg-primary">
        <div className="container">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item">
              <p className="text-center text-white mt-4">
                © 2021 Proyecto Peluditos
              </p>
            </li>
          </ul>
          <a
            href="https://github.com/DiegoxK/G11_ProyectoG7_Ciclo4"
            rel="noreferrer"
            target="_blank"
            className="nav-link px-2 text-white text-center"
          >
            GitHub!
          </a>
          <p className="text-white">
            Diego Steven Suarez Salgado - diego.stv@hotmail.com <br />
            Laura Mantilla Jaimes - lala9086@hotmail.com <br />
            Julián Camilo García Rincón - jcgrrincon@hotmail.com <br />
            Lorena Gutiérrez Giraldo - lgugi21@hotmail.com <br />
            Jhon Alejandro Gaspar - jhongaspar2021@hotmail.com
          </p>
        </div>
      </footer>
    );
  }
}
