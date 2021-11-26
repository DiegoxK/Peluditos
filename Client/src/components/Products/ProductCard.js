import axios from "axios";
import React, { useState } from "react";

function ProductCard(props) {
  const userType = props.readCookie("userType");

  const [editState, setEditState] = useState(false);

  const [data, setData] = useState({
    id: props.id,
    img: props.img,
    nombre: props.name,
    tipoProducto: props.productType,
    descripcion: props.description,
    precio: props.price,
    stock: props.stock,
  });

  const parseInfo = (info) => {
    const parseData = {
      ...info,
      precio: parseInt(info.precio),
      stock: parseInt(info.stock),
    };

    return parseData;
  };

  const submitProduct = (event, productId) => {
    event.preventDefault();
    axios
      .put(`${props.url}/api/products/${productId}`, parseInfo(data))
      .then((res) => {
        console.log(res);
        setEditState(false);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const deleteProduct = (productId) => {
    axios
      .delete(`${props.url}/api/products/${productId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const onChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  // Tarjeta normal

  if (editState === false) {
    return (
      <div className="card mb-3 mt-5 bg-secondary">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={data.img} className="img-fluid p-5" alt="Product" />
          </div>
          <div className="col-md-8">
            <div className="card-body py-5">
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold fs-2">{data.nombre}</h5>
                <p className="fw-bold fs-3 me-5">${data.precio}</p>
              </div>
              <p>
                Tipo:{" "}
                <span className="fw-bold">{`${data.tipoProducto[0].toUpperCase()}${data.tipoProducto.substring(
                  1
                )}`}</span>
              </p>
              <p>
                Stock: <span className="fw-bold">{data.stock}</span>
              </p>
              <p className="card-text pt-2">{data.descripcion}</p>
              <div className="d-flex justify-content-end">
                <a href={`/payment/${data.id}`}>
                  <button className="btn btn-primary me-5 text-secondary">
                    Comprar
                  </button>
                </a>
                {userType === "admin" && (
                  <button
                    onClick={() => {
                      setEditState(true);
                    }}
                    className="btn btn-warning me-5"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (editState === true) {
    // Tarjeta En modo edicion

    return (
      <div className="card mb-3 mt-5 bg-secondary">
        <form
          onSubmit={(event) => {
            submitProduct(event, data.id);
          }}
          className="row g-0"
        >
          <div className="col-md-4">
            <div className="mt-5 ms-4 form-floating">
              <textarea
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
          </div>
          <div className="col-md-8">
            <div className="card-body py-5">
              <div className="d-flex justify-content-between">
                <div className="mb-3">
                  <input
                    type="text"
                    name="nombre"
                    onChange={onChange}
                    value={data.nombre}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="precio"
                    onChange={onChange}
                    value={data.precio}
                    className="form-control"
                  />
                </div>
              </div>
              Tipo:{" "}
              <select
                name="tipoProducto"
                onChange={onChange}
                value={data.tipoProducto}
                className="form-select py-2"
              >
                <option disabled value="">
                  Tipo de producto
                </option>
                <option>alimentos</option>
                <option>snacks</option>
                <option>aseo</option>
                <option>juguetes</option>
                <option>accesorios</option>
              </select>
              Stock:{" "}
              <div className="mb-3">
                <input
                  type="text"
                  name="stock"
                  onChange={onChange}
                  value={data.stock}
                  className="form-control"
                />
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
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-warning mt-4 me-3">
                  Terminar
                </button>
                <button className="btn btn-danger mt-4 me-5 ">Eliminar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ProductCard;
