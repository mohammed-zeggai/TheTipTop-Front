import { React, useState } from "react";
import "./Newsletter.css";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleClick = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/addemail`;
    const { data: res } = await axios.post(url, email);
    setMessage(res.message);
  };

  const handleChange = (e) => {
    setEmail({ email: e.target.value });
    setMessage("");
  };

  return (
    <>
      <div className="newsletter" id="newsletter">
        <div className="container">
          <div className="col-3">
            <div class="container">
              <div class="row">
                <div class="col-sm-12">
                  <div class="single">
                    <h2 style={{ color: "black" }}>Restez à l'écoute !</h2>

                    <div class="input-group">
                      <span className="line"></span>
                      <p>
                        Inscrivez-vous à notre newsletter et recevez nos
                        actualités
                      </p>
                      <input
                        type="text"
                        name="email"
                        className="input4"
                        placeholder="Veuillez saisir votre email"
                        onChange={handleChange}
                        value={email.email}
                        style={{
                          marginBottom: "3rem",
                          fontFamily: "-apple-system",
                        }}
                      />
                      <button
                        className="button"
                        onClick={handleClick}
                        style={{ minHeight: "50px", background: "#0C8E0C" }}
                      >
                        Abonnez-vous
                      </button>
                      {message && <span>{message}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Newsletter;
