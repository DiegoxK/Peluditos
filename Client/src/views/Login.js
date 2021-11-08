import React, { Component } from "react";

// Assets
import Logo from "../assets/images/Header/Logo.png";

// Footer
import Footer from "../components/Footer";

export default class Login extends Component {
  render() {
    return (
      <div className="text-center">
        <main className="form-signin mt-5 p-3 border border-3 border-primary">
          <form className>
            <a href="/">
              <img className="mb-4" src={Logo} alt="Logo" />
            </a>
            <h1 className="h3 mb-2 fw-normal fw-bold text-primary">
              Inicio de sesión
            </h1>
            <div className="form-floating mt-3">
              <input
                type="email"
                className="form-control"
                id="floatingMail"
                placeholder="nombre@ejemplo.com"
              />
              <label htmlFor="floatingMail">Correo Electronico</label>
            </div>
            <div className="form-floating mt-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Contraseña"
              />
              <label htmlFor="floatingPassword">Contraseña</label>
            </div>
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" defaultValue="remember-me" /> Recuerdame
              </label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Ingresar
            </button>
          </form>
          <div className="mt-3">
            <a href="registro" className="text-secondary">
              Registrar cuenta
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
