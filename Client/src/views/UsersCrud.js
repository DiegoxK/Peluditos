import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

function UsersCrud(props) {
  const [credentials, setCredentials] = useState([]);
  const [userEdit, setuserEdit] = useState({});
  const [pageState, setPageState] = useState(true);
  const [editState, setEditState] = useState(false);

  useEffect(() => {
    axios
      .get(`${props.url}/api/user`)
      .then((response) => {
        setCredentials(() => {
          return response.data;
        });
      })
      .catch((e) => {
        console.log("error" + e);
      });
  }, [pageState]);

  const handleInputChange = (event) => {
    setuserEdit({
      ...userEdit,
      [event.target.name]: event.target.value,
    });
  };

  const editChangeState = (id) => {
    setEditState(true);
    axios
      .get(`${props.url}/api/user/${id}`)
      .then((res) => {
        setuserEdit(() => {
          return res.data;
        });
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const editUser = (event, id) => {
    event.preventDefault();
    axios
      .put(`${props.url}/api/user/${id}`, userEdit)
      .then(() => {
        setEditState(false);
        setPageState(!pageState);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const deleteUser = (id) => {
    axios
      .delete(`${props.url}/api/user/${id}`)
      .then((res) => {
        setPageState(!pageState);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const disableEdit = () => {
    setEditState(false);
  };

  return (
    <>
      <Header />
      <h2 className="header">Usuarios!</h2>
      <div className="container bg-primary text-center d-flex justify-content-center mt-5">
        <table className="table table-secondary mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Tipo de Casa</th>
              <th>Mascota?</th>
              <th>Castrada?</th>
              <th>Edad Mascota</th>
              <th>Tipo de Usuario</th>
              <th>Correo Electronico</th>
              <th>Telefono</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.tipoDeCasa}</td>
                  <td>{user.mascota.toString()}</td>
                  <td>{user.castrada.toString()}</td>
                  {user.edadMascota === null && <td>{"N/A"}</td>}
                  {user.edadMascota !== null && <td>{user.edadMascota}</td>}
                  <td>{user.userType}</td>
                  <td>{user.correoElectronico}</td>
                  <td>{user.telefono}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        editChangeState(user._id);
                      }}
                      className="btn btn-outline-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                      <span className="visually-hidden">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteUser(user._id);
                      }}
                      className="btn btn-outline-danger"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                      <span className="visually-hidden">Delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editState === true && (
        <>
          <h2 className="header mt-5">Editar!</h2>
          <div className="container">
            <form
              className="mx-5 my-4"
              onSubmit={(event) => {
                editUser(event, userEdit._id);
              }}
            >
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  value={userEdit.nombre}
                  name="nombre"
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  value={userEdit.apellido}
                  name="apellido"
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de usuario</label>
                <input
                  type="text"
                  value={userEdit.userType}
                  name="userType"
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo Electronico</label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={userEdit.correoElectronico}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Telefono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={userEdit.telefono}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary ms-3">
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-3"
                  onClick={disableEdit}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default UsersCrud;
