import { React } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Participer";

const NotFoundPage = () => {
  const style = { textAlign: "center", marginTop: "11rem", fontSize: "6rem" };
  return (
    <>
      <Navbar />
      <div className="main">
        <div className="content">
          <h2 style={style}>Page introuvable</h2>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
