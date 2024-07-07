import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Lots from "./components/Lots";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import CookiesBar from "./components/CookiesBar";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Lots />
      <Newsletter />
      <Footer />
      <CookiesBar />
    </>
  );
}

export default App;
