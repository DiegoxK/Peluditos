import React from "react";

import Logo from "../assets/images/Header/Logo.png";
import Footer from "../components/Footer";

function Payment() {
  return (
    <>
      <section className="Pagos">
        <h2 className="header">Pago</h2>
        <div className="container">
          <div className="mt-5">
            <form className>
              <a href="/">
                <img className="mb-4" src={Logo} alt="Logo" />
              </a>
              <h1 className="h3 mb-2 fw-normal fw-bold text-primary">Pagos</h1>
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
                <label htmlFor="floatinDirection">Dirección </label>
              </div>
              <div className="form-floating mt-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingDirection"
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
              <div className="mt-3">
                <select className="form-select py-2">
                  <option disabled value>
                    Metodo de pago
                  </option>
                  <option>Paypal</option>
                  <option>Tarjeta credito/Debito</option>
                  <option>Contra entrega</option>
                </select>
              </div>
              <hr className="my-4" />
              <p className="mt-3 fs-4 fw-bold text-primary">Datos Tarjeta</p>
              <div className="form-floating mt-3">
                <input
                  type="tel"
                  className="form-control"
                  id="floatingPhone"
                  placeholder="Telefono"
                />
                <label htmlFor="floatingPhone">Numero Tarjeta</label>
              </div>
              <div className="col-6 mt-3">
                <input
                  type="number"
                  className="form-control py-2"
                  placeholder="CVV"
                />
              </div>
              <div className="form-floating mt-3">
                <input
                  type="tel"
                  className="form-control"
                  id="floatingPhone"
                  placeholder="Telefono"
                />
                <label htmlFor="floatingPhone">Nombre en la tarjeta</label>
              </div>
              <div className="row">
                <p className="mt-3 fs-4 fw-bold text-primary">
                  Fecha de expiracion
                </p>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control py-2"
                    placeholder="Año"
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control py-2"
                    placeholder="Mes"
                  />
                </div>
              </div>
              <button
                className="w-100 btn btn-lg btn-primary mt-5"
                type="submit"
              >
                Confirmar Compra
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Payment;
