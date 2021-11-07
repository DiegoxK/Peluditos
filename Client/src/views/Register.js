import React, { Component } from "react";
// Assets
import Logo from "../assets/images/Header/Logo.png";

// Footer
import Footer from "../components/Footer";

export default class Register extends Component {
  render() {
    return (
      <div className="text-center">
        <main className="form-signin mt-5 p-3 border border-3 border-primary">
          <form className>
            <a href="/">
              <img className="mb-4" src={Logo} alt="Logo" />
            </a>
            <h1 className="h3 mb-2 fw-normal fw-bold text-primary">
              Registrate
            </h1>
            <div className="form-floating mt-5">
              <input
                type="text"
                className="form-control"
                id="floatingName"
                placeholder="Nombre"
              />
              <label htmlFor="floatingName">Nombre</label>
            </div>
            <div className="form-floating mt-3">
              <input
                type="text"
                className="form-control"
                id="floatingLastname"
                placeholder="Apellido"
              />
              <label htmlFor="floatingLastname">Apellido</label>
            </div>
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
                type="tel"
                className="form-control"
                id="floatingPhone"
                placeholder="Telefono"
              />
              <label htmlFor="floatingPhone">Telefono</label>
            </div>
            <hr className="my-4" />
            <div class="mt-3">
              <select className="form-select py-2">
                <option selected disabled>
                  Tipo de vivienda
                </option>
                <option>Casa</option>
                <option>Apartamento</option>
                <option>Finca o parcela</option>
              </select>
            </div>
            <div className="mt-3">
              <select className="form-select py-2">
                <option selected disabled>
                  ¿Tiene mascota?
                </option>
                <option>Si</option>
                <option>No</option>
              </select>
            </div>
            <div className="row">
              <p className="mt-3 fs-4 fw-bold text-primary">Edad</p>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control py-2"
                  placeholder="Años"
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control py-2"
                  placeholder="Meses"
                />
              </div>
            </div>
            <div className="mt-3">
              <select
                className="form-select py-2"
                placeholder="name@example.com"
              >
                <option selected disabled>
                  ¿Esta castrada?
                </option>
                <option>Si</option>
                <option>No</option>
              </select>
            </div>
            <hr className="my-4" />
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
              Registrarse
            </button>
          </form>
          <div className="mt-3">
            <a href="#" className="text-secondary">
              Ya tienes cuenta?
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
