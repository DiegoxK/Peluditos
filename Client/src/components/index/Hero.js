import React, { Component } from "react";

// Assets
import Cat1 from "../../assets/images/Index/Hero/cat1.jpg";
import Cat2 from "../../assets/images/Index/Hero/cat2.jpg";
import Dog1 from "../../assets/images/Index/Hero/dog1.jpg";
import Dog2 from "../../assets/images/Index/Hero/dog2.jpg";

export default class Hero extends Component {
  render() {
    return (
      <section
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={Cat1} className="d-block w-100 hero-img" alt="Cat" />
          </div>
          <div className="carousel-item">
            <img src={Cat2} className="d-block w-100 hero-img" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={Dog1} className="d-block w-100 hero-img" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={Dog2} className="d-block w-100 hero-img" alt="..." />
          </div>
          <div className="hero-background">
            <h1 className="hero-text">
              PELUDITOS! <br />
              Es un proyecto que consiste en apoyar fundaciónes dónde se impulse
              la adopción de perros o gatos.
            </h1>
            <p className="sub-hero-text">
              Dedicados al cuidado de los animales
            </p>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </section>
    );
  }
}
