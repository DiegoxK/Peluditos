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
    loginFailed: false,
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
          document.cookie = `userEmail=${user.correoElectronico}; expires=`;
          document.cookie = `check=true; expires=`;
        }
        logCheck = true;
        break;
      }
    }
    if (logCheck === false) {
      document.cookie = `check=false`;
      this.setState({
        loginFailed: true,
      });
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
                required
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
                required
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
          {this.state.loginFailed && (
            <div
              className="alert alert-danger d-flex align-items-center mt-3 pt-4"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={50}
                height={50}
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
              <p>Error: Por favor compruebe su correo y contraseña</p>
            </div>
          )}

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
