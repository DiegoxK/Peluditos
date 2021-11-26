import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Assets
import Compras from "../assets/images/PetInfo/Compras.jpg";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

function PetInfo(props) {
  const userType = props.readCookie("userType");

  const { petId } = useParams();

  const [editState, setEditState] = useState(false);

  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`${props.url}/api/pet/${petId}`)
      .then((res) => {
        const petData = res.data;
        setData({
          id: petData._id,
          img: petData.img,
          nombre: petData.nombre,
          descripcion: petData.descripcion,
          edadAñosMascota: petData.edadAñosMascota,
          edadMesesMascota: petData.edadMesesMascota,
          genero: petData.genero,
          tamaño: petData.tamaño,
          castrado: petData.castrado.toString(),
          vacunado: petData.vacunado.toString(),
          niños: petData.niños.toString(),
          otrasMascotas: petData.otrasMascotas.toString(),
          direccion: petData.direccion,
          correoDeContacto: petData.correoDeContacto,
          telefono: petData.telefono,
          localizacion: petData.localizacion,
        });
      })
      .catch((e) => {
        console.log(e.response);
      });
  }, [editState]);

  const parseInfo = (info) => {
    const parseData = {
      ...info,
      edadAñosMascota: parseInt(info.edadAñosMascota),
      edadMesesMascota: parseInt(info.edadMesesMascota),
      castrado: info.castrado === "true" ? true : false,
      vacunado: info.vacunado === "true" ? true : false,
      niños: info.niños === "true" ? true : false,
      otrasMascotas: info.otrasMascotas === "true" ? true : false,
      telefono: parseInt(info.telefono),
    };

    return parseData;
  };

  const onChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const submitPet = (event, id) => {
    event.preventDefault();
    axios
      .put(`${props.url}/api/pet/${petId}`, parseInfo(data))
      .then((res) => {
        console.log(res);
        setEditState(false);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const deletePet = (petId) => {
    axios
      .delete(`${props.url}/api/pet/${petId}`)
      .then(() => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  return (
    <>
      <Header />
      <section className="mascota">
        <h2 className="header">Informacion!</h2>
        <div className="container">
          <div className="row mt-5">
            {editState === false && (
              <>
                <div className="col">
                  <div className="h-100">
                    <div className="bg-secondary shadow-sm rounded p-5 mx-3 mb-4">
                      <h3 className="mb-4 fw-bold">{data.nombre}</h3>
                      <ul className="d-flex flex-row">
                        <li className="card-text fw-bold">{data.genero}</li>
                        <li className="ms-5 card-text">
                          Tamaño: <span className="fw-bold">{data.tamaño}</span>
                        </li>
                      </ul>
                      <hr />
                      <table className="table text-primary">
                        <thead>
                          <tr>
                            <th scope="col">Castrado</th>
                            <th scope="col">Vacunado</th>
                            <th scope="col">Niños</th>
                            <th scope="col">Otras mascotas</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{data.castrado === "true" ? "Si" : "No"}</td>
                            <td>{data.vacunado === "true" ? "Si" : "No"}</td>
                            <td>{data.niños === "true" ? "Si" : "No"}</td>
                            <td>
                              {data.otrasMascotas === "true" ? "Si" : "No"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="card-text fw-bold mt-5">
                        Sobre {data.nombre}
                      </p>
                      <p>
                        <span className="fw-bold">Años:</span>{" "}
                        {data.edadAñosMascota}{" "}
                        <span className="fw-bold">Meses:</span>{" "}
                        {data.edadMesesMascota}
                      </p>
                      <p className="card-text">{data.descripcion}</p>
                    </div>
                    <div className="text-center w-100 px-3">
                      <iframe
                        className="rounded-3 shadow-sm"
                        src={data.localizacion}
                        allowFullScreen
                        width="100%"
                        height={675}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="bg-secondary shadow-sm rounded p-5 mx-3 h-100">
                    <div className="text-center bg-primary p-3 rounded-3 shadow-sm">
                      <img src={data.img} alt="Pet" />
                    </div>
                    {userType === "admin" && (
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="card mt-4 btn btn-danger"
                          onClick={() => {
                            deletePet(data.id);
                          }}
                        >
                          Eliminar mascota
                        </button>
                      </div>
                    )}
                    <div className="d-flex justify-content-center">
                      <a href="#">
                        <button
                          type="button"
                          className="card mt-4 btn btn-primary"
                        >
                          ¡Darse a conocer!
                        </button>
                      </a>
                      {userType === "admin" && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditState(true);
                          }}
                          className="card ms-2 mt-4 btn btn-warning"
                        >
                          Editar info
                        </button>
                      )}
                    </div>
                    <div className="mx-4">
                      <p className="card-text mt-4">
                        <span className="fw-bold">Localizacion:</span>{" "}
                        {data.direccion}
                      </p>
                      <p className="card-text mt-4">
                        <span className="fw-bold">Correo de contacto: </span>
                        {data.correoDeContacto}
                      </p>
                      <p className="card-text mt-4">
                        <span className="fw-bold">Telefono:</span>{" "}
                        {data.telefono}
                      </p>
                      <div className="pt-5">
                        <h3 className="card-title">Productos</h3>
                        <div className="img-container mt-5">
                          <img
                            src={Compras}
                            alt="CompraProductos"
                            className="img-hover rounded-3"
                          />
                          <div className="overlay">
                            <a
                              href="/products/productos"
                              className="header-text"
                            >
                              Recuerda que puedes adquirir los mejores productos
                              para tu nuevo amigo, o si ya tienes mascota lo
                              puedes consentir con los mejores productos del
                              mercado para aseo, alimentación y salud.
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Pagina en modo de edicion */}

            {editState === true && (
              <>
                <form
                  className="row"
                  onSubmit={(event) => {
                    submitPet(event, data.id);
                  }}
                >
                  <div className="col">
                    <div className="h-100">
                      <div className="bg-secondary shadow-sm rounded p-5 mx-3 mb-4">
                        <div className="mb-3">
                          <input
                            type="text"
                            name="nombre"
                            onChange={onChange}
                            value={data.nombre}
                            className="form-control"
                            id="exampleInputName"
                          />
                        </div>

                        <ul className="d-flex flex-row">
                          <li className="card-text fw-bold">
                            <select
                              name="genero"
                              onChange={onChange}
                              value={data.genero}
                              className="form-select py-2"
                            >
                              <option disabled value="">
                                Genero
                              </option>
                              <option>Femenino</option>
                              <option>Masculino</option>
                            </select>
                          </li>
                          <li className="ms-5 card-text">
                            <select
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
                          </li>
                        </ul>
                        <hr />
                        <table className="table text-primary">
                          <thead>
                            <tr>
                              <th scope="col">Castrado</th>
                              <th scope="col">Vacunado</th>
                              <th scope="col">Niños</th>
                              <th scope="col">Otras mascotas</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <select
                                  name="castrado"
                                  onChange={onChange}
                                  value={data.castrado}
                                  className="form-select py-2"
                                >
                                  <option disabled value="">
                                    ¿Castrado?
                                  </option>
                                  <option>true</option>
                                  <option>false</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  name="vacunado"
                                  onChange={onChange}
                                  value={data.vacunado}
                                  className="form-select py-2"
                                >
                                  <option disabled value="">
                                    ¿Vacunado?
                                  </option>
                                  <option>true</option>
                                  <option>false</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  name="niños"
                                  onChange={onChange}
                                  value={data.niños}
                                  className="form-select py-2"
                                >
                                  <option disabled value="">
                                    Niños
                                  </option>
                                  <option>true</option>
                                  <option>false</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  name="otrasMascotas"
                                  onChange={onChange}
                                  value={data.otrasMascotas}
                                  className="form-select py-2"
                                >
                                  <option disabled value="">
                                    Mascotas
                                  </option>
                                  <option>true</option>
                                  <option>false</option>
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="card-text fw-bold mt-5">
                          Sobre {data.nombre}
                        </p>
                        <div>
                          <span className="fw-bold">Años:</span>{" "}
                          <div className="mb-3">
                            <input
                              type="number"
                              name="edadAñosMascota"
                              onChange={onChange}
                              value={data.edadAñosMascota}
                              className="form-control"
                            />
                          </div>{" "}
                          <span className="fw-bold">Meses:</span>{" "}
                          <div className="mb-3">
                            <input
                              type="number"
                              name="edadMesesMascota"
                              onChange={onChange}
                              value={data.edadMesesMascota}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            placeholder="Leave a comment here"
                            id="floatingTextarea2"
                            style={{ height: 100 }}
                            name="descripcion"
                            onChange={onChange}
                            value={data.descripcion}
                          />
                          <label htmlFor="floatingTextarea2">Descripcion</label>
                        </div>
                      </div>
                      <div className="text-center w-100 px-3">
                        <div className="d-flex justify-content-start mt-3">
                          <a
                            target="_blank"
                            href="https://www.embedgooglemap.net/"
                          >
                            Referencia
                          </a>
                        </div>
                        <div className="d-flex justify-content-start">
                          <p>Copiar y pegar contenido de "src"</p>
                        </div>
                        <div className="mt-1 mb-4 form-floating">
                          <textarea
                            className="form-control"
                            name="localizacion"
                            onChange={onChange}
                            value={data.localizacion}
                            placeholder="Leave a comment here"
                            id="floatingTextarea2"
                            style={{ height: 100 }}
                          />
                          <label
                            className="text-muted"
                            htmlFor="floatingTextarea2"
                          >
                            Ubicacion (Google Link)
                          </label>
                        </div>

                        <iframe
                          className="rounded-3 shadow-sm"
                          name="localizacion"
                          onChange={onChange}
                          src={data.localizacion}
                          allowFullScreen
                          width="100%"
                          height={675}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-secondary shadow-sm rounded p-5 mx-3 h-100">
                      <div className="text-center bg-primary p-3 rounded-3 shadow-sm">
                        <div className="mt-3 form-floating">
                          <textarea
                            className="form-control"
                            name="img"
                            onChange={onChange}
                            value={data.img}
                            placeholder="Leave a comment here"
                            id="floatingTextarea2"
                            style={{ height: 200 }}
                          />
                          <label
                            className="text-muted"
                            htmlFor="floatingTextarea2"
                          >
                            Imagen (Link)
                          </label>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <a href="#">
                          <button
                            type="button"
                            className="card mt-4 btn btn-primary"
                          >
                            ¡Darse a conocer!
                          </button>
                        </a>
                        <button
                          type="submit"
                          className="card ms-2 mt-4 btn btn-warning"
                        >
                          Terminar
                        </button>
                      </div>
                      <div className="mx-4">
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="direccion"
                            onChange={onChange}
                            value={data.direccion}
                            className="form-control"
                            id="floatingAddress"
                            placeholder="Direccion"
                          />
                          <label
                            className="text-muted"
                            htmlFor="floatingAddress"
                          >
                            Direccion
                          </label>
                        </div>
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="correoDeContacto"
                            onChange={onChange}
                            value={data.correoDeContacto}
                            className="form-control"
                            id="floatingEmail"
                            placeholder="Email de contacto"
                          />
                          <label className="text-muted" htmlFor="floatingEmail">
                            Correo de contacto
                          </label>
                        </div>
                        <div className="form-floating mt-3">
                          <input
                            type="tel"
                            name="telefono"
                            onChange={onChange}
                            value={data.telefono}
                            className="form-control"
                            id="floatingPhone"
                            placeholder="Telefono de contacto"
                          />
                          <label className="text-muted" htmlFor="floatingPhone">
                            Telefono de contacto
                          </label>
                        </div>
                        <div className="pt-5">
                          <h3 className="card-title">Productos</h3>
                          <div className="img-container mt-5">
                            <img
                              src={Compras}
                              alt="CompraProductos"
                              className="img-hover rounded-3"
                            />
                            <div className="overlay">
                              <a
                                href="/products/productos"
                                className="header-text"
                              >
                                Recuerda que puedes adquirir los mejores
                                productos para tu nuevo amigo, o si ya tienes
                                mascota lo puedes consentir con los mejores
                                productos del mercado para aseo, alimentación y
                                salud.
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PetInfo;
