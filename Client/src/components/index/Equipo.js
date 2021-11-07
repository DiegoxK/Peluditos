import React, { Component } from "react";

// Assets
import Team1 from "../../assets/images/Index/Team/team1.png";
import Team2 from "../../assets/images/Index/Team/team2.png";
import Team3 from "../../assets/images/Index/Team/team3.png";
import Team4 from "../../assets/images/Index/Team/team4.png";

export default class Equipo extends Component {
  render() {
    return (
      <section id="equipo">
        <h2 className="team-header">EQUIPO</h2>
        <div className="container">
          <div className="row">
            {/* Team1 */}
            <div
              className="
                col-lg-3
                text-center
                border border-3 border-end-0 border-primary
                rounded-start
              "
            >
              <img className="mt-4" src={Team1} alt="Personal del equipo 1" />
              <h2 className="team-header-card">Samuel</h2>
              <p className="team-text">
                Es nuestro veterinario de confianza y co-fundador de la
                fundación PELUDITOS, es el encargado de los tratamientos médicos
                que requieren nuestros amiguitos.
              </p>
            </div>
            {/* team2 */}
            <div
              className="
                col-lg-3
                text-center
                border border-3 border-end-0 border-primary
              "
            >
              <img className="mt-4" src={Team2} alt="Personal del equipo 1" />
              <h2 className="team-header-card">Martha</h2>
              <p className="team-text">
                Lleva mas de 10 años vigilando el proceso de adopciones y los
                rescates de peluditos que se encuentren en vulnerabilidad.
              </p>
            </div>
            {/* team3 */}
            <div
              className="
                col-lg-3
                text-center
                border border-3 border-end-0 border-primary
              "
            >
              <img className="mt-4" src={Team3} alt="Personal del equipo 1" />
              <h2 className="team-header-card">Carlos</h2>
              <p className="team-text">
                Es co-fundador de PELUDITOS, su amor por los menos favorecidos
                es tan grande que lucha día a día por darles un espacio lleno de
                amor y seguridad.
              </p>
            </div>
            {/* Team4 */}
            <div
              className="
                col-lg-3
                text-center
                border border-3 border-primary
                rounded-end
              "
            >
              <img className="mt-4" src={Team4} alt="Personal del equipo 1" />
              <h2 className="team-header-card">Janet</h2>
              <p className="team-text">
                Es una de nuestras colaboradoras mas nuevas, lleva con nosotros
                2 años y es la encargada de velar por la seguridad de nuestros
                amiguitos en los hogares de paso.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
