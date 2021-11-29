import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import axios from "axios";

// Components
import Header from "../components/Header";
import ProductCard from "../components/Products/ProductCard";

function Products(props) {
  const { productId } = useParams();

  // Array de productos
  const [products, setProducts] = useState([]);
  // Producto actual
  const [productType, setProductType] = useState(productId);
  // Array del producto actual
  const [actualProducts, setActualProducts] = useState([]);
  // Estado de la paginacion
  const [pageNumber, setPageNumber] = useState(0);
  // Cantidad de tarjetas por paginacion
  const productsPerPage = 4;
  const productsVisited = pageNumber * productsPerPage;
  const pageCount = Math.ceil(actualProducts.length / productsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    axios
      .get(props.url + "/api/products")
      .then((response) => {
        setProducts(() => {
          return response.data;
        });
        setActualProducts(
          response.data.filter((product) => {
            if (productId === "productos") {
              return response.data;
            } else {
              return product.tipoProducto === productId;
            }
          })
        );
        setProductType(
          `${productId[0].toUpperCase()}${productId.substring(1)}`
        );
      })
      .catch((e) => {
        console.log("error " + e);
      });
  }, []);

  const displayCards = actualProducts
    .slice(productsVisited, productsVisited + productsPerPage)
    .map((product) => {
      return (
        <ProductCard
          url={props.url}
          key={product._id}
          id={product._id}
          img={product.img}
          name={product.nombre}
          productType={product.tipoProducto}
          description={product.descripcion}
          price={product.precio}
          stock={product.stock}
          readCookie={props.readCookie}
        />
      );
    });

  const productFilter = (event) => {
    setActualProducts(
      products.filter((product) => {
        if (event.target.name === "productos") {
          return products;
        } else {
          return product.tipoProducto === event.target.name;
        }
      })
    );
    setProductType(
      `${event.target.name[0].toUpperCase()}${event.target.name.substring(1)}`
    );
  };

  return (
    <>
      <Header />

      <section className="Products">
        <h2 className="header">Productos</h2>
        <div className="bg-primary ">
          <div className="container d-flex justify-content-between">
            <div className="dropdown ms-5 py-3">
              <button
                className="btn btn-secondary dropdown-toggle"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {productType}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-dark"
                aria-labelledby="dropdownMenuLink"
              >
                <li>
                  <button
                    className="dropdown-item"
                    name="productos"
                    onClick={productFilter}
                  >
                    Todos
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    name="aseo"
                    onClick={productFilter}
                  >
                    Aseo
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    name="alimentos"
                    onClick={productFilter}
                  >
                    Alimentos
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    name="snacks"
                    onClick={productFilter}
                  >
                    Snacks
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    name="accesorios"
                    onClick={productFilter}
                  >
                    Accesorios
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    name="juguetes"
                    onClick={productFilter}
                  >
                    Juguetes
                  </button>
                </li>
              </ul>
            </div>

            <h2 className="text-secondary  py-3 me-5">Bienvenido!</h2>
          </div>
        </div>
        <div className="container">{displayCards}</div>
        <div className="bg-primary mt-5 p-3 d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Siguiente"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"page-item"}
            activeLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"page-item active"}
            disabledClassName={"page-item disable"}
          />
        </div>
      </section>
    </>
  );
}

export default Products;
