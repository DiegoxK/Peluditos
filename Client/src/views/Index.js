import React, { Component } from "react";

// Components
import Header from "../components/Header";
import Hero from "../components/index/Hero";
import Servicios from "../components/index/Servicios";
import Noticias from "../components/index/Noticias";
import Equipo from "../components/index/Equipo";
import Footer from "../components/Footer";

export default class index extends Component {
  render() {
    return (
      <div>
        {/* <!-- Modulo Header --> */}
        <Header />
        {/* Modulo Hero */}
        <Hero />
        {/* <!-- Seccion de Servicios --> */}
        <Servicios />
        {/* <!-- Seccion de Noticias --> */}
        <Noticias />
        {/* <!-- Seccion de Equipo --> */}
        <Equipo />
        {/* <!-- Modulo Footer --> */}
        <Footer />
      </div>
    );
  }
}
