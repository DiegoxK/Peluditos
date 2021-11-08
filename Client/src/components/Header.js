import React, { Component } from "react";

// Assets
import Logo from "../assets/images/Header/Logo.png";

//Login
import Login from "../views/Login"
export default class Header extends Component {
  render() {
    return (
      <div className="container-cstm">
        <nav className="navbar p-1 navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src={Logo} alt="Logo" width={90} height={72} />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="ps-5 collapse navbar-collapse justify-content-between center"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-4 mb-lg-0 justify-content-start">
                <li className="nav-item">
                  <a
                    className="nav-link active fs-6"
                    aria-current="page"
                    href="#"
                  >
                    Inicio
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fs-6" href="#">
                    Adopciones
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle fs-6"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Productos
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Comida
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Juguetes!
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="navbar-nav mb-lg-0 justify-content-end">
                <li className="nav-item">
                  <a href="/login">
                    <button
                      type="button"
                      className="btn btn-light mb-2 mb-lg-0"
                    >
                      Ingresar
                    </button>
                  </a>
                </li>
                <li className="nav-item ms-0 ms-lg-4">
                  <a href="/registro">
                    <button type="button" className="btn btn-primary">
                      Registro
                    </button>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
