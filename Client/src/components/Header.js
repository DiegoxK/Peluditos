import React, { useState } from "react";

// Assets
import Logo from "../assets/images/Header/Logo.png";

const readCookie = (cname) => {
  var name = cname + "=";
  var decoded_cookie = decodeURIComponent(document.cookie);
  var carr = decoded_cookie.split(";");
  for (var i = 0; i < carr.length; i++) {
    var c = carr[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

function Header() {
  const [check, setCheck] = useState(readCookie("check"));

  const userName = readCookie("nombre");
  const userType = readCookie("userType");
  const adopcion = readCookie("adopcion");

  const logOut = () => {
    document.cookie = `check=false`;
    setCheck(readCookie("check"));
    window.location.href = "/";
  };

  return (
    <div className="container-cstm">
      <nav className="navbar p-1 navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
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
            className="collapse navbar-collapse justify-content-between center"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-4 mb-lg-0 justify-content-start">
              <li className="nav-item">
                <a
                  className="nav-link active fs-6"
                  aria-current="page"
                  href="/"
                >
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fs-6" href="/adoptions">
                  Adopciones
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle fs-6"
                  href="/products"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Productos
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="/products/productos">
                      Todos
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/aseo">
                      Aseo
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/alimentos">
                      Alimentos
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/snacks">
                      Snacks
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/accesorios">
                      Accesorios
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/juguetes">
                      Juguetes
                    </a>
                  </li>
                </ul>
              </li>
              {userType === "admin" && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle fs-6"
                    href="/products"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Admin
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="/usersCrud">
                        Crud Usuarios
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/petRegister">
                        Registrar Mascota
                      </a>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
            <ul className="navbar-nav mb-lg-0 justify-content-end">
              {check === "true" && (
                <div>
                  <li className="nav-item ms-0 ms-lg-4 text-center pb-1">
                    Bienvenido <span className="fw-bold">{userName}</span>
                  </li>
                  <li className="nav-item ms-0 ms-lg-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={logOut}
                    >
                      Cerrar Sesion
                    </button>
                  </li>
                </div>
              )}
              {check != "true" && (
                <>
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
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
