import React, { Component } from "react";

// Assets
import donacionImg from "../../assets/images/Index/Services/donaciones.jpg";
import productoImg from "../../assets/images/Index/Services/products.jpg";
import adopcionImg from "../../assets/images/Index/Services/adopciones.jpg";

export default class Servicios extends Component {
  render() {
    return (
      <section id="servicios">
        <h2 className="header">NUESTROS SERVICIOS!</h2>
        <div className="container">
          {/* Servicio 1 */}
          <div className="card mb-3 pt-5">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={donacionImg}
                  className="img-fluid rounded-start pe-3"
                  alt="Donaciones"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Donaciones</h5>
                  <p className="card-text pt-3">
                    Recuerda, puedes apoyar todo nuestro trabajo y esfuerzo,
                    puedes poner tu granito de arena, cada uno de estos
                    peluditos te lo agredecerá!.
                  </p>
                  <button type="button" className="btn btn-primary ms-custom">
                    Dona ya!
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Servicio 2 */}
          <div className="card mb-3 pt-5">
            <div className="row g-0">
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title text-end">Productos</h5>
                  <p className="card-text text-end pt-3">
                    Puedes adquirir los mejores productos para tu nuevo amigo, o
                    si ya tienes mascota lo puedes consentir con los mejores
                    productos del mercado para aseo, alimentación y salud.
                  </p>
                  <button type="button" className="btn btn-primary ms-4">
                    Compra ya!
                  </button>
                </div>
              </div>
              <div className="col-md-4">
                <img
                  src={productoImg}
                  className="img-fluid rounded-start ps-3"
                  alt="Productos"
                />
              </div>
            </div>
          </div>
          {/* Servicio 3 */}
          <div className="card mb-3 pt-5">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={adopcionImg}
                  className="img-fluid rounded-start pe-3"
                  alt="Adopciones"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Adopciones</h5>
                  <p className="card-text pt-3">
                    Todavía no tienes mascota, no compres, adopta ya, decenas de
                    peluditos esperan por tí, de seguro hay uno que se quedatá
                    en tu corazón y en tu alma.
                  </p>
                  <button type="button" className="btn btn-primary ms-custom">
                    Adopta!!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
