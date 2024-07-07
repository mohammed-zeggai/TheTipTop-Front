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
import FacebookLogin from "@greatsumini/react-facebook-login";

const Signup = (props = { isSignUp: true }) => {
  const connectedUser = JSON.parse(localStorage.getItem("user"));
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const facebookId = process.env.REACT_APP_FACEBOOK_ID;

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(googleButton.current, {
      theme: "outline",
      text: "continue_with",
    });
  }, []);

  const handleFacebookLogin = async (res) => {
    const token = res.accessToken;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/ssofb`,
        {
          access_token: token,
        }
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.access_level === 3) {
        window.location = "/participer";
      }

      if (res.data.access_level === 2) {
        window.location = "/staff";
      }

      if (res.data.access_level === 1) {
        window.location = "/admin";
      }
    } catch (e) {
      console.log(e);
      setSignUpError("Error de connection avec Facebook");
      setLoginError("Error de connection avec Facebook");
    }
  };

  const handleCredentialResponse = async (res) => {
    const token = res.credential;
    const responsePayload = jwt_decode(res.credential);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/sso`,
        {
          access_token: token,
          email: responsePayload.email,
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.access_level === 3) {
        window.location = "/participer";
      }

      if (res.data.access_level === 2) {
        window.location = "/staff";
      }

      if (res.data.access_level === 1) {
        window.location = "/admin";
      }
    } catch (e) {
      console.log(e);
      setSignUpError("Error de connection avec Google");
      setLoginError("Error de connection avec Google");
    }
  };

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
  const handleLoginChange = ({ currentTarget: input }) => {
    setLoginError("");
    setLoginData({ ...logInData, [input.name]: input.value });
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload(false);
  };

  const handleLoginSubmit = async (e) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`;
      const { data: res } = await axios.post(url, logInData);
      localStorage.setItem("user", JSON.stringify(res));
      if (res.access_level === 3) {
        window.location = "/participer";
      }

      if (res.access_level === 2) {
        window.location = "/staff";
      }

      if (res.access_level === 1) {
        window.location = "/admin";
      }
    } catch (error) {
      setLoginError(getError(error));
    }
    setInfoMessage("");
  };

  const handleSignUpSubmit = async (e) => {
    if (!checkAndGetSignUpDataValidity()) {
      setRenderSignUpFormError(true);
      return;
    }
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`;
      await axios.post(url, {
        name: signUpData.firstName + " " + signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
      });
      doAfterSignUp();
    } catch (error) {
      setSignUpError(getError(error));
    }
  };

  const doAfterSignUp = () => {
    setLoginData({ email: signUpData.email, password: "" });
    onChangeLoginTab();
    setInfoMessage("Votre compte a été crée, Connectez vous dés maintenant !");
    setTimeout(() => loginPasswordRef.current.focus(), 20);
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
              <ul className="tab-group">
                <li className={isSignUpTabSelected ? "tab active" : "tab"}>
                  <a href="#" onClick={onChangeSignUpTab}>
                    S'inscrire
                  </a>
                </li>
                <li className={!isSignUpTabSelected ? "tab active" : "tab"}>
                  <a href="#" onClick={onChangeLoginTab}>
                    Se connecter
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div
                  className={
                    isSignUpTabSelected
                      ? "signup-login-tab active"
                      : "signup-login-tab"
                  }
                >
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
                <div
                  className={
                    !isSignUpTabSelected
                      ? "signup-login-tab active"
                      : "signup-login-tab"
                  }
                >
                  <h1>Compte Existant</h1>
                  <form autoComplete="off">
                    <div className="field-wrap">
                      <label
                        className={
                          (logInData.email !== "" ? "active" : "") +
                          " " +
                          (fieldOnFocus === "logInData.email"
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
                        onFocus={onFieldFocus("logInData")}
                        onChange={handleLoginChange}
                        value={logInData.email}
                      />
                      <div
                        className={
                          infoMessage === "" ? "info-msg" : "info-msg active"
                        }
                      >
                        <FontAwesomeIcon icon={faCircleCheck} /> : {infoMessage}
                      </div>
                    </div>

                    <div className="field-wrap">
                      <label
                        className={
                          (logInData.password !== "" ? "active" : "") +
                          " " +
                          (fieldOnFocus === "logInData.password"
                            ? "highlight"
                            : "")
                        }
                      >
                        Mot De Passe<span className="req">*</span>
                      </label>
                      <input
                        name="password"
                        type="password"
                        ref={loginPasswordRef}
                        onBlur={onFieldBlur}
                        onFocus={onFieldFocus("logInData")}
                        onChange={handleLoginChange}
                        value={logInData.password}
                      />
                    </div>

                    <p className="forgot">
                      <a href="#forgot" onClick={onChangeSignUpTab}>
                        Mot de passe oublié?
                      </a>
                    </p>
                  </form>
                  <button
                    className="button button-block"
                    type="submit"
                    onClick={handleLoginSubmit}
                  >
                    Connecter
                  </button>
                  <div
                    className={
                      loginError === "" ? "error-msg" : "error-msg active"
                    }
                  >
                    <FontAwesomeIcon icon={faCircleXmark} /> : {loginError}
                  </div>
                </div>
              </div>
              <div className="separator">
                <div className="line"></div>
                <div className="text">Ou</div>
                <div className="line"></div>
              </div>
              <ul className="tab-group api">
                <li className="tab">
                  <a className="google" ref={googleButton}>
                    S'inscrire avec Google
                  </a>
                </li>
                <FacebookLogin
                  appId={facebookId}
                  onSuccess={handleFacebookLogin}
                  onFail={(error) => {
                    console.log("Login Failed!", error);
                  }}
                  render={({ onClick }) => (
                    <li className="tab" onClick={onClick}>
                      <a className="facebook">S'inscrire avec Facebook</a>
                    </li>
                  )}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
