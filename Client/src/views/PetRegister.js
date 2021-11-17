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
              Registrar Mascota
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
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: 100 }}
                defaultValue={""}
              />
              <label htmlFor="floatingTextarea2">Comments</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">
              Registrarse
            </button>
          </form>
        </main>
        <Footer />
      </div>
    );
  }
}
