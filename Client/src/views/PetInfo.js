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

  const [img, setImg] = useState(props.img);
  const [name, setName] = useState(props.name);
  const [age, setAge] = useState(props.age);
  const [description, setDescription] = useState(props.description);

  useEffect(() => {
    axios
      .get(`${props.url}/api/pet/${petId}`)
      .then((res) => {
        setImg(res.data.img);
        setName(res.data.nombre);
        setAge(res.data.edadMascota);
        setDescription(res.data.descripcion);
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
                    <li className="card-text fw-bold">Edad</li>
                    <li className="ms-5 card-text fw-bold">Genero</li>
                    <li className="ms-5 card-text fw-bold">Tamaño</li>
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
                        <td>Sis</td>
                        <td>Non</td>
                        <td>100%</td>
                        <td>100%</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="card-text fw-bold mt-5">Sobre {name}</p>
                  <p className="card-text">{description}</p>
                </div>
                <div className="text-center w-100 px-3">
                  <iframe
                    className="rounded-3 shadow-sm"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253821.43534606486!2d-75.7364810050448!3d6.26900071367555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428ef4e52dddb%3A0x722fd6c39270ac72!2sMedellin%2C%20Antioquia!5e0!3m2!1sen!2sco!4v1636581592062!5m2!1sen!2sco"
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
                    <span className="fw-bold">Localizacion:</span> Medellín,
                    Medellin, Antioquia
                  </p>
                  <p className="card-text mt-4">
                    <span className="fw-bold">Correo de contacto:</span>
                    Adopciones@Empresa.com
                  </p>
                  <p className="card-text mt-4">
                    <span className="fw-bold">Telefono:</span> (787) 722-2238
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
                        <a href="/productos" className="header-text">
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
