import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

function Payment(props) {
  const { productId } = useParams();

  const [paymentState, setPaymentState] = useState("other");

  const [alert, setAlert] = useState(false);

  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    correo: "",
    telefono: "",
  });

  useEffect(() => {
    axios
      .get(`${props.url}/api/products/${productId}`)
      .then((res) => {
        setImg(res.data.img);
        setName(res.data.nombre);
        setProductType(res.data.tipoProducto);
        setDescription(res.data.descripcion);
        setPrice(res.data.precio);
        setStock(res.data.stock);
      })
      .catch((e) => {
        console.log(e.response);
      });
  }, []);

  const onChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const showAlert = (event) => {
    event.preventDefault();
    setAlert("modal");
  };

  return (
    <>
      <Header />
      <section className="Pagos">
        <h2 className="header">Pago</h2>
        <div className="container">
          <div className="product-card">
            <div className="card mb-3 mt-5 bg-secondary">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={img} className="img-fluid p-5" alt="Product" />
                </div>
                <div className="col-md-8">
                  <div className="card-body py-5">
                    <div className="d-flex justify-content-between">
                      <h5 className="fw-bold fs-2">{name}</h5>
                      <p className="fw-bold fs-3 me-5">${price}</p>
                    </div>
                    <p>
                      Tipo:{" "}
                      <span className="fw-bold">
                        {productType.toUpperCase()}
                      </span>
                    </p>
                    <p>
                      Stock: <span className="fw-bold">{stock}</span>
                    </p>
                    <p className="card-text pt-2">{description}</p>
                    <div className="row me-4 mt-4">
                      <div className="col-9 d-flex justify-content-end">
                        <p className="fw-bold mt-2">Cantidad: </p>
                      </div>
                      <div className="col-3">
                        <input
                          type="number"
                          className="form-control py-2"
                          placeholder="Cantidad"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <form onSubmit={showAlert}>
              <h1 className="h3 mb-2 fw-normal fw-bold text-primary">Pagos</h1>
              <div className="form-floating mt-5">
                <input
                  required
                  type="text"
                  className="form-control"
                  name="nombre"
                  onChange={onChange}
                  value={data.nombre}
                  id="floatingName"
                  placeholder="Nombre"
                />
                <label htmlFor="floatingName">Nombre</label>
              </div>
              <div className="form-floating mt-3">
                <input
                  required
                  type="text"
                  className="form-control"
                  name="apellido"
                  onChange={onChange}
                  value={data.apellido}
                  id="floatingLastname"
                  placeholder="Apellido"
                />
                <label htmlFor="floatingLastname">Apellido</label>
              </div>
              <div className="form-floating mt-3">
                <input
                  required
                  type="text"
                  className="form-control"
                  name="direccion"
                  onChange={onChange}
                  value={data.direccion}
                  id="floatingMail"
                  placeholder="nombre@ejemplo.com"
                />
                <label htmlFor="floatinDirection">Dirección </label>
              </div>
              <div className="form-floating mt-3">
                <input
                  required
                  type="text"
                  className="form-control"
                  name="correo"
                  onChange={onChange}
                  value={data.correo}
                  id="floatingDirection"
                  placeholder="nombre@ejemplo.com"
                />
                <label htmlFor="floatingMail">Correo Electronico</label>
              </div>
              <div className="form-floating mt-3">
                <input
                  required
                  type="tel"
                  className="form-control"
                  name="telefono"
                  onChange={onChange}
                  value={data.telefono}
                  id="floatingPhone"
                  placeholder="Telefono"
                />
                <label htmlFor="floatingPhone">Telefono</label>
              </div>
              <div className="mt-3">
                <p className="mt-3 fs-4 fw-bold text-primary">Metodo de pago</p>
                <select
                  required
                  className="form-select py-2"
                  onChange={(e) => setPaymentState(e.target.value)}
                >
                  <option disabled value>
                    Metodo de pago
                  </option>
                  <option value="other">PayPal</option>
                  <option value="card">Tarjeta credito/Debito</option>
                  <option value="other">Contra entrega</option>
                </select>
              </div>
              {paymentState === "card" && (
                <>
                  <hr className="my-4" />
                  <p className="mt-3 fs-4 fw-bold text-primary">
                    Datos Tarjeta
                  </p>
                  <div className="form-floating mt-3">
                    <input
                      required
                      type="tel"
                      className="form-control"
                      id="floatingPhone"
                      placeholder="Telefono"
                    />
                    <label htmlFor="floatingPhone">Numero Tarjeta</label>
                  </div>
                  <div className="col-6 mt-3">
                    <input
                      required
                      type="number"
                      className="form-control py-2"
                      placeholder="CVV"
                    />
                  </div>
                  <div className="form-floating mt-3">
                    <input
                      required
                      type="tel"
                      className="form-control"
                      id="floatingPhone"
                      placeholder="Telefono"
                    />
                    <label htmlFor="floatingPhone">Nombre en la tarjeta</label>
                  </div>
                  <div className="row">
                    <p className="mt-3 fs-4 fw-bold text-primary">
                      Fecha de expiracion
                    </p>
                    <div className="col-6">
                      <input
                        required
                        type="number"
                        className="form-control py-2"
                        placeholder="Año"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        required
                        type="number"
                        className="form-control py-2"
                        placeholder="Mes"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                className="w-100 btn btn-lg btn-primary mt-5"
                type="submit"
                data-bs-toggle={alert}
                data-bs-target="#paymentModal"
              >
                Confirmar Compra
              </button>
            </form>
          </div>
        </div>
        {/* Pago Modal */}
        <div
          className="modal fade"
          id="paymentModal"
          tabIndex={-1}
          aria-labelledby="paymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content bg-secondary">
              <div className="modal-header">
                <h5
                  className="modal-title text-primary fw-bold"
                  id="paymentModalLabel"
                >
                  ¡Gracias!
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              <div className="d-flex justify-content-center">
                <img
                  src="http://gifimage.net/wp-content/uploads/2017/10/cute-transparent-gif-10.gif"
                  alt="Cat gif"
                  width={250}
                />
              </div>
              <div className="text-center modal-body">
                <p className="fs-4 fw-bold">
                  Te enviaremos el estado del envio al siguiente correo:
                </p>
                <p className="fs-4">{data.correo}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                <a href="/">
                  <button type="button" className="btn btn-primary">
                    Inicio
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Payment;
