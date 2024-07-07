import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo5 from "./images/logo5.png";
import "./Navbar.css";

let user = JSON.parse(localStorage.getItem("user"));

const Navbar = ({ onChangeLoginTab }) => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const navigate = useNavigate();

  const closeMenu = () => setClick(false);

  const handleParticiper = () => {
    closeMenu();
    navigate("/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location = "/";
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="header">
        <nav className="navbar">
          <a href="/">
            <img src={logo5} alt="logo" />
          </a>
          <div className="hamburger" onClick={handleClick}>
            {click ? (
              <FaTimes size={30} style={{ color: "#ffffff" }} />
            ) : (
              <FaBars size={30} style={{ color: "#ffffff" }} />
            )}
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <a href="/" onClick={closeMenu}>
                Accueil
              </a>
            </li>
            <li className="nav-item">
              {user?.access_level !== 1 && (
                <a href="/#about" onClick={closeMenu}>
                  Règles du jeu
                </a>
              )}
              {user?.access_level === 1 && (
                <a href="/admin/signup" onClick={closeMenu}>
                  Création de compte
                </a>
              )}
            </li>
            <li className="nav-item">
              {!user && <a onClick={handleParticiper}>Participer</a>}
              {user && user.access_level === 3 && (
                <a href="/participer" onClick={closeMenu}>
                  Participer
                </a>
              )}
              {user && user.access_level === 1 && (
                <a href="/admin" onClick={closeMenu}>
                  Tableau de bord
                </a>
              )}
              {user && user.access_level === 2 && (
                <a href="/staff" onClick={closeMenu}>
                  Tableau de bord
                </a>
              )}
            </li>
            <li className="nav-item">
              <a href="#footer" onClick={closeMenu}>
              Contact
              </a>
            </li>
            <li className="nav-item">
              {user ? (
                <button className="logout" onClick={handleLogout}>
                  logout
                </button>
              ) : (
                <button className="login" onClick={handleLogin}>
                  LOGIN
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
