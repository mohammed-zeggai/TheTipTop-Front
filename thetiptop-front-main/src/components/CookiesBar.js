import { React, useEffect, useState } from "react";
import "./CookiesBar.css";

const CookiesBar = () => {
  const [cookieConsent, setCookieConsent] = useState(
    localStorage.getItem("cookieConsent")
  );
  useEffect(() => {
    cookieConsent && localStorage.setItem("cookieConsent", cookieConsent);
  }, [cookieConsent]);
  const handleAccept = () => {
    window["ga-disable-G-FV0CQ2Z6QW"] = false;
    setCookieConsent(true);
  };
  const handleReject = () => {
    window["ga-disable-G-FV0CQ2Z6QW"] = true;
    setCookieConsent(true);
  };
  return (
    <>
      {!cookieConsent && (
        <div className="cookie-consent-banner">
          <div className="cookie-consent-banner__inner">
            <div className="cookie-consent-banner__copy">
              <div className="cookie-consent-banner__header">
                Thétiptop utilise des cookies
              </div>
              <div className="cookie-consent-banner__description">
                Nous utilisons des cookies pour offrir les fonctionnalités
                nécessaires au fonctionnement du site et améliorer votre
                expérience. Accepteriez-vous l'utilisation des cookies à des
                fins de métrique ?
              </div>
            </div>

            <div className="cookie-consent-banner__actions">
              <button className="accept-btn" onClick={handleAccept}>
                Accepter tous les cookies
              </button>

              <button className="accept-btn refuse" onClick={handleReject}>
                Accepter seulement les cookies nécessaires
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookiesBar;
