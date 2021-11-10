import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";

// Components
import Header from "../components/Header";
import PetCard from "../components/adoptions/PetCard";

function Adoption(props) {
  // Array de mascotas
  const [pets, setPets] = useState([]);
  // Estado de la paginacion
  const [pageNumber, setPageNumber] = useState(0);
  // Cantidad de tarjetas por paginacion
  const petsPerPage = 6;
  const petsVisited = pageNumber * petsPerPage;
  const pageCount = Math.ceil(pets.length / petsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    axios
      .get(props.url + "/api/pet")
      .then((response) => {
        setPets(() => {
          return response.data;
        });
      })
      .catch((e) => {
        console.log("error " + e);
      });
  }, []);

  const displayCards = pets
    .slice(petsVisited, petsVisited + petsPerPage)
    .map((pet) => {
      return (
        <PetCard
          key={pet._id}
          img={pet.img}
          name={pet.nombre}
          age={pet.edadMascota}
          description={pet.descripcion}
        />
      );
    });

  return (
    <div>
      <Header />
      <section className="Adopcion">
        <h2 className="header">Adopta!</h2>
        <div className="container">
          <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
            {displayCards}
          </div>
        </div>
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
    </div>
  );
}

export default Adoption;
