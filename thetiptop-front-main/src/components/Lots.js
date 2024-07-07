import React from "react";
import logo5 from "./images/logo5.png";
import "./Lots.css";

const Lots = () => {
  return (
    <>

      <div className="lots" id="lots">
        <div className="container">
          <h2 style={{ color: "black" }}>Lots</h2>
          <span className="line2"></span>
          <div className="content-second">
            <div className="card">
              <img src={logo5} alt="user1" />
              <p>Un coffret découverte d’une valeur de 69€</p>
            </div>
            <div className="card">
              <img src={logo5} alt="user1" />
              <p>Un coffret découverte d’une valeur de 39€</p>
            </div>
          </div>
          <div className="content">
            <div className="card">
              <img src={logo5} alt="user1" />
              <p>Une boîte de 100g d'un thé signature</p>
            </div>
            <div className="card">
              <img src={logo5} alt="user1" />
              <p>Un infuseur à thé</p>
            </div>
            <div className="card">
              <img src={logo5} alt="user1" />
              <p>Une boîte de 100g d'un thé détox ou d'infusion</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lots;
