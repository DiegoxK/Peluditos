import React, { Component } from "react";
import axios from "axios";

// Assets
import Logo from "../assets/images/Header/Logo.png";

// Footer
import Footer from "../components/Footer";

export default class Register extends Component {
  state = {
    nombre: "",
    apellido: "",
    telefono: "",
    tipoDeCasa: "",
    mascota: "",
    edadMascota: "",
    castrada: "",
    correoElectronico: "",
    contraseña: "",
  };

  onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(this.props.url + "/api/user", this.parseInfo(this.state))
      .then((res) => {
        this.setState({
          nombre: "",
          apellido: "",
          telefono: "",
          tipoDeCasa: "",
          mascota: "",
          edadMascota: "",
          castrada: "",
          correoElectronico: "",
          contraseña: "",
        });
        console.log(res);
        window.location.href = "/login";
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  parseInfo(state) {
    let info = {
      nombre: state.nombre,
      apellido: state.apellido,
      tipoDeCasa: state.tipoDeCasa,
      correoElectronico: state.correoElectronico,
      contraseña: state.contraseña,
      telefono: parseInt(state.telefono),
      mascota: Boolean,
      edadMascota: parseInt(state.edadMascota),
      castrada: Boolean,
    };

    if (state.mascota === "Si") {
      info.mascota = true;
    } else {
      info.mascota = false;
    }

    if (state.castrada === "Si") {
      info.castrada = true;
    } else {
      info.castrada = false;
    }

    console.log(info);

    this.setState(info);

    console.log(state);

    return info;
  }

  render() {
    return (
      <div className="text-center">
        <main className="form-signin mt-5 p-3 border border-3 border-primary">
          <form onSubmit={this.onSubmit}>
            <a href="/">
              <img className="mb-4" src={Logo} alt="Logo" />
            </a>
            <h1 className="h3 mb-2 fw-normal fw-bold text-primary">
              Registrate
            </h1>
            <div className="form-floating mt-5">
              <input
                type="text"
                name="nombre"
                onChange={this.onChange}
                value={this.state.nombre}
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
                name="apellido"
                onChange={this.onChange}
                value={this.state.apellido}
                id="floatingLastname"
                placeholder="Apellido"
              />
              <label htmlFor="floatingLastname">Apellido</label>
            </div>
            <div className="form-floating mt-3">
              <input
                type="email"
                className="form-control"
                name="correoElectronico"
                onChange={this.onChange}
                value={this.state.correoElectronico}
                id="floatingMail"
                placeholder="nombre@ejemplo.com"
              />
              <label htmlFor="floatingMail">Correo Electronico</label>
            </div>
            <div className="form-floating mt-3">
              <input
                type="tel"
                name="telefono"
                className="form-control"
                onChange={this.onChange}
                value={this.state.telefono}
                id="floatingPhone"
                placeholder="Telefono"
              />
              <label htmlFor="floatingPhone">Telefono</label>
            </div>
            <hr className="my-4" />
            <div className="mt-3">
              <select
                className="form-select py-2"
                name="tipoDeCasa"
                onChange={this.onChange}
                value={this.state.tipoDeCasa}
              >
                <option disabled value="">
                  Tipo de vivienda
                </option>
                <option>Casa</option>
                <option>Apartamento</option>
                <option>Finca o parcela</option>
              </select>
            </div>
            <div className="mt-3">
              <select
                className="form-select py-2"
                name="mascota"
                onChange={this.onChange}
                value={this.state.mascota}
              >
                <option disabled value="">
                  ¿Tiene mascota?
                </option>
                <option>Si</option>
                <option>No</option>
              </select>
            </div>
            <div>
              {this.state.mascota === "Si" && (
                <div>
                  <div className="row">
                    <p className="mt-3 fs-4 fw-bold text-primary">Edad</p>
                    <div className="col-6">
                      <input
                        name="edadMascota"
                        onChange={this.onChange}
                        value={this.state.edadMascota}
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
                      name="castrada"
                      onChange={this.onChange}
                      value={this.state.castrada}
                    >
                      <option disabled value="">
                        ¿Esta castrada?
                      </option>
                      <option>Si</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <hr className="my-4" />
            <div className="form-floating my-3">
              <input
                type="password"
                className="form-control"
                name="contraseña"
                onChange={this.onChange}
                value={this.state.contraseña}
                id="floatingPassword"
                placeholder="Contraseña"
              />
              <label htmlFor="floatingPassword">Contraseña</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Registrarse
            </button>
          </form>
          <div className="mt-3">
            <a href="/login" className="text-dark">
              Ya tienes cuenta?
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
