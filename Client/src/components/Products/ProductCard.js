import React from "react";

function ProductCard(props) {
  const id = props.id;
  const img = props.img;
  const name = props.name;
  const productType = props.productType;
  const description = props.description;
  const price = props.price;
  const stock = props.stock;

  return (
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
              <span className="fw-bold">{`${productType[0].toUpperCase()}${productType.substring(
                1
              )}`}</span>
            </p>
            <p>
              Stock: <span className="fw-bold">{stock}</span>
            </p>
            <p className="card-text pt-2">{description}</p>
            <div className="d-flex justify-content-end">
              <a href={`/payment/${id}`}>
                <button className="btn btn-primary me-5 text-secondary">
                  Comprar
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
