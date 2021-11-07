import React, { Component } from "react";

// Assets
import news1 from "../../assets/images/Index/News/newscat1.jpg";
import news2 from "../../assets/images/Index/News/newscat2.jpg";
import news3 from "../../assets/images/Index/News/newsdog1.jpg";

export default class Noticias extends Component {
  render() {
    return (
      <section className="noticias">
        <h2 className="header mt-5">NOTICIAS!!</h2>
        <div className="primary-background">
          <div className="container p-5">
            <div className="row">
              <div className="col img-container">
                <img src={news1} alt="Cat" className="img-hover" />
                <div className="overlay">
                  <a
                    href="https://www.univision.com/local/houston-kxln/mascotas-adopcion-houston-fotos"
                    className="header-text"
                    target="_blank"
                  >
                    ¿Podrías darles un hogar? Ofrecen 50% en tarifas de adopción
                    de mascotas adultas en Houston
                  </a>
                  <p className="text">
                    Perros y gatos adultos buscan dónde vivir, por lo que en
                    Houston Humane Society están listos para ayudarles a
                    encontrar a su nuevo mejor amigo en noviembre, que es el Mes
                    Nacional de Adopción de Mascotas adultas.
                  </p>
                </div>
              </div>
              <div className="col img-container">
                <img src={news3} alt="Cat" className="img-hover" />
                <div className="overlay">
                  <a
                    href="https://www.eltiempo.com/bogota/adopcion-de-perros-y-gatos-en-bogota-una-tendencia-que-crece-desde-2020-598818"
                    className="header-text"
                    target="_blank"
                  >
                    Adopción de perros y gatos en Bogotá, tendencia que crece
                    desde 2020
                  </a>
                  <p className="text">
                    Desde 2020 hasta la fecha, se ha incrementado la adopción de
                    perros y gatos en Bogotá, según datos de la investigación
                    Ampliar el horizonte ideas para la adopción de animales de
                    compañía en Bogotá del Instituto de Protección y Bienestar
                    Animal (IDPYBA).
                  </p>
                </div>
              </div>
              <div className="col img-container">
                <img src={news2} alt="Cat" className="img-hover" />
                <div className="overlay">
                  <a
                    href="https://cnnespanol.cnn.com/2019/12/23/navidad-regalo-perfecto-mascota-porque-animales-no/"
                    className="header-text"
                    target="_blank"
                  >
                    ¿Por qué los animales no son el regalo perfecto de Navidad?
                  </a>
                  <p className="text">
                    Cada año cuando se acerca la Navidad, la gente hace una
                    lluvia de ideas para pensar en el regalo perfecto. La
                    comodidad y la alegría de una mascota pueden parecer una
                    gran opción, pero los refugios de mascotas y las
                    organizaciones de bienestar animal no lo aconsejan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
