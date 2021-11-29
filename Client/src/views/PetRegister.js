import React, { Component, useState } from "react";
import axios from "axios";

// Assets
import Logo from "../assets/images/Header/Logo.png";

// Footer
import Footer from "../components/Footer";

function PetRegister(props) {
  const [data, setData] = useState({
    img: "",
    nombre: "",
    descripcion: "",
    edadAñosMascota: "",
    edadMesesMascota: "",
    genero: "",
    tamaño: "",
    castrado: "",
    vacunado: "",
    niños: "",
    otrasMascotas: "",
    direccion: "",
    correoDeContacto: "",
    telefono: "",
    localizacion: "",
  });

  const parseInfo = (info) => {
    const parseData = {
      ...info,
      edadAñosMascota: parseInt(info.edadAñosMascota),
      edadMesesMascota: parseInt(info.edadMesesMascota),
      castrado: info.castrado === "Si" ? true : false,
      vacunado: info.vacunado === "Si" ? true : false,
      niños: info.niños === "Si" ? true : false,
      otrasMascotas: info.otrasMascotas === "Si" ? true : false,
      telefono: parseInt(info.telefono),
    };

    return parseData;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(props.url + "/api/pet", parseInfo(data))
      .then(() => {
        setData({
          img: "",
          nombre: "",
          descripcion: "",
          edadAñosMascota: "",
          edadMesesMascota: "",
          genero: "",
          tamaño: "",
          castrado: "",
          vacunado: "",
          niños: "",
          otrasMascotas: "",
          direccion: "",
          correoDeContacto: "",
          telefono: "",
          localizacion: "",
        });
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  const onChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div className="text-center">
        <main className="form-signin mt-5 p-3 border border-3 border-primary">
          <form onSubmit={onSubmit}>
            <a href="/">
              <img className="mb-4" src={Logo} alt="Logo" />
            </a>
            <h1 className="h3 mb-2 fw-normal fw-bold text-primary">
              Registrar mascota
            </h1>
            <div className="form-floating mt-3">
              <input
                required
                type="text"
                name="nombre"
                onChange={onChange}
                value={data.nombre}
                className="form-control"
                id="floatingName"
                placeholder="Nombre"
              />
              <label className="text-muted" htmlFor="floatingName">
                Nombre Mascota
              </label>
            </div>
            <div className="row">
              <p className="mt-3 fs-4 fw-bold text-primary">Edad</p>
              <div className="col-6">
                <input
                  required
                  type="number"
                  name="edadAñosMascota"
                  onChange={onChange}
                  value={data.edadAñosMascota}
                  className="form-control py-2"
                  placeholder="Años"
                />
              </div>
              <div className="col-6">
                <input
                  required
                  type="number"
                  name="edadMesesMascota"
                  onChange={onChange}
                  value={data.edadMesesMascota}
                  className="form-control py-2"
                  placeholder="Meses"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <p className="mt-3 fs-4 fw-bold text-primary">Genero</p>
                <select
                  required
                  name="genero"
                  onChange={onChange}
                  value={data.genero}
                  className="form-select py-2"
                >
                  <option disabled value="">
                    Genero
                  </option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                </select>
              </div>
              <div className="col-6">
                <p className="mt-3 fs-4 fw-bold text-primary">Tamaño</p>
                <select
                  required
                  name="tamaño"
                  onChange={onChange}
                  value={data.tamaño}
                  className="form-select py-2"
                >
                  <option disabled value="">
                    Tamaño
                  </option>
                  <option>Pequeño</option>
                  <option>Medio</option>
                  <option>Grande</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <p className="mt-3 fs-4 fw-bold text-primary">Castrado</p>
                <select
                  required
                  name="castrado"
                  onChange={onChange}
                  value={data.castrado}
                  className="form-select py-2"
                >
                  <option disabled value="">
                    ¿Castrado?
                  </option>
                  <option>Si</option>
                  <option>No</option>
                </select>
              </div>
              <div className="col-6">
                <p className="mt-3 fs-4 fw-bold text-primary">Vacunas</p>
                <select
                  required
                  name="vacunado"
                  onChange={onChange}
                  value={data.vacunado}
                  className="form-select py-2"
                >
                  <option disabled value="">
                    ¿Vacunado?
                  </option>
                  <option>Si</option>
                  <option>No</option>
                </select>
              </div>
            </div>
            <p className="mt-3 fs-4 fw-bold text-primary">Se lleva bien con</p>
            <div className="row">
              <div className="col-6">
                <p className="fs-4 fw-bold text-primary">Niños</p>
                <select
                  required
                  name="niños"
                  onChange={onChange}
                  value={data.niños}
                  className="form-select py-2"
                >
                  <option disabled value="">
                    Niños
                  </option>
                  <option>Si</option>
                  <option>No</option>
                </select>
              </div>
              <div className="col-6">
                <p className="fs-4 fw-bold text-primary">Mascotas</p>
                <select
                  required
                  name="otrasMascotas"
                  onChange={onChange}
                  value={data.otrasMascotas}
                  className="form-select py-2"
                >
                  <option disabled value="">
                    Mascotas
                  </option>
                  <option>Si</option>
                  <option>No</option>
                </select>
              </div>
            </div>
            <div className="mt-3 form-floating">
              <textarea
                required
                className="form-control"
                name="descripcion"
                onChange={onChange}
                value={data.descripcion}
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: 100 }}
              />
              <label className="text-muted" htmlFor="floatingTextarea2">
                Descripcion
              </label>
            </div>

            <div className="mt-3 form-floating">
              <textarea
                required
                type="url"
                className="form-control"
                name="img"
                onChange={onChange}
                value={data.img}
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: 200 }}
              />
              <label className="text-muted" htmlFor="floatingTextarea2">
                Imagen (Link)
              </label>
            </div>
            <p className="mt-3 fs-4 fw-bold text-primary">Contacto</p>
            <div className="form-floating mt-3">
              <input
                required
                type="text"
                name="direccion"
                onChange={onChange}
                value={data.direccion}
                className="form-control"
                id="floatingAddress"
                placeholder="Direccion"
              />
              <label className="text-muted" htmlFor="floatingAddress">
                Direccion
              </label>
            </div>
            <div className="form-floating mt-3">
              <input
                required
                type="email"
                name="correoDeContacto"
                onChange={onChange}
                value={data.correoDeContacto}
                className="form-control"
                id="floatingEmail"
                placeholder="Email"
              />
              <label className="text-muted" htmlFor="floatingEmail">
                Correo de contacto
              </label>
            </div>
            <div className="form-floating mt-3">
              <input
                required
                type="tel"
                name="telefono"
                onChange={onChange}
                value={data.telefono}
                className="form-control"
                id="floatingTel"
                placeholder="Telefono"
              />
              <label className="text-muted" htmlFor="floatingTel">
                Telefono
              </label>
            </div>
            <hr className="my-4" />
            <div className="mt-3 form-floating">
              <textarea
                required
                className="form-control"
                name="localizacion"
                onChange={onChange}
                value={data.localizacion}
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: 100 }}
              />
              <label className="text-muted" htmlFor="floatingTextarea2">
                Ubicacion (Google Link)
              </label>
            </div>
            <div className="d-flex justify-content-start mt-3">
              <a target="_blank" href="https://www.embedgooglemap.net/">
                Referencia
              </a>
            </div>
            <div className="d-flex justify-content-start">
              <p>Copiar y pegar contenido de "src"</p>
            </div>
            <button className="mt-3 w-100 btn btn-lg btn-primary" type="submit">
              Registrar Mascota
            </button>
          </form>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default PetRegister;
