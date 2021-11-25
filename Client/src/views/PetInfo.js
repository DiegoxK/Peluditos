import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Assets
import Compras from "../assets/images/PetInfo/Compras.jpg";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

function PetInfo(props) {
  const { petId } = useParams();

  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [yearAge, setYearAge] = useState("");
  const [monthAge, setMonthAge] = useState("");
  const [gender, setGender] = useState("");
  const [petSize, setPetSize] = useState("");
  const [castred, setCastred] = useState("");
  const [vaccinated, setVaccinated] = useState("");
  const [kids, setKids] = useState("");
  const [otherPets, setOtherPets] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    axios
      .get(`${props.url}/api/pet/${petId}`)
      .then((res) => {
        setImg(res.data.img);
        setName(res.data.nombre);
        setDescription(res.data.descripcion);
        setYearAge(res.data.edadAñosMascota);
        setMonthAge(res.data.edadMesesMascota);
        setGender(res.data.genero);
        setPetSize(res.data.tamaño);
        setCastred(res.data.castrado);
        setVaccinated(res.data.vacunado);
        setKids(res.data.niños);
        setOtherPets(res.data.otrasMascotas);
        setAddress(res.data.direccion);
        setContactEmail(res.data.correoDeContacto);
        setPhoneNumber(res.data.telefono);
        setLocation(res.data.localizacion);
      })
      .catch((e) => {
        console.log(e.response);
      });
  }, []);

  return (
    <>
      <Header />
      <section className="mascota">
        <h2 className="header">Informacion!</h2>
        <div className="container">
          <div className="row mt-5">
            <div className="col">
              <div className="h-100">
                <div className="bg-secondary shadow-sm rounded p-5 mx-3 mb-4">
                  <h3 className="mb-4 fw-bold">{name}</h3>
                  <ul className="d-flex flex-row">
                    <li className="card-text fw-bold">{gender}</li>
                    <li className="ms-5 card-text">
                      Tamaño: <span className="fw-bold">{petSize}</span>
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
                        <td>{castred === true ? "Si" : "No"}</td>
                        <td>{vaccinated === true ? "Si" : "No"}</td>
                        <td>{kids === true ? "Si" : "No"}</td>
                        <td>{otherPets === true ? "Si" : "No"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="card-text fw-bold mt-5">Sobre {name}</p>
                  <p>
                    <span className="fw-bold">Años:</span> {yearAge}{" "}
                    <span className="fw-bold">Meses:</span> {monthAge}
                  </p>
                  <p className="card-text">{description}</p>
                </div>
                <div className="text-center w-100 px-3">
                  <iframe
                    className="rounded-3 shadow-sm"
                    src={location}
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
                  <img src={img} alt="Pet" />
                </div>
                <div className="d-flex justify-content-center">
                  <a href="#">
                    <button type="button" className="card mt-4 btn btn-primary">
                      ¡Darse a conocer!
                    </button>
                  </a>
                </div>
                <div className="mx-4">
                  <p className="card-text mt-4">
                    <span className="fw-bold">Localizacion:</span> {address}
                  </p>
                  <p className="card-text mt-4">
                    <span className="fw-bold">Correo de contacto: </span>
                    {contactEmail}
                  </p>
                  <p className="card-text mt-4">
                    <span className="fw-bold">Telefono:</span> {phoneNumber}
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
                        <a href="/products/productos" className="header-text">
                          Recuerda que puedes adquirir los mejores productos
                          para tu nuevo amigo, o si ya tienes mascota lo puedes
                          consentir con los mejores productos del mercado para
                          aseo, alimentación y salud.
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PetInfo;
