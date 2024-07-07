import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Timer from "./Timer";

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="content" style={{ fontFamily: "-apple-system" }}>
          <p></p>
          <p
            style={{
              fontSize: "5.5rem",
              fontFamily: "-apple-system",
              marginBottom: "3rem",
              marginTop: "3rem",
            }}
          >
            Le grand jeu concours ThéTipTop
          </p>
          <p
            style={{
              fontSize: "2.5rem",
              fontFamily: "-apple-system",
            }}
          >
            Un jeu où tout le monde est 100% gagnant
          </p>

          <p>
            <p>
              <Timer />
            </p>
            <p
              style={{
                marginTop: "3rem",
              }}
            >
              <Link to="/signup">
                <button className="button">Participer</button>
              </Link>
            </p>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
