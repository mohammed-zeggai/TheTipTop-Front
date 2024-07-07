import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
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

const Participer = () => {
  const [deadline, setDeadline] = useState(true);
  const [row, setRow] = useState();
  const [data, setData] = useState({
    number: "",
  });

  const [error, setError] = useState("");

  const [gift, setGift] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ number: input.value });
    setError("");
  };

  const handleParticipate = async (e) => {
    try {
      setData(data);
      console.log(data);
      setGift("");
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/tickets`;
      const { data: res } = await axios.post(url, data, {
        headers: { authorization: `${user.token}` },
      });
      console.log(data.number);
      setGift(res.gift);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  const getTickets = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/tickets`;
      const { data: res } = await axios.get(url, {
        headers: { authorization: `${user.token}` },
      });

      const filteredData = res.tickets.map((ticket) => {
        return {
          Nom: ticket.client.name,
          Cadeau: ticket.gift.name,
          Numero: ticket.number,
          Received: ticket.received ? "oui" : "non",
          dateGain: new Date(
            new Date(ticket.creation_date).toLocaleString("en-US", {
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          ).setHours(0, 0, 0, 0),
        };
      });
      setRow(filteredData);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getTickets();
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/dates`;
      axios.get(url).then((res) => {
        if (
          Number(res.data.start) + Number(res.data.duration) >
          Math.floor(new Date().getTime() / 1000)
        ) {
          setDeadline(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [gift]);

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="content">
          <h1 style={{ fontSize: "50px", marginBottom: "2rem", marginTop: "5rem", fontFamily: "-apple-system", alignItems: "center" }}>Participez</h1>
          <h5>
            {`${user.name} (${user.email}) | `}
            <Link to="modifier">Modifier vos coordonnées</Link>
          </h5>
          <div className="card">
            {deadline && (
              <>
                <center>
                  <h1 style={{ color: "black" }}>
                    Veuillez saisir votre numéro de ticket
                  </h1>
                </center>

                <input
                  type="text"
                  name="number"
                  inputMode="numeric"
                  className="input2"
                  maxLength="10"
                  onChange={handleChange}
                  value={data.number}
                />
                <br />
                <button
                  type="button"
                  className="button participer"
                  onClick={handleParticipate}
                >
                  Jouer
                </button>
                <div
                  className={error === "" ? "error-msg" : "error-msg active"}
                >
                  <FontAwesomeIcon icon={faCircleXmark} /> : {error}
                </div>
                <div className={gift === "" ? "info-msg" : "info-msg active"}>
                  <FontAwesomeIcon icon={faCircleCheck} /> Cadeau gagné : {gift}
                </div>
              </>
            )}
            {row && row.length !== 0 && (
              <>
                <center>
                  <h1 style={{ color: "black" }}>Historique des gains</h1>
                </center>
                <div className="ag-theme-material" style={{ height: 500 }}>
                  <AgGridReact
                    defaultColDef={{
                      sortable: true,
                      filter: true,
                      resizable: true,
                    }}
                    pagination={true}
                    rowData={row}
                    paginationAutoPageSize={true}
                  >
                    <AgGridColumn
                      headerName="Cadeau gagné"
                      field="Cadeau"
                      width="300px"
                    />
                    <AgGridColumn
                      headerName="Numéro de ticket"
                      field="Numero"
                    />
                    <AgGridColumn headerName="Reçu" field="Received" />
                    <AgGridColumn
                      headerName="Date de gain"
                      field="dateGain"
                      filter="agDateColumnFilter"
                      valueFormatter={(params) => {
                        return moment(params.value).format("DD/MM/yyyy");
                      }}
                    />
                  </AgGridReact>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Participer;
