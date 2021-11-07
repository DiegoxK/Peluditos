import React, { Component } from "react";

export default class Login extends Component {
  render() {
    return (
      <main className="form-signin border border-teal rounded-3 text-center">
        <a href="/">
          <img
            className="mb-4"
            src="../assets/images/index/headerImages/logo.jpg"
            alt
            width={90}
            height={80}
          />
        </a>
        <h1 className="h3 mb-3 fw-normal">Registrate</h1>
        <div className="form-floating">
          <input
            v-model="register.nombre"
            type="text"
            className="form-control border-teal"
            id="Input-name"
            placeholder="Nombre"
          />
          <label htmlFor="Input-name">Nombre</label>
        </div>
        <div className="form-floating mt-3">
          <input
            v-model="register.apellido"
            type="text"
            className="form-control border-teal"
            id="Input-lastname"
            placeholder="Apellido"
          />
          <label htmlFor="Input-lastname">Apellido</label>
        </div>
        <div className="form-floating mt-3">
          <input
            v-model="register.correoElectronico"
            type="email"
            className="form-control border-teal"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Correo Electronico</label>
        </div>
        <div className="form-floating mt-3">
          <input
            v-model="register.telefono"
            type="tel"
            className="form-control border-teal"
            id="Input-phonenumber"
            placeholder="Telefono"
          />
          <label htmlFor="Input-phonenumber">Telefono</label>
        </div>
        <div className="form-floating mt-3">
          <select
            v-model="register.tipoDeCasa"
            className="form-select border-teal"
            id="validationCustom04"
            required
          >
            <option selected disabled value>
              Tipo de vivienda
            </option>
            <option>Casa</option>
            <option>Apartamento</option>
            <option>Finca o parcela</option>
          </select>
        </div>
        <div className="form-floating mt-3">
          <select
            v-model="register.mascota"
            className="form-select border-teal"
            id="validationCustom05"
            required
          >
            <option selected disabled value>
              ¿Tiene mascota?
            </option>
            <option>Si</option>
            <option>No</option>
          </select>
        </div>
        <div v-if="register.mascota === 'Si'" className="group-floating mt-3">
          <div className="form-floating mt-3">
            <input
              v-model="register.edadMascota"
              type="number"
              className="form-control border-teal"
              id="Input-Edad"
              placeholder="Edad (En años)"
            />
            <label htmlFor="Input-Edad">Edad (En año humano)</label>
          </div>
          <div className="form-floating mt-3">
            <select
              v-model="register.castrada"
              className="form-select border-teal"
              id="validationCustom06"
              required
            >
              <option selected disabled value>
                ¿Castrada?
              </option>
              <option>Si</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="form-floating mt-5">
          <input
            v-model="register.contraseña"
            type="password"
            className="form-control border-teal"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Contraseña</label>
        </div>
        <div>
          <button
            className="w-100 btn btn-lg btn-outline-teal"
            href="/login"
            type="submit"
          >
            Registrar Cuenta
          </button>
        </div>
        <div className="mt-3">
          <a href="/login" className="text-secondary ">
            Ya tienes cuenta?
          </a>
        </div>
      </main>
    );
  }
}
