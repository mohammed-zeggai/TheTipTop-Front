import { React, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

const user = JSON.parse(localStorage.getItem("user"));

const Staff = () => {
  const [row, setRow] = useState();
  const [error, setError] = useState("");
  const [data, setData] = useState({
    email: "",
  });

  const [tickets, setTickets] = useState({
    gifts_won: "",
    gifts_left: "",
    tickets: [],
  });

  const getTickets = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/staff/tickets`;
      const { data: res } = await axios.post(url, data, {
        headers: { authorization: `${user.token}` },
      });
      setTickets({
        tickets: res.tickets,
      });
      const getLocalDate = (date) => {
        return new Date(
          new Date(date).toLocaleString("en-US", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        ).setHours(0, 0, 0, 0);
      };
      const filteredData = res.tickets.map((ticket) => {
        return {
          id: ticket._id,
          Nom: ticket.client.name,
          Email: ticket.client.email,
          Cadeau: ticket.gift.name,
          Numero: ticket.number,
          Received: ticket.received,
          dateReception: getLocalDate(ticket.reception_date),
          deliveredBy: ticket.delivered_by,
          dateGain: getLocalDate(ticket.creation_date),
        };
      });
      setRow(filteredData);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  const giveGift = async (id) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/staff/confirm/${id}`;
      const { data: res } = await axios.get(url, {
        headers: { authorization: `${user.token}` },
      });
      getTickets();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="content">
          <h2>Modérateur : </h2>
          <h5>
            {`${user.name} (${user.email}) | `}
            <Link to="modifier">Modifier vos coordonnées</Link>
          </h5>
          <div className="card">
            <p>Veuillez saisir l'email du client</p>
            <input
              type="text"
              name="email"
              className="input3"
              required
              onChange={(e) => {
                setError("");
                setData({ email: e.target.value });
              }}
              value={data.email}
            />
            <br />
            <button
              type="button"
              className="button participer"
              onClick={getTickets}
            >
              Valider
            </button>
            <div className={error === "" ? "error-msg" : "error-msg active"}>
              <FontAwesomeIcon icon={faCircleXmark} /> : {error}
            </div>
            {tickets.tickets.length > 0 && (
              <>
                <center>
                  <p>Liste des cadeaux de : {tickets.tickets[0].client.name}</p>
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
                      headerName="Reçu"
                      field="Received"
                      width="160"
                      resizable="false"
                      cellRenderer={(params) => {
                        return params.value ? (
                          <p>OUI</p>
                        ) : (
                          <>
                            <a href="#">NON </a>
                            <button onClick={() => giveGift(params.data.id)}>
                              Donner
                            </button>
                          </>
                        );
                      }}
                    />
                    <AgGridColumn
                      headerName="Cadeau gagné"
                      field="Cadeau"
                      width="300px"
                    />
                    <AgGridColumn
                      headerName="Numéro de ticket"
                      field="Numero"
                    />
                    <AgGridColumn
                      headerName="Date de gain"
                      field="dateGain"
                      filter="agDateColumnFilter"
                      valueFormatter={(params) => {
                        return moment(params.value).format("DD/MM/yyyy");
                      }}
                    />
                    <AgGridColumn
                      headerName="Date de réception"
                      field="dateReception"
                      filter="agDateColumnFilter"
                      style="text-center"
                      valueFormatter={(params) =>
                        params?.value
                          ? ""
                          : moment(params.value).format("DD/MM/yyyy")
                      }
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

export default Staff;
