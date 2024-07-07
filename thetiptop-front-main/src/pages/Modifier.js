import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "./Participer.css";
const user = JSON.parse(localStorage.getItem("user"));

const Modifier = () => {
  const [data, setData] = useState({
    email: user.email,
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [success, setSuccess] = useState("");

  const getError = (error) => {
    if (error.code === axios.AxiosError.ERR_NETWORK)
      return "Une erreur de connexion est arrivée !";
    if (
      error.code === axios.AxiosError.ERR_BAD_REQUEST &&
      error?.response?.data?.message
    )
      return error.response.data.message;
    return "Une erreur inconnue est arrivé !";
  };

  const handleDeleteUser = async () => {
    setDeleteUserError("");
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/delete`;
      const { data: res } = await axios.post(
        url,
        {},
        {
          headers: { Authorization: `${user.token}` },
        }
      );
      localStorage.removeItem("user");
      setIsUserDeleted(true);
    } catch (error) {
      setDeleteUserError(getError(error));
    }
  };

  const handleChange = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    setSuccess("");
  };
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  const modalRef = useRef(null);

  const doShowDeleteUserModal = () => {
    setShowDeleteUserModal(true);
  };

  const doHideDeleteUserModal = () => {
    setShowDeleteUserModal(false);
    setDeleteUserError("");
    if (isUserDeleted) {
      window.location = "/";
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutSideModalClick, true);
  });

  const handleOutSideModalClick = (e) => {
    if (showDeleteUserModal && !modalRef.current.contains(e.target)) {
      doHideDeleteUserModal();
    }
  };

  useEffect(() => {
    comparePasswords();
  }, [data]);

  const comparePasswords = () => {
    if (!data.newPasswordConfirm) {
      return;
    }
    if (data.newPasswordConfirm === data.newPassword) {
      setErrorPass("");
      return;
    }
    setErrorPass("Password not matching");
  };

  const handleUpdatePassword = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/updateuser`;
      const { data: res } = await axios.patch(url, data, {
        headers: { authorization: `${user.token}` },
      });
      setSuccess("");
      if (res.id) {
        setSuccess("Mot de passe modifié avec succès !");
        setData({
          email: user.email,
          oldPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        });
      }
    } catch (error) {
      if (error.response) {
        setErrorPass(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={showDeleteUserModal ? "modal active" : "modal"}>
        <div className="modal-content delete-user" ref={modalRef}>
          <span className="close" onClick={doHideDeleteUserModal}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </span>
          <p>
            Êtes-vous sur de supprimer votre compte ? <br />
            Vos cadeaux non récupérés seront perdus ! <br /> ( Attention cette
            opération est irréversible )
          </p>
          <div className="buttons">
            <button
              className="btn delete-user"
              disabled={isUserDeleted ? true : false}
              onClick={handleDeleteUser}
            >
              Oui
            </button>
            <button
              className="btn cancel"
              disabled={isUserDeleted ? true : false}
              onClick={doHideDeleteUserModal}
            >
              Annuler
            </button>
          </div>
          <div
            className={
              deleteUserError === "" ? "error-msg" : "error-msg active"
            }
          >
            <FontAwesomeIcon icon={faCircleXmark} /> : {deleteUserError}
          </div>
          <div className={isUserDeleted ? "info-msg active" : "info-msg"}>
            <FontAwesomeIcon icon={faCircleCheck} /> : Votre compte à été
            supprimé
          </div>
        </div>
      </div>
      <div className="main">
        <div className="content">
          <h2>Modifier vos coordonnées</h2>
          <h5>{`${user.name} (${user.email})`}</h5>
          <div className="card modify">
            <p>Ancien mot de passe : </p>
            <input
              type="password"
              name="oldPassword"
              className="input4"
              onChange={handleChange}
              value={data.oldPassword}
            />
            <p>Nouveau mot de passe : </p>
            <input
              type="password"
              name="newPassword"
              className="input4"
              onChange={handleChange}
              value={data.newPassword}
            />
            <p>Confirmer le nouveau mot de passe : </p>
            <input
              type="password"
              name="newPasswordConfirm"
              className="input4"
              onChange={handleChange}
              value={data.newPasswordConfirm}
            />
            <br />
            <div
              className={errorPass === "" ? "error-msg" : "error-msg active"}
            >
              <FontAwesomeIcon icon={faCircleXmark} /> : {errorPass}
            </div>
            <div className={success === "" ? "info-msg" : "info-msg active"}>
              <FontAwesomeIcon icon={faCircleCheck} /> : {success}
            </div>
            <button
              type="button"
              style={{ width: "100%" }}
              className={
                errorPass || !data.newPasswordConfirm || !data.oldPassword
                  ? "button-disabled"
                  : "button"
              }
              onClick={(e) => handleUpdatePassword(e)}
            >
              Confirmer
            </button>
            {user?.access_level === 3 && (
              <button
                type="button"
                style={{ width: "100%" }}
                className="button delete-user"
                onClick={doShowDeleteUserModal}
              >
                Supprimer mon compte
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Modifier;
