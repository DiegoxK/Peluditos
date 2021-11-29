import axios from "axios";
import React, { useState } from "react";
// Assets
import Logo from "../assets/images/Header/Logo.png";

// Footer
import Footer from "../components/Footer";

function ProductRegister(props) {
  const [data, setData] = useState({
    img: "",
    tipoProducto: "",
    nombre: "",
    stock: "",
    precio: "",
    descripcion: "",
  });

  const parseInfo = (info) => {
    const parseData = {
      ...info,
      edadAñosMascota: parseInt(info.stock),
      telefono: parseInt(info.precio),
    };

    return parseData;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(props.url + "/api/products", parseInfo(data))
      .then(() => {
        setData({
          img: "",
          tipoProducto: "",
          nombre: "",
          stock: "",
          precio: "",
          descripcion: "",
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
    <div className="text-center">
      <main className="form-signin mt-5 p-3 border border-3 border-primary">
        <form onSubmit={onSubmit}>
          <a href="/">
            <img className="mb-4" src={Logo} alt="Logo" />
          </a>
          <h1 className="h3 mb-2 fw-normal fw-bold text-primary">
            Registrar producto
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
              placeholder="Nombre del producto"
            />
            <label className="text-muted" htmlFor="floatingName">
              Nombre del producto
            </label>
          </div>
          <select
            required
            name="tipoProducto"
            onChange={onChange}
            value={data.tipoProducto}
            className="mt-3 form-select py-2"
          >
            <option disabled value="">
              Tipo de producto
            </option>
            <option>snacks</option>
            <option>aseo</option>
            <option>juguetes</option>
            <option>accesorios</option>
            <option>alimentos</option>
          </select>

          <div className="form-floating mt-3">
            <input
              required
              type="number"
              name="stock"
              onChange={onChange}
              value={data.stock}
              className="form-control"
              id="floatingStock"
              placeholder="Stock"
            />
            <label className="text-muted" htmlFor="floatingStock">
              Stock
            </label>
          </div>
          <div className="form-floating mt-3">
            <input
              required
              type="number"
              name="precio"
              onChange={onChange}
              value={data.precio}
              className="form-control"
              id="floatingStock"
              placeholder="Precio"
            />
            <label className="text-muted" htmlFor="floatingPrecio">
              Precio
            </label>
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
              name="img"
              onChange={onChange}
              value={data.img}
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              style={{ height: 100 }}
            />
            <label className="text-muted" htmlFor="floatingTextarea2">
              Imagen (Link)
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">
            Registrar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default ProductRegister;
