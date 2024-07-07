import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <>
      <div className="about" id="about">
        <div className="col-2">
          <h2 style={{ color: "black" }}>Comment jouer ?</h2>
          <span className="line"></span>
          <div
            className="content"
            style={{
              marginBottom: "3rem",
              fontSize: "1.8rem",
              textAlign: "justify",
            }}
          >
            <div>
              Afin de fêter l’ouverture de notre 10ème boutique à Nice, nous
              organisons un jeu-concours de type tirage au sort.
            </div>
            <div>
              Vous trouverez sur tous vos tickets de caisse et vos factures de
              vos achat chez Thétiptop,{" "}
              <b>
                d'un montant dépassant 49€, un numéro composé de 10 chiffres.
              </b>
            </div>
            <div>
              Vous le récupérez, vous vous inscrivez ici sur notre plateforme,
              et vous tentez votre chance à gagner nos <b>5 lots</b>, et à
              l'issu du jeu concours vous participez au grand tombola et
              tenterez de gagner <b>un an de thé d'un montant de 360€ !</b>
            </div>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              100% des tickets seront gagnants
            </div>
          </div>
          <Link to="/signup">
            <button className="button">Participer</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default About;
