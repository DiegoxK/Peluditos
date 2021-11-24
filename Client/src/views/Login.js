import React, { Component } from "react";
import axios from "axios";

// Assets
import Logo from "../assets/images/Header/Logo.png";

// Footer
import Footer from "../components/Footer";

export default class Login extends Component {
  state = {
    checkRemember: false,
    credentials: [],
    correoElectronico: "",
    contraseña: "",
  };

  checkRememberChange = () => {
    this.setState({
      checkRemember: !this.state.checkRemember,
    });
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    axios
      .get(this.props.url + "/api/user")
      .then((response) => {
        this.setState({
          credentials: response.data,
        });
      })

      .catch((e) => {
        console.log("error" + e);
      });
  }

  onSubmit = (event) => {
    event.preventDefault();

    let logCheck = false;

    for (let user of this.state.credentials) {
      if (
        user.correoElectronico === this.state.correoElectronico &&
        user.contraseña === this.state.contraseña
      ) {
        if (this.state.checkRemember) {
          document.cookie = `nombre=${user.nombre}`;
          document.cookie = `adopcion=${user.capacidadDeAdopcion}`;
          document.cookie = `userType=${user.userType}`;
          document.cookie = `check=true`;
        } else {
          document.cookie = `nombre=${user.nombre}; expires=`;
          document.cookie = `adopcion=${user.capacidadDeAdopcion}; expires=`;
          document.cookie = `userType=${user.userType}; expires=`;
          document.cookie = `check=true; expires=`;
        }
        logCheck = true;
        break;
      }
    }
    if (logCheck === false) {
      document.cookie = `check=false`;
      console.log("nologeado");
    } else {
      window.location.href = "/";
    }
  };

  render() {
    return (
      <div className="text-center">
        <main
          className="form-signin mt-5 p-3 border border-3 border-primary"
          style={{ marginTop: "6em" }}
        >
          <form onSubmit={this.onSubmit}>
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
            {/* <div className="checkbox mb-3">
              <label>
                <input
                  type="checkbox"
                  defaultValue="remember-me"
                  onChange={this.checkRememberChange}
                />
                Recuerdame
              </label>
            </div> */}
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Ingresar
            </button>
          </form>
          <div className="mt-3">
            <a href="registro" className="text-dark">
              Registrar cuenta
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
