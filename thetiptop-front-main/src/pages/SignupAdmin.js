import { useRef, React, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Signup.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCircleXmark,
  faArrowAltCircleRight,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import jwt_decode from "jwt-decode";
const user = JSON.parse(localStorage.getItem("user"));

const Signup = (props = { isSignUp: true }) => {
  const connectedUser = JSON.parse(localStorage.getItem("user"));

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accessLevel: "3",
  });
  const [logInData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signUpDataValidity, setSignUpDataValidity] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  });

  useEffect(() => {
    const checkEmail = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    const checkName = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");
    const checkPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    setSignUpDataValidity({
      firstName: checkName.test(signUpData.firstName),
      lastName: checkName.test(signUpData.lastName),
      email: checkEmail.test(signUpData.email),
      password: checkPassword.test(signUpData.password),
    });
  }, [signUpData]);

  useEffect(() => {
    if (
      renderSignUpFormError &&
      signUpDataValidity.firstName &&
      signUpDataValidity.lastName &&
      signUpDataValidity.email &&
      signUpDataValidity.password
    )
      setRenderSignUpFormError(false);
  }, [signUpDataValidity]);

  const [signUpError, setSignUpError] = useState("");
  const [renderSignUpFormError, setRenderSignUpFormError] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSignUpTabSelected, setIsSignUpTabSelected] = useState(
    props.isSignUp
  );
  useEffect(() => {
    setIsSignUpTabSelected(props.isSignUp);
  }, [props.isSignUp]);
  const [fieldOnFocus, setFieldOnFocus] = useState("true");
  const loginPasswordRef = useRef();
  const googleButton = useRef();

  const handleSignUpChange = ({ currentTarget: input }) => {
    setSignUpError("");
    setInfoMessage("");
    setSignUpData({ ...signUpData, [input.name]: input.value });
  };

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

  const handleSignUpSubmit = async (e) => {
    if (!checkAndGetSignUpDataValidity()) {
      setRenderSignUpFormError(true);
      return;
    }
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/admin/signup`;
      await axios.post(
        url,
        {
          name: signUpData.firstName + " " + signUpData.lastName,
          email: signUpData.email,
          password: signUpData.password,
          access_level: signUpData.accessLevel,
        },
        {
          headers: { authorization: `${user.token}` },
        }
      );
      doAfterSignUp();
    } catch (error) {
      console.log(error);
      setSignUpError(getError(error));
    }
  };

  const doAfterSignUp = () => {
    const accountType =
      signUpData.accessLevel === "1"
        ? "Administrateur"
        : signUpData.accessLevel === "2"
        ? "Modérateur"
        : signUpData.accessLevel === "3"
        ? "client"
        : "inconnu";
    setInfoMessage(
      `Le compte ${signUpData.email} de type ${accountType} a été crée !`
    );
    setSignUpData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  const checkAndGetSignUpDataValidity = () => {
    return (
      signUpDataValidity.firstName &&
      signUpDataValidity.lastName &&
      signUpDataValidity.email &&
      signUpDataValidity.password
    );
  };

  const onChangeLoginTab = (e) => {
    setSignUpError("");
    setIsSignUpTabSelected(false);
  };

  const onChangeSignUpTab = (e) => {
    setLoginError("");
    setIsSignUpTabSelected(true);
  };

  const onFieldFocus =
    (tabType) =>
    ({ currentTarget: input }) => {
      setFieldOnFocus(tabType + "." + input.name);
    };

  const onFieldBlur = () => {
    setFieldOnFocus("");
  };

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="content">
          <div>
            <div className="form">
              <div className="tab-content">
                <div className="signup-login-tab active">
                  <h1>Nouveau Compte</h1>
                  <form autoComplete="off">
                    <div className="top-row">
                      <div className="field-wrap">
                        <label
                          className={
                            (signUpData.firstName !== "" ? "active" : "") +
                            " " +
                            (fieldOnFocus === "signUpData.firstName"
                              ? "highlight"
                              : "")
                          }
                        >
                          Prénom
                          <span className="req">*</span>
                        </label>
                        <input
                          name="firstName"
                          type="text"
                          onBlur={onFieldBlur}
                          onFocus={onFieldFocus("signUpData")}
                          onChange={handleSignUpChange}
                          value={signUpData.firstName}
                        />
                      </div>

                      <div className="field-wrap">
                        <label
                          className={
                            (signUpData.lastName !== "" ? "active" : "") +
                            " " +
                            (fieldOnFocus === "signUpData.lastName"
                              ? "highlight"
                              : "")
                          }
                        >
                          Nom De Famille<span className="req">*</span>
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          onBlur={onFieldBlur}
                          onFocus={onFieldFocus("signUpData")}
                          onChange={handleSignUpChange}
                          value={signUpData.lastName}
                        />
                      </div>
                    </div>

                    <div className="field-wrap">
                      <label
                        className={
                          (signUpData.email !== "" ? "active" : "") +
                          " " +
                          (fieldOnFocus === "signUpData.email"
                            ? "highlight"
                            : "")
                        }
                      >
                        Adresse Email<span className="req">*</span>
                      </label>
                      <input
                        name="email"
                        type="text"
                        onBlur={onFieldBlur}
                        onFocus={onFieldFocus("signUpData")}
                        onChange={handleSignUpChange}
                        value={signUpData.email}
                      />
                    </div>

                    <div className="field-wrap">
                      <label
                        className={
                          (signUpData.password !== "" ? "active" : "") +
                          " " +
                          (fieldOnFocus === "signUpData.password"
                            ? "highlight"
                            : "")
                        }
                      >
                        Mot De Passe<span className="req">*</span>
                      </label>
                      <input
                        name="password"
                        type="password"
                        onBlur={onFieldBlur}
                        onFocus={onFieldFocus("signUpData")}
                        onChange={handleSignUpChange}
                        value={signUpData.password}
                      />
                    </div>
                    <div className="field-wrap">
                      <label className="active">
                        Type De Compte<span className="req">*</span>
                      </label>
                      <select
                        className="accessLevel"
                        name="accessLevel"
                        onChange={handleSignUpChange}
                      >
                        <option value="3">Client</option>
                        <option value="2">Modérateur</option>
                        <option value="1">Administrateur</option>
                      </select>
                    </div>
                  </form>
                  <button
                    type="submit"
                    className="button button-block"
                    onClick={handleSignUpSubmit}
                  >
                    Créer
                  </button>
                  <div
                    className={
                      infoMessage === "" ? "info-msg" : "info-msg active"
                    }
                  >
                    <FontAwesomeIcon icon={faCircleCheck} /> : {infoMessage}
                  </div>
                  <div
                    className={
                      signUpError === "" ? "error-msg" : "error-msg active"
                    }
                  >
                    <FontAwesomeIcon icon={faCircleXmark} /> : {signUpError}
                  </div>
                  <div
                    className={
                      renderSignUpFormError ? "error-msg active" : "error-msg"
                    }
                  >
                    <FontAwesomeIcon icon={faCircleXmark} /> : Veuillez remplir
                    les champs correctement :
                    <ul className="error-list">
                      <li
                        className={
                          signUpDataValidity.firstName
                            ? "error-element"
                            : "error-element active"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faArrowAltCircleRight}
                          size="xs"
                        />{" "}
                        Prénom Invalide
                      </li>

                      <li
                        className={
                          signUpDataValidity.lastName
                            ? "error-element"
                            : "error-element active"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faArrowAltCircleRight}
                          size="xs"
                        />{" "}
                        Nom Invalide
                      </li>

                      <li
                        className={
                          signUpDataValidity.email
                            ? "error-element"
                            : "error-element active"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faArrowAltCircleRight}
                          size="xs"
                        />{" "}
                        Email Invalide
                      </li>

                      <li
                        className={
                          signUpDataValidity.password
                            ? "error-element"
                            : "error-element active"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faArrowAltCircleRight}
                          size="xs"
                        />{" "}
                        Mot de passe Invalide
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
