import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer" id="footer">
        <div className="container">
          <ul>
            <li className="nav-item">
              <a href="/">Accueil</a>
            </li>
            <li className="nav-item">
              <a href="#about">Comment jouer ?</a>
            </li>
            <li className="nav-item">
              <a href="#lots">Lots</a>
            </li>
            <li className="nav-item">
              <a href="/participer">Participer</a>
            </li>
            <li className="nav-item">
              <a href="/mentionslegales">Mentions Légales</a>
            </li>
          </ul>
          <div className="bottom">
            <span className="line"></span>
            <p>+33 6 21 21 31 31</p>
            <p>contact@thetiptop.fr</p>
            <p>18 rue Léon Frot, 75011 Paris </p>
            <p style={{ marginTop: "4rem" }}>© 2023 Copyright : Thétiptop - Tous droits réservés - <b>ATTENTION : Ce site internet est un projet étudiant.</b></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
